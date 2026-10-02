<?php
// Academy admin: upload a SCORM 1.2 package (SCORMcraft export) into /courses/{id}/.
//
// POST multipart/form-data, header Authorization: Bearer <Supabase access token>
//   course_id  slug, ^[a-z0-9-]{3,60}$
//   mode       "new" (fails if the folder exists) or "replace" (old folder kept as .old-{id}-{time})
//   package    the .zip
//
// Responds with JSON: { id, page_count, page_titles } or { error }.
// Course files must live on this origin: the SCORM pages reach the player's API through window.parent.

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const MAX_ZIP_BYTES = 100 * 1024 * 1024;
const MAX_UNPACKED_BYTES = 300 * 1024 * 1024;
const MAX_ENTRIES = 3000;
const ALLOWED_EXTENSIONS = [
    'html', 'htm', 'js', 'css', 'json', 'xml', 'xsd', 'dtd', 'txt', 'csv', 'vtt', 'srt',
    'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp', 'avif',
    'woff', 'woff2', 'ttf', 'otf', 'eot',
    'mp4', 'webm', 'ogg', 'ogv', 'mp3', 'wav', 'm4a', 'aac',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip',
];

function fail(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit;
}

function http_get_json(string $url, array $headers): ?array
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 15,
        ]);
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    } else {
        $context = stream_context_create(['http' => [
            'method' => 'GET',
            'header' => implode("\r\n", $headers),
            'timeout' => 15,
            'ignore_errors' => true,
        ]]);
        $body = @file_get_contents($url, false, $context);
        $status = 0;
        foreach ($http_response_header ?? [] as $line) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $line, $m)) {
                $status = (int) $m[1];
            }
        }
    }
    if (!is_string($body) || $status !== 200) {
        return null;
    }
    $data = json_decode($body, true);
    return is_array($data) ? $data : null;
}

// Only used on the temp folder this request created.
function remove_tree(string $path): void
{
    if (!file_exists($path)) {
        return;
    }
    $items = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($items as $item) {
        $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname());
    }
    rmdir($path);
}

function read_manifest_titles(string $xml): array
{
    $previous = libxml_use_internal_errors(true);
    $doc = new DOMDocument();
    $loaded = $doc->loadXML($xml, LIBXML_NONET);
    libxml_use_internal_errors($previous);
    if (!$loaded) {
        return [];
    }

    $titles = [];
    foreach ($doc->getElementsByTagName('item') as $item) {
        foreach ($item->childNodes as $child) {
            if ($child instanceof DOMElement && $child->localName === 'title') {
                $titles[] = trim(preg_replace('/\s+/', ' ', $child->textContent));
                break;
            }
        }
    }
    return $titles;
}

// --- Request checks -------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'Method not allowed');
}
if (!class_exists('ZipArchive')) {
    fail(500, 'The server does not have PHP zip support enabled');
}

// Some LiteSpeed setups drop the Authorization header, so the token may also come as a form field.
$auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
$token = preg_match('/^Bearer\s+(\S+)$/', $auth, $m) ? $m[1] : (string) ($_POST['access_token'] ?? '');
if (!preg_match('/^[A-Za-z0-9._-]+$/', $token)) {
    fail(401, 'Sign in again and retry');
}

$config = json_decode((string) @file_get_contents(__DIR__ . '/config.json'), true);
$supabaseUrl = rtrim((string) ($config['supabaseUrl'] ?? ''), '/');
$anonKey = (string) ($config['supabaseAnonKey'] ?? '');
if ($supabaseUrl === '' || $anonKey === '') {
    fail(500, 'Upload is not configured');
}

$user = http_get_json($supabaseUrl . '/auth/v1/user', [
    'Authorization: Bearer ' . $token,
    'apikey: ' . $anonKey,
]);
if ($user === null) {
    fail(401, 'Sign in again and retry');
}
if (($user['app_metadata']['role'] ?? '') !== 'admin') {
    fail(403, 'Admins only');
}

$courseId = (string) ($_POST['course_id'] ?? '');
if (!preg_match('/^[a-z0-9-]{3,60}$/', $courseId)) {
    fail(400, 'Course ID must be 3-60 lowercase letters, numbers or hyphens');
}
$mode = (string) ($_POST['mode'] ?? 'new');
if (!in_array($mode, ['new', 'replace'], true)) {
    fail(400, 'Unknown mode');
}

$file = $_FILES['package'] ?? null;
if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $code = $file['error'] ?? UPLOAD_ERR_NO_FILE;
    $tooBig = in_array($code, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true);
    fail(400, $tooBig ? 'The zip is larger than the server allows' : 'No zip received');
}
if ($file['size'] > MAX_ZIP_BYTES) {
    fail(400, 'The zip is over 100 MB');
}

$coursesRoot = realpath(__DIR__ . '/../courses');
if ($coursesRoot === false || !is_writable($coursesRoot)) {
    fail(500, 'The courses folder is missing or not writable');
}
$target = $coursesRoot . '/' . $courseId;
if ($mode === 'new' && file_exists($target)) {
    fail(409, 'A course folder with that ID already exists. Use Replace files instead.');
}
if ($mode === 'replace' && !is_dir($target)) {
    fail(404, 'There is no existing course folder to replace');
}

// --- Inspect the package before writing anything ---------------------------

$zip = new ZipArchive();
if ($zip->open($file['tmp_name']) !== true) {
    fail(400, 'That file is not a readable zip');
}
if ($zip->numFiles > MAX_ENTRIES) {
    fail(400, 'The zip has too many files');
}

$entries = [];
$unpacked = 0;
for ($i = 0; $i < $zip->numFiles; $i++) {
    $stat = $zip->statIndex($i);
    $name = str_replace('\\', '/', (string) $stat['name']);
    if (substr($name, -1) === '/') {
        continue;
    }
    if (strpos($name, '__MACOSX/') === 0 || basename($name) === '.DS_Store' || basename($name) === 'Thumbs.db') {
        continue;
    }
    $entries[$i] = $name;
    $unpacked += (int) $stat['size'];
}
if ($unpacked > MAX_UNPACKED_BYTES) {
    fail(400, 'The unpacked course is over 300 MB');
}

// Accept a package wrapped in one top-level folder.
$prefix = '';
if (!in_array('imsmanifest.xml', $entries, true)) {
    foreach ($entries as $name) {
        if (preg_match('#^([^/]+/)imsmanifest\.xml$#', $name, $pm)) {
            $prefix = $pm[1];
            break;
        }
    }
    if ($prefix === '') {
        fail(400, 'No imsmanifest.xml found. Export the course as SCORM 1.2.');
    }
}

$files = [];
foreach ($entries as $index => $name) {
    if ($prefix !== '') {
        if (strpos($name, $prefix) !== 0) {
            fail(400, 'Unexpected file outside the course folder: ' . $name);
        }
        $name = substr($name, strlen($prefix));
    }
    $segments = explode('/', $name);
    foreach ($segments as $segment) {
        if ($segment === '' || $segment === '.' || $segment === '..' || $segment[0] === '.' || strpos($segment, "\0") !== false || strpos($segment, ':') !== false) {
            fail(400, 'Unsafe file path in zip: ' . $name);
        }
    }
    $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (!in_array($extension, ALLOWED_EXTENSIONS, true)) {
        fail(400, 'File type not allowed in a course: ' . $name);
    }
    $files[$index] = $name;
}

$names = array_flip($files);
foreach (['imsmanifest.xml', 'scorm-api.js', 'content/page_0.html'] as $required) {
    if (!isset($names[$required])) {
        fail(400, 'The package is missing ' . $required);
    }
}

$pageNumbers = [];
foreach ($files as $name) {
    if (preg_match('#^content/page_(\d+)\.html$#', $name, $pm)) {
        $pageNumbers[] = (int) $pm[1];
    }
}
sort($pageNumbers);
$pageCount = count($pageNumbers);
if ($pageNumbers !== range(0, $pageCount - 1)) {
    fail(400, 'Pages must run content/page_0.html, page_1.html, ... with no gaps');
}

$manifestTitles = read_manifest_titles((string) $zip->getFromIndex((int) array_search('imsmanifest.xml', $files, true)));
$pageTitles = [];
for ($p = 0; $p < $pageCount; $p++) {
    $title = $manifestTitles[$p] ?? '';
    $pageTitles[] = $title !== '' ? $title : 'Page ' . ($p + 1);
}

// --- Extract to a temp folder, then swap it in ------------------------------

$tmp = $coursesRoot . '/.tmp-' . bin2hex(random_bytes(6));
if (!mkdir($tmp, 0755)) {
    fail(500, 'Could not create a working folder');
}

foreach ($files as $index => $name) {
    $dest = $tmp . '/' . $name;
    $dir = dirname($dest);
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        remove_tree($tmp);
        fail(500, 'Could not create folder for ' . $name);
    }
    $in = $zip->getStream($zip->getNameIndex($index));
    $out = fopen($dest, 'wb');
    if (!$in || !$out || stream_copy_to_stream($in, $out) === false) {
        remove_tree($tmp);
        fail(500, 'Could not extract ' . $name);
    }
    fclose($in);
    fclose($out);
}
$zip->close();

if ($mode === 'replace') {
    $backup = $coursesRoot . '/.old-' . $courseId . '-' . date('Ymd-His');
    if (!rename($target, $backup)) {
        remove_tree($tmp);
        fail(500, 'Could not move the old course files aside');
    }
}
if (!rename($tmp, $target)) {
    remove_tree($tmp);
    if (isset($backup)) {
        rename($backup, $target);
    }
    fail(500, 'Could not put the course files in place');
}

echo json_encode([
    'id' => $courseId,
    'page_count' => $pageCount,
    'page_titles' => $pageTitles,
]);

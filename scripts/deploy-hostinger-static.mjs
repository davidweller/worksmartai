/**
 * Deploy a pre-built static archive to Hostinger via the public API.
 * Mirrors hosting_deployStaticWebsite from hostinger-api-mcp.
 *
 * Requires HOSTINGER_API_TOKEN (hPanel → API).
 *
 * Usage:
 *   node scripts/prepare-hostinger-static-archive.mjs
 *   node scripts/deploy-hostinger-static.mjs .hostinger-deploy/worksmart_YYYYMMDD_HHMMSS.zip
 *
 * Or one step after build:
 *   npm run deploy:hostinger
 */
import { createReadStream, existsSync, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as tus from 'tus-js-client';

const API_BASE = (process.env.HOSTINGER_API_BASE ?? 'https://developers.hostinger.com').replace(/\/$/, '');
const DOMAIN = process.env.HOSTINGER_DOMAIN ?? 'worksmart-ai.co.uk';
const REMOVE_ARCHIVE = process.env.HOSTINGER_REMOVE_ARCHIVE === 'true';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function getToken() {
  const token = process.env.HOSTINGER_API_TOKEN?.trim();
  if (!token) {
    throw new Error('HOSTINGER_API_TOKEN is not set. Create a token at https://hpanel.hostinger.com/profile/api');
  }
  return token;
}

async function apiRequest(method, apiPath, body) {
  const response = await fetch(`${API_BASE}/${apiPath.replace(/^\//, '')}`, {
    method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      `Hostinger API ${method} ${apiPath} → ${response.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`
    );
  }

  return data;
}

async function resolveUsername(domain) {
  const result = await apiRequest('GET', `api/hosting/v1/websites?domain=${encodeURIComponent(domain)}`);
  const username = result?.data?.[0]?.username;
  if (!username) {
    throw new Error(`No Hostinger website found for domain: ${domain}`);
  }
  return username;
}

async function fetchUploadCredentials(username, domain) {
  return apiRequest('POST', 'api/hosting/v1/files/upload-urls', { username, domain });
}

function uploadFile(filePath, basename, uploadUrl, authToken, authRestToken) {
  const stats = statSync(filePath);
  const cleanUploadUrl = uploadUrl.replace(/\/$/, '');
  const uploadUrlWithFile = `${cleanUploadUrl}/${basename}?override=true`;
  const requestHeaders = {
    'X-Auth': authToken,
    'X-Auth-Rest': authRestToken,
    'upload-length': String(stats.size),
    'upload-offset': '0',
  };

  return new Promise((resolve, reject) => {
    const fileStream = createReadStream(filePath);

    fetch(uploadUrlWithFile, { method: 'POST', headers: requestHeaders })
      .then((res) => {
        if (res.status !== 201) {
          return res.text().then((t) => reject(new Error(`Pre-upload failed (${res.status}): ${t}`)));
        }

        const upload = new tus.Upload(fileStream, {
          uploadUrl: uploadUrlWithFile,
          retryDelays: [1000, 2000, 4000, 8000, 16000, 20000],
          uploadDataDuringCreation: false,
          parallelUploads: 1,
          chunkSize: 10 * 1024 * 1024,
          headers: requestHeaders,
          removeFingerprintOnSuccess: true,
          uploadSize: stats.size,
          metadata: { filename: basename },
          onError: (error) => reject(error),
          onSuccess: () => resolve({ filename: basename }),
        });

        upload.start();
      })
      .catch(reject);
  });
}

async function triggerDeploy(username, domain, archiveBasename) {
  return apiRequest('POST', `api/hosting/v1/accounts/${username}/websites/${domain}/deploy`, {
    archive_path: archiveBasename,
  });
}

function resolveArchivePath(arg) {
  if (arg) {
    const resolved = path.isAbsolute(arg) ? arg : path.join(root, arg);
    if (!existsSync(resolved)) {
      throw new Error(`Archive not found: ${resolved}`);
    }
    return resolved;
  }

  const deployDir = path.join(root, '.hostinger-deploy');
  if (!existsSync(deployDir)) {
    throw new Error(
      'No archive path given and .hostinger-deploy/ is missing. Run prepare-hostinger-static-archive.mjs first.'
    );
  }

  throw new Error(
    'Pass the archive path, e.g. node scripts/deploy-hostinger-static.mjs .hostinger-deploy/worksmart_YYYYMMDD_HHMMSS.zip'
  );
}

async function main() {
  const archivePath = resolveArchivePath(process.argv[2]);
  const archiveBasename = path.basename(archivePath);

  console.log(`Deploying ${archiveBasename} to ${DOMAIN}…`);

  const username = await resolveUsername(DOMAIN);
  console.log(`Resolved account: ${username}`);

  const credentials = await fetchUploadCredentials(username, DOMAIN);
  const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = credentials;
  if (!uploadUrl || !authToken || !authRestToken) {
    throw new Error('Invalid upload credentials from Hostinger API');
  }

  console.log('Uploading archive…');
  await uploadFile(archivePath, archiveBasename, uploadUrl, authToken, authRestToken);

  console.log('Triggering deploy…');
  const deployResult = await triggerDeploy(username, DOMAIN, archiveBasename);
  console.log('Deploy triggered:', JSON.stringify(deployResult, null, 2));

  if (REMOVE_ARCHIVE) {
    unlinkSync(archivePath);
    console.log(`Removed ${archivePath}`);
  }

  console.log(`Done. Verify https://${DOMAIN}/ loads and _astro/ assets return HTTP 200.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

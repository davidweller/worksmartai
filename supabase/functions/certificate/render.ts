import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'https://esm.sh/pdf-lib@1.17.1';
import * as fontkitModule from 'https://esm.sh/@pdf-lib/fontkit@1.1.1';

import { ASSET_PATHS, PAGE, RULES, SIGNATORY, SIGNATURE, TEXT, type FontKey, type TextLayout } from './layout.ts';

// esm.sh serves fontkit as a default export at runtime, but its types only declare named ones.
const fontkit = (fontkitModule as unknown as { default?: typeof fontkitModule }).default ?? fontkitModule;

// Draws a certificate: the Word design's background image, then every line of text on top.

export type CertificateRow = {
  id: string;
  cert_code: string;
  user_id: string;
  course_id: string;
  learner_name: string;
  course_title: string;
  course_details: string;
  score_percent: number;
  issued_at: string;
};

function formatIssueDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  });
}

// Work Sans covers Latin scripts only; anything else (Greek, Cyrillic) falls back to Ubuntu Bold.
function fontFor(text: string, preferred: PDFFont, fallback: PDFFont): PDFFont {
  const supported = new Set(preferred.getCharacterSet());
  for (const ch of text) {
    if (!supported.has(ch.codePointAt(0)!)) return fallback;
  }
  return preferred;
}

function drawCentred(page: PDFPage, text: string, layout: TextLayout, font: PDFFont) {
  if (!text) return;
  let size = layout.size;
  while (size > 7 && font.widthOfTextAtSize(text, size) > layout.maxWidth) size -= 0.5;
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: layout.x - width / 2, y: layout.y, size, font, color: rgb(...layout.color) });
}

export async function renderCertificate(
  cert: CertificateRow,
  loadAsset: (path: string) => Promise<Uint8Array | null>
): Promise<Uint8Array> {
  const [background, headingBytes, regularBytes, boldBytes, signatureBytes] = await Promise.all([
    loadAsset(ASSET_PATHS.background),
    loadAsset(ASSET_PATHS.heading),
    loadAsset(ASSET_PATHS.regular),
    loadAsset(ASSET_PATHS.bold),
    loadAsset(ASSET_PATHS.signature),
  ]);
  if (!background || !headingBytes || !regularBytes || !boldBytes || !signatureBytes) {
    throw new Error('Certificate design files are missing from the site');
  }

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const fonts: Record<FontKey, PDFFont> = {
    heading: await pdf.embedFont(headingBytes, { subset: true }),
    regular: await pdf.embedFont(regularBytes, { subset: true }),
    bold: await pdf.embedFont(boldBytes, { subset: true }),
    signature: await pdf.embedFont(signatureBytes, { subset: true }),
  };
  const textFont = (text: string, layout: TextLayout) => fontFor(text, fonts[layout.font], fonts.bold);

  const page = pdf.addPage([PAGE.width, PAGE.height]);
  page.drawImage(await pdf.embedPng(background), { x: 0, y: 0, width: PAGE.width, height: PAGE.height });

  for (const rule of RULES) {
    page.drawLine({
      start: { x: rule.x1, y: rule.y },
      end: { x: rule.x2, y: rule.y },
      thickness: rule.thickness,
      color: rgb(...rule.color),
    });
  }

  const lines: [keyof typeof TEXT, string][] = [
    ['title', 'Certificate of Completion'],
    ['certify', 'This is to certify that'],
    ['name', cert.learner_name],
    ['completed', 'has successfully completed'],
    ['course', cert.course_title],
    ['details', cert.course_details],
    ['date', formatIssueDate(cert.issued_at)],
    ['dateLabel', 'Date of completion'],
    ['code', `Certificate no. ${cert.cert_code}`],
    ['signedLabel', 'Signed for WorkSmart-AI'],
    ['signatory', SIGNATORY],
    ['signature', SIGNATURE],
  ];
  for (const [key, text] of lines) {
    drawCentred(page, text, TEXT[key], textFont(text, TEXT[key]));
  }

  pdf.setTitle(`${cert.course_title} – Certificate – ${cert.learner_name}`);
  pdf.setAuthor('WorkSmart-AI');
  return await pdf.save();
}

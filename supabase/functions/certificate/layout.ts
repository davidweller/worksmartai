// The certificate design, rebuilt from WorkSmart-AI_Certificate_of_Completion.docx.
// background.png is the Word file's full-page image (border, logo, seal, corner squares);
// everything below is drawn on top. Units are PDF points from the BOTTOM-left of an
// A4 landscape page (842 x 595). Text is centred on x.

export const PAGE = { width: 842, height: 595 };

export const ASSET_PATHS = {
  background: '/academy/certificate/background.png',
  heading: '/academy/certificate/WorkSans-Bold.ttf',
  regular: '/academy/certificate/Ubuntu-Regular.ttf',
  bold: '/academy/certificate/Ubuntu-Bold.ttf',
  signature: '/academy/certificate/MrsSaintDelafield-Regular.ttf',
};

export const SIGNATORY = 'David Weller, Director';
// Drawn in the handwriting font, sitting on the signature line.
export const SIGNATURE = 'DWeller';

export type FontKey = 'heading' | 'regular' | 'bold' | 'signature';
export type Colour = [number, number, number];

export type TextLayout = {
  x: number;
  y: number;
  size: number;
  font: FontKey;
  color: Colour;
  // Text wider than this shrinks to fit.
  maxWidth: number;
};

const hex = (value: string): Colour => [
  parseInt(value.slice(0, 2), 16) / 255,
  parseInt(value.slice(2, 4), 16) / 255,
  parseInt(value.slice(4, 6), 16) / 255,
];

const NAVY = hex('015887');
const INK = hex('1B0101');
const ORANGE = hex('FF7700');
const GREY = hex('C4C4C4');

const LEFT_COL = 231;
const RIGHT_COL = 611;

export const TEXT: Record<
  | 'title'
  | 'certify'
  | 'name'
  | 'completed'
  | 'course'
  | 'details'
  | 'date'
  | 'dateLabel'
  | 'code'
  | 'signedLabel'
  | 'signatory'
  | 'signature',
  TextLayout
> = {
  title: { x: 421, y: 433, size: 38, font: 'heading', color: NAVY, maxWidth: 620 },
  certify: { x: 421, y: 388, size: 13, font: 'regular', color: INK, maxWidth: 500 },
  name: { x: 421, y: 354, size: 30, font: 'heading', color: NAVY, maxWidth: 490 },
  completed: { x: 421, y: 319, size: 13, font: 'regular', color: INK, maxWidth: 500 },
  course: { x: 421, y: 293, size: 20, font: 'heading', color: NAVY, maxWidth: 600 },
  details: { x: 421, y: 273, size: 11, font: 'regular', color: NAVY, maxWidth: 600 },
  date: { x: LEFT_COL, y: 137, size: 13, font: 'regular', color: INK, maxWidth: 220 },
  dateLabel: { x: LEFT_COL, y: 118, size: 9, font: 'bold', color: NAVY, maxWidth: 220 },
  code: { x: LEFT_COL, y: 106, size: 9, font: 'regular', color: INK, maxWidth: 220 },
  signedLabel: { x: RIGHT_COL, y: 118, size: 9, font: 'bold', color: NAVY, maxWidth: 220 },
  signatory: { x: RIGHT_COL, y: 106, size: 9, font: 'regular', color: INK, maxWidth: 220 },
  signature: { x: RIGHT_COL, y: 136, size: 42, font: 'signature', color: NAVY, maxWidth: 200 },
};

export const RULES: { x1: number; x2: number; y: number; thickness: number; color: Colour }[] = [
  { x1: 384, x2: 458, y: 417, thickness: 2.5, color: ORANGE }, // under the title
  { x1: 173, x2: 669, y: 344, thickness: 0.75, color: GREY }, // under the name
  { x1: 118, x2: 345, y: 131, thickness: 1.25, color: NAVY }, // date
  { x1: 498, x2: 724, y: 131, thickness: 1.25, color: NAVY }, // signature
];

import { expect, test } from '@playwright/test';

const responsiveViewports = [
  { name: 'small-mobile', width: 360, height: 800 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'tailwind-sm', width: 640, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'tailwind-lg', width: 1024, height: 768 },
  { name: 'before-header-switch', width: 1279, height: 900 },
  { name: 'at-header-switch', width: 1280, height: 900 },
  { name: 'desktop', width: 1280, height: 900 },
];

const visualSnapshotViewports = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

test.describe('homepage responsive layout', () => {
  for (const viewport of responsiveViewports) {
    test(`has no horizontal overflow at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'load' });

      await expect(page.getByRole('heading', { name: /AI skills training, designed for education/i })).toBeVisible();

      const heDoor = page.getByRole('link', { name: 'For Higher Education' }).first();
      await expect(heDoor).toBeVisible();
      await expect(heDoor).toHaveAttribute('href', '/higher-education/');

      const schoolsDoor = page.getByRole('link', { name: 'For Schools' }).first();
      await expect(schoolsDoor).toBeVisible();
      await expect(schoolsDoor).toHaveAttribute('href', '/schools/');

      await expect(page.getByRole('heading', { name: /A structured approach, not a one-off workshop/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Choose your sector/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /Not sure where your staff are starting from/i })).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(overflow.scrollWidth, `document width at ${viewport.width}px`).toBeLessThanOrEqual(
        overflow.clientWidth + 1
      );
    });
  }

  test('uses the mobile header below the custom 1280px breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1279, height: 900 });
    await page.goto('/', { waitUntil: 'load' });

    await expect(page.getByRole('button', { name: 'Toggle Menu' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();
  });

  test('uses the desktop header at the custom 1280px breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/', { waitUntil: 'load' });

    await expect(page.getByRole('button', { name: 'Toggle Menu' })).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  });

  test('keeps the hero heading below the sticky header at tablet width', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/', { waitUntil: 'load' });

    const header = page.locator('#header');
    const heroHeading = page.getByRole('heading', { name: /AI skills training, designed for education/i });

    await expect(header).toBeVisible();
    await expect(heroHeading).toBeVisible();

    const [headerBox, headingBox] = await Promise.all([header.boundingBox(), heroHeading.boundingBox()]);

    expect(headerBox).not.toBeNull();
    expect(headingBox).not.toBeNull();
    expect(headingBox!.y, 'hero heading should not overlap the sticky header').toBeGreaterThanOrEqual(
      headerBox!.y + headerBox!.height
    );
  });
});

test.describe('homepage visual responsive snapshots', () => {
  for (const viewport of visualSnapshotViewports) {
    test(`matches approved ${viewport.name} snapshot`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/', { waitUntil: 'load' });

      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
        animations: 'disabled',
        fullPage: true,
      });
    });
  }
});

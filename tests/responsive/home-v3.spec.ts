import { expect, test } from '@playwright/test';

const responsiveViewports = [
  { name: 'small-mobile', width: 360, height: 800 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'tailwind-sm', width: 640, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'tailwind-lg', width: 1024, height: 768 },
  { name: 'before-header-switch', width: 1179, height: 900 },
  { name: 'at-header-switch', width: 1180, height: 900 },
  { name: 'desktop', width: 1280, height: 900 },
];

const visualSnapshotViewports = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

test.describe('/home-v3 responsive layout', () => {
  for (const viewport of responsiveViewports) {
    test(`has no horizontal overflow at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/home-v3/', { waitUntil: 'load' });

      await expect(page.getByRole('heading', { name: /AI Capability Built for Higher Education/i })).toBeVisible();

      const primaryCta = page.getByRole('link', { name: 'Book Your AI Capability Check' }).first();
      await expect(primaryCta).toBeVisible();
      await expect(primaryCta).toHaveAttribute('href', '/health-check/');
      await primaryCta.click({ trial: true });

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(overflow.scrollWidth, `document width at ${viewport.width}px`).toBeLessThanOrEqual(
        overflow.clientWidth + 1
      );
    });
  }

  test('uses the mobile header below the custom 1180px breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1179, height: 900 });
    await page.goto('/home-v3/', { waitUntil: 'load' });

    await expect(page.getByRole('button', { name: 'Toggle Menu' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeHidden();
  });

  test('uses the desktop header at the custom 1180px breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 900 });
    await page.goto('/home-v3/', { waitUntil: 'load' });

    await expect(page.getByRole('button', { name: 'Toggle Menu' })).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  });
});

test.describe('/home-v3 visual responsive snapshots', () => {
  for (const viewport of visualSnapshotViewports) {
    test(`matches approved ${viewport.name} snapshot`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/home-v3/', { waitUntil: 'load' });

      await expect(page).toHaveScreenshot(`home-v3-${viewport.name}.png`, {
        animations: 'disabled',
        fullPage: true,
      });
    });
  }
});

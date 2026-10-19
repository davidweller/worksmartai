import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

test.describe('colleges page responsive layout', () => {
  for (const viewport of viewports) {
    test(`loads and has no horizontal overflow at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/colleges/', { waitUntil: 'load' });

      await expect(page.getByRole('heading', { level: 1, name: /AI skills for further education/i })).toBeVisible();

      await expect(page.getByRole('link', { name: /Book your free AI Capability Check/i }).first()).toHaveAttribute(
        'href',
        '/health-check/'
      );

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });
  }
});

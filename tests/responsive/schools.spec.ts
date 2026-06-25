import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'phone', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

test.describe('schools page responsive layout', () => {
  for (const viewport of viewports) {
    test(`loads and has no horizontal overflow at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/schools/', { waitUntil: 'load' });

      await expect(
        page.getByRole('heading', {
          name: /Your teachers are drowning in workload/i,
        })
      ).toBeVisible();

      await expect(page.getByLabel('Name')).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });
  }

  test('links to ungated schools one-pager PDF', async ({ page }) => {
    await page.goto('/schools/', { waitUntil: 'load' });

    const pdfLink = page.getByRole('link', { name: /Download the schools one-pager/i }).first();
    await expect(pdfLink).toHaveAttribute('href', '/downloads/worksmart-ai-schools.pdf');
  });
});

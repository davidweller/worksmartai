import { expect, test } from '@playwright/test';

test.describe('homepage responsive layout', () => {
  test('keeps the hero tagline below the sticky header at tablet width', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/', { waitUntil: 'load' });

    const header = page.locator('#header');
    const heroTagline = page.getByText('WORKSMART-AI', { exact: true });

    await expect(header).toBeVisible();
    await expect(heroTagline).toBeVisible();

    const [headerBox, taglineBox] = await Promise.all([header.boundingBox(), heroTagline.boundingBox()]);

    expect(headerBox).not.toBeNull();
    expect(taglineBox).not.toBeNull();
    expect(taglineBox!.y, 'hero tagline should not overlap the sticky header').toBeGreaterThanOrEqual(
      headerBox!.y + headerBox!.height
    );
  });
});

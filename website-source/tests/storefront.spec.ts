import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.loading-screen')).toHaveCount(0);
});

test('loads official assets without runtime errors or overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.reload();
  await expect(page.locator('.loading-screen')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('YOUR EDGE.UNLEASHED.');
  await expect(page.locator('.product-card')).toHaveCount(5);
  for (const image of await page.locator('.product-art img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(async () => image.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
  }
  await page.locator('#status').scrollIntoViewIfNeeded();
  await expect(page.locator('.status-row')).toHaveCount(5);
  await expect(page.locator('.status-row .status-pill')).toHaveText(Array(5).fill('Undetected'));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('filters the collection by product category', async ({ page }) => {
  await page.getByRole('button', { name: 'Game enhancements 03', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(3);
  await expect(page.locator('.product-card h3')).toHaveText(['Fortnite Private', 'Fortnite Slotted', 'Valorant ColorBot']);
  await page.getByRole('button', { name: 'HWID tools 02', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(2);
  await expect(page.locator('.product-card h3')).toHaveText(['Permanent Spoofer', 'Temporary Spoofer']);
  await page.getByRole('button', { name: 'All products 05', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(5);
});

test('all 23 license prices update the total and checkout selection', async ({ page }) => {
  test.setTimeout(60_000);
  const priceLists = [
    ['Fortnite Private', ['$14.99', '$19.99', '$39.99', '$49.99', '$99.99', '$149.99', '$169.99']],
    ['Fortnite Slotted', ['$29.99', '$69.99', '$129.99']],
    ['Valorant ColorBot', ['$9.99', '$14.99', '$29.99', '$79.99']],
    ['Permanent Spoofer', ['$19.99', '$29.99', '$39.99', '$49.99']],
    ['Temporary Spoofer', ['$4.99', '$11.99', '$19.99', '$49.99', '$109.99']],
  ] as const;
  for (const [name, prices] of priceLists) {
    const trigger = page.getByRole('button', { name: `View ${name}, from ${prices[0]}`, exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h2')).toHaveText(`${name}.`);
    await expect(dialog.locator('.license-option')).toHaveCount(prices.length);
    for (let index = 0; index < prices.length; index++) {
      await dialog.locator('.license-option').nth(index).click();
      await expect(dialog.locator('.license-total strong')).toHaveText(prices[index]);
      await expect(dialog.getByRole('radio').nth(index)).toBeChecked();
      await expect(dialog.locator('.purchase-button')).toHaveAttribute('href', 'https://goblinservices.sellhub.cx');
      await expect(dialog.locator('.purchase-button')).toHaveAttribute('aria-label', new RegExp(prices[index].replace('$', '\\$').replace('.', '\\.')));
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});

test('shows feature and compatibility information with keyboard tab navigation', async ({ page }) => {
  await page.getByRole('button', { name: 'View Permanent Spoofer, from $19.99', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('tabpanel')).toContainText('Full HWID support');
  await expect(dialog.getByRole('tabpanel')).toContainText('No RAID0 required');
  await dialog.getByRole('tab', { name: 'Features', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(dialog.getByRole('tab', { name: 'Compatibility', exact: true })).toBeFocused();
  await expect(dialog.getByRole('tabpanel')).toContainText('22H2 / 24H2 / 25H2');
  await expect(dialog.getByRole('tabpanel')).toContainText('All motherboard brands');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.getByRole('tabpanel')).toContainText('Kernel-level spoofing');
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await dialog.getByRole('button', { name: 'Close product details' }).click();
  await expect(dialog).toHaveCount(0);
});

test('status rows open the corresponding product', async ({ page }) => {
  await page.getByRole('button', { name: 'Temporary Spoofer: Undetected. View details.', exact: true }).click();
  await expect(page.getByRole('dialog').locator('h2')).toHaveText('Temporary Spoofer.');
  await expect(page.getByRole('dialog').getByRole('tabpanel')).toContainText('One-click spoofing');
});

test('FAQ expands one answer at a time', async ({ page }) => {
  const first = page.getByRole('button', { name: '01 How do I purchase a product?', exact: true });
  const second = page.getByRole('button', { name: '02 Which product is right for me?', exact: true });
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await second.click();
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#faq-answer-1')).toContainText('Fortnite Slotted');
  await second.click();
  await expect(second).toHaveAttribute('aria-expanded', 'false');
});

test('navigation and the approved example Discord links work', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile') {
    const menu = page.getByRole('button', { name: 'Open navigation', exact: true });
    await menu.click();
    await expect(page.getByRole('button', { name: 'Close navigation', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await menu.click();
    await page.getByRole('navigation', { name: 'Mobile navigation', exact: true }).getByRole('link', { name: '03 Product status', exact: true }).click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  } else {
    await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Status', exact: true }).click();
  }
  await expect(page).toHaveURL(/#status$/);
  await expect(page.locator('#status')).toBeInViewport();
  const discordLinks = page.locator('a[href="https://discord.gg/example"]');
  expect(await discordLinks.count()).toBeGreaterThan(3);
  for (const link of await discordLinks.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});

test('respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('.loading-screen')).toHaveCount(0);
  await expect(page.locator('.embers')).toHaveCSS('display', 'none');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  expect(await page.locator('.brand-mark').first().evaluate(image => (image as HTMLImageElement).currentSrc)).toContain('goblin-logo-still.webp');
});

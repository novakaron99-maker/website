import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.loading-screen')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('wheel movement eases toward its destination and stops when reduced motion is requested', async ({ page }) => {
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.evaluate(() => window.addEventListener('wheel', event => {
    document.documentElement.dataset.deliveredWheelDelta = String(event.deltaY);
  }, { once: true }));
  await page.mouse.wheel(0, 600);
  // Chromium normalizes physical wheel input to CSS pixels on high-DPI mobile devices.
  const target = await page.evaluate(() => Number(document.documentElement.dataset.deliveredWheelDelta));
  await page.waitForTimeout(60);
  const first = await page.evaluate(() => scrollY);
  await page.waitForTimeout(220);
  const second = await page.evaluate(() => scrollY);
  expect(first).toBeGreaterThan(0);
  expect(second).toBeGreaterThan(first);
  expect(first).toBeLessThan(target);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThanOrEqual(target - 2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  await expect(page.locator('.embers')).toHaveCSS('display', 'none');
});

test('embers contain bright visible pixels and keep moving', async ({ page }) => {
  const canvas = page.locator('canvas.embers');
  const brightPixels = await canvas.evaluate(canvas => {
    const c = canvas as HTMLCanvasElement;
    const pixels = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    let count = 0;
    for (let index = 3; index < pixels.length; index += 4) if (pixels[index] > 100) count++;
    return count;
  });
  expect(brightPixels).toBeGreaterThan(30);
  const firstFrame = await canvas.evaluate(canvas => (canvas as HTMLCanvasElement).toDataURL());
  await expect.poll(() => canvas.evaluate(canvas => (canvas as HTMLCanvasElement).toDataURL())).not.toBe(firstFrame);
  await expect(page.locator('.hero img')).toHaveCount(0);
});

test('product hover responds to the pointer and touch presses produce a light ripple', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'desktop') {
    const card = page.locator('.product-card').first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).not.toHaveClass(/is-revealing/);
    await expect(card).toHaveClass(/is-visible/);
    const bounds = (await card.boundingBox())!;
    await page.mouse.move(bounds.x + bounds.width * .85, bounds.y + bounds.height * .25);
    await expect.poll(() => card.evaluate(element => Math.abs(parseFloat(getComputedStyle(element).getPropertyValue('--tilt-y')) || 0))).toBeGreaterThan(.5);
    await page.mouse.move(10, 10);
    await expect.poll(() => card.evaluate(element => Math.abs(parseFloat(getComputedStyle(element).getPropertyValue('--tilt-y')) || 0))).toBeLessThan(.1);
  } else {
    const filter = page.getByRole('button', { name: 'Game enhancements 03', exact: true });
    await filter.tap();
    await expect(page.locator('.interaction-ripple').first()).toBeVisible();
    await expect(page.locator('.product-card')).toHaveCount(3);
    await expect(page.locator('.interaction-ripple')).toHaveCount(0);
  }
});

test('scroll-triggered title words move into place and finish readable', async ({ page }) => {
  const section = page.locator('#why-goblin');
  await section.scrollIntoViewIfNeeded();
  const word = section.locator('h2 .motion-word-inner').last();
  await expect.poll(() => word.evaluate(element => getComputedStyle(element).transform)).not.toBe('none');
  await expect(word).toHaveCSS('transform', 'none');
  await expect(word).toHaveCSS('opacity', '1');
  await expect(page.locator('#why-title')).toHaveText("GOOD ISN'TGOOD ENOUGH.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

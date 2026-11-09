const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

test.use({
  viewport: { width: 1280, height: 900 },
  reducedMotion: 'reduce',
  launchOptions: {
    executablePath: process.env.CHROME_PATH,
  },
});

test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\//, route => route.abort());
  await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
  await page.locator('[data-project-preview]').click();
  await expect(page.locator('#project-dialog')).toBeVisible();
});

test('selecting text into the backdrop keeps the preview open', async ({ page }) => {
  const description = await page.locator('#project-dialog-description').boundingBox();
  await page.mouse.move(description.x + 10, description.y + description.height / 2);
  await page.mouse.down();
  await page.mouse.move(1275, description.y + description.height / 2, { steps: 10 });
  await page.mouse.up();

  await expect(page.locator('#project-dialog')).toBeVisible();
  await expect(page.locator('[data-project-preview]')).toHaveAttribute('aria-expanded', 'true');
});

test('dragging from the backdrop into the preview keeps it open', async ({ page }) => {
  const description = await page.locator('#project-dialog-description').boundingBox();
  await page.mouse.move(1275, description.y + description.height / 2);
  await page.mouse.down();
  await page.mouse.move(description.x + 10, description.y + description.height / 2, { steps: 10 });
  await page.mouse.up();

  await expect(page.locator('#project-dialog')).toBeVisible();
});

test('clicking the dialog border keeps the preview open', async ({ page }) => {
  const dialog = await page.locator('#project-dialog').boundingBox();
  await page.mouse.click(dialog.x + dialog.width - 0.5, dialog.y + dialog.height / 2);

  await expect(page.locator('#project-dialog')).toBeVisible();
});

for (const method of ['backdrop', 'close button', 'Escape']) {
  test(`${method} dismisses the preview and restores focus`, async ({ page }) => {
    if (method === 'backdrop') await page.mouse.click(1275, 5);
    else if (method === 'close button') await page.getByRole('button', { name: 'Close preview' }).click();
    else await page.keyboard.press('Escape');

    await expect(page.locator('#project-dialog')).not.toBeVisible();
    await expect(page.locator('[data-project-preview]')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('[data-project-preview]')).toBeFocused();
  });
}

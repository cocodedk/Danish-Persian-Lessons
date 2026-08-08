import { expect, test } from '@playwright/test'
import { prepareVisualState, visualStates, visualWidths } from './visualStates'

test.describe('visual regression candidates awaiting human sign-off', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'pixel baselines run once in Chromium')

  for (const scheme of ['light', 'dark'] as const) {
    for (const width of visualWidths) {
      test(`${scheme} at ${width}px`, async ({ page }) => {
        test.setTimeout(180_000)
        await page.setViewportSize({ width, height: width < 600 ? 844 : 900 })
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' })

        for (const state of visualStates) {
          await prepareVisualState(page, state)
          await page.evaluate(() => document.fonts.ready)
          await expect(page.locator('.lesson-image--loading')).toHaveCount(0)
          await page.waitForFunction(() => (
            [...document.images].every((image) => image.complete && image.naturalWidth > 0)
          ))
          await page.locator('img').evaluateAll((images) => Promise.all(
            images.map((image) => (image as HTMLImageElement).decode()),
          ))
          await expect(page).toHaveScreenshot(`${state}-${scheme}-${width}.png`, {
            animations: 'disabled',
            caret: 'hide',
            scale: 'css',
          })
        }
      })
    }
  }
})

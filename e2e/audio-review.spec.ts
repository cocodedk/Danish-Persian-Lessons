import { expect, test, type Page } from '@playwright/test'
import reviewRows from '../src/audio/review.generated.json' with { type: 'json' }

const envelope = (value: object) => JSON.stringify({ schemaVersion: 1, value })

async function seed(page: Page) {
  await page.addInitScript(([profile, alphabet]) => {
    localStorage.setItem('dpl.v1.profile', profile)
    localStorage.setItem('dpl.v1.alphabet', alphabet)
  }, [envelope({}), envelope({ letters: [], marks: [], orientationSeen: true })])
}

test.beforeEach(async ({ page }) => seed(page))

test('every current review draft loads from its manifest row', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./#/lydreview')
  await expect(page.getByRole('heading', { name: 'Tjek persisk lyd' })).toBeVisible()
  expect(reviewRows.length).toBeGreaterThan(0)
  await expect(page.locator('.audio-review__card')).toHaveCount(reviewRows.length)

  for (const row of reviewRows) {
    const card = page.locator(`#${row.clipId}`)
    const audio = card.locator('audio')
    await card.getByRole('button', { name: `Hør ${row.transcript}` }).click()
    await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.getAttribute('src')))
      .toMatch(new RegExp(`${row.file.replace(/[.]/g, '\\.')}$`))
    await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.error?.code ?? null))
      .toBe(null)
    await expect(card.getByRole('status')).toHaveCount(0)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth
    - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
})

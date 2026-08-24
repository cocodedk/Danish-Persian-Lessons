import { expect, test, type Page } from '@playwright/test'
import approvedRows from '../src/audio/approved.generated.json' with { type: 'json' }

const routes = [
  '#/lesson/taelle/21-99',
  '#/lesson/taelle/100-900',
  '#/lesson/taelle/tusinder',
]
const byEntry = new Map(approvedRows.map((row) => [row.entryId, row]))
const envelope = (value: object) => JSON.stringify({ schemaVersion: 1, value })

async function seed(page: Page) {
  await page.addInitScript(([profile, alphabet]) => {
    localStorage.setItem('dpl.v1.profile', profile)
    localStorage.setItem('dpl.v1.alphabet', alphabet)
  }, [envelope({}), envelope({ letters: [], marks: [], orientationSeen: true })])
}

test('every visible counting-rule row plays its released clip on mobile', async ({ page }) => {
  await seed(page)
  await page.setViewportSize({ width: 390, height: 844 })

  for (const route of routes) {
    await page.goto(`./${route}`)
    const cards = page.locator('.entry-phrase[data-entry-id]')
    expect(await cards.count()).toBeGreaterThan(0)

    for (let index = 0; index < await cards.count(); index += 1) {
      const card = cards.nth(index)
      const entryId = await card.getAttribute('data-entry-id')
      const released = entryId ? byEntry.get(entryId) : undefined
      expect(released, `approved row for ${entryId}`).toBeDefined()
      const audio = card.locator('audio')
      await card.getByRole('button', { name: /^Hør / }).click()
      await expect.poll(() => audio.getAttribute('src'))
        .toMatch(new RegExp(`${released!.file.replace(/[.]/g, '\\.')}$`))
      await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.error?.code ?? null))
        .toBe(null)
      await expect(card.getByRole('status')).toHaveCount(0)
    }
  }
})

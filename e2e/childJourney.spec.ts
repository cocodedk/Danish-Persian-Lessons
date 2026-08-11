import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function openFresh(page: Page) {
  await page.goto('./#/')
  await expect(page.getByRole('heading', { name: 'Lær at tale persisk' })).toBeVisible()
}

async function openWater(page: Page) {
  await page.getByRole('link', { name: 'Ord', exact: true }).click()
  await expect(page).toHaveTitle('Ordværksted · Lær persisk skrift')
  await page.getByRole('link', { name: 'Vælg vand' }).click()
  await expect(page).toHaveTitle('vand · Ordværksted')
}

async function completeWater(page: Page) {
  await page.getByRole('button', { name: 'Byg ordet' }).click()
  await page.getByRole('button', { name: 'Vælg آ, næste tegn' }).click()
  await page.getByRole('button', { name: 'Vælg ب, næste tegn' }).click()
  await expect(page.getByText('Byg det én gang selv, så kommer det i din samling.')).toBeVisible()
  await page.getByRole('button', { name: 'Prøv selv' }).click()
  await page.getByRole('button', { name: 'Vælg آ' }).click()
  await page.getByRole('button', { name: 'Vælg ب' }).click()
  await expect(page.getByText('Nu er آب i din samling.')).toBeVisible()
}

test('fresh child journey collects a word, returns, and switches both ways', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openFresh(page)
  await expect(page).toHaveTitle('Lær at tale persisk · Lær persisk')
  await openWater(page)
  await completeWater(page)
  await page.getByRole('link', { name: 'Færdig for nu' }).click()
  await expect(page.getByText('I din samling')).toBeVisible()

  await page.getByRole('link', { name: 'Ordbroer' }).click()
  await expect(page.getByRole('heading', { name: 'Ord, der ligner' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Ordbroer' })).toHaveAttribute('aria-current', 'page')
  await page.getByRole('link', { name: 'Til ordværkstedet' }).click()
  await expect(page.getByRole('heading', { name: 'Vælg et persisk ord' })).toBeVisible()

  await page.goto('./#/')
  await expect(page.getByRole('heading', { name: 'Vælg et persisk ord' })).toBeVisible()
  await page.getByRole('link', { name: 'Skrift' }).click()
  await expect(page.getByRole('heading', { name: 'Sådan virker persisk skrift' })).toBeVisible()
  await page.getByRole('link', { name: 'Til ordværkstedet' }).click()
  await expect(page.getByRole('heading', { name: 'Vælg et persisk ord' })).toBeVisible()
})

test('fresh gate and workshop have no automatic axe violations', async ({ page }) => {
  await openFresh(page)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.getByRole('link', { name: 'Ord', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Vælg et persisk ord' })).toBeVisible()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.getByRole('link', { name: 'Vælg vand' }).click()
  await expect(page.getByRole('heading', { name: 'vand' })).toBeVisible()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('word building is keyboard operable, recoverable, and bounded at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await openFresh(page)
  const primary = page.getByRole('link', { name: /Øv alle lyde/ })
  const primaryBox = await primary.boundingBox()
  expect((primaryBox?.y ?? 640) + (primaryBox?.height ?? 0)).toBeLessThanOrEqual(640)
  await primary.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Øv persisk lyd' })).toBeVisible()
  await page.getByRole('link', { name: 'Ord', exact: true }).click()
  await page.getByRole('link', { name: 'Vælg vand' }).click()
  await page.getByRole('button', { name: 'Byg ordet' }).click()

  const wrong = page.getByRole('button', { name: 'Vælg ب' })
  await wrong.focus()
  await page.keyboard.press('Enter')
  await expect(wrong).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Prøv igen' }).click()
  await expect(page.getByLabel('Tegn du kan vælge')).toBeFocused()

  for (const name of ['Vælg آ, næste tegn', 'Vælg ب, næste tegn']) {
    const tile = page.getByRole('button', { name })
    await tile.focus()
    await page.keyboard.press('Enter')
  }
  await page.getByRole('button', { name: 'Prøv selv' }).click()
  for (const name of ['Vælg آ', 'Vælg ب']) {
    const tile = page.getByRole('button', { name })
    await tile.focus()
    await page.keyboard.press('Enter')
  }
  expect(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth)).toBe(true)
})

test('denied storage keeps a completed word for the current session', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('denied') }
  })
  await openFresh(page)
  await openWater(page)
  await completeWater(page)
  await expect(page.getByRole('status').filter({ hasText: 'Fremskridt gemmes kun i denne fane' })).toBeVisible()
  await page.getByRole('link', { name: 'Færdig for nu' }).click()
  await expect(page.getByText('I din samling')).toBeVisible()
  await context.close()
})

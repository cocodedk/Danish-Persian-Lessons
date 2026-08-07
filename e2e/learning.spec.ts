import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const envelope = (value: object) => JSON.stringify({ schemaVersion: 1, value })

async function seed(page: Page) {
  await page.addInitScript(([profile, alphabet]) => {
    localStorage.setItem('dpl.v1.profile', profile)
    localStorage.setItem('dpl.v1.alphabet', alphabet)
  }, [envelope({}), envelope({ letters: [], marks: [], orientationSeen: true })])
}

async function open(page: Page, hash = '#/') {
  await page.goto(`./${hash}`)
  await expect(page.locator('main h1')).toBeVisible()
}

test.beforeEach(async ({ page }) => seed(page))

test('representative routes have no automatic axe violations', async ({ page }) => {
  for (const route of ['#/', '#/lesson/alphabet', '#/lesson/ord/2/madrese', '#/lesson/ord/1/skriv', '#/repetition']) {
    await open(page, route)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations, route).toEqual([])
  }
})

test('a new review item is modeled and guided before unaided retrieval', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await open(page, '#/repetition')
  await expect(page.getByRole('heading', { name: 'Nyt tegn: alef med madde' })).toBeVisible()
  await expect(page.getByText('Se først · øv med hjælp · prøv selv')).toBeVisible()

  await page.getByRole('button', { name: 'Se forskellen' }).click()
  await page.getByRole('button', { name: 'Øv med hjælp' }).click()
  await page.getByRole('button', { name: /Peg på svaret med hjælp/ }).click()
  await page.getByRole('button', { name: 'Prøv uden hjælp' }).click()
  await expect(page.getByRole('heading', { name: 'Hvilket tegn siger denne lyd?' })).toBeVisible()

  await page.locator('.review-session__choices button').filter({ hasText: 'آ' }).click()
  await expect(page.getByText('✓ Husket')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Stop for i dag' })).toBeVisible()
  await page.getByRole('button', { name: 'Stop for i dag' }).click()
  await expect(page.getByText('1 nyt introduceret.')).toBeVisible()
  await expect(page.getByText('1 husket i denne session.')).toBeVisible()
})

test('review remains usable with denied storage and offline after load', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('denied') }
    Storage.prototype.setItem = () => { throw new DOMException('denied') }
  })
  await open(page, '#/repetition')
  await expect(page.getByRole('status')).toHaveText(
    'Du kan fortsætte. Fremskridt gemmes kun i denne fane lige nu.',
  )
  await page.context().setOffline(true)
  await page.getByRole('button', { name: 'Se forskellen' }).click()
  await page.getByRole('button', { name: 'Øv med hjælp' }).click()
  await page.getByRole('button', { name: /Peg på svaret med hjælp/ }).click()
  await page.getByRole('button', { name: 'Prøv uden hjælp' }).click()
  await expect(page.getByRole('heading', { name: 'Hvilket tegn siger denne lyd?' })).toBeVisible()
  await page.close()
})

test('200 percent text and resizing preserve the active review step without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await open(page, '#/repetition')
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px' })
  await page.getByRole('button', { name: 'Se forskellen' }).click()
  await expect(page.getByRole('heading', { name: 'Se forskellen' })).toBeVisible()
  expect(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth)).toBe(true)

  await page.setViewportSize({ width: 768, height: 900 })
  await expect(page.getByRole('heading', { name: 'Se forskellen' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Øv med hjælp' })).toBeVisible()
  expect(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth)).toBe(true)
})

test('review modeling and retrieval are keyboard operable with enhanced targets', async ({ page }) => {
  await open(page, '#/repetition')
  for (const name of ['Se forskellen', 'Øv med hjælp']) {
    const button = page.getByRole('button', { name })
    await button.focus()
    await page.keyboard.press('Enter')
  }
  const guided = page.getByRole('button', { name: /Peg på svaret med hjælp/ })
  await guided.focus()
  await page.keyboard.press('Enter')
  const retrieve = page.getByRole('button', { name: 'Prøv uden hjælp' })
  await retrieve.focus()
  await page.keyboard.press('Enter')
  const answer = page.locator('.review-session__choices button').filter({ hasText: 'آ' })
  const box = await answer.boundingBox()
  expect(box?.width).toBeGreaterThanOrEqual(44)
  expect(box?.height).toBeGreaterThanOrEqual(44)
  await answer.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('✓ Husket')).toBeVisible()
})

test('dark representative routes have no automatic axe violations', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark', viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await seed(page)
  for (const route of ['#/', '#/repetition']) {
    await open(page, route)
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations, route).toEqual([])
  }
  await context.close()
})

test('forced colors preserve focus and review operation', async ({ browser, browserName }) => {
  test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium evidence')
  const context = await browser.newContext({ forcedColors: 'active', viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await seed(page)
  await open(page, '#/repetition')
  const button = page.getByRole('button', { name: 'Se forskellen' })
  await button.focus()
  await expect(button).toBeFocused()
  expect(await button.evaluate((node) => getComputedStyle(node).outlineStyle)).not.toBe('none')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Se forskellen' })).toBeVisible()
  await context.close()
})

test('connected reading moves from marked help to an unmarked meaning check', async ({ page }) => {
  await open(page, '#/lesson/ord/1/laes/1-1')
  await expect(page.getByRole('heading', { name: 'Før du læser' })).toBeVisible()
  await expect(page.locator('[data-entry-id="reading-function-o"]')).toBeVisible()
  await expect(page.getByText('آب و باد')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Hvad betyder udtrykket?' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Prøv uden vokaltegn' }).click()
  await page.getByRole('button', { name: 'vand og vind' }).click()
  await expect(page.getByText('✓ Rigtigt')).toBeVisible()
  await expect(page.getByLabel('Forstået')).toBeVisible()
})

test('initial routes never request the dormant audio corpus', async ({ page }) => {
  const audioRequests: string[] = []
  page.on('request', (request) => {
    if (/\/audio\/.*\.(?:mp3|m4a|ogg)(?:\?|$)/.test(request.url())) audioRequests.push(request.url())
  })
  await open(page, '#/')
  await open(page, '#/lesson/ord/1/baba')
  expect(audioRequests).toEqual([])
})

test('dark scheme and reduced motion retain the first-run route', async ({ browser }) => {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  })
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException('denied') }
  })
  await open(page)
  await expect(page.getByRole('heading', { name: 'Sådan virker persisk skrift' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Spring over og gå til alfabetet' })).toBeVisible()
  await page.close()
})

import { expect, test, type Page } from '@playwright/test'

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

test('critical routes stay bounded from phone to ultrawide', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'full geometry matrix runs once')
  const widths = [
    320, 360, 390, 430, 479, 480, 481, 600, 767, 768, 769, 820,
    1023, 1024, 1025, 1280, 1440, 1599, 1600, 1601, 1920, 2560,
  ]
  const routes = ['#/', '#/lesson/alphabet', '#/lesson/alphabet/bogstav/be', '#/lesson/ord/2/madrese', '#/lesson/ord/1/skriv', '#/repetition']
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 })
    for (const route of routes) {
      await open(page, route)
      const geometry = await page.locator('body').evaluate((body) => ({
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth,
      }))
      expect(geometry.scrollWidth, `${route} at ${width}px`).toBeLessThanOrEqual(geometry.clientWidth)
      for (const [selector, maximum] of [
        ['.ruled-section', 1282],
        ['.entry-card', 546],
        ['.keyboard', 546],
        ['.review-session, .guided-model', 834],
      ] as const) {
        for (const box of await page.locator(selector).evaluateAll((items) => items.map((item) => item.getBoundingClientRect()))) {
          expect(box.width, `${selector} on ${route} at ${width}px`).toBeLessThanOrEqual(maximum)
        }
      }
    }
  }
})

test('mobile master-detail stays within its viewport share and leaves context visible', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'mobile geometry runs once')
  await page.setViewportSize({ width: 360, height: 640 })
  for (const route of ['#/lesson/alphabet', '#/lesson/ord/1']) {
    await open(page, route)
    const detail = page.locator('.entry-detail--master')
    const detailBox = await detail.boundingBox()
    const selectedBox = await page.locator('[aria-pressed="true"]').first().boundingBox()
    const actionBox = await detail.locator('.entry-detail__link').boundingBox()
    expect(detailBox?.height, route).toBeLessThanOrEqual(160)
    expect(actionBox?.y, route).toBeGreaterThanOrEqual(0)
    expect((actionBox?.y ?? 640) + (actionBox?.height ?? 0), route).toBeLessThanOrEqual(640)
    expect(selectedBox?.y, route).toBeLessThan(640)
  }
})

test('short landscape layouts preserve core routes without page overflow', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'landscape geometry matrix runs once')
  for (const [width, height] of [[640, 360], [844, 390], [1024, 768]]) {
    await page.setViewportSize({ width, height })
    for (const route of ['#/lesson/alphabet/intro', '#/lesson/ord/1/skriv', '#/repetition']) {
      await open(page, route)
      expect(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth), `${route} at ${width}x${height}`).toBe(true)
    }
  }
})

test('forward focus and Back scroll restoration are predictable', async ({ page }) => {
  await open(page, '#/lesson/alphabet')
  await page.evaluate(() => window.scrollTo(0, 520))
  await page.locator('.alphabet__cell').nth(20).click()
  const priorPosition = await page.evaluate(() => window.scrollY)
  expect(priorPosition).toBeGreaterThan(200)
  await page.getByRole('link', { name: 'Åbn hele lektionen' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Alfabetet' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(priorPosition)
})

test('first-run orientation records six viewed steps or an explicit skip, never a mount', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await open(page, '#/lesson/alphabet')
  await expect(page.getByText(/trin 1 af 6/)).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('dpl.v1.alphabet'))).toBeNull()
  for (const name of [
    'Næste: læseretning',
    'Næste: bogstaver der binder',
    'Næste: bogstavformer',
    'Næste: store og små bogstaver',
    'Næste: prikker',
  ]) await page.getByRole('button', { name }).click()
  await expect(page.getByText(/trin 6 af 6/)).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('dpl.v1.alphabet'))).not.toBeNull()
  await context.close()
})

test('wrong feedback is visibly selected and not hidden by the dock', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await open(page, '#/lesson/alphabet/ovelse/find')
  const choices = page.locator('.choice-exercise__choice')
  await choices.nth(1).click()
  await expect(choices.nth(1)).toHaveAttribute('aria-pressed', 'true')
  await expect(choices.nth(1)).toContainText('Valgt')
  const feedback = page.locator('.choice-exercise__feedback')
  await expect(feedback.getByRole('heading', { name: /Se hele/ })).toBeVisible()
  const bounds = await feedback.boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds!.y).toBeGreaterThanOrEqual(0)
  expect(bounds!.y).toBeLessThan(844)
})

test('typing remains keyboard-completable with enhanced targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await open(page, '#/lesson/ord/1/skriv')
  const keys = page.locator('.keyboard__key')
  await expect(keys.first()).toBeVisible()
  for (const box of await keys.evaluateAll((items) => items.slice(0, 6).map((item) => item.getBoundingClientRect()))) {
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
  await page.getByRole('button', { name: 'alef med madde' }).click()
  await page.getByRole('button', { name: 'be' }).click()
  await page.getByRole('button', { name: 'Se efter' }).click()
  await expect(page.getByText('Rigtigt')).toBeVisible()
})

test('typing accepts a physical Persian keyboard without disabling the on-screen board', async ({ page }) => {
  await open(page, '#/lesson/ord/1/skriv')
  const keyboard = page.locator('.keyboard')
  await keyboard.focus()
  await keyboard.dispatchEvent('keydown', { key: 'آ' })
  await keyboard.dispatchEvent('keydown', { key: 'ب' })
  await expect(page.locator('.type__written')).toHaveText('آب')
  await expect(page.getByRole('button', { name: 'alef med madde' })).toBeVisible()
  await page.getByRole('button', { name: 'Se efter' }).click()
  await expect(page.getByText('Rigtigt')).toBeVisible()
})

test('a wrong typed attempt reveals teaching above the keyboard dock', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await open(page, '#/lesson/ord/1/skriv')
  await page.getByRole('button', { name: 'be' }).click()
  await page.getByRole('button', { name: 'Se efter' }).click()
  const reveal = page.locator('.type__reveal')
  await expect(reveal.getByRole('heading', { name: /Se hele/ })).toBeVisible()
  await expect(reveal.getByRole('button', { name: 'Prøv én gang til' })).toBeVisible()
  await expect(page.locator('.keyboard')).toHaveCount(0)
  const revealBox = await reveal.boundingBox()
  const footBox = await page.locator('.lesson-foot').boundingBox()
  expect(revealBox).not.toBeNull()
  expect(footBox).not.toBeNull()
  expect(footBox!.y).toBeGreaterThanOrEqual(0)
  expect(revealBox!.y).toBeLessThan(footBox!.y)
  await reveal.getByRole('button', { name: 'Prøv én gang til' }).click()
  await expect(page.locator('.type__written')).toHaveText('ب')
  await expect(page.locator('.keyboard')).toBeVisible()
})

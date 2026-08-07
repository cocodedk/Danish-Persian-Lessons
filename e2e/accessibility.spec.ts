import { expect, test, type Page } from '@playwright/test'

const envelope = (value: object) => JSON.stringify({ schemaVersion: 1, value })

async function seed(page: Page) {
  await page.addInitScript(([profile, alphabet]) => {
    localStorage.setItem('dpl.v1.profile', profile)
    localStorage.setItem('dpl.v1.alphabet', alphabet)
  }, [
    envelope({ name: 'Sara', faSpelling: 'سارا' }),
    envelope({ letters: [], marks: [], orientationSeen: true }),
  ])
}

async function open(page: Page, hash: string) {
  await page.goto(`./${hash}`)
  await expect(page.locator('main h1')).toBeVisible()
}

test.beforeEach(async ({ page }) => seed(page))

test('representative routes retain enhanced target sizes at narrow width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  const routes = [
    '#/', '#/lesson/alphabet', '#/lesson/alphabet/intro',
    '#/lesson/alphabet/bogstav/be', '#/lesson/alphabet/ovelse/find',
    '#/lesson/ord/1', '#/lesson/ord/1/skriv', '#/puslespil/alphabet-1-match',
    '#/repetition', '#/dit-navn', '#/lesson/navn',
    '#/ord-der-ligner', '#/billedkilder', '#/lesson/ord/1/ab',
  ]
  for (const route of routes) {
    await open(page, route)
    const undersized = await page.locator(
      'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"]',
    ).evaluateAll((items) => items.filter((item) => {
      const box = item.getBoundingClientRect()
      const inlineException = getComputedStyle(item).display === 'inline' && !!item.closest('p, li')
      return box.width > 0 && box.height > 0 && !inlineException
        && (box.width < 43.5 || box.height < 43.5)
    }).map((item) => item.outerHTML.slice(0, 120)))
    expect(undersized, route).toEqual([])
  }
})

test('the learner can choose and keep light or dark colours', async ({ page }) => {
  await open(page, '#/')
  await page.getByRole('button', { name: 'Indstillinger for Sara' }).click()
  const colors = page.getByLabel('Farver')

  await expect(colors).toHaveValue('system')
  await colors.selectOption('dark')
  await expect(page.locator('html')).toHaveClass(/scheme-dark/)

  await page.reload()
  await expect(page.locator('html')).toHaveClass(/scheme-dark/)

  await page.getByRole('button', { name: 'Indstillinger for Sara' }).click()
  await page.getByLabel('Farver').selectOption('light')
  await expect(page.locator('html')).toHaveClass(/scheme-light/)
})

test('400 percent reflow equivalent and text-spacing overrides do not lose content', async ({ page }) => {
  // A 1280px desktop viewport at 400% browser zoom exposes about 320 CSS px.
  await page.setViewportSize({ width: 320, height: 844 })
  for (const route of ['#/', '#/lesson/alphabet/intro', '#/lesson/ord/1/ab', '#/repetition']) {
    await open(page, route)
    await page.addStyleTag({ content: `
      * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }
      p { margin-block-end: 2em !important; }
    ` })
    expect(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth), route).toBe(true)
    await expect(page.locator('main h1')).toBeVisible()
  }
})

test('typing buffer and focus survive live resize and rotation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await open(page, '#/lesson/ord/1/skriv')
  await page.getByRole('button', { name: 'alef med madde' }).click()
  const be = page.getByRole('button', { name: 'be' })
  await be.focus()
  await page.setViewportSize({ width: 1024, height: 768 })
  await expect(page.locator('.type__written')).toHaveText('آ')
  await expect(be).toBeFocused()
  await page.setViewportSize({ width: 640, height: 360 })
  await expect(page.locator('.type__written')).toHaveText('آ')
  await expect(be).toBeFocused()
  expect(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth)).toBe(true)
})

test('lesson photos reflow from phone to wide screen and with large text', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'One browser records the full photo size matrix')
  for (const width of [320, 390, 768, 1280, 2560]) {
    await page.setViewportSize({ width, height: 900 })
    await open(page, '#/lesson/ord/1/ab')
    const image = page.getByRole('img', { name: 'Et glas vand' })
    await expect(image).toBeVisible()
    const box = await image.boundingBox()
    expect(box?.width).toBeLessThanOrEqual(448)
    expect(Math.abs((box?.width ?? 0) / (box?.height ?? 1) - 4 / 3)).toBeLessThan(0.02)
    expect(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth)).toBe(true)
  }

  for (const rootSize of ['32px', '64px']) {
    await page.setViewportSize({ width: 1280, height: 900 })
    await open(page, '#/lesson/ord/1/ab')
    await page.evaluate((size) => { document.documentElement.style.fontSize = size }, rootSize)
    await expect(page.getByText('vand', { exact: true })).toBeVisible()
    expect(await page.locator('body').evaluate((body) => body.scrollWidth <= body.clientWidth)).toBe(true)
  }
})

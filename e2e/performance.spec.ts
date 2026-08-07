import { expect, test } from '@playwright/test'

const envelope = (value: object) => JSON.stringify({ schemaVersion: 1, value })

test('three-run mobile lab medians meet the production performance targets', async ({ browser, browserName }) => {
  test.skip(browserName !== 'chromium', 'Core Web Vitals lab proxy runs in Chromium')
  const runs: Array<{ lcp: number; cls: number; interaction: number }> = []

  for (let index = 0; index < 3; index += 1) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await page.addInitScript(([profile, alphabet]) => {
      localStorage.setItem('dpl.v1.profile', profile)
      localStorage.setItem('dpl.v1.alphabet', alphabet)
      const values = { cls: 0 }
      Object.assign(window, { __dplVitals: values })
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
          if (!shift.hadRecentInput) values.cls += shift.value ?? 0
        }
      }).observe({ type: 'layout-shift', buffered: true })
    }, [envelope({}), envelope({ letters: [], marks: [], orientationSeen: true })])
    await page.goto('./#/')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)

    const started = await page.evaluate(() => performance.now())
    await page.getByRole('button', { name: 'Indstillinger' }).click()
    await expect(page.locator('#settings-corner-panel')).toBeVisible()
    const interaction = await page.evaluate((start) => performance.now() - start, started)
    const values = await page.evaluate(() => {
      const entries = performance.getEntriesByType('largest-contentful-paint')
      const lcp = entries.at(-1)?.startTime ?? performance.getEntriesByType('navigation')[0]?.duration ?? Infinity
      const cls = (window as Window & { __dplVitals?: { cls: number } }).__dplVitals?.cls ?? Infinity
      return { lcp, cls }
    })
    runs.push({ ...values, interaction })
    await page.close()
  }

  const median = (values: number[]) => [...values].sort((a, b) => a - b)[1]
  expect(median(runs.map((run) => run.lcp))).toBeLessThanOrEqual(2500)
  expect(median(runs.map((run) => run.cls))).toBeLessThanOrEqual(0.1)
  expect(median(runs.map((run) => run.interaction))).toBeLessThanOrEqual(200)
})

test('production journeys make no external, fetch, or XHR request', async ({ page }) => {
  const requests: Array<{ url: string; type: string }> = []
  page.on('request', (request) => requests.push({ url: request.url(), type: request.resourceType() }))
  await page.goto('./#/lesson/alphabet')
  await page.waitForLoadState('networkidle')
  await page.goto('./#/repetition')
  await page.goto('./#/lesson/ord/1/ab')
  await expect(page.getByRole('img', { name: 'Et glas vand' })).toBeVisible()
  await page.goto('./#/billedkilder')
  await expect(page.getByRole('heading', { name: 'Billedkilder' })).toBeVisible()

  const origin = new URL(page.url()).origin
  expect(requests.every((request) => new URL(request.url).origin === origin)).toBe(true)
  expect(requests.filter((request) => ['fetch', 'xhr'].includes(request.type))).toEqual([])
  const routeImages = requests.filter((request) => (
    request.type === 'image' && request.url.includes('/lesson-images/')
  ))
  expect(routeImages.length).toBeGreaterThanOrEqual(1)
  expect(routeImages.length).toBeLessThanOrEqual(2)
  expect(routeImages.every((request) => request.url.includes('/ab-480.'))).toBe(true)
})

test('the home route loads no lesson photo bytes', async ({ page }) => {
  const lessonImages: string[] = []
  page.on('request', (request) => {
    if (request.resourceType() === 'image' && request.url().includes('/lesson-images/')) {
      lessonImages.push(request.url())
    }
  })
  await page.goto('./#/')
  await page.waitForLoadState('networkidle')
  expect(lessonImages).toEqual([])
})

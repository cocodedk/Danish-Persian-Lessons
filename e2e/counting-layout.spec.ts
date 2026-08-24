import { expect, test, type Page } from '@playwright/test'

const envelope = (value: object) => JSON.stringify({ schemaVersion: 1, value })

async function seed(page: Page) {
  await page.addInitScript(([profile, alphabet]) => {
    localStorage.setItem('dpl.v1.profile', profile)
    localStorage.setItem('dpl.v1.alphabet', alphabet)
  }, [envelope({}), envelope({ letters: [], marks: [], orientationSeen: true })])
}

async function open(page: Page) {
  await page.goto('./#/lesson/taelle')
  await expect(page.getByRole('heading', { name: 'Tæl til tyve' })).toBeVisible()
}

type Box = { x: number; y: number; width: number; height: number }

async function tileBoxes(page: Page): Promise<Box[]> {
  return page.locator('.vocab__grid button').evaluateAll((tiles) => tiles.map((tile) => {
    const { x, y, width, height } = tile.getBoundingClientRect()
    return { x, y, width, height }
  }))
}

const firstRow = (boxes: Box[]) => boxes.filter((box) => Math.abs(box.y - boxes[0].y) < 1)

test.beforeEach(async ({ page }) => seed(page))

test('mobile grid counts LTR in three and four compact columns', async ({ page }) => {
  for (const [width, minimumColumns] of [[320, 3], [390, 4]] as const) {
    await page.setViewportSize({ width, height: 844 })
    await open(page)
    const grid = page.locator('.vocab__grid')
    const boxes = await tileBoxes(page)
    const row = firstRow(boxes)

    await expect(grid).toHaveAttribute('dir', 'ltr')
    expect(await grid.evaluate((node) => getComputedStyle(node).direction)).toBe('ltr')
    expect(await grid.locator('.vocab__cell-fa').first()
      .evaluate((node) => getComputedStyle(node).direction)).toBe('rtl')
    expect(row.length).toBeGreaterThanOrEqual(minimumColumns)
    expect(row[0].x).toBeLessThan(row[1].x)
    for (const box of boxes) {
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeLessThanOrEqual(72)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth
      - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
  }
})

test('desktop grid keeps compact tracks clear of its detail rail', async ({ page }) => {
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await open(page)
    const detail = await page.locator('.entry-detail--master').boundingBox()
    const grid = await page.locator('.vocab__grid').boundingBox()
    const boxes = await tileBoxes(page)
    const row = firstRow(boxes)

    expect(detail!.width).toBeGreaterThanOrEqual(288)
    expect(detail!.width).toBeLessThanOrEqual(384)
    expect(detail!.x + detail!.width).toBeLessThanOrEqual(grid!.x)
    expect(row.length).toBeGreaterThanOrEqual(7)
    for (const box of boxes) {
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.width).toBeLessThanOrEqual(80)
    }
    expect(Math.max(...boxes.map((box) => box.width))).toBe(
      Math.min(...boxes.map((box) => box.width)),
    )
  }
})

test('a longer selection keeps grid geometry, focus and nav clearance', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await open(page)
  const grid = page.locator('.vocab__grid')
  const geometry = () => grid.evaluate((node) => {
    const box = node.getBoundingClientRect()
    return { top: box.top + scrollY, width: box.width, height: box.height }
  })
  const before = await geometry()
  const seventeen = page.getByRole('button', { name: 'Vælg tallet sytten' })

  await seventeen.click()

  await expect(page.locator('.entry-detail--master')).toHaveAttribute('data-entry-id', 'number-17-word')
  await expect(seventeen).toBeFocused()
  expect(await geometry()).toEqual(before)
  const selected = await seventeen.boundingBox()
  const nav = await page.locator('.area-nav').boundingBox()
  expect(selected!.y + selected!.height).toBeLessThanOrEqual(nav!.y)
})

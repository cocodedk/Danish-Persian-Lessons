import { expect, test, type Page } from '@playwright/test'
import approvedAudio from '../src/audio/approved.generated.json' with { type: 'json' }

/** The approved generated corpus is the only inventory this spec trusts: the
 *  counting rows are read off it, never typed here, so a clip that is added,
 *  renamed or withdrawn changes what the browser test demands. */
const countingRows = (approvedAudio as { entryId: string; file: string }[])
  .map((row) => ({ row, match: /^number-(\d+)-word$/.exec(row.entryId) }))
  .filter((candidate): candidate is { row: typeof candidate.row; match: RegExpExecArray } =>
    candidate.match !== null)
  .map(({ row, match }) => ({ value: Number(match[1]), entryId: row.entryId, file: row.file }))
  .sort((a, b) => a.value - b.value)

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

test('initial routes never request the dormant audio corpus', async ({ page }) => {
  const audioRequests: string[] = []
  page.on('request', (request) => {
    if (/\/audio\/.*\.(?:mp3|m4a|ogg)(?:\?|$)/.test(request.url())) audioRequests.push(request.url())
  })
  await open(page, '#/')
  await open(page, '#/lesson/ord/1/baba')
  await open(page, '#/lesson/taelle')
  expect(audioRequests).toEqual([])
})

test('audio speed buttons apply 80 and 50 percent to the media element', async ({ page }) => {
  await open(page, '#/lesson/ord/1/ab')
  const audio = page.locator('audio').first()
  await expect(audio).not.toHaveAttribute('src')

  // Speed choices live behind the progressive disclosure toggle.
  await page.getByRole('button', { name: 'Flere lydvalg' }).first().click()

  await page.getByRole('button', { name: 'Langsom 0,8×' }).first().click()
  await expect(audio).toHaveAttribute('src', /\/audio\/vocabulary-1-ab\..*\.mp3$/)
  await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.playbackRate))
    .toBe(0.8)
  await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.defaultPlaybackRate))
    .toBe(0.8)

  await page.getByRole('button', { name: 'Meget langsom 0,5×' }).first().click()
  await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.playbackRate))
    .toBe(0.5)
  await expect.poll(() => audio.evaluate((node: HTMLAudioElement) => node.defaultPlaybackRate))
    .toBe(0.5)
})

const overflow = (page: Page) => page.evaluate(() => {
  const root = document.documentElement
  return root.scrollWidth - root.clientWidth
})

test('the tempo strip stays one row at 320px and never forces sideways scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await open(page, '#/lesson/ord/1/ab')
  await page.getByRole('button', { name: 'Flere lydvalg' }).first().click()

  const tempo = page.getByRole('group', { name: 'Tempo' }).first()
  const cells = tempo.getByRole('button')
  await expect(cells).toHaveCount(3)
  const boxes = await Promise.all((await cells.all()).map((cell) => cell.boundingBox()))

  // One shared row: same top edge, and each cell keeps the 44px tap target.
  expect(new Set(boxes.map((box) => Math.round(box!.y))).size).toBe(1)
  for (const box of boxes) expect(box!.height).toBeGreaterThanOrEqual(44)
  // The selected cell is filled with ink; its neighbours stay on paper.
  const [ink, paper] = await Promise.all([cells.first(), cells.nth(1)]
    .map((cell) => cell.evaluate((node) => getComputedStyle(node).backgroundColor)))
  expect(ink).not.toBe(paper)
  expect(await overflow(page)).toBeLessThanOrEqual(0)

  // At 200% root text the strip may wrap, but the page must still never scroll sideways.
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  await expect(cells.first()).toBeVisible()
  expect(await overflow(page)).toBeLessThanOrEqual(0)
})

test('the transport stays put when Hør becomes Hør igen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await open(page, '#/lesson/taelle')
  const control = page.locator('.audio-control').first()
  const play = control.locator('.audio-control__play')
  const grid = page.locator('.vocab__grid')
  const geometry = async () => ({
    controlHeight: (await control.boundingBox())!.height,
    playWidth: (await play.boundingBox())!.width,
    gridY: (await grid.boundingBox())!.y,
  })
  const idle = await geometry()

  await play.click()
  await expect(play).toHaveText('Hør igen')

  expect(await geometry()).toEqual(idle)
  expect(idle.controlHeight).toBe(44)

  // "to" is a prefix of "tolv": only the exact label picks the number two tile.
  await page.getByRole('button', { name: 'Vælg tallet to', exact: true }).click()
  // One click now selects and plays, so the transport never falls back to Hør.
  await expect(play).toHaveText(/Afspiller|Hør igen/)
  expect(await geometry()).toEqual(idle)
})

test('every approved counting clip plays from its own tile', async ({ page }) => {
  await open(page, '#/lesson/taelle')
  expect(countingRows.length).toBeGreaterThan(0)

  const detail = page.locator('.entry-detail--master')
  const audio = detail.locator('audio')
  const play = detail.locator('.audio-control__play')
  // DOM order is the counting order, whatever the RTL grid shows first.
  const tiles = page.locator('.vocab__grid li button')
  // The lesson may teach more numbers than the corpus covers, never fewer.
  expect(await tiles.count()).toBeGreaterThanOrEqual(countingRows[countingRows.length - 1].value)

  for (const { value, entryId, file } of countingRows) {
    const tile = tiles.nth(value - 1)
    await expect(tile, `tile for ${entryId}`).toBeVisible()
    await tile.click()

    await expect(detail, `detail for ${entryId}`).toHaveAttribute('data-entry-id', entryId)
    // The base path lives in the app, so the manifest file is matched as the tail.
    await expect
      .poll(() => audio.evaluate((node: HTMLAudioElement) => node.getAttribute('src')),
        { message: `src for ${entryId}` })
      .toMatch(new RegExp(`${file.replace(/[.]/g, '\\.')}$`))
    await expect
      .poll(() => audio.evaluate((node: HTMLAudioElement) => node.error?.code ?? null),
        { message: `media error for ${entryId}` })
      .toBe(null)
    await expect(play, `transport for ${entryId}`).toHaveText(/Afspiller|Hør igen/)
    await expect(detail.getByRole('status'), `error message for ${entryId}`).toHaveCount(0)
  }
})

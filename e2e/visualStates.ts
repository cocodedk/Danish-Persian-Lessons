import { expect, type Page } from '@playwright/test'

export const visualWidths = [320, 390, 768, 1024, 1440, 1920, 2560] as const
export const visualStates = [
  'home',
  'orientation',
  'index-top',
  'index-scrolled',
  'detail',
  'exercise-active',
  'exercise-wrong',
  'exercise-correct',
  'puzzle',
  'typing-active',
  'typing-feedback',
  'name-settings',
  'connected-reading',
  'word-bridges',
  'celebration',
  'session-summary',
] as const

export type VisualState = typeof visualStates[number]

const envelope = (value: object) => JSON.stringify({ schemaVersion: 1, value })
let resetId = 0

async function reset(page: Page, profile: object = {}) {
  await page.goto(`./?visual-reset=${resetId += 1}#/`)
  await page.evaluate(([profileRow, alphabetRow]) => {
    localStorage.clear()
    localStorage.setItem('dpl.v1.profile', profileRow)
    localStorage.setItem('dpl.v1.alphabet', alphabetRow)
  }, [envelope(profile), envelope({ letters: [], marks: [], orientationSeen: true })])
  await page.reload()
}

async function open(page: Page, hash: string) {
  await page.goto(`./${hash}`)
  await expect(page.locator('main h1')).toBeVisible()
}

async function wrongExercise(page: Page) {
  await open(page, '#/lesson/alphabet/ovelse/find')
  await page.locator('.choice-exercise__choice').nth(1).click()
  await expect(page.getByText('Valgt')).toBeVisible()
}

async function correctExercise(page: Page) {
  await open(page, '#/lesson/alphabet/ovelse/find')
  await page.locator('.choice-exercise__choice').first().click()
  await expect(page.getByLabel('Rigtigt')).toBeVisible()
}

async function sessionSummary(page: Page) {
  await open(page, '#/repetition')
  await page.getByRole('button', { name: 'Se forskellen' }).click()
  await page.getByRole('button', { name: 'Øv med hjælp' }).click()
  await page.getByRole('button', { name: /Peg på svaret med hjælp/ }).click()
  await page.getByRole('button', { name: 'Prøv uden hjælp' }).click()
  await page.locator('.review-session__choices button').filter({ hasText: 'آ' }).click()
  await page.getByRole('button', { name: 'Stop for i dag' }).click()
  await expect(page.getByRole('heading', { name: 'Dagens repetition er færdig' })).toBeVisible()
}

export async function prepareVisualState(page: Page, state: VisualState) {
  if (state === 'orientation') {
    await page.goto(`./?visual-reset=${resetId += 1}#/`)
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    return open(page, '#/lesson/alphabet')
  }
  await reset(page, state === 'name-settings' ? { name: 'Sara', faSpelling: 'سارا' } : {})
  if (state === 'home') return open(page, '#/')
  if (state === 'index-top') return open(page, '#/lesson/alphabet')
  if (state === 'index-scrolled') {
    await open(page, '#/lesson/alphabet')
    await page.evaluate(() => scrollTo(0, Math.min(800, document.documentElement.scrollHeight)))
    return expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)
  }
  if (state === 'detail') return open(page, '#/lesson/alphabet/bogstav/be')
  if (state === 'exercise-active') return open(page, '#/lesson/alphabet/ovelse/find')
  if (state === 'exercise-wrong') return wrongExercise(page)
  if (state === 'exercise-correct') return correctExercise(page)
  if (state === 'puzzle') return open(page, '#/puslespil/alphabet-1-match')
  if (state === 'typing-active') return open(page, '#/lesson/ord/1/skriv')
  if (state === 'typing-feedback') {
    await open(page, '#/lesson/ord/1/skriv')
    await page.getByRole('button', { name: 'be' }).click()
    await page.getByRole('button', { name: 'Se efter' }).click()
    return expect(page.getByRole('button', { name: 'Prøv én gang til' })).toBeVisible()
  }
  if (state === 'name-settings') {
    await open(page, '#/')
    await page.getByRole('button', { name: 'Indstillinger for Sara' }).click()
    return expect(page.getByLabel('Farver')).toBeVisible()
  }
  if (state === 'connected-reading') return open(page, '#/lesson/ord/1/laes/1-1')
  if (state === 'word-bridges') {
    await open(page, '#/ord-der-ligner')
    return expect(page.getByRole('heading', { name: 'Ord, der ligner' })).toBeVisible()
  }
  if (state === 'celebration') {
    await page.evaluate((row) => localStorage.setItem('dpl.v1.rewards', row), envelope({
      stickers: [], level: 1, points: 9, practiceDates: [], giftsOpened: [], cheers: 0,
      streak: { value: 0, resting: false },
    }))
    await correctExercise(page)
    await page.locator('.celebration').scrollIntoViewIfNeeded()
    return expect(page.locator('.celebration')).toBeVisible()
  }
  return sessionSummary(page)
}

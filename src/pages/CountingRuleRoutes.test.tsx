// The counting rule lessons as the app's own routing sees them: through the
// real App and its hash router, from the URL a learner can type or bookmark.
//
// This suite asserts routing only — which screen a URL opens, and where an
// address a lesson does not reserve puts the learner. The Persian, the
// lydskrift and the IPA these screens print are candidate drafts, so nothing
// here asserts any of them; the headings come from the descriptors and the
// round titles, the same Danish scaffolding the screens' own suites use.
//
// Both rule lessons run the same generic screens, so the round headings are
// identical between them. The address is what tells the two apart, and every
// round case pins it.
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'
import { counting21to99Lesson } from '../lessons/counting21to99'
import { counting100to900Lesson } from '../lessons/counting100to900'
import { countingLesson as foundation } from '../lessons/countingLesson'
import { RULE_BUILD_TITLE, RULE_RECOGNITION_TITLES } from '../lessons/countingRuleExercises'

/** Open a URL the way a learner does: the hash first, then the whole app. */
function open(path: string) {
  window.location.hash = `#${path}`
  return render(<App />)
}

function heading(name: string) {
  return screen.findByRole('heading', { name })
}

const rounds = [
  ['betydning', RULE_RECOGNITION_TITLES.betydning],
  ['tal', RULE_RECOGNITION_TITLES.tal],
  ['byg', RULE_BUILD_TITLE],
] as const

const ruleLessons = [counting21to99Lesson, counting100to900Lesson]

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = ''
})

afterEach(() => {
  window.location.hash = ''
})

for (const rule of ruleLessons) {
  describe(`the «${rule.title}» routes`, () => {
    it('opens the rule lesson on its own address', async () => {
      open(rule.path)

      expect(await heading(rule.title)).toBeInTheDocument()
      expect(window.location.hash).toBe(`#${rule.path}`)
    })

    for (const [kind, title] of rounds) {
      it(`opens the «${kind}» round directly, without going through the lesson page`, async () => {
        open(`${rule.path}/ovelse/${kind}`)

        expect(await heading(title)).toBeInTheDocument()
        // The round titles are shared between the rule lessons; the address is
        // what says which lesson's round this is.
        expect(window.location.hash).toBe(`#${rule.path}/ovelse/${kind}`)
      })
    }

    it('sends a round this lesson does not have back to this same lesson, without a step to fall back into', async () => {
      // The address itself is one step; the redirect must not add a second.
      window.location.hash = `#${rule.path}/ovelse/findes-ikke`
      const before = window.history.length
      render(<App />)

      expect(await heading(rule.title)).toBeInTheDocument()
      // A replacing redirect: the address that failed is gone rather than left
      // behind us, so «tilbage» cannot fall into it again.
      expect(window.location.hash).toBe(`#${rule.path}`)
      expect(window.history.length).toBe(before)
    })
  })
}

describe('the addresses the rule lessons are registered on', () => {
  it('gives lesson 2 and lesson 3 their own exact paths', () => {
    expect(counting21to99Lesson.path).toBe('/lesson/taelle/21-99')
    expect(counting100to900Lesson.path).toBe('/lesson/taelle/100-900')
  })

  it('routes lesson 3 on «100-900» while the range it teaches stays 100-999', () => {
    // The path is the label the learner reads; the range is what the lesson
    // actually covers, and the two are deliberately not the same number.
    expect(counting100to900Lesson.path).toBe('/lesson/taelle/100-900')
    expect(counting100to900Lesson.range).toEqual([100, 999])
  })
})

describe('the counting lessons the rule routes stand beside', () => {
  it('still opens the foundation lesson on its own address', async () => {
    open(foundation.path)

    expect(await heading(foundation.title)).toBeInTheDocument()
    expect(window.location.hash).toBe(`#${foundation.path}`)
  })

  it('still lands a retired /tal/tal/:page link on the foundation, never on a rule lesson', async () => {
    open('/tal/tal/3')

    expect(await heading(foundation.title)).toBeInTheDocument()
    expect(window.location.hash).toBe(`#${foundation.path}`)
    for (const rule of ruleLessons) {
      expect(screen.queryByRole('heading', { name: rule.title })).not.toBeInTheDocument()
    }
  })
})

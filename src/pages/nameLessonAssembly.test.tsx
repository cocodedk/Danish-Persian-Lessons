// The exercise at the bottom of #/lesson/navn: tap your own name back together
// out of a tray of its letters and two strangers. What the lesson says on the
// way down to it is nameLesson.test.tsx.
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { setProfile } from '../progress/profile'
import { isNameLessonDone } from '../progress/nameLesson'
import { assemblyBank, nameGlyphs } from '../name/bank'
import { getRewards } from '../rewards/engine'
import { freshAppPerTest, open, tapTile, assemble } from './nameLessonHarness'

freshAppPerTest()

describe('the name-assembly exercise', () => {
  it('rebuilds the name from a bank of its own letters plus two strangers', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    const tray = document.querySelectorAll('.name-assembly .letter-bank__tile')
    expect(tray).toHaveLength(6)

    const line = () => document.querySelector('.name-assembly__line')?.textContent
    expect(line()).toBe('')
    tapTile('س')
    expect(line()).toBe('س')
    tapTile('ا')
    expect(line()).toBe('سا')
  })

  it('a wrong letter costs nothing: it does not stick, and the app says «دوباره»', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    tapTile('ا') // the name starts with س, so this one waits its turn
    expect(document.querySelector('.name-assembly__line')?.textContent).toBe('')
    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(screen.getByText(/Prøv igen, du mister ingenting/)).toBeInTheDocument()

    // …and the letter is still there to use when its turn comes.
    tapTile('س')
    tapTile('ا')
    expect(document.querySelector('.name-assembly__line')?.textContent).toBe('سا')
  })

  it('says which kind of wrong tap it was — a letter waiting its turn, or a stranger', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    // One of the two letters the tray carries from outside the name. Telling a
    // learner to "try again" here would send them hunting for a letter that is
    // not in their name to find.
    const stranger = assemblyBank('سارا').find((tile) => !nameGlyphs('سارا').includes(tile.glyph))
    expect(stranger, 'the tray always carries two strangers').toBeTruthy()

    tapTile(stranger!.glyph)
    expect(screen.getByText('این حرف در نامِ تو نیست. دوباره نگاه کن.')).toBeInTheDocument()
    expect(screen.getByText('Det bogstav er ikke i dit navn. Kig igen.')).toBeInTheDocument()
    expect(screen.queryByText('دوباره')).not.toBeInTheDocument()

    // The other branch, from the same screen: a letter of the name, out of turn.
    tapTile('ا')
    expect(screen.getByText('دوباره')).toBeInTheDocument()
    expect(screen.getByText(/kommer et andet sted i navnet/)).toBeInTheDocument()
    expect(screen.queryByText('Det bogstav er ikke i dit navn. Kig igen.')).not.toBeInTheDocument()
    expect(document.querySelector('.name-assembly__line')?.textContent).toBe('')
  })

  it('celebrates the finished name by name — «آفرین، سارا!» / "Flot, Sara!"', () => {
    setProfile({ name: 'Sara', faSpelling: 'سارا' })
    open('#/lesson/navn')

    assemble('سارا')

    expect(screen.getByText('آفرین، سارا!')).toBeInTheDocument()
    expect(screen.getByText('Flot, Sara!')).toBeInTheDocument()
    expect(isNameLessonDone()).toBe(true)
  })

  it('remembers it was cleared, and can be played again', () => {
    setProfile({ name: 'Babak', faSpelling: 'بابک' })
    open('#/lesson/navn')
    assemble('بابک')
    expect(isNameLessonDone()).toBe(true)

    open('#/lesson/navn')
    expect(screen.getByLabelText('Klaret')).toBeInTheDocument()
    assemble('بابک')
    expect(screen.getByText('آفرین، بابک!')).toBeInTheDocument()
  })

  it('praises every finish but pays for the lesson once — the letter rule, for a lesson', () => {
    setProfile({ name: 'Babak', faSpelling: 'بابک' })
    open('#/lesson/navn')
    assemble('بابک')

    const paid = getRewards()
    expect(paid.points).toBeGreaterThan(0)
    expect(paid.stickers.length).toBeGreaterThan(0)

    // Round two, after a reload: the same warm ending, and not one point more.
    open('#/lesson/navn')
    assemble('بابک')
    expect(screen.getByText('آفرین، بابک!')).toBeInTheDocument()
    expect(screen.getByText('Flot, Babak!')).toBeInTheDocument()

    const again = getRewards()
    expect(again.points).toBe(paid.points)
    expect(again.level).toBe(paid.level)
    expect(again.stickers).toEqual(paid.stickers)

    open('#/lesson/navn')
    assemble('بابک')
    expect(getRewards().points).toBe(paid.points)
  })
})

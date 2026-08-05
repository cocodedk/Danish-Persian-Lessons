// Sample data for the #/kit gallery (docs/plans/002-design-system.md step 7).
// ALL Persian the gallery renders is catalog entries, so the registry guard
// (src/catalog/registry.test.ts) walks every string here — nothing is inline
// in KitSamples.tsx.
import type { PersianEntry } from '../catalog/types'
import { defineEntry } from '../catalog/types'
import { vowelMarks } from '../lessons/vowelMarks'

/** زبر، زیر، پیش with their Danish sound anchors (CLAUDE.md "Curriculum"). */
export const KIT_VOWELS: PersianEntry[] = vowelMarks.slice(0, 3).map((mark) => mark.entry)

/** One line of handwriting for the ruled sheet, per reading direction. */
export const KIT_SHEET_ENTRY = defineEntry({ id: 'interface-kit-write-line', kind: 'phrase', fa: 'روی خط بنویس.', da: 'Skriv på linjen.', pron: { da: 'ruje khat benevis', ipa: 'ɾuːje xæt beneviːs' } })
export const KIT_SHEET_DA = 'Skriv dit navn på linjen.'

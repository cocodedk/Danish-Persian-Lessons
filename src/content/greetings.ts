// Greeting rule (docs/plans/001-scaffold-app.md and 006-your-name.md step 3):
// the Danish pane greets by the written name, the Persian pane by the Persian
// spelling and never by the Latin one. Neither pane invents a name it has not
// been given — with nothing saved, both greet plainly.

import { defineEntry } from '../catalog/types'

export const GREETING_ENTRY = defineEntry({
  id: 'interface-greeting',
  kind: 'word',
  fa: 'سلام!',
  da: 'Hej!',
  pron: { da: 'salåm', ipa: 'sælɒːm' },
})

export const GREETING_WITH_NAME_ENTRY = defineEntry({
  id: 'interface-greeting-with-name',
  kind: 'word',
  fa: 'سلام،',
  da: 'Hej',
  pron: { da: 'salåm', ipa: 'sælɒːm' },
})


export function daGreeting(name?: string): string {
  return name ? `Hej ${name}!` : 'Hej!'
}

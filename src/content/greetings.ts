// Greeting rule (docs/plans/001-scaffold-app.md and 006-your-name.md step 3):
// the Danish pane greets by the written name, the Persian pane by the Persian
// spelling and never by the Latin one. Neither pane invents a name it has not
// been given — with nothing saved, both greet plainly.

export const FA_GREETING = 'سلام!'

/** «سلام، سارا!» — the name in ink, not in red: it is a greeting, not a correction. */
export function faGreeting(faSpelling?: string): string {
  return faSpelling ? `سلام، ${faSpelling}!` : FA_GREETING
}

export function daGreeting(name?: string): string {
  return name ? `Hej ${name}!` : 'Hej!'
}

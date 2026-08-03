// Greeting rule for plan 001 (see docs/plans/001-scaffold-app.md Acceptance):
// the Danish pane greets by name as soon as one exists; the Persian pane
// greets «سلام!» alone until profile.faSpelling arrives with plan 006 — Latin
// text never renders inside the Persian pane.

export const FA_GREETING = 'سلام!'

export function daGreeting(name?: string): string {
  return name ? `Hej ${name}!` : 'Hej!'
}

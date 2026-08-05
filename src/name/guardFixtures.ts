// Names the Persian text-rule guard transliterates and then checks, so a broken
// rule or a mistyped override shows up as a failing test rather than as an
// Arabic ي on a learner's own name. Test data, kept beside the engine it
// guards; nothing in the app imports it.

export const GUARD_FIXTURE_NAMES: string[] = [
  // The plan's golden names.
  'Babak',
  'Sara',
  'Mette',
  'Søren',
  'Anna',
  'Ali',
  'Lærke',
  // Iranian names whose spelling only the override list knows.
  'Reza',
  'Fatemeh',
  'Maryam',
  'Hossein',
  'Mohammad',
  'Zahra',
  'Shirin',
  'Dariush',
  'Yasmin',
  'Parisa',
  'Kian',
  // Danish names, on and off the list.
  'Peter',
  'Jørgen',
  'Bjørn',
  'Signe',
  'Louise',
  'Frederik',
  'Emma',
  'Astrid',
  'Rasmus',
  'Josefine',
  'Villads',
  'Malthe',
  'Thøger',
  'Åge',
  'Bæk',
  // Compound and awkward input.
  'Anne-Mette',
  'Anne Mette',
  'Karen Margrethe',
  'X Æ A-12',
]

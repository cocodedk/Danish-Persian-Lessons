// Real first names — the ones a Dane or an Iranian in Denmark actually carries —
// so the decency guard is walked over names people have, not only over the 25 000
// letter-strings the sweep invents. Test data, kept beside the engine it guards;
// nothing in the app imports it.
//
// The override tables are NOT repeated here: the test walks those too, and this
// list is what the RULES have to answer for. A name that is on neither list and
// still comes back crude is the bug this file exists to catch.

/** Whitespace-separated, so ~200 names cost ~25 lines instead of ~200. */
function names(block: string): string[] {
  return block.trim().split(/\s+/)
}

/** Danish first names the override table does not carry. */
export const DANISH_CORPUS: string[] = names(`
  Agnes Aja Alberte Alma Andrea Anette Annette Asta Benedikte Berit
  Birgit Birgitte Birthe Bodil Britta Cathrine Christina Kristina Dagmar Dorte
  Eva Elin Elisabeth Ellen Else Esther Filippa Frida Gerda Gertrud
  Gitte Grethe Gudrun Hedvig Helene Henriette Hilda Ingrid Inger Irene
  Iben Jane Janne Jette Johanne Jonna Karina Karla Kirstine Kira
  Kristine Lea Lena Lilly Lisbeth Liv Lotte Lykke Maja Malene
  Malou Maren Marie Mathilde Merete Mie Mille Nanna Nete Nina
  Oda Olivia Pernille Ragnhild Randi Rita Rosa Ruth Sanne Sidsel
  Sine Sinne Sissel Solveig Stine Tanja Thea Tina Tove Ulla
  Vibeke Winnie Yrsa Åse
  Aage Alf Allan Arne Asger Bent Bjarke Bjarne Brian Carsten
  Karsten Christoffer Ebbe Egon Esben Finn Flemming Frank Frode Gunnar
  Gorm Harald Helge Holger Ivan Jarl Jeppe Joakim Jon Jørn
  Kaj Kasper Keld Kent Knud Kuno Kuni Kurt Leif Lennart
  Malte Marius Mogens Nils Orla Otto Palle Poul Preben Rune
  Sigurd Steen Stig Svend Tage Thor Thorbjørn Torben Troels Uffe
  Ulrik Valdemar Verner Vagn Walther
`)

/** Iranian first names the override table does not carry. */
export const IRANIAN_CORPUS: string[] = names(`
  Afsaneh Afshin Akbar Akram Ardeshir Arezoo Armin Arman Arsalan Aryan
  Ashkan Atefeh Atena Azar Bahar Banafsheh Behrouz Behzad Bita Borna
  Cyrus Davood Delaram Donya Ebrahim Elnaz Esmail Farah Farbod Fariba
  Farid Farideh Farnaz Farshid Firouzeh Forough Ghazal Golshan Hadi Hafez
  Hedieh Hooman Iman Iraj Jaleh Jamshid Kambiz Kamyar Katayoun Keyvan
  Khosrow Kimia Kosar Kowsar Ladan Mahan Mahnaz Mahtab Majid Manouchehr
  Mansour Marjan Masoud Mehrdad Mehrnoosh Milad Mohsen Mojgan Morteza Nahid
  Naser Navid Nazila Nooshin Parham Parvaneh Parviz Pooneh Pooria Rambod
  Rasoul Reyhaneh Roshanak Roxana Sadegh Saman Sanaz Sasan Shabnam Shadi
  Shahab Shaghayegh Shahnaz Shayan Sheida Sholeh Siavash Simin Sogand Tahereh
  Tahmineh Toraj Vida Yasaman Yousef Zeinab Ziba
`)

/**
 * The Margrethe family and the near-misses the round-2 critic typed in. Not all
 * of these are names — Kuse, Kusse and Chos are the crude words themselves, and
 * they are here so that «no suggestion» stays the answer for them. The rest are
 * real names one letter away from a crude reading, and the app owes them either
 * a decent spelling or silence.
 */
export const NEAR_MISS_PROBES: string[] = names(`
  Margrete Margrethe Margit Marga Marge Margrit Margaretha Margarethe
  Sine Sinne Signe Kosar Kowsar Kawsar Cosima Cosmo Kuse Kusse Chos
  Kuno Kuni Kirstine Kira Kirsten Gertrud Konrad Ker Kir Sg
  Felix Axel Aksel Alexandra Maxine Xenia Rex Cyrus
`)

/** Everything above, once each, for the guard that walks all of it. */
export const GIVEN_NAME_CORPUS: string[] = [
  ...new Set([...DANISH_CORPUS, ...IRANIAN_CORPUS, ...NEAR_MISS_PROBES]),
]

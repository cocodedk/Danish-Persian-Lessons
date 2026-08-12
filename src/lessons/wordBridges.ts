import type { PersianEntry } from '../catalog/types'
import { bridgeEntriesA as a } from './wordBridgeEntriesA'
import { bridgeEntriesB as b } from './wordBridgeEntriesB'
import { wordBridgeMemoryAdditions } from './wordBridgeMemoryAdditions'
import type { WordBridge } from './wordBridgeTypes'

export type { WordBridge, WordBridgeCategory } from './wordBridgeTypes'

/** Memory clues, never rules for mechanically changing one language into the other. */
export const wordBridges: readonly WordBridge[] = [
  {
    id: 'pedar-fader', titleDa: 'Pedar og fader', entry: a.pedar, category: 'family',
    danish: 'fader', danishIpa: 'ˈfæːðʌ', danishGlossDa: 'far',
    clueDa: 'P i pedar svarer til f i fader.',
    meaningDa: 'Begge betyder far.',
    historyDa: 'Persisk går tilbage til oldpersisk pitā, dansk til oldnordisk faðir. Begge fortsætter det samme meget gamle indoeuropæiske ord for far.',
  },
  {
    id: 'madar-moder', titleDa: 'Mådar og moder', entry: a.madar, category: 'family',
    danish: 'moder', danishIpa: 'ˈmoːðʌ', danishGlossDa: 'mor',
    clueDa: 'M, den lange vokal og d går igen i begge ord.',
    meaningDa: 'Begge betyder mor.',
    historyDa: 'Mådar og moder er sikre slægtninge. De går tilbage til det samme indoeuropæiske ord for mor.',
  },
  {
    id: 'baradar-broder', titleDa: 'Barådar og broder', entry: a.baradar, category: 'family',
    danish: 'broder', danishIpa: 'ˈbʁoːðʌ', danishGlossDa: 'bror',
    clueDa: 'B, r og d danner et tydeligt skelet i begge ord.',
    meaningDa: 'Begge betyder bror.',
    historyDa: 'De iranske og germanske former kommer fra det samme indoeuropæiske ord for bror.',
  },
  {
    id: 'doxtar-datter', titleDa: 'Dokhtar og datter', entry: a.doxtar, category: 'family',
    danish: 'datter', danishIpa: 'ˈdadʌ', danishGlossDa: 'datter',
    clueDa: 'D og t er de letteste lydspor at få øje på.',
    meaningDa: 'Begge betyder datter.',
    historyDa: 'Lydændringer skjuler ligheden, men begge ord stammer fra det gamle indoeuropæiske ord for datter.',
  },
  {
    id: 'dar-doer', titleDa: 'Dar og dør', entry: a.dar, category: 'everyday',
    danish: 'dør', danishIpa: 'ˈdɶˀɐ̯', danishGlossDa: 'dør',
    clueDa: 'D og r går igen i dar og dør.',
    meaningDa: 'Begge betyder dør.',
    historyDa: 'Oldpersisk duvar- og oldnordisk dyrr fører tilbage til den samme gamle indoeuropæiske rod for dør.',
  },
  {
    id: 'nam-navn', titleDa: 'Nåm og navn', entry: a.nam, category: 'everyday',
    danish: 'navn', danishIpa: 'ˈnɑwˀn', danishGlossDa: 'navn',
    clueDa: 'N og m i nåm svarer til n og n i navn.',
    meaningDa: 'Begge betyder navn.',
    historyDa: 'Persisk går gennem oldpersisk nāma, dansk gennem oldnordisk nafn. Begge kommer fra det samme indoeuropæiske navneord.',
  },
  {
    id: 'mush-mus', titleDa: 'Mush og mus', entry: a.mush, category: 'everyday',
    danish: 'mus', danishIpa: 'ˈmuˀs', danishGlossDa: 'mus',
    clueDa: 'M og den lange u-lyd gør de moderne ord usædvanligt ens.',
    meaningDa: 'Begge betyder mus.',
    historyDa: 'De iranske mūš-former og de germanske mūs-former fortsætter det samme gamle indoeuropæiske ord for mus.',
  },
  {
    id: 'garm-varm', titleDa: 'Garm og varm', entry: a.garm, category: 'everyday',
    danish: 'varm', danishIpa: 'ˈvɑːm', danishGlossDa: 'varm',
    clueDa: 'Endelsen arm er let at høre i begge ord.',
    meaningDa: 'Begge kan betyde varm.',
    historyDa: 'Persisk garm og germansk varm hører til den samme gamle indoeuropæiske familie for varme og hede.',
  },
  {
    id: 'now-ny', titleDa: 'Now og ny', entry: a.now, category: 'everyday',
    danish: 'ny', danishIpa: 'ˈnyˀ', danishGlossDa: 'ny',
    clueDa: 'N-lyden står fast, selv om vokalerne har flyttet sig.',
    meaningDa: 'Begge betyder ny.',
    historyDa: 'Oldpersisk nava og oldnordisk nýr kommer fra det samme indoeuropæiske ord for ny.',
  },
  {
    id: 'band-baand', titleDa: 'Band og bånd', entry: b.band, category: 'everyday',
    danish: 'bånd', danishIpa: 'ˈbɔnˀ', danishGlossDa: 'bånd eller binding',
    clueDa: 'Begge ord hænger sammen med at binde.',
    meaningDa: 'Begge kan være noget, der binder. En بند kan også være en mur, der holder vand, men betyder ikke vand eller flod.',
    historyDa: 'Persisk band og den germanske familie bag binde og bånd går tilbage til den samme gamle rod for at binde.',
  },
  {
    id: 'setad-sted', titleDa: 'Setåd og sted', entry: b.setad, category: 'everyday',
    danish: 'sted', danishGlossDa: 'sted',
    clueDa: 'S, t og d går igen i begge ord.',
    meaningDa: 'De betyder ikke det samme i dag: det persiske ord betyder hovedkontor.',
    historyDa: 'De deler et gammelt stå- og stedspor, men de moderne betydninger har bevæget sig fra hinanden.',
  },
  {
    id: 'do-to', titleDa: 'Do og to', entry: a.do, category: 'numbers',
    danish: 'to', danishIpa: 'ˈtoˀ', danishGlossDa: 'tallet 2',
    clueDa: 'Kun den første lyd har skiftet fra d til t.',
    meaningDa: 'Begge er tallet to.',
    historyDa: 'De to talord fortsætter det samme indoeuropæiske ord for to.',
  },
  {
    id: 'shesh-seks', titleDa: 'Shesh og seks', entry: b.shesh, category: 'numbers',
    danish: 'seks', danishIpa: 'ˈsɛgs', danishGlossDa: 'tallet 6',
    clueDa: 'S- og sh-lydene ligger tæt, og begge ord slutter med en skarp lyd.',
    meaningDa: 'Begge er tallet seks.',
    historyDa: 'Persiske og germanske former går tilbage til det samme indoeuropæiske talord for seks.',
  },
  {
    id: 'noh-ni', titleDa: 'Noh og ni', entry: b.noh, category: 'numbers',
    danish: 'ni', danishIpa: 'ˈniˀ', danishGlossDa: 'tallet 9',
    clueDa: 'N står fast, mens den sidste vokal har ændret sig.',
    meaningDa: 'Begge er tallet ni.',
    historyDa: 'Oldpersisk nava og oldnordisk níu fortsætter det samme indoeuropæiske talord for ni.',
  },
  {
    id: 'dandan-tand', titleDa: 'Dandån og tand', entry: b.dandan, category: 'world',
    danish: 'tand', danishIpa: 'ˈtanˀ', danishGlossDa: 'tand',
    clueDa: 'Det første d i dandån svarer til t i tand.',
    meaningDa: 'Begge betyder tand.',
    historyDa: 'Begge ord stammer fra den samme gamle indoeuropæiske tandrod. Den gentagne lyd i persisk gør formen længere.',
  },
  {
    id: 'naf-navle', titleDa: 'Nåf og navle', entry: b.naf, category: 'world',
    danish: 'navle', danishIpa: 'ˈnɑwlə', danishGlossDa: 'navle',
    clueDa: 'N og v- eller f-lyden holder forbindelsen synlig.',
    meaningDa: 'Begge betyder navle.',
    historyDa: 'Nåf og navle er slægtninge fra en gammel indoeuropæisk rod for navle.',
  },
  {
    id: 'mah-maane', titleDa: 'Måh og måne', entry: b.mah, category: 'world',
    danish: 'måne', danishIpa: 'ˈmɔːnə', danishGlossDa: 'måne',
    clueDa: 'Måh og måne starter med næsten samme lyd.',
    meaningDa: 'Persisk ماه kan betyde både måne og måned; dansk måne har samme himmelbetydning.',
    historyDa: 'De gamle iranske og germanske måneord kommer fra samme familie, historisk forbundet med at måle tid og måneder.',
  },
  {
    id: 'setareh-stjerne', titleDa: 'Setåre og stjerne', entry: b.setareh, category: 'world',
    danish: 'stjerne', danishIpa: 'ˈsdjæɐ̯nə', danishGlossDa: 'stjerne',
    clueDa: 'S, t og r går igen i setåre og stjerne.',
    meaningDa: 'Begge betyder stjerne.',
    historyDa: 'Begge ord fortsætter den samme gamle indoeuropæiske stjernefamilie og bevarer et tydeligt s-t-r-skelet.',
  },
  {
    id: 'seyl-sejle', titleDa: 'Seyl og sejle', entry: b.seyl, category: 'memory',
    danish: 'sejle', danishGlossDa: 'bevæge sig på vand',
    clueDa: 'Seyl og sejle lyder næsten ens.',
    meaningDa: 'De betyder ikke det samme. سیل er en oversvømmelse; på dansk kan vi sige: “Byen sejlede i vand.”',
    historyDa: 'De er ikke i samme gamle familie. Dette er kun en lydlig huskebro.',
  },
  {
    id: 'dust-dus', titleDa: 'Dust og dus', entry: b.dust, category: 'memory',
    danish: 'dus', danishIpa: 'ˈdus', danishGlossDa: 'på uformelig tiltale',
    clueDa: 'Persisk dust og dansk dus lyder næsten ens.',
    meaningDa: 'دوست betyder ven. At være dus betyder, at man er fortrolig og siger “du” til hinanden.',
    historyDa: 'Ordene har forskellig historie. Dette er en lydlig huskebro, ikke et fælles ophav.',
  },
  ...wordBridgeMemoryAdditions,
]

export const wordBridgeCatalog: PersianEntry[] = wordBridges.map((bridge) => bridge.entry)

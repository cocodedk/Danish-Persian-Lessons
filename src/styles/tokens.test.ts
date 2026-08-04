import { describe, it, expect } from 'vitest'
import tokens from './tokens.css?raw'

/** Every .css file in src, keyed by path. */
const stylesheets = import.meta.glob('../**/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** tokens.css declares the palette; fonts.css declares the @font-face names. */
const DECLARATION_FILES = ['tokens.css', 'fonts.css']

function isDeclarationFile(path: string): boolean {
  return DECLARATION_FILES.some((name) => path.endsWith(name))
}

const SEMANTIC_TOKENS = [
  '--paper',
  '--ink',
  '--red',
  '--blue',
  '--rule',
  '--card',
  '--gold',
  '--orange',
]

/** The declarations inside the first rule whose selector matches. */
function block(selector: string): string {
  const match = tokens.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`))
  return match?.[1] ?? ''
}

describe('design tokens', () => {
  it('binds every semantic token in both schemes', () => {
    const light = block('\\.scheme-light')
    const dark = block('\\.scheme-dark')
    for (const token of SEMANTIC_TOKENS) {
      expect(light).toContain(`${token}: var(${token}-light)`)
      expect(dark).toContain(`${token}: var(${token}-dark)`)
    }
  })

  it('keeps the chalkboard on prefers-color-scheme too, not only on .scheme-dark', () => {
    const media = block(':root:not\\(\\.scheme-light\\)')
    for (const token of SEMANTIC_TOKENS) {
      expect(media).toContain(`${token}: var(${token}-dark)`)
    }
  })

  it('is the only stylesheet holding a colour literal', () => {
    const offenders = Object.entries(stylesheets)
      .filter(([path]) => !isDeclarationFile(path))
      .filter(([, css]) => /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/.test(css))
      .map(([path]) => path)
    expect(offenders).toEqual([])
  })

  it('is the only stylesheet naming a font family', () => {
    const offenders = Object.entries(stylesheets)
      .filter(([path]) => !isDeclarationFile(path))
      .flatMap(([path, css]) => (css.match(/font-family:\s*[^;]+;/g) ?? []).map((d) => [path, d]))
      .filter(([, declaration]) => !declaration.includes('var(--font-'))
    expect(offenders).toEqual([])
  })
})

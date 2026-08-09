interface VersionCheckOptions {
  currentVersion?: string
  baseUrl?: string
  document?: Document
  pageUrl?: string
  now?: () => number
  readLatestVersion?: () => unknown
  replace?: (url: string) => void
}

interface VersionMonitorOptions extends VersionCheckOptions {
  intervalMs?: number
  window?: Window
}

const safeVersion = /^[a-zA-Z0-9._-]{1,64}$/

export function refreshUrl(
  currentVersion: string,
  latestVersion: unknown,
  pageUrl: string,
): string | null {
  if (typeof latestVersion !== 'string') return null
  const latest = latestVersion.trim()
  if (!safeVersion.test(latest) || latest === currentVersion) return null

  const url = new URL(pageUrl)
  if (url.searchParams.get('app-version') === latest) return null
  url.searchParams.set('app-version', latest)
  return url.href
}

/**
 * GitHub Pages may keep index.html for ten minutes. This small, unique script
 * request finds a new release and opens its versioned URL without a hard reload.
 */
export function startVersionCheck(options: VersionCheckOptions = {}): HTMLScriptElement {
  const doc = options.document ?? document
  const pageUrl = options.pageUrl ?? window.location.href
  const baseUrl = options.baseUrl ?? import.meta.env.BASE_URL
  const currentVersion = options.currentVersion ?? __DPL_APP_VERSION__
  const readLatestVersion = options.readLatestVersion ?? (() => window.__DPL_LATEST_VERSION__)
  const replace = options.replace ?? ((url: string) => window.location.replace(url))
  const now = options.now ?? Date.now

  const versionUrl = new URL(`${baseUrl}version.js`, pageUrl)
  versionUrl.searchParams.set('check', String(now()))

  const script = doc.createElement('script')
  script.async = true
  script.src = versionUrl.href
  script.addEventListener('load', () => {
    const nextUrl = refreshUrl(currentVersion, readLatestVersion(), pageUrl)
    script.remove()
    if (nextUrl) replace(nextUrl)
  })
  script.addEventListener('error', () => script.remove())
  doc.head.append(script)
  return script
}

/** Keeps long-open and back-forward-cached tabs on the latest deployed build. */
export function startVersionMonitor(options: VersionMonitorOptions = {}): () => void {
  const {
    intervalMs = 60_000,
    window: target = window,
    pageUrl,
    ...checkOptions
  } = options
  let activeScript: HTMLScriptElement | null = null

  const check = () => {
    activeScript?.remove()
    activeScript = startVersionCheck({
      ...checkOptions,
      document: checkOptions.document ?? target.document,
      pageUrl: pageUrl ?? target.location.href,
    })
  }
  const checkWhenVisible = () => {
    if (!target.document.hidden) check()
  }
  const checkWhenRestored = (event: PageTransitionEvent) => {
    if (event.persisted) check()
  }

  check()
  const timer = target.setInterval(check, intervalMs)
  target.addEventListener('focus', check)
  target.addEventListener('pageshow', checkWhenRestored)
  target.document.addEventListener('visibilitychange', checkWhenVisible)

  return () => {
    target.clearInterval(timer)
    target.removeEventListener('focus', check)
    target.removeEventListener('pageshow', checkWhenRestored)
    target.document.removeEventListener('visibilitychange', checkWhenVisible)
    activeScript?.remove()
  }
}

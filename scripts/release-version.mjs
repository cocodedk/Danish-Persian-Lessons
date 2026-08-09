import { execFileSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const SEMVER_TAG = /^v(\d+)\.(\d+)\.(\d+)$/

export function parseVersionTag(tag) {
  const match = SEMVER_TAG.exec(tag)
  if (!match) return null
  return {
    tag,
    parts: match.slice(1).map(Number),
    version: match.slice(1).join('.'),
  }
}

export function highestVersionTag(tags) {
  return tags
    .map(parseVersionTag)
    .filter(Boolean)
    .sort((left, right) => {
      for (let index = 0; index < 3; index += 1) {
        if (left.parts[index] !== right.parts[index]) {
          return right.parts[index] - left.parts[index]
        }
      }
      return 0
    })[0] ?? null
}

export function releaseBump(messages) {
  let bump = 'patch'

  for (const message of messages) {
    if (/(^|\n)BREAKING(?: |-)?CHANGE:/i.test(message)) return 'major'

    const headers = message.matchAll(
      /^([a-z][a-z0-9-]*)(?:\([^\r\n)]+\))?(!)?:/gim,
    )
    for (const [, type, breaking] of headers) {
      if (breaking) return 'major'
      if (type.toLowerCase() === 'feat') bump = 'minor'
    }
  }

  return bump
}

export function incrementVersion(version, bump) {
  const parts = version.split('.').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid version: ${version}`)
  }

  if (bump === 'major') return `${parts[0] + 1}.0.0`
  if (bump === 'minor') return `${parts[0]}.${parts[1] + 1}.0`
  if (bump === 'patch') return `${parts[0]}.${parts[1]}.${parts[2] + 1}`
  throw new Error(`Invalid bump: ${bump}`)
}

export function planRelease({ tags, headTags, messages }) {
  const existing = highestVersionTag(headTags)
  if (existing) {
    return { bump: 'existing', existing: true, ...existing }
  }

  const current = highestVersionTag(tags) ?? parseVersionTag('v0.0.0')
  const bump = releaseBump(messages)
  const version = incrementVersion(current.version, bump)
  return { bump, existing: false, tag: `v${version}`, version }
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim()
}

function lines(value) {
  return value ? value.split('\n').filter(Boolean) : []
}

function readRepositoryPlan() {
  const tags = lines(git(['tag', '--merged', 'HEAD', '--format=%(refname:short)']))
  const headTags = lines(git(['tag', '--points-at', 'HEAD', '--format=%(refname:short)']))
  const latest = highestVersionTag(tags)
  const range = latest ? `${latest.tag}..HEAD` : 'HEAD'
  const log = git(['log', range, '--format=%B%x00'])
  const messages = log ? log.split('\0').filter(Boolean) : []
  return planRelease({ tags, headTags, messages })
}

function printOutputs(plan) {
  console.log(`version=${plan.version}`)
  console.log(`tag=${plan.tag}`)
  console.log(`bump=${plan.bump}`)
  console.log(`existing=${plan.existing}`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  printOutputs(readRepositoryPlan())
}

let activeAudio: HTMLMediaElement | null = null

export function activateAudio(node: HTMLMediaElement): void {
  if (activeAudio && activeAudio !== node) activeAudio.pause()
  activeAudio = node
}

export function releaseAudio(node: HTMLMediaElement): void {
  if (activeAudio === node) activeAudio = null
}

export function stopActiveAudio(): void {
  if (!activeAudio) return
  const node = activeAudio
  activeAudio = null
  node.pause()
}

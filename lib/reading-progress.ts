const STORAGE_PREFIX = 'novel-reader:'

export function getStorageKey(repo: string, author: string, name: string) {
  return `${STORAGE_PREFIX}${repo}:${author}:${name}`
}

export function loadProgress(key: string): number {
  if (typeof window === 'undefined') return 0
  try {
    const saved = localStorage.getItem(key)
    if (saved != null) {
      const ratio = parseFloat(saved)
      if (ratio >= 0 && ratio <= 1) return ratio
    }
  } catch {
    // ignore
  }
  return 0
}

export function saveProgress(key: string, ratio: number) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, String(ratio))
  } catch {
    // ignore
  }
}

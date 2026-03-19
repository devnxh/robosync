/**
 * Format bytes to human-readable string (KB, MB, GB, TB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = bytes / Math.pow(k, i)
  return `${value.toFixed(i > 0 ? 1 : 0)} ${units[i]}`
}

/**
 * Format bytes per second to human-readable speed string
 */
export function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec === 0) return '0 B/s'
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s']
  const k = 1024
  const i = Math.floor(Math.log(bytesPerSec) / Math.log(k))
  const value = bytesPerSec / Math.pow(k, i)
  return `${value.toFixed(1)} ${units[i]}`
}

/**
 * Format seconds to HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '--:--:--'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

/**
 * Format an ISO date string to a relative or short datetime
 */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

/**
 * Truncate a path for display, keeping the drive and last folder/file
 */
export function truncatePath(p: string, maxLen: number = 40): string {
  if (p.length <= maxLen) return p
  const parts = p.split('\\')
  if (parts.length <= 2) return p

  const first = parts[0]
  const last = parts[parts.length - 1]
  const secondLast = parts[parts.length - 2]

  return `${first}\\...\\${secondLast}\\${last}`
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

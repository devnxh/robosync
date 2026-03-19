import { useMemo } from 'react'
import type { JobConfig } from '../types/RobocopyJob'

export interface Suggestion {
  id: string
  severity: 'info' | 'warning' | 'tip'
  message: string
  applyFn?: (config: JobConfig) => Partial<JobConfig>
}

export function useSmartSuggestions(config: JobConfig): Suggestion[] {
  return useMemo(() => {
    const suggestions: Suggestion[] = []

    // 1. Network path detection
    if (config.source.startsWith('\\\\') || config.destination.startsWith('\\\\')) {
      if (config.retryCount < 3 || config.retryWait < 10) {
        suggestions.push({
          id: 'network-retry',
          severity: 'tip',
          message:
            'Network path detected — recommend /R:3 /W:10 to handle timeouts gracefully.',
          applyFn: () => ({ retryCount: 3, retryWait: 10 })
        })
      }
    }

    // 2. Mirror mode warning
    if (config.copyMode === 'mirror') {
      suggestions.push({
        id: 'mirror-warning',
        severity: 'warning',
        message:
          'Using /MIR (Mirror) — WARNING: Files in destination that are NOT in source will be PERMANENTLY DELETED.'
      })
    }

    // 3. Restartable mode suggestion for large transfers
    if (!config.restartable && config.source) {
      suggestions.push({
        id: 'restartable',
        severity: 'tip',
        message:
          'Consider enabling /Z (Restartable) for crash recovery on large or network transfers.',
        applyFn: () => ({ restartable: true })
      })
    }

    // 4. Low thread count
    if (config.threads < 4) {
      suggestions.push({
        id: 'low-threads',
        severity: 'tip',
        message: `Using ${config.threads} thread(s) — try 16 for faster transfers on modern drives.`,
        applyFn: () => ({ threads: 16 })
      })
    }

    // 5. ETA disabled
    if (!config.showEta) {
      suggestions.push({
        id: 'show-eta',
        severity: 'info',
        message: 'Enable /ETA to see estimated time remaining during copy.',
        applyFn: () => ({ showEta: true })
      })
    }

    // 6. Junction loops
    if (!config.excludeJunctions) {
      suggestions.push({
        id: 'junctions',
        severity: 'warning',
        message:
          'Junction points NOT excluded (/XJ is off) — this may cause infinite loops on some Windows directories.',
        applyFn: () => ({ excludeJunctions: true })
      })
    }

    // 7. No log file
    if (!config.logFile && config.source) {
      suggestions.push({
        id: 'log-file',
        severity: 'info',
        message:
          'No log file configured. Consider saving output to a log file for review.',
      })
    }

    // 8. Expert flags with PURGE but no /E
    if (
      config.expertFlags.toUpperCase().includes('/PURGE') &&
      config.copyMode !== 'copy' &&
      config.copyMode !== 'move'
    ) {
      suggestions.push({
        id: 'purge-warning',
        severity: 'warning',
        message:
          'Expert flags include /PURGE without /E — destination files may be deleted without copying new ones.'
      })
    }

    // 9. High thread count
    if (config.threads > 64) {
      suggestions.push({
        id: 'high-threads',
        severity: 'info',
        message: `${config.threads} threads is very high. This may cause throttling on some systems. 8-32 is typically optimal.`
      })
    }

    return suggestions
  }, [config])
}

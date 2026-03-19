import { useMemo } from 'react'
import type { JobConfig } from '../types/RobocopyJob'
import { quoteArg } from './commandBuilderUtils'

/**
 * Derives the robocopy command string from form state.
 * Runs on every state change for the CommandPreview component.
 */
export function useCommandBuilder(config: JobConfig): string {
  return useMemo(() => {
    if (!config.source && !config.destination) return ''

    const parts: string[] = ['robocopy']

    // Source and destination
    parts.push(quoteArg(config.source || '<source>'))
    parts.push(quoteArg(config.destination || '<destination>'))

    // Copy mode
    switch (config.copyMode) {
      case 'mirror':
        parts.push('/MIR')
        break
      case 'move':
        parts.push('/MOV')
        parts.push('/E')
        break
      case 'moveFiles':
        parts.push('/MOV')
        break
      case 'copy':
      default:
        parts.push('/E')
        break
    }

    if (config.threads > 1) parts.push(`/MT:${config.threads}`)
    parts.push(`/R:${config.retryCount}`)
    parts.push(`/W:${config.retryWait}`)

    if (config.restartable) parts.push('/Z')
    if (config.backupMode) parts.push('/B')
    if (config.unbufferedIO) parts.push('/J')
    if (config.ipg > 0) parts.push(`/IPG:${config.ipg}`)

    // Copy flags
    const copyStr = buildCopyStr(config.copyFlags)
    if (copyStr && copyStr !== 'DAT') parts.push(`/COPY:${copyStr}`)

    const dcopyStr = buildDCopyStr(config.dirCopyFlags)
    if (dcopyStr && dcopyStr !== 'D') parts.push(`/DCOPY:${dcopyStr}`)

    if (config.excludeNewer) parts.push('/XN')
    if (config.excludeOlder) parts.push('/XO')
    if (config.excludeChanged) parts.push('/XC')
    if (config.excludeLonely) parts.push('/XL')
    if (config.excludeJunctions) parts.push('/XJ')
    if (config.fatTimes) parts.push('/FFT')
    if (config.compensateDst) parts.push('/DST')

    for (const p of config.includeFiles) parts.push('/IF', quoteArg(p))
    for (const p of config.excludeFiles) parts.push('/XF', quoteArg(p))
    for (const p of config.excludeDirs) parts.push('/XD', quoteArg(p))

    if (config.verbose) parts.push('/V')
    if (config.showEta) parts.push('/ETA')
    if (config.logFile) {
      parts.push(config.appendLog ? `/LOG+:${quoteArg(config.logFile)}` : `/LOG:${quoteArg(config.logFile)}`)
    }
    if (config.noProgress) parts.push('/NP')
    if (config.noJobHeader) parts.push('/NJH')
    if (config.noJobSummary) parts.push('/NJS')

    if (config.expertFlags.trim()) {
      parts.push(...config.expertFlags.trim().split(/\s+/))
    }

    return parts.join(' ')
  }, [config])
}

function buildCopyStr(flags: JobConfig['copyFlags']): string {
  let s = ''
  if (flags.data) s += 'D'
  if (flags.attributes) s += 'A'
  if (flags.timestamps) s += 'T'
  if (flags.security) s += 'S'
  if (flags.owner) s += 'O'
  if (flags.auditing) s += 'U'
  return s
}

function buildDCopyStr(flags: JobConfig['dirCopyFlags']): string {
  let s = ''
  if (flags.data) s += 'D'
  if (flags.attributes) s += 'A'
  if (flags.timestamps) s += 'T'
  return s
}

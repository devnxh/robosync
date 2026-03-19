import { parse, extname } from 'path'
import { statSync } from 'fs'
import type { JobConfig } from '../../src/types/RobocopyJob'
import { sanitizePath, quoteArg } from '../utils/pathSanitizer'

/**
 * Checks if a source path is a file (not a directory).
 * If so, returns { dir, file } so robocopy can be called as:
 *   robocopy "dir" "dest" "file"
 */
function splitSourcePath(sourcePath: string): { dir: string; file: string | null } {
  try {
    const stats = statSync(sourcePath)
    if (stats.isFile()) {
      const parsed = parse(sourcePath)
      return { dir: parsed.dir, file: parsed.base }
    }
  } catch {
    // If stat fails, check if it looks like a file path (has extension)
    if (extname(sourcePath)) {
      const parsed = parse(sourcePath)
      return { dir: parsed.dir, file: parsed.base }
    }
  }
  return { dir: sourcePath, file: null }
}

/**
 * Builds a robocopy command from a JobConfig.
 * Returns the executable and arguments array for use with spawn().
 */
export function buildCommand(config: JobConfig): { exe: string; args: string[] } {
  const exe = 'robocopy'
  const args: string[] = []

  // Handle file vs directory source
  const { dir: sourceDir, file: sourceFile } = splitSourcePath(config.source)

  // Source and destination paths (sanitized)
  args.push(sanitizePath(sourceDir))
  args.push(sanitizePath(config.destination))

  // If source is a specific file, add it as the file filter
  if (sourceFile) {
    args.push(sourceFile)
  }

  // Copy mode
  switch (config.copyMode) {
    case 'mirror':
      args.push('/MIR')
      break
    case 'move':
      args.push('/MOV')
      args.push('/E')
      break
    case 'moveFiles':
      args.push('/MOV')
      break
    case 'copy':
    default:
      args.push('/E')
      break
  }

  // Threads
  if (config.threads > 1) {
    args.push(`/MT:${config.threads}`)
  }

  // Retry
  args.push(`/R:${config.retryCount}`)
  args.push(`/W:${config.retryWait}`)

  // Restartable mode
  if (config.restartable) {
    args.push('/Z')
  }

  // Backup mode
  if (config.backupMode) {
    args.push('/B')
  }

  // Unbuffered I/O
  if (config.unbufferedIO) {
    args.push('/J')
  }

  // Inter-packet gap
  if (config.ipg > 0) {
    args.push(`/IPG:${config.ipg}`)
  }

  // Copy flags (/COPY:)
  const copyFlagStr = buildCopyFlagString(config.copyFlags)
  if (copyFlagStr && copyFlagStr !== 'DAT') {
    args.push(`/COPY:${copyFlagStr}`)
  }

  // Dir copy flags (/DCOPY:)
  const dirCopyFlagStr = buildDirCopyFlagString(config.dirCopyFlags)
  if (dirCopyFlagStr && dirCopyFlagStr !== 'D') {
    args.push(`/DCOPY:${dirCopyFlagStr}`)
  }

  // Exclude options
  if (config.excludeNewer) args.push('/XN')
  if (config.excludeOlder) args.push('/XO')
  if (config.excludeChanged) args.push('/XC')
  if (config.excludeLonely) args.push('/XL')
  if (config.excludeJunctions) args.push('/XJ')

  // Time handling
  if (config.fatTimes) args.push('/FFT')
  if (config.compensateDst) args.push('/DST')

  // File filters
  if (config.includeFiles.length > 0) {
    for (const pattern of config.includeFiles) {
      args.push('/IF')
      args.push(pattern)
    }
  }

  if (config.excludeFiles.length > 0) {
    for (const pattern of config.excludeFiles) {
      args.push('/XF')
      args.push(pattern)
    }
  }

  if (config.excludeDirs.length > 0) {
    for (const pattern of config.excludeDirs) {
      args.push('/XD')
      args.push(pattern)
    }
  }

  // Logging options
  if (config.verbose) args.push('/V')
  if (config.showEta) args.push('/ETA')

  if (config.logFile) {
    const logPath = sanitizePath(config.logFile)
    if (config.appendLog) {
      args.push(`/LOG+:${logPath}`)
    } else {
      args.push(`/LOG:${logPath}`)
    }
  }

  if (config.noProgress) args.push('/NP')
  if (config.noJobHeader) args.push('/NJH')
  if (config.noJobSummary) args.push('/NJS')

  // Expert mode flags
  if (config.expertFlags.trim()) {
    const expertArgs = config.expertFlags.trim().split(/\s+/)
    args.push(...expertArgs)
  }

  return { exe, args }
}

/**
 * Builds a displayable command string for the CommandPreview component.
 */
export function buildCommandString(config: JobConfig): string {
  const { exe, args } = buildCommand(config)
  const quotedArgs = args.map((arg) => quoteArg(arg))
  return `${exe} ${quotedArgs.join(' ')}`
}

function buildCopyFlagString(flags: JobConfig['copyFlags']): string {
  let s = ''
  if (flags.data) s += 'D'
  if (flags.attributes) s += 'A'
  if (flags.timestamps) s += 'T'
  if (flags.security) s += 'S'
  if (flags.owner) s += 'O'
  if (flags.auditing) s += 'U'
  return s
}

function buildDirCopyFlagString(flags: JobConfig['dirCopyFlags']): string {
  let s = ''
  if (flags.data) s += 'D'
  if (flags.attributes) s += 'A'
  if (flags.timestamps) s += 'T'
  return s
}

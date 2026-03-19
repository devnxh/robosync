export interface ExitCodeResult {
  success: boolean
  message: string
  flags: {
    noCopyNeeded: boolean
    oneOrMore: boolean
    extraFiles: boolean
    mismatch: boolean
    failedFiles: boolean
    fatalError: boolean
  }
}

const EXIT_CODE_MESSAGES: Record<number, string> = {
  0: 'No errors, no copying needed. Source and destination are in sync.',
  1: 'Files copied successfully.',
  2: 'Extra files or directories detected in destination (not errors).',
  3: 'Some files copied and extra files exist in destination.',
  4: 'Mismatched files or directories found. Examine log.',
  5: 'Files copied and mismatches detected.',
  6: 'Extra files and mismatches detected.',
  7: 'Files copied, extra files, and mismatches detected.',
  8: 'Some files FAILED to copy. Examine log for errors.',
  16: 'Fatal error. Robocopy did not copy any files. Check command arguments.'
}

export function decodeExitCode(code: number): ExitCodeResult {
  const flags = {
    noCopyNeeded: (code & 1) === 0 && code < 8,
    oneOrMore: (code & 1) === 1,
    extraFiles: (code & 2) === 2,
    mismatch: (code & 4) === 4,
    failedFiles: (code & 8) === 8,
    fatalError: (code & 16) === 16
  }

  const success = code < 8

  // Build a descriptive message from the bitmask
  let message: string
  if (EXIT_CODE_MESSAGES[code]) {
    message = EXIT_CODE_MESSAGES[code]
  } else {
    // Composite code — build a message from individual flags
    const parts: string[] = []
    if (flags.oneOrMore) parts.push('Files were copied')
    if (flags.extraFiles) parts.push('Extra files exist in destination')
    if (flags.mismatch) parts.push('Mismatched files detected')
    if (flags.failedFiles) parts.push('Some files FAILED to copy')
    if (flags.fatalError) parts.push('FATAL error occurred')
    message = parts.join('. ') + `. (Exit code: ${code})`
  }

  return { success, message, flags }
}

export const EXIT_CODE_TABLE = [
  { code: 0, meaning: 'No files copied. Source and destination identical.', status: 'OK' },
  { code: 1, meaning: 'All files copied successfully.', status: 'OK' },
  { code: 2, meaning: 'Extra files exist in destination.', status: 'OK' },
  { code: 3, meaning: 'Some files copied + extra files in destination.', status: 'OK' },
  { code: 4, meaning: 'Mismatched files or dirs found.', status: 'WARNING' },
  { code: 5, meaning: 'Files copied + mismatches.', status: 'WARNING' },
  { code: 6, meaning: 'Extra + mismatches.', status: 'WARNING' },
  { code: 7, meaning: 'Files copied + extra + mismatches.', status: 'WARNING' },
  { code: 8, meaning: 'Some files FAILED to copy.', status: 'ERROR' },
  { code: 16, meaning: 'Fatal error — no files copied at all.', status: 'FATAL' }
] as const

/**
 * Path sanitization utilities for safe robocopy command building.
 * Handles quoting, escaping, long path support, and null byte rejection.
 */

const SPECIAL_CHARS_REGEX = /[[\]()^&|<>;`']/g
const MAX_PATH_STANDARD = 260
const MAX_PATH_EXTENDED = 32767

export function sanitizePath(p: string): string {
  // Remove null bytes
  let sanitized = p.replace(/\0/g, '')

  // Reject overly long paths
  if (sanitized.length > MAX_PATH_EXTENDED) {
    throw new Error(`Path exceeds maximum length of ${MAX_PATH_EXTENDED} characters`)
  }

  // Normalize backslashes (don't convert to forward slash on Windows)
  sanitized = sanitized.replace(/\//g, '\\')

  // Remove trailing backslash (unless root like C:\ or UNC \\server\share\)
  if (sanitized.length > 3 && sanitized.endsWith('\\')) {
    sanitized = sanitized.slice(0, -1)
  }

  // Prepend \\?\ for long paths that aren't UNC and aren't already prefixed
  if (sanitized.length > MAX_PATH_STANDARD && !sanitized.startsWith('\\\\?\\')) {
    if (sanitized.startsWith('\\\\')) {
      // UNC path: \\server\share → \\?\UNC\server\share
      sanitized = '\\\\?\\UNC\\' + sanitized.slice(2)
    } else {
      sanitized = '\\\\?\\' + sanitized
    }
  }

  return sanitized
}

export function quoteArg(arg: string): string {
  // For display purposes — wrap in double quotes if contains space or special chars
  if (/\s/.test(arg) || SPECIAL_CHARS_REGEX.test(arg)) {
    // Escape existing double quotes
    const escaped = arg.replace(/"/g, '\\"')
    return `"${escaped}"`
  }
  return arg
}

export function escapeSpecialChars(s: string): string {
  return s.replace(SPECIAL_CHARS_REGEX, '^$&')
}

export function validatePathFormat(p: string): { valid: boolean; error?: string } {
  if (!p || p.trim().length === 0) {
    return { valid: false, error: 'Path cannot be empty' }
  }

  if (p.includes('\0')) {
    return { valid: false, error: 'Path contains null bytes' }
  }

  if (p.length > MAX_PATH_EXTENDED) {
    return { valid: false, error: `Path exceeds maximum length of ${MAX_PATH_EXTENDED} characters` }
  }

  // Check for valid drive letter or UNC path
  const hasDriveLetter = /^[A-Za-z]:\\/.test(p)
  const isUNCPath = p.startsWith('\\\\')
  const isLongPath = p.startsWith('\\\\?\\')

  if (!hasDriveLetter && !isUNCPath && !isLongPath) {
    return { valid: false, error: 'Path must start with a drive letter (e.g., C:\\) or UNC path (\\\\server\\share)' }
  }

  return { valid: true }
}

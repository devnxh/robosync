import { access, stat, constants } from 'fs/promises'

export interface PathValidationResult {
  valid: boolean
  exists: boolean
  isDir: boolean
  isFile: boolean
  writable: boolean
  error?: string
}

export async function validatePath(p: string): Promise<PathValidationResult> {
  const result: PathValidationResult = {
    valid: false,
    exists: false,
    isDir: false,
    isFile: false,
    writable: false
  }

  if (!p || p.trim().length === 0) {
    result.error = 'Path cannot be empty'
    return result
  }

  if (p.includes('\0')) {
    result.error = 'Path contains null bytes'
    return result
  }

  if (p.length > 32767) {
    result.error = 'Path exceeds maximum length'
    return result
  }

  try {
    await access(p, constants.F_OK)
    result.exists = true
  } catch {
    result.error = 'Path does not exist'
    return result
  }

  try {
    const stats = await stat(p)
    result.isDir = stats.isDirectory()
    result.isFile = stats.isFile()
  } catch {
    result.error = 'Cannot read path information'
    return result
  }

  // Both files and directories are valid paths
  if (!result.isDir && !result.isFile) {
    result.error = 'Path is not a file or directory'
    return result
  }

  try {
    await access(p, constants.W_OK)
    result.writable = true
  } catch {
    // Not writable, but still valid for source paths
  }

  try {
    await access(p, constants.R_OK)
    result.valid = true
  } catch {
    result.error = 'Path is not readable'
    return result
  }

  result.valid = true
  return result
}

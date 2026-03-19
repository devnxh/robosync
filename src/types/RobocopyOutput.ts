export interface ParsedProgress {
  percent: number
  currentFile: string
  bytesTransferred: number
  speed: number // bytes per second
  filesTransferred: number
  eta: string
}

export interface ParsedStats {
  dirs: { total: number; copied: number; skipped: number; failed: number }
  files: { total: number; copied: number; skipped: number; failed: number }
  bytes: { total: number; copied: number; skipped: number; failed: number }
  speed: number
  eta: string
}

export type LogLineType = 'info' | 'success' | 'warning' | 'error' | 'progress' | 'header'

export interface LogLine {
  id: number
  timestamp: string
  type: LogLineType
  raw: string
}

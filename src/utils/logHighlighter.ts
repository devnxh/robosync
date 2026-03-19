import type { LogLineType } from '../types/RobocopyOutput'

const ERROR_PATTERNS = /ERROR|FAILED|error\s+\d+/i
const WARNING_PATTERNS = /SKIP|EXTRA|Mismatch|WARNING/i
const SUCCESS_PATTERNS = /New File|Newer|Copied|100%/i
const PROGRESS_PATTERNS = /^\s+\d+(?:\.\d+)?%/
const HEADER_PATTERNS = /^-{10,}|^ROBOCOPY|^Source|^Dest/i

export function classifyLogLine(line: string): LogLineType {
  if (HEADER_PATTERNS.test(line)) return 'header'
  if (PROGRESS_PATTERNS.test(line)) return 'progress'
  if (ERROR_PATTERNS.test(line)) return 'error'
  if (WARNING_PATTERNS.test(line)) return 'warning'
  if (SUCCESS_PATTERNS.test(line)) return 'success'
  return 'info'
}

export function getLogLineColor(type: LogLineType): string {
  switch (type) {
    case 'error':
      return 'text-error'
    case 'warning':
      return 'text-warning'
    case 'success':
      return 'text-success'
    case 'progress':
      return 'text-accent'
    case 'header':
      return 'text-text-muted font-semibold'
    case 'info':
    default:
      return 'text-text-muted'
  }
}

export function getLogDotColor(type: LogLineType): string {
  switch (type) {
    case 'error':
      return 'bg-error'
    case 'warning':
      return 'bg-warning'
    case 'success':
      return 'bg-success'
    case 'progress':
      return 'bg-accent'
    case 'header':
      return 'bg-text-subtle'
    case 'info':
    default:
      return 'bg-text-subtle'
  }
}

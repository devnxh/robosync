import type { LogLine, LogLineType, ParsedProgress, ParsedStats } from '../../src/types/RobocopyOutput'

type ParserState = 'header' | 'scanning' | 'copying' | 'summary'

interface ParseResult {
  logLine: LogLine
  progress?: ParsedProgress
  stats?: Partial<ParsedStats>
}

const PERCENT_REGEX = /^\s+(\d+(?:\.\d+)?)%\s*(.*)/
const STATS_REGEX = /^\s+(Dirs|Files|Bytes)\s*:\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/
const SPEED_REGEX = /Speed\s*:\s*([\d,]+)\s+Bytes\/sec/
const ETA_REGEX = /ETA\s*:\s*(.+)/
const HEADER_REGEX = /^-{10,}|^ROBOCOPY/i
const TOTAL_REGEX = /^\s*(Total|Ended)\s*:/i
// Robocopy outputs file sizes like:  New File  		   1234	  filename.txt
// Or:                                 100%        New File     1.5 m	filename.txt
const FILE_SIZE_REGEX = /(?:New File|Newer|Older|Changed)\s+(\d+(?:\.\d+)?)\s*([kmgt]?)\s/i

let lineCounter = 0

export class RobocopyOutputParser {
  private state: ParserState = 'header'
  private bytesTransferred = 0
  private filesTransferred = 0
  private startTime = 0
  private currentFileSize = 0
  private lastFilePercent = 0

  parseLine(line: string): ParseResult {
    lineCounter++

    if (this.startTime === 0) {
      this.startTime = Date.now()
    }

    const logLine: LogLine = {
      id: lineCounter,
      timestamp: new Date().toISOString(),
      type: classifyLine(line),
      raw: line
    }

    const result: ParseResult = { logLine }

    // State transitions
    if (this.state === 'header' && !HEADER_REGEX.test(line) && line.trim().length > 0) {
      this.state = 'scanning'
    }

    // Detect new file being copied — extract file size
    const fileSizeMatch = FILE_SIZE_REGEX.exec(line)
    if (fileSizeMatch) {
      this.state = 'copying'
      this.lastFilePercent = 0
      const sizeNum = parseFloat(fileSizeMatch[1])
      const unit = (fileSizeMatch[2] || '').toLowerCase()
      this.currentFileSize = convertToBytes(sizeNum, unit)
      this.filesTransferred++
    }

    // Check for percentage progress lines
    const percentMatch = PERCENT_REGEX.exec(line)
    if (percentMatch) {
      this.state = 'copying'
      const filePercent = parseFloat(percentMatch[1])

      // Calculate bytes increment from file progress
      if (this.currentFileSize > 0 && filePercent > this.lastFilePercent) {
        const increment = ((filePercent - this.lastFilePercent) / 100) * this.currentFileSize
        this.bytesTransferred += increment
        this.lastFilePercent = filePercent
      }

      // If file reached 100%, reset for next file
      if (filePercent >= 100) {
        this.lastFilePercent = 0
        this.currentFileSize = 0
      }

      // Calculate live speed
      const elapsedMs = Date.now() - this.startTime
      const speed = elapsedMs > 0 ? (this.bytesTransferred / elapsedMs) * 1000 : 0

      // Estimate ETA from overall progress
      let eta = ''
      if (speed > 0 && filePercent > 0 && filePercent < 100) {
        const remaining = (this.bytesTransferred / (filePercent / 100)) - this.bytesTransferred
        const etaSeconds = Math.round(remaining / speed)
        if (etaSeconds < 3600) {
          const m = Math.floor(etaSeconds / 60)
          const s = etaSeconds % 60
          eta = `${m}m ${s}s`
        } else {
          const h = Math.floor(etaSeconds / 3600)
          const m = Math.floor((etaSeconds % 3600) / 60)
          eta = `${h}h ${m}m`
        }
      }

      result.progress = {
        percent: filePercent,
        currentFile: percentMatch[2]?.trim() || '',
        bytesTransferred: this.bytesTransferred,
        speed,
        filesTransferred: this.filesTransferred,
        eta,
      }
    }

    // Check for summary section
    if (TOTAL_REGEX.test(line) || STATS_REGEX.test(line)) {
      this.state = 'summary'
    }

    // Parse stats in summary
    if (this.state === 'summary') {
      const statsMatch = STATS_REGEX.exec(line)
      if (statsMatch) {
        const category = statsMatch[1].toLowerCase() as 'dirs' | 'files' | 'bytes'
        const statValues = {
          total: parseInt(statsMatch[2], 10),
          copied: parseInt(statsMatch[3], 10),
          skipped: parseInt(statsMatch[4], 10),
          failed: parseInt(statsMatch[6], 10)
        }

        if (!result.stats) {
          result.stats = {}
        }

        result.stats[category] = statValues
      }

      const speedMatch = SPEED_REGEX.exec(line)
      if (speedMatch) {
        if (!result.stats) result.stats = {}
        result.stats.speed = parseInt(speedMatch[1].replace(/,/g, ''), 10)
      }

      const etaMatch = ETA_REGEX.exec(line)
      if (etaMatch) {
        if (!result.stats) result.stats = {}
        result.stats.eta = etaMatch[1].trim()
      }
    }

    return result
  }

  reset(): void {
    this.state = 'header'
    this.bytesTransferred = 0
    this.filesTransferred = 0
    this.startTime = 0
    this.currentFileSize = 0
    this.lastFilePercent = 0
    lineCounter = 0
  }

  getState(): ParserState {
    return this.state
  }
}

function convertToBytes(size: number, unit: string): number {
  switch (unit) {
    case 'k': return size * 1024
    case 'm': return size * 1024 * 1024
    case 'g': return size * 1024 * 1024 * 1024
    case 't': return size * 1024 * 1024 * 1024 * 1024
    default: return size
  }
}

export function classifyLine(line: string): LogLineType {
  if (HEADER_REGEX.test(line)) return 'header'
  if (PERCENT_REGEX.test(line)) return 'progress'
  if (/ERROR|FAILED/i.test(line)) return 'error'
  if (/SKIP|EXTRA|Mismatch/i.test(line)) return 'warning'
  if (/New File|Newer|Copied/i.test(line)) return 'success'
  return 'info'
}

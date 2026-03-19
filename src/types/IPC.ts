import type { JobConfig, Profile, HistoryEntry } from './RobocopyJob'
import type { LogLine, ParsedProgress, ParsedStats } from './RobocopyOutput'

export interface JobResult {
  exitCode: number
  success: boolean
  message: string
  stats: ParsedStats | null
  duration: number
}

export interface PathValidationResult {
  valid: boolean
  exists: boolean
  isDir: boolean
  writable: boolean
  error?: string
}

export interface ScheduleOptions {
  taskName: string
  command: string
  scheduleType: 'daily' | 'weekly' | 'once'
  time: string
  days?: number[]
}

export interface ElectronAPI {
  openFolderDialog: () => Promise<string | null>
  openFileDialog: () => Promise<string[] | null>
  startJob: (config: JobConfig) => Promise<void>
  cancelJob: () => Promise<void>
  onJobOutput: (cb: (line: LogLine) => void) => () => void
  onJobProgress: (cb: (p: ParsedProgress) => void) => () => void
  onJobComplete: (cb: (result: JobResult) => void) => () => void
  onJobError: (cb: (err: string) => void) => () => void
  getProfiles: () => Promise<Profile[]>
  saveProfile: (p: Profile) => Promise<void>
  deleteProfile: (id: string) => Promise<void>
  getHistory: () => Promise<HistoryEntry[]>
  clearHistory: () => Promise<void>
  createTask: (opts: ScheduleOptions) => Promise<void>
  deleteTask: (name: string) => Promise<void>
  listTasks: () => Promise<string[]>
  validatePath: (p: string) => Promise<PathValidationResult>
  saveLogFile: (lines: string[]) => Promise<void>
  getVersion: () => Promise<string>
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
}

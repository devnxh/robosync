export type CopyMode = 'copy' | 'mirror' | 'move' | 'moveFiles'
export type UIMode = 'basic' | 'advanced' | 'expert'

export interface CopyFlags {
  data: boolean
  attributes: boolean
  timestamps: boolean
  security: boolean
  owner: boolean
  auditing: boolean
}

export interface DirCopyFlags {
  data: boolean
  attributes: boolean
  timestamps: boolean
}

export interface JobConfig {
  source: string
  destination: string
  uiMode: UIMode
  copyMode: CopyMode
  includeFiles: string[]
  excludeFiles: string[]
  excludeDirs: string[]
  threads: number
  retryCount: number
  retryWait: number
  restartable: boolean
  backupMode: boolean
  unbufferedIO: boolean
  ipg: number
  copyFlags: CopyFlags
  dirCopyFlags: DirCopyFlags
  excludeNewer: boolean
  excludeOlder: boolean
  excludeChanged: boolean
  excludeLonely: boolean
  excludeJunctions: boolean
  fatTimes: boolean
  compensateDst: boolean
  verbose: boolean
  showEta: boolean
  logFile: string
  appendLog: boolean
  noProgress: boolean
  noJobHeader: boolean
  noJobSummary: boolean
  expertFlags: string
  scheduleEnabled: boolean
  scheduleType: 'daily' | 'weekly' | 'once'
  scheduleTime: string
  scheduleDays: number[]
}

export interface Profile {
  id: string
  name: string
  icon: string
  createdAt: string
  updatedAt: string
  config: JobConfig
}

export interface HistoryEntry {
  id: string
  profileName: string
  source: string
  destination: string
  command: string
  startedAt: string
  finishedAt: string
  exitCode: number
  exitMessage: string
  filesCopied: number
  bytesCopied: number
  errors: number
  duration: number
}

export const DEFAULT_JOB_CONFIG: JobConfig = {
  source: '',
  destination: '',
  uiMode: 'basic',
  copyMode: 'copy',
  includeFiles: [],
  excludeFiles: [],
  excludeDirs: [],
  threads: 8,
  retryCount: 1,
  retryWait: 3,
  restartable: false,
  backupMode: false,
  unbufferedIO: false,
  ipg: 0,
  copyFlags: {
    data: true,
    attributes: true,
    timestamps: true,
    security: false,
    owner: false,
    auditing: false
  },
  dirCopyFlags: {
    data: true,
    attributes: false,
    timestamps: false
  },
  excludeNewer: false,
  excludeOlder: false,
  excludeChanged: false,
  excludeLonely: false,
  excludeJunctions: true,
  fatTimes: false,
  compensateDst: false,
  verbose: false,
  showEta: true,
  logFile: '',
  appendLog: false,
  noProgress: false,
  noJobHeader: false,
  noJobSummary: false,
  expertFlags: '',
  scheduleEnabled: false,
  scheduleType: 'daily',
  scheduleTime: '02:00',
  scheduleDays: [1]
}

import { create } from 'zustand'
import type { JobConfig, Profile, HistoryEntry } from '../types/RobocopyJob'
import type { LogLine, ParsedProgress, ParsedStats } from '../types/RobocopyOutput'
import type { JobResult } from '../types/IPC'

export type TabId = 'newjob' | 'savedjobs' | 'history' | 'logs'
export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
}

interface AppState {
  // Active job config (form state)
  jobConfig: JobConfig
  setJobConfig: (partial: Partial<JobConfig>) => void
  resetJobConfig: () => void

  // Execution state
  isRunning: boolean
  isPaused: boolean
  progress: ParsedProgress
  stats: ParsedStats | null
  logLines: LogLine[]
  jobResult: JobResult | null
  jobError: string | null

  // Actions
  startJob: () => Promise<void>
  cancelJob: () => void
  clearLogs: () => void
  addLogLine: (line: LogLine) => void
  setProgress: (p: ParsedProgress) => void
  setJobResult: (r: JobResult) => void
  setIsRunning: (v: boolean) => void
  setJobError: (err: string) => void

  // Profiles
  profiles: Profile[]
  loadProfiles: () => Promise<void>
  saveProfile: (name: string, icon: string) => Promise<void>
  deleteProfile: (id: string) => Promise<void>
  loadProfile: (p: Profile) => void

  // History
  history: HistoryEntry[]
  loadHistory: () => Promise<void>
  clearHistory: () => Promise<void>

  // Toasts
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void

  // UI
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  showSaveProfileModal: boolean
  setShowSaveProfileModal: (v: boolean) => void
}

const defaultJobConfig: JobConfig = {
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

export const useAppStore = create<AppState>((set, get) => ({
  // Job config
  jobConfig: { ...defaultJobConfig },
  setJobConfig: (partial) =>
    set((state) => ({
      jobConfig: { ...state.jobConfig, ...partial }
    })),
  resetJobConfig: () => set({ jobConfig: { ...defaultJobConfig } }),

  // Execution
  isRunning: false,
  isPaused: false,
  progress: { percent: 0, currentFile: '', bytesTransferred: 0, speed: 0, filesTransferred: 0, eta: '' },
  stats: null,
  logLines: [],
  jobResult: null,
  jobError: null,

  startJob: async () => {
    const config = get().jobConfig
    set({
      isRunning: true,
      isPaused: false,
      logLines: [],
      progress: { percent: 0, currentFile: '', bytesTransferred: 0, speed: 0, filesTransferred: 0, eta: '' },
      stats: null,
      jobResult: null,
      jobError: null,
    })

    try {
      await window.electronAPI.startJob(config)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      set({
        isRunning: false,
        jobError: message,
        jobResult: {
          exitCode: -1,
          success: false,
          message,
          stats: null,
          duration: 0
        }
      })
      get().addToast({ type: 'error', title: 'Job Failed', message })
    }
  },

  cancelJob: () => {
    window.electronAPI.cancelJob()
    set({ isRunning: false })
    get().addToast({ type: 'info', message: 'Job cancelled' })
  },

  clearLogs: () => set({ logLines: [] }),

  addLogLine: (line) =>
    set((state) => ({
      logLines: [...state.logLines.slice(-9999), line] // Keep max 10000 lines
    })),

  setProgress: (p) => set({ progress: p }),

  setJobResult: (r) => {
    set({
      jobResult: r,
      isRunning: false
    })
    if (r.success) {
      get().addToast({ type: 'success', title: 'Job Complete', message: r.message })
    } else {
      get().addToast({ type: 'error', title: 'Job Failed', message: r.message })
    }
  },

  setIsRunning: (v) => set({ isRunning: v }),

  setJobError: (err) => {
    set({
      isRunning: false,
      jobError: err,
      jobResult: {
        exitCode: -1,
        success: false,
        message: err,
        stats: null,
        duration: 0
      }
    })
    get().addToast({ type: 'error', title: 'Execution Error', message: err })
  },

  // Profiles
  profiles: [],
  loadProfiles: async () => {
    const profiles = (await window.electronAPI.getProfiles()) as Profile[]
    set({ profiles })
  },

  saveProfile: async (name, icon) => {
    const config = get().jobConfig
    const profile: Profile = {
      id: crypto.randomUUID(),
      name,
      icon,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: { ...config }
    }
    await window.electronAPI.saveProfile(profile)
    await get().loadProfiles()
    get().addToast({ type: 'success', message: 'Profile saved' })
  },

  deleteProfile: async (id) => {
    await window.electronAPI.deleteProfile(id)
    await get().loadProfiles()
    get().addToast({ type: 'info', message: 'Profile deleted' })
  },

  loadProfile: (p) => {
    set({ jobConfig: { ...p.config } })
  },

  // History
  history: [],
  loadHistory: async () => {
    const history = (await window.electronAPI.getHistory()) as HistoryEntry[]
    set({ history })
  },

  clearHistory: async () => {
    await window.electronAPI.clearHistory()
    set({ history: [] })
    get().addToast({ type: 'info', message: 'History cleared' })
  },

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID()
    const duration = toast.duration ?? 4000
    const newToast: ToastItem = { ...toast, id }

    set((state) => {
      const updated = [...state.toasts, newToast]
      // Cap at 5 toasts — remove oldest if over limit
      while (updated.length > 5) {
        updated.shift()
      }
      return { toasts: updated }
    })

    // Auto-dismiss
    setTimeout(() => {
      get().removeToast(id)
    }, duration)
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    })),

  // UI
  activeTab: 'newjob',
  setActiveTab: (tab) => set({ activeTab: tab }),
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  showSaveProfileModal: false,
  setShowSaveProfileModal: (v) => set({ showSaveProfileModal: v }),
}))

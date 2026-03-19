import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@shared/ipcChannels'

contextBridge.exposeInMainWorld('electronAPI', {
  // Dialogs
  openFolderDialog: (): Promise<string | null> =>
    ipcRenderer.invoke(IPC.OPEN_FOLDER_DIALOG),
  openFileDialog: (): Promise<string[] | null> =>
    ipcRenderer.invoke(IPC.OPEN_FILE_DIALOG),

  // Job control
  startJob: (config: unknown): Promise<void> =>
    ipcRenderer.invoke(IPC.JOB_START, config),
  cancelJob: (): Promise<void> =>
    ipcRenderer.invoke(IPC.JOB_CANCEL),

  // Event listeners — each returns an unsubscribe function
  onJobOutput: (cb: (line: unknown) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, line: unknown): void => cb(line)
    ipcRenderer.on(IPC.JOB_OUTPUT, handler)
    return () => ipcRenderer.removeListener(IPC.JOB_OUTPUT, handler)
  },

  onJobProgress: (cb: (p: unknown) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, p: unknown): void => cb(p)
    ipcRenderer.on(IPC.JOB_PROGRESS, handler)
    return () => ipcRenderer.removeListener(IPC.JOB_PROGRESS, handler)
  },

  onJobComplete: (cb: (result: unknown) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, result: unknown): void => cb(result)
    ipcRenderer.on(IPC.JOB_COMPLETE, handler)
    return () => ipcRenderer.removeListener(IPC.JOB_COMPLETE, handler)
  },

  onJobError: (cb: (err: string) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, err: string): void => cb(err)
    ipcRenderer.on(IPC.JOB_ERROR, handler)
    return () => ipcRenderer.removeListener(IPC.JOB_ERROR, handler)
  },

  // Profiles
  getProfiles: (): Promise<unknown[]> =>
    ipcRenderer.invoke(IPC.PROFILE_GETALL),
  saveProfile: (p: unknown): Promise<void> =>
    ipcRenderer.invoke(IPC.PROFILE_SAVE, p),
  deleteProfile: (id: string): Promise<void> =>
    ipcRenderer.invoke(IPC.PROFILE_DELETE, id),

  // History
  getHistory: (): Promise<unknown[]> =>
    ipcRenderer.invoke(IPC.HISTORY_GETALL),
  clearHistory: (): Promise<void> =>
    ipcRenderer.invoke(IPC.HISTORY_CLEAR),

  // Scheduler
  createTask: (opts: unknown): Promise<void> =>
    ipcRenderer.invoke(IPC.SCHEDULER_CREATE, opts),
  deleteTask: (name: string): Promise<void> =>
    ipcRenderer.invoke(IPC.SCHEDULER_DELETE, name),
  listTasks: (): Promise<string[]> =>
    ipcRenderer.invoke(IPC.SCHEDULER_LIST),

  // Validation
  validatePath: (p: string): Promise<unknown> =>
    ipcRenderer.invoke(IPC.PATH_VALIDATE, p),

  // Log export
  saveLogFile: (lines: string[]): Promise<void> =>
    ipcRenderer.invoke(IPC.SAVE_LOG_FILE, lines),

  // App
  getVersion: (): Promise<string> =>
    ipcRenderer.invoke(IPC.APP_VERSION),
  minimizeWindow: (): void => { ipcRenderer.invoke(IPC.MINIMIZE_WINDOW) },
  maximizeWindow: (): void => { ipcRenderer.invoke(IPC.MAXIMIZE_WINDOW) },
  closeWindow: (): void => { ipcRenderer.invoke(IPC.CLOSE_WINDOW) }
})

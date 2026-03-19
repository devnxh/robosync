import type { ElectronAPI } from './IPC'

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}

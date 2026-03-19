import { ipcMain, dialog, app, BrowserWindow } from 'electron'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { IPC } from '@shared/ipcChannels'
import { RobocopyRunner } from '../services/RobocopyRunner'
import { RobocopyOutputParser } from '../services/OutputParser'
import { decodeExitCode } from '../services/ExitCodeMapper'
import { buildCommandString } from '../services/CommandBuilder'
import { ProfileStore } from '../services/ProfileStore'
import { JobHistoryStore } from '../services/JobHistoryStore'
import { Scheduler } from '../services/Scheduler'
import { validatePath } from '../utils/validation'
import type { JobConfig, HistoryEntry, Profile } from '../../src/types/RobocopyJob'
import type { ScheduleOptions } from '../../src/types/IPC'

const runner = new RobocopyRunner()
const parser = new RobocopyOutputParser()
const profileStore = new ProfileStore()
const historyStore = new JobHistoryStore()
const scheduler = new Scheduler()

export function registerIpcHandlers(mainWindow: BrowserWindow): void {
  // --- Dialog ---
  ipcMain.handle(IPC.OPEN_FOLDER_DIALOG, async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
    return result.canceled ? null : result.filePaths[0] ?? null
  })

  ipcMain.handle(IPC.OPEN_FILE_DIALOG, async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'All Files', extensions: ['*'] }]
    })
    return result.canceled ? null : result.filePaths
  })

  // --- Job Execution ---
  ipcMain.handle(IPC.JOB_START, async (_event, config: JobConfig) => {
    // Validate source
    const sourceResult = await validatePath(config.source)
    if (!sourceResult.valid) {
      mainWindow.webContents.send(IPC.JOB_ERROR, `Invalid source path: ${sourceResult.error}`)
      return
    }

    parser.reset()
    const startTime = Date.now()
    const commandString = buildCommandString(config)

    runner.start(
      config,
      (line: string) => {
        const result = parser.parseLine(line)
        mainWindow.webContents.send(IPC.JOB_OUTPUT, result.logLine)

        if (result.progress) {
          mainWindow.webContents.send(IPC.JOB_PROGRESS, result.progress)
        }
      },
      (exitCode: number) => {
        const decoded = decodeExitCode(exitCode)
        const duration = Math.round((Date.now() - startTime) / 1000)

        const jobResult = {
          exitCode,
          success: decoded.success,
          message: decoded.message,
          stats: null,
          duration
        }

        mainWindow.webContents.send(IPC.JOB_COMPLETE, jobResult)

        // Save to history
        const historyEntry: HistoryEntry = {
          id: randomUUID(),
          profileName: '',
          source: config.source,
          destination: config.destination,
          command: commandString,
          startedAt: new Date(startTime).toISOString(),
          finishedAt: new Date().toISOString(),
          exitCode,
          exitMessage: decoded.message,
          filesCopied: 0,
          bytesCopied: 0,
          errors: decoded.flags.failedFiles ? 1 : 0,
          duration
        }
        historyStore.add(historyEntry)
      },
      (err: Error) => {
        mainWindow.webContents.send(IPC.JOB_ERROR, err.message)
      }
    )
  })

  ipcMain.handle(IPC.JOB_CANCEL, async () => {
    runner.cancel()
  })

  // --- Log Export ---
  ipcMain.handle(IPC.SAVE_LOG_FILE, async (_event, lines: string[]) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Export Log',
      defaultPath: `robosync-log-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`,
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'Log Files', extensions: ['log'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (!result.canceled && result.filePath) {
      await writeFile(result.filePath, lines.join('\n'), 'utf-8')
    }
  })

  // --- Profiles ---
  ipcMain.handle(IPC.PROFILE_GETALL, async () => {
    return profileStore.getAll()
  })

  ipcMain.handle(IPC.PROFILE_SAVE, async (_event, profile: Profile) => {
    profileStore.save(profile)
  })

  ipcMain.handle(IPC.PROFILE_DELETE, async (_event, id: string) => {
    profileStore.delete(id)
  })

  // --- History ---
  ipcMain.handle(IPC.HISTORY_GETALL, async () => {
    return historyStore.getAll()
  })

  ipcMain.handle(IPC.HISTORY_CLEAR, async () => {
    historyStore.clear()
  })

  // --- Scheduler ---
  ipcMain.handle(IPC.SCHEDULER_CREATE, async (_event, opts: ScheduleOptions) => {
    await scheduler.createTask(opts)
  })

  ipcMain.handle(IPC.SCHEDULER_DELETE, async (_event, taskName: string) => {
    await scheduler.deleteTask(taskName)
  })

  ipcMain.handle(IPC.SCHEDULER_LIST, async () => {
    return scheduler.listTasks()
  })

  // --- Validation ---
  ipcMain.handle(IPC.PATH_VALIDATE, async (_event, p: string) => {
    return validatePath(p)
  })

  // --- App ---
  ipcMain.handle(IPC.APP_VERSION, async () => {
    return app.getVersion()
  })

  ipcMain.handle(IPC.MINIMIZE_WINDOW, () => {
    mainWindow.minimize()
  })

  ipcMain.handle(IPC.MAXIMIZE_WINDOW, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.handle(IPC.CLOSE_WINDOW, () => {
    app.quit()
  })
}

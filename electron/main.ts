import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { registerIpcHandlers } from './ipc/handlers'

// Set app user model ID for Windows notifications
app.setAppUserModelId('com.robosync.app')

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

// --- Mod 5: Single instance lock ---
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
  process.exit(0)
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    createWindow()
    createTray()
  })
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0d0d0f',
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  // --- Mod 4: Close to tray instead of quitting ---
  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      mainWindow?.hide()
    }
  })

  // Register all IPC handlers
  registerIpcHandlers(mainWindow)

  // Load the renderer
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createTray(): void {
  try {
    const iconPath = join(__dirname, '../../assets/tray-icon.png')
    let icon = nativeImage.createFromPath(iconPath)

    // Fallback: create a programmatic blue square if icon file is missing/empty
    if (icon.isEmpty()) {
      icon = nativeImage.createFromDataURL(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVQ4T2Nk+M/wn4EBCJgYGBiZQGxkwMgIk0cWg/GZGHAB' +
        'JHkUA2ACyC6A0cQENwDFi8guQPYzigswHAAAHBQQEZDnfbgAAAAASUVORK5CYII='
      )
    }

    tray = new Tray(icon.resize({ width: 16, height: 16 }))
    tray.setToolTip('RoboSync')

    const updateMenu = () => {
      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'Show RoboSync',
          click: () => {
            mainWindow?.show()
            mainWindow?.focus()
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          click: () => {
            isQuitting = true
            app.quit()
          }
        }
      ])
      tray!.setContextMenu(contextMenu)
    }

    updateMenu()

    tray.on('double-click', () => {
      mainWindow?.show()
      mainWindow?.focus()
    })
  } catch {
    console.warn('Failed to create system tray icon')
  }
}

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  // On macOS, apps typically stay open until Cmd+Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

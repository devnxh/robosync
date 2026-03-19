# 🔄 RoboSync

> A modern, production-ready GUI wrapper for Windows Robocopy — built with Electron, React, and TypeScript.

![GitHub release](https://img.shields.io/github/v/release/devnxh/robosync?style=flat-square&color=4f6ef7)
![Platform](https://img.shields.io/badge/platform-Windows-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Built with Electron](https://img.shields.io/badge/built%20with-Electron-47848F?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square)
![CI](https://github.com/devnxh/robosync/actions/workflows/ci.yml/badge.svg)
![Release](https://github.com/devnxh/robosync/actions/workflows/release.yml/badge.svg)

---

## ⬇️ Download

> **Windows 10 / 11 (64-bit) required. Robocopy is built into Windows — no extra install needed.**

| | |
|---|---|
| [📦 **Download Installer (.exe)**](https://github.com/devnxh/robosync/releases/latest) | Installs RoboSync with Start Menu shortcut and auto-uninstaller |
| [🗜️ **Download Portable (.exe)**](https://github.com/devnxh/robosync/releases/latest) | Single .exe, no installation required — run from anywhere |

---

## ✨ Features

- **Visual Job Builder** — Configure robocopy with an intuitive UI across Basic, Advanced, and Expert modes
- **Real-Time Log Viewer** — Syntax-highlighted, virtualized for 10,000+ lines without lag
- **Live Command Preview** — See the exact robocopy command before running, with copy-to-clipboard
- **Job Profiles** — Save, load, and manage named backup configurations for repeated use
- **Smart Suggestions** — Contextual tips based on your configuration (network paths, mirror warnings, thread tuning)
- **Progress Tracking** — Real-time percentage, files copied, transfer speed (MB/s), and ETA
- **System Tray Support** — Minimize to tray, runs in background, double-click to restore
- **Job History** — Searchable log of all past runs with exit status badges and duration
- **Task Scheduler Integration** — Schedule jobs daily or weekly via Windows Task Scheduler
- **Full Robocopy Coverage** — /MIR, /Z, /B, /MT, /COPY, /DCOPY, /XF, /XD, and 30+ more flags
- **Drag & Drop** — Drop folders or files directly onto source/destination inputs
- **File & Folder Source** — Copy entire directories or select specific files to transfer
- **Keyboard Shortcuts** — Ctrl+Enter to run, Ctrl+S to save, Ctrl+N for new job, and more
- **Dark Mode UI** — VS Code-inspired design with glassmorphism and smooth micro-animations
- **Auto Thread Detection** — Automatically detects CPU thread count to set optimal /MT value
- **Secure Architecture** — contextIsolation, no nodeIntegration, spawn with shell:false

---

## 📸 Screenshots

| New Job | Saved Jobs | Run History |
|---------|------------|-------------|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

> Take actual screenshots from the running app and add them to `assets/screenshots/`, then update the image links above.

---

## 🎯 Robocopy Mode Reference

| Mode | Description | Best For |
|------|-------------|----------|
| **Basic** | Copy, Mirror, Move with thread control, retry settings, and quick toggles | Everyday backups |
| **Advanced** | Full flag control — /Z (restartable), /B (backup mode), /COPY, /DCOPY, logging, IPG | Power users |
| **Expert** | Free-text flag input, merged with source/dest — for custom robocopy flags | Scripting veterans |

---

## ⚡ Robocopy Exit Code Reference

| Code | Meaning | Status |
|------|---------|--------|
| 0 | No copy needed. Source and destination are identical. | ✅ OK |
| 1 | Files copied successfully. | ✅ OK |
| 2 | Extra files exist in destination (not errors). | ✅ OK |
| 3 | Files copied + extra files in destination. | ✅ OK |
| 4 | Mismatched files found — examine log. | ⚠️ Warning |
| 5 | Files copied + mismatches. | ⚠️ Warning |
| 6 | Extra files + mismatches. | ⚠️ Warning |
| 7 | Copied + extra + mismatches. | ⚠️ Warning |
| 8 | One or more files FAILED to copy. | ❌ Error |
| 16 | Fatal error — no files copied at all. | 🔴 Fatal |

> **Note:** Exit codes are **bitmasks**. Code 9 = 8+1 (some files failed AND some copied successfully).

---

## 🔧 Thread Recommendations

| Storage Setup | Recommended /MT |
|---|---|
| NVMe → NVMe | /MT:32 |
| SSD → SSD | /MT:16 |
| SSD → HDD | /MT:8 |
| HDD → HDD | /MT:4 |
| Network (Gigabit) | /MT:16 |
| Network (WiFi) | /MT:8 |

> RoboSync auto-detects your CPU thread count and caps the /MT slider accordingly.

---

## 🛠️ Build From Source

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 9 or later
- Windows 10/11 (64-bit)
- [Git](https://git-scm.com/)

### Setup

```bash
git clone https://github.com/devnxh/robosync.git
cd robosync
npm install
```

### Development

```bash
npm run dev
```

Opens the Electron app with hot module replacement for both main and renderer processes.

### Production Build

```bash
npm run build
```

Outputs compiled files to `out/` directory.

### Create Installer

```bash
npm run package
```

Creates NSIS installer and portable .exe in the `release/` folder.

---

## 🏗️ Architecture

RoboSync follows Electron's security best practices with strict process isolation:

- **Main Process** — Handles all system operations: file dialogs, robocopy execution, persistence, task scheduling
- **Renderer Process** — React UI with `contextIsolation: true` and `nodeIntegration: false`
- **Preload Script** — All Node.js APIs exposed exclusively via `contextBridge` with typed IPC channels
- **Robocopy Execution** — `child_process.spawn()` with `shell: false` (no shell injection possible)
- **State Management** — Zustand for UI state, electron-store for persistent profiles and history
- **Data Validation** — Zod schemas for runtime validation of all loaded JSON data
- **IPC Channels** — Single source of truth in `shared/ipcChannels.ts`, imported by all three targets

### Project Structure

```
robosync/
├── electron/               # Main process
│   ├── main.ts             # App entry, window, tray, single-instance
│   ├── preload.ts          # Context bridge API
│   ├── ipc/handlers.ts     # All IPC handlers
│   ├── services/           # RobocopyRunner, CommandBuilder, OutputParser, stores
│   └── utils/              # Path validation, sanitization
├── shared/
│   └── ipcChannels.ts      # IPC channel constants (shared across all targets)
├── src/                    # Renderer process (React)
│   ├── App.tsx             # Root component with keyboard shortcuts
│   ├── store/              # Zustand store with toast system
│   ├── pages/              # NewJob, SavedJobs, RunHistory, Logs
│   ├── components/         # 25 components across 5 categories
│   ├── hooks/              # useRobocopy, useCommandBuilder, useSmartSuggestions
│   ├── types/              # TypeScript types, Zod schemas, global.d.ts
│   └── utils/              # Formatters, log highlighter
├── assets/                 # Icons (ico, png, tray)
├── .github/workflows/      # CI + Release pipelines
├── electron-builder.config.js
├── electron.vite.config.ts
└── tailwind.config.js
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` | Start job |
| `Ctrl+.` | Cancel running job |
| `Ctrl+S` | Save current config as profile |
| `Ctrl+N` | New Job tab |
| `Ctrl+L` | Logs tab |
| `Ctrl+H` | History tab |
| `Escape` | Close modal |

---

## 📋 Example Commands Generated

RoboSync generates standard robocopy commands. Here are some examples:

**Simple folder copy with 8 threads:**
```
robocopy "C:\Users\Me\Documents" "D:\Backup\Documents" /E /MT:8 /R:1 /W:3 /ETA
```

**Mirror a network share (deletes extras in destination):**
```
robocopy "\\server\share\data" "D:\LocalMirror" /MIR /MT:16 /R:3 /W:5 /Z /ETA /LOG:"C:\Logs\mirror.log"
```

**Copy a single file:**
```
robocopy "C:\Users\Me\Downloads\Video" "D:\Backup\Video" "movie.mkv" /MT:8 /R:1 /W:3 /ETA
```

**Expert mode — custom flags merged with source/dest:**
```
robocopy "C:\Source" "D:\Dest" /E /MT:32 /COPY:DATSOU /DCOPY:DAT /XJ /FFT /NP /LOG+:"backup.log"
```

---

## 🔐 Security

RoboSync is built with security as a first-class concern:

- **Typed IPC Channels** — All inter-process communication uses compile-time verified channel constants from a shared module
- **No Shell Injection** — `child_process.spawn()` uses args array with `shell: false` — command strings are never evaluated by a shell
- **Path Sanitization** — Null byte rejection, MAX_PATH validation, and `\\?\` long path prefix support
- **UNC Path Support** — Network share paths (`\\server\share`) are fully supported
- **Process Isolation** — `contextIsolation: true`, `nodeIntegration: false`, `webSecurity: true`
- **No Node in Renderer** — Zero `require()`, `ipcRenderer`, or `electron-store` imports in the renderer process
- **Data Validation** — All persisted JSON data validated with Zod schemas on load — corrupted data is skipped, never crashes

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please ensure `npm run build` passes with zero errors before submitting.

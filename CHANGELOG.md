# Changelog

All notable changes to RoboSync will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-03-19

### Added
- Initial release of RoboSync
- Visual job builder with Basic, Advanced, and Expert modes
- Real-time log viewer with virtualization (handles 10,000+ lines)
- Live command preview with syntax highlighting and copy-to-clipboard
- Job profiles — save, load, and manage named backup configurations
- Smart suggestions panel with 9 contextual rules and one-click apply
- Progress tracking — percentage, files copied, transfer speed (MB/s), ETA
- System tray support with minimize-to-tray and double-click restore
- Job history with sortable entries and exit status badges
- Windows Task Scheduler integration (daily/weekly scheduling)
- Full robocopy flag coverage across all three modes
- Drag and drop folder/file support in path pickers
- File and folder source selection with split browse button
- Auto CPU thread detection for optimal /MT slider
- Keyboard shortcuts for all major actions (Ctrl+Enter, Ctrl+S, Ctrl+N, etc.)
- Dark mode VS Code-inspired UI with glassmorphism and micro-animations
- Toast notification system for all user actions
- NSIS installer and portable .exe build targets
- Zod schema validation for all persisted data
- Secure IPC architecture (contextIsolation, shell:false, typed channels)
- Single-instance lock to prevent multiple app windows
- Robocopy-not-found error state with PATH guidance
- GitHub Actions CI/CD pipeline for automated releases

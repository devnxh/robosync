import React from 'react'
import { Minus, Square, X, Zap } from 'lucide-react'

export const TitleBar: React.FC = () => {
  const handleMinimize = () => window.electronAPI.minimizeWindow()
  const handleMaximize = () => window.electronAPI.maximizeWindow()
  const handleClose = () => window.electronAPI.closeWindow()

  return (
    <div className="flex items-center h-9 bg-surface border-b border-border select-none shrink-0">
      {/* App icon */}
      <div className="flex items-center gap-2 px-3 no-drag">
        <Zap size={12} className="text-accent" />
        <span className="text-xs text-text-muted font-medium">RoboSync</span>
      </div>

      {/* Drag region */}
      <div className="flex-1 h-full drag-region" />

      {/* Window controls */}
      <div className="flex items-center h-full no-drag">
        <button
          onClick={handleMinimize}
          className="h-full w-11 flex items-center justify-center hover:bg-bg-hover text-text-muted transition-colors"
          aria-label="Minimize"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={handleMaximize}
          className="h-full w-11 flex items-center justify-center hover:bg-bg-hover text-text-muted transition-colors"
          aria-label="Maximize"
        >
          <Square size={11} />
        </button>
        <button
          onClick={handleClose}
          className="h-full w-11 flex items-center justify-center hover:bg-error text-text-muted hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

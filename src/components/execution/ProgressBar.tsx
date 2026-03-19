import React from 'react'
import { useAppStore } from '../../store/useAppStore'

export const ProgressBar: React.FC = () => {
  const { isRunning, progress } = useAppStore()

  return (
    <div className="flex flex-col gap-2">
      {/* Bar */}
      <div className="w-full h-2 bg-progress-bg rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isRunning ? 'progress-shimmer' : 'bg-accent'
          }`}
          style={{ width: `${Math.min(progress.percent, 100)}%` }}
        />
      </div>

      {/* Info below bar */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">
          <span className="text-text-primary font-medium">
            {progress.percent.toFixed(1)}%
          </span>
          {progress.currentFile && (
            <span className="ml-2 text-text-subtle">
              — {progress.currentFile}
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

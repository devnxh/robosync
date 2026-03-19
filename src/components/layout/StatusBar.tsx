import React from 'react'
import { useAppStore } from '../../store/useAppStore'

export const StatusBar: React.FC = () => {
  const { isRunning, progress, jobResult } = useAppStore()

  return (
    <div className="flex items-center justify-between h-6 px-3 bg-surface border-t border-border text-xs text-text-subtle shrink-0">
      <div className="flex items-center gap-3">
        <span>RoboSync v1.0.0</span>
        {isRunning && (
          <span className="flex items-center gap-1.5 text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            Running — {progress.percent.toFixed(0)}%
          </span>
        )}
        {jobResult && !isRunning && (
          <span
            className={`flex items-center gap-1.5 ${
              jobResult.success ? 'text-success' : 'text-error'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                jobResult.success ? 'bg-success' : 'bg-error'
              }`}
            />
            {jobResult.success ? 'Completed' : 'Failed'} — Exit {jobResult.exitCode}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span>Windows {navigator.platform}</span>
      </div>
    </div>
  )
}

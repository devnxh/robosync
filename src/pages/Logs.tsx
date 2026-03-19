import React from 'react'
import { LiveLogViewer } from '../components/execution/LiveLogViewer'

export const Logs: React.FC = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-bold text-text-primary">Live Logs</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Full-screen log output viewer — monitor your job in real-time
        </p>
      </div>

      {/* Full-height log viewer */}
      <div className="flex-1 overflow-hidden relative">
        <LiveLogViewer />
      </div>
    </div>
  )
}

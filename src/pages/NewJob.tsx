import React from 'react'
import { useAppStore } from '../store/useAppStore'
import { FolderPicker } from '../components/job/FolderPicker'
import { ModeSelector } from '../components/job/ModeSelector'
import { BasicOptions } from '../components/job/BasicOptions'
import { AdvancedOptions } from '../components/job/AdvancedOptions'
import { ExpertInput } from '../components/job/ExpertInput'
import { FilterPanel } from '../components/job/FilterPanel'
import { CommandPreview } from '../components/job/CommandPreview'
import { SmartSuggestions } from '../components/job/SmartSuggestions'
import { ProgressBar } from '../components/execution/ProgressBar'
import { StatsPanel } from '../components/execution/StatsPanel'
import { LiveLogViewer } from '../components/execution/LiveLogViewer'
import { JobControls } from '../components/execution/JobControls'
import { Badge } from '../components/shared/Badge'

export const NewJob: React.FC = () => {
  const { jobConfig, setJobConfig, isRunning, jobResult } = useAppStore()

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="max-w-3xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-text-primary">New Job</h1>
                <p className="text-sm text-text-muted mt-0.5">
                  Configure and run a robocopy operation
                </p>
              </div>
              <JobControls />
            </div>

            {/* Execution status area */}
            {(isRunning || jobResult) && (
              <div className="space-y-3 p-4 bg-surface border border-border rounded-xl">
                {jobResult && !isRunning && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={jobResult.success ? 'success' : 'error'}
                    >
                      Exit Code {jobResult.exitCode}
                    </Badge>
                    <span className="text-sm text-text-muted">
                      {jobResult.message}
                    </span>
                  </div>
                )}
                <ProgressBar />
                <StatsPanel />
                {isRunning && (
                  <div className="h-[200px] bg-base rounded-lg border border-border overflow-hidden">
                    <LiveLogViewer />
                  </div>
                )}
              </div>
            )}

            {/* Source & Destination */}
            <div className="space-y-3">
              <FolderPicker
                label="Source"
                value={jobConfig.source}
                onChange={(v) => setJobConfig({ source: v })}
                placeholder="Select source folder or file..."
                validateAs="source"
                showFileOption
              />
              <FolderPicker
                label="Destination"
                value={jobConfig.destination}
                onChange={(v) => setJobConfig({ destination: v })}
                placeholder="Select destination folder..."
                validateAs="destination"
              />
            </div>

            {/* Mode selector */}
            <ModeSelector
              value={jobConfig.uiMode}
              onChange={(mode) => setJobConfig({ uiMode: mode })}
            />

            {/* Mode-specific options */}
            <div className="transition-opacity duration-200">
              {jobConfig.uiMode === 'basic' && <BasicOptions />}
              {jobConfig.uiMode === 'advanced' && <AdvancedOptions />}
              {jobConfig.uiMode === 'expert' && <ExpertInput />}
            </div>

            {/* Filters */}
            <div className="border-t border-border pt-5">
              <FilterPanel />
            </div>

            {/* Command Preview */}
            <div className="border-t border-border pt-5">
              <CommandPreview />
            </div>
          </div>
        </div>
      </div>

      {/* Smart Suggestions sidebar */}
      <div className="w-[280px] shrink-0 border-l border-border bg-surface overflow-y-auto p-4
        scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <SmartSuggestions />
      </div>
    </div>
  )
}

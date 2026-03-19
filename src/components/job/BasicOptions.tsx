import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Toggle } from '../shared/Toggle'
import type { CopyMode } from '../../types/RobocopyJob'

const copyModes: { id: CopyMode; label: string; desc: string }[] = [
  { id: 'copy', label: 'Copy', desc: 'Copy files, preserving directory structure' },
  { id: 'mirror', label: 'Mirror', desc: 'Mirror — deletes files in dest not in source' },
  { id: 'move', label: 'Move All', desc: 'Move files and directories (deletes source)' },
  { id: 'moveFiles', label: 'Move Files', desc: 'Move files only (directories stay)' }
]

export const BasicOptions: React.FC = () => {
  const { jobConfig, setJobConfig } = useAppStore()
  const maxThreads = navigator.hardwareConcurrency || 8

  return (
    <div className="flex flex-col gap-5">
      {/* Copy Mode */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-text-muted font-medium">Copy Mode</label>
        <div className="grid grid-cols-2 gap-2">
          {copyModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setJobConfig({ copyMode: mode.id })}
              className={`flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-lg border text-left
                transition-all duration-150
                ${
                  jobConfig.copyMode === mode.id
                    ? 'border-accent bg-accent/5 text-text-primary'
                    : 'border-border bg-elevated hover:border-text-subtle text-text-muted'
                }`}
            >
              <span className="text-sm font-medium">{mode.label}</span>
              <span className="text-xs text-text-subtle">{mode.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Thread count */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-text-muted font-medium">
            Threads (/MT)
          </label>
          <span className="text-xs font-mono text-accent">{jobConfig.threads}</span>
        </div>
        <input
          type="range"
          min={1}
          max={maxThreads}
          value={jobConfig.threads}
          onChange={(e) => setJobConfig({ threads: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-sm
            [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-xs text-text-subtle">
          <span>1</span>
          <span>{maxThreads}</span>
        </div>
      </div>

      {/* Retry settings */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-muted font-medium">
            Retries (/R)
          </label>
          <input
            type="number"
            min={0}
            max={999}
            value={jobConfig.retryCount}
            onChange={(e) => setJobConfig({ retryCount: parseInt(e.target.value) || 0 })}
            className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm
              text-text-primary font-mono focus:border-border-focus focus:ring-2
              focus:ring-accent/20 outline-none transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-muted font-medium">
            Wait (sec) (/W)
          </label>
          <input
            type="number"
            min={0}
            max={999}
            value={jobConfig.retryWait}
            onChange={(e) => setJobConfig({ retryWait: parseInt(e.target.value) || 0 })}
            className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm
              text-text-primary font-mono focus:border-border-focus focus:ring-2
              focus:ring-accent/20 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Quick toggles */}
      <div className="flex flex-col gap-3">
        <Toggle
          checked={jobConfig.showEta}
          onChange={(v) => setJobConfig({ showEta: v })}
          label="Show ETA"
          description="Display estimated time remaining"
        />
        <Toggle
          checked={jobConfig.excludeJunctions}
          onChange={(v) => setJobConfig({ excludeJunctions: v })}
          label="Exclude Junctions"
          description="Skip NTFS junction points to avoid loops"
        />
      </div>
    </div>
  )
}

import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Toggle } from '../shared/Toggle'

export const AdvancedOptions: React.FC = () => {
  const { jobConfig, setJobConfig } = useAppStore()

  return (
    <div className="flex flex-col gap-5">
      {/* Transfer Options */}
      <div>
        <h4 className="text-xs text-text-subtle font-semibold uppercase tracking-wider mb-3">
          Transfer
        </h4>
        <div className="flex flex-col gap-3">
          <Toggle
            checked={jobConfig.restartable}
            onChange={(v) => setJobConfig({ restartable: v })}
            label="Restartable Mode (/Z)"
            description="Resume on interruption — slightly slower"
          />
          <Toggle
            checked={jobConfig.backupMode}
            onChange={(v) => setJobConfig({ backupMode: v })}
            label="Backup Mode (/B)"
            description="Use backup privileges (requires admin)"
          />
          <Toggle
            checked={jobConfig.unbufferedIO}
            onChange={(v) => setJobConfig({ unbufferedIO: v })}
            label="Unbuffered I/O (/J)"
            description="Copy without OS cache — best for large files"
          />

          {/* IPG */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-text-primary">Inter-Packet Gap (/IPG)</span>
              <p className="text-xs text-text-muted">Throttle bandwidth in ms</p>
            </div>
            <input
              type="number"
              min={0}
              max={10000}
              value={jobConfig.ipg}
              onChange={(e) => setJobConfig({ ipg: parseInt(e.target.value) || 0 })}
              className="w-20 bg-elevated border border-border rounded-lg px-2 py-1.5 text-sm
                text-text-primary font-mono text-center focus:border-border-focus
                focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Copy Flags */}
      <div>
        <h4 className="text-xs text-text-subtle font-semibold uppercase tracking-wider mb-3">
          File Copy Flags (/COPY)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {([
            ['data', 'Data (D)'],
            ['attributes', 'Attributes (A)'],
            ['timestamps', 'Timestamps (T)'],
            ['security', 'Security (S)'],
            ['owner', 'Owner (O)'],
            ['auditing', 'Auditing (U)']
          ] as const).map(([key, label]) => (
            <Toggle
              key={key}
              size="sm"
              checked={jobConfig.copyFlags[key]}
              onChange={(v) =>
                setJobConfig({
                  copyFlags: { ...jobConfig.copyFlags, [key]: v }
                })
              }
              label={label}
            />
          ))}
        </div>
      </div>

      {/* Dir Copy Flags */}
      <div>
        <h4 className="text-xs text-text-subtle font-semibold uppercase tracking-wider mb-3">
          Directory Copy Flags (/DCOPY)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {([
            ['data', 'Data (D)'],
            ['attributes', 'Attributes (A)'],
            ['timestamps', 'Timestamps (T)']
          ] as const).map(([key, label]) => (
            <Toggle
              key={key}
              size="sm"
              checked={jobConfig.dirCopyFlags[key]}
              onChange={(v) =>
                setJobConfig({
                  dirCopyFlags: { ...jobConfig.dirCopyFlags, [key]: v }
                })
              }
              label={label}
            />
          ))}
        </div>
      </div>

      {/* Exclude Options */}
      <div>
        <h4 className="text-xs text-text-subtle font-semibold uppercase tracking-wider mb-3">
          Exclusion Rules
        </h4>
        <div className="flex flex-col gap-2">
          <Toggle
            size="sm"
            checked={jobConfig.excludeNewer}
            onChange={(v) => setJobConfig({ excludeNewer: v })}
            label="Exclude Newer (/XN)"
          />
          <Toggle
            size="sm"
            checked={jobConfig.excludeOlder}
            onChange={(v) => setJobConfig({ excludeOlder: v })}
            label="Exclude Older (/XO)"
          />
          <Toggle
            size="sm"
            checked={jobConfig.excludeChanged}
            onChange={(v) => setJobConfig({ excludeChanged: v })}
            label="Exclude Changed (/XC)"
          />
          <Toggle
            size="sm"
            checked={jobConfig.excludeLonely}
            onChange={(v) => setJobConfig({ excludeLonely: v })}
            label="Exclude Lonely (/XL)"
          />
          <Toggle
            size="sm"
            checked={jobConfig.excludeJunctions}
            onChange={(v) => setJobConfig({ excludeJunctions: v })}
            label="Exclude Junctions (/XJ)"
          />
        </div>
      </div>

      {/* Time */}
      <div>
        <h4 className="text-xs text-text-subtle font-semibold uppercase tracking-wider mb-3">
          Time Handling
        </h4>
        <div className="flex flex-col gap-2">
          <Toggle
            size="sm"
            checked={jobConfig.fatTimes}
            onChange={(v) => setJobConfig({ fatTimes: v })}
            label="FAT Times (/FFT)"
            description="2-second timestamp granularity"
          />
          <Toggle
            size="sm"
            checked={jobConfig.compensateDst}
            onChange={(v) => setJobConfig({ compensateDst: v })}
            label="Compensate DST (/DST)"
            description="Account for daylight saving time"
          />
        </div>
      </div>

      {/* Logging */}
      <div>
        <h4 className="text-xs text-text-subtle font-semibold uppercase tracking-wider mb-3">
          Logging
        </h4>
        <div className="flex flex-col gap-3">
          <Toggle
            size="sm"
            checked={jobConfig.verbose}
            onChange={(v) => setJobConfig({ verbose: v })}
            label="Verbose (/V)"
          />
          <Toggle
            size="sm"
            checked={jobConfig.showEta}
            onChange={(v) => setJobConfig({ showEta: v })}
            label="Show ETA (/ETA)"
          />
          <Toggle
            size="sm"
            checked={jobConfig.noProgress}
            onChange={(v) => setJobConfig({ noProgress: v })}
            label="No Progress (/NP)"
          />
          <Toggle
            size="sm"
            checked={jobConfig.noJobHeader}
            onChange={(v) => setJobConfig({ noJobHeader: v })}
            label="No Job Header (/NJH)"
          />
          <Toggle
            size="sm"
            checked={jobConfig.noJobSummary}
            onChange={(v) => setJobConfig({ noJobSummary: v })}
            label="No Job Summary (/NJS)"
          />

          {/* Log file */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted font-medium">
              Log File Path (/LOG)
            </label>
            <input
              type="text"
              value={jobConfig.logFile}
              onChange={(e) => setJobConfig({ logFile: e.target.value })}
              placeholder="e.g. C:\Logs\backup.log"
              className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm
                text-text-primary font-mono placeholder:text-text-subtle
                focus:border-border-focus focus:ring-2 focus:ring-accent/20 outline-none"
            />
            {jobConfig.logFile && (
              <Toggle
                size="sm"
                checked={jobConfig.appendLog}
                onChange={(v) => setJobConfig({ appendLog: v })}
                label="Append to log (/LOG+)"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

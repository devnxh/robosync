import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export const ExpertInput: React.FC = () => {
  const { jobConfig, setJobConfig } = useAppStore()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs text-text-muted font-medium">
          Custom Flags (Expert Mode)
        </label>
      </div>

      <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-warning/5 border border-warning/20">
        <AlertTriangle size={14} className="text-warning mt-0.5 shrink-0" />
        <p className="text-xs text-warning/80">
          Expert mode: flags are appended as-is to the command. Ensure compatibility
          with other selected options. Invalid flags may cause robocopy to fail.
        </p>
      </div>

      <textarea
        value={jobConfig.expertFlags}
        onChange={(e) => setJobConfig({ expertFlags: e.target.value })}
        placeholder="/MAXAGE:30 /MINAGE:1 /MAXSIZE:104857600"
        rows={3}
        className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm
          text-text-primary font-mono placeholder:text-text-subtle resize-none
          focus:border-border-focus focus:ring-2 focus:ring-accent/20 outline-none"
      />

      <p className="text-xs text-text-subtle">
        Separate flags with spaces. Example: /MAXAGE:30 /MIN:1048576
      </p>
    </div>
  )
}

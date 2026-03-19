import React from 'react'
import { Files, HardDrive, Clock, Gauge } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { formatBytes, formatSpeed, formatDuration } from '../../utils/formatters'

export const StatsPanel: React.FC = () => {
  const { stats, progress, isRunning, jobResult } = useAppStore()

  // Use live progress data when running, fall back to final stats when done
  const filesValue = (() => {
    if (isRunning && progress.filesTransferred > 0) {
      return `${progress.filesTransferred} copied`
    }
    if (stats) return `${stats.files.copied}/${stats.files.total}`
    if (jobResult) return 'Done'
    return '—'
  })()

  const bytesValue = (() => {
    if (isRunning && progress.bytesTransferred > 0) {
      return formatBytes(progress.bytesTransferred)
    }
    if (stats) return formatBytes(stats.bytes.copied)
    return '—'
  })()

  const speedValue = (() => {
    // Show live speed while running
    if (isRunning && progress.speed > 0) {
      return formatSpeed(progress.speed)
    }
    // Show final speed from summary
    if (stats && stats.speed > 0) return formatSpeed(stats.speed)
    return '—'
  })()

  const etaValue = (() => {
    // Show live ETA while running
    if (isRunning && progress.eta) return progress.eta
    if (stats?.eta) return stats.eta
    if (jobResult) return formatDuration(jobResult.duration)
    return '—'
  })()

  return (
    <div className="grid grid-cols-4 gap-3">
      <StatCard
        icon={<Files size={14} />}
        label="Files"
        value={filesValue}
      />
      <StatCard
        icon={<HardDrive size={14} />}
        label="Transferred"
        value={bytesValue}
      />
      <StatCard
        icon={<Gauge size={14} />}
        label="Speed"
        value={speedValue}
        highlight={isRunning && progress.speed > 0}
      />
      <StatCard
        icon={<Clock size={14} />}
        label={isRunning ? 'ETA' : 'Duration'}
        value={etaValue}
      />
    </div>
  )
}

const StatCard: React.FC<{
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}> = ({ icon, label, value, highlight }) => (
  <div className={`flex items-center gap-2.5 px-3 py-2.5 bg-elevated border rounded-lg
    ${highlight ? 'border-accent/30' : 'border-border'}`}>
    <div className={highlight ? 'text-accent' : 'text-text-subtle'}>{icon}</div>
    <div className="flex flex-col min-w-0">
      <span className="text-xs text-text-subtle">{label}</span>
      <span className={`text-sm font-medium truncate
        ${highlight ? 'text-accent' : 'text-text-primary'}`}>
        {value}
      </span>
    </div>
  </div>
)

import React from 'react'
import { Clock, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { useJobHistory } from '../hooks/useJobHistory'
import { EmptyState } from '../components/shared/EmptyState'
import { Badge } from '../components/shared/Badge'
import { Button } from '../components/shared/Button'
import { formatRelativeTime, formatDuration, truncatePath } from '../utils/formatters'

export const RunHistory: React.FC = () => {
  const { history, clearHistory } = useJobHistory()

  const sortedHistory = [...history].reverse() // Latest first

  const getStatusBadge = (exitCode: number) => {
    if (exitCode >= 8) return <Badge variant="error">Error</Badge>
    if (exitCode >= 4) return <Badge variant="warning">Warning</Badge>
    return <Badge variant="success">Success</Badge>
  }

  const getStatusIcon = (exitCode: number) => {
    if (exitCode >= 8) return <XCircle size={14} className="text-error" />
    if (exitCode >= 4) return <AlertTriangle size={14} className="text-warning" />
    return <CheckCircle size={14} className="text-success" />
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Run History</h1>
            <p className="text-sm text-text-muted mt-0.5">
              View past job executions and their results
            </p>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 size={13} />}
              onClick={() => {
                if (confirm('Clear all history? This cannot be undone.')) {
                  clearHistory()
                }
              }}
            >
              Clear All
            </Button>
          )}
        </div>

        {sortedHistory.length === 0 ? (
          <EmptyState
            icon={<Clock size={40} />}
            title="No History"
            description="Job execution history will appear here after running your first job."
          />
        ) : (
          <div className="space-y-2">
            {sortedHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 px-4 py-3 bg-elevated border border-border
                  rounded-xl hover:border-text-subtle transition-colors"
              >
                {getStatusIcon(entry.exitCode)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary truncate">
                      {truncatePath(entry.source, 30)} → {truncatePath(entry.destination, 30)}
                    </span>
                    {getStatusBadge(entry.exitCode)}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                    <span>{formatRelativeTime(entry.startedAt)}</span>
                    <span>Duration: {formatDuration(entry.duration)}</span>
                    <span>Exit: {entry.exitCode}</span>
                  </div>
                </div>

                <div className="text-right text-xs text-text-subtle shrink-0">
                  <p>{entry.exitMessage}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

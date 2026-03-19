import React, { useState } from 'react'
import { Lightbulb, AlertTriangle, Info, Zap, Check } from 'lucide-react'
import { useSmartSuggestions } from '../../hooks/useSmartSuggestions'
import { useAppStore } from '../../store/useAppStore'

export const SmartSuggestions: React.FC = () => {
  const jobConfig = useAppStore((s) => s.jobConfig)
  const setJobConfig = useAppStore((s) => s.setJobConfig)
  const suggestions = useSmartSuggestions(jobConfig)
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())

  const handleApply = (id: string, applyFn: (config: typeof jobConfig) => Partial<typeof jobConfig>) => {
    const patch = applyFn(jobConfig)
    setJobConfig(patch)
    setAppliedIds((prev) => new Set(prev).add(id))
  }

  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Lightbulb size={20} className="text-text-subtle mb-2" />
        <p className="text-xs text-text-subtle">
          Smart suggestions will appear here based on your configuration
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <Lightbulb size={14} className="text-warning" />
        <h4 className="text-xs text-text-muted font-semibold uppercase tracking-wider">
          Suggestions
        </h4>
      </div>

      {suggestions.map((suggestion) => {
        const isApplied = appliedIds.has(suggestion.id)

        return (
          <div
            key={suggestion.id}
            className={`flex flex-col gap-2 px-3 py-2.5 rounded-lg border text-sm
              ${
                suggestion.severity === 'warning'
                  ? 'bg-warning/5 border-warning/20'
                  : suggestion.severity === 'tip'
                    ? 'bg-accent/5 border-accent/20'
                    : 'bg-elevated border-border'
              }`}
          >
            <div className="flex items-start gap-2">
              {suggestion.severity === 'warning' ? (
                <AlertTriangle size={13} className="text-warning mt-0.5 shrink-0" />
              ) : suggestion.severity === 'tip' ? (
                <Zap size={13} className="text-accent mt-0.5 shrink-0" />
              ) : (
                <Info size={13} className="text-text-muted mt-0.5 shrink-0" />
              )}
              <p className="text-xs text-text-muted leading-relaxed">
                {suggestion.message}
              </p>
            </div>

            {suggestion.applyFn && (
              <button
                onClick={() => handleApply(suggestion.id, suggestion.applyFn!)}
                disabled={isApplied}
                className={`self-end px-2.5 py-1 text-xs font-medium rounded-md transition-colors
                  ${
                    isApplied
                      ? 'bg-success/10 text-success cursor-default'
                      : 'bg-accent/10 text-accent hover:bg-accent/20'
                  }`}
              >
                {isApplied ? (
                  <span className="flex items-center gap-1">
                    <Check size={11} />
                    Applied
                  </span>
                ) : (
                  'Apply'
                )}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

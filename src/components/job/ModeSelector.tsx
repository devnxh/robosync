import React from 'react'
import type { UIMode } from '../../types/RobocopyJob'

interface ModeSelectorProps {
  value: UIMode
  onChange: (mode: UIMode) => void
}

const modes: { id: UIMode; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'expert', label: 'Expert' }
]

export const ModeSelector: React.FC<ModeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-elevated rounded-lg border border-border">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            ${
              value === mode.id
                ? 'bg-accent text-white shadow-sm shadow-accent/20'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
            }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}

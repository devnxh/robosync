import React from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md'
}) => {
  const trackSize = size === 'sm' ? 'w-8 h-4' : 'w-10 h-5'
  const dotSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const translateX = size === 'sm' ? 'translate-x-4' : 'translate-x-5'

  return (
    <label
      className={`flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex shrink-0 ${trackSize} items-center rounded-full transition-colors duration-200
          ${checked ? 'bg-accent' : 'bg-border'}`}
      >
        <span
          className={`inline-block ${dotSize} transform rounded-full bg-white shadow-sm transition-transform duration-200
            ${checked ? translateX : 'translate-x-0.5'}`}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm text-text-primary">{label}</span>
          )}
          {description && (
            <span className="text-xs text-text-muted">{description}</span>
          )}
        </div>
      )}
    </label>
  )
}

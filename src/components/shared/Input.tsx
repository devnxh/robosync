import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  mono?: boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  mono,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs text-text-muted font-medium">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary
            placeholder:text-text-subtle
            hover:border-text-subtle
            focus:border-border-focus focus:ring-2 focus:ring-accent/20
            transition-colors duration-150
            ${icon ? 'pl-9' : ''}
            ${mono ? 'font-mono' : ''}
            ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}

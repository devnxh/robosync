import React, { useMemo, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useCommandBuilder } from '../../hooks/useCommandBuilder'

export const CommandPreview: React.FC = () => {
  const jobConfig = useAppStore((s) => s.jobConfig)
  const commandString = useCommandBuilder(jobConfig)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commandString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select all
    }
  }

  const highlightedParts = useMemo(() => {
    return highlightCommand(commandString)
  }, [commandString])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-text-muted font-medium">
          Generated Command
        </label>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md
            hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors"
        >
          {copied ? (
            <>
              <Check size={12} className="text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="relative bg-[#080810] border-l-2 border-accent rounded-lg px-4 py-3 overflow-x-auto">
        <code className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-all">
          {highlightedParts}
        </code>
      </div>
    </div>
  )
}

function highlightCommand(cmd: string): React.ReactNode[] {
  if (!cmd) return [<span key="empty" className="text-text-subtle">Configure source and destination to preview command</span>]

  const parts: React.ReactNode[] = []
  const tokens = cmd.split(/(\s+)/)
  let idx = 0

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      parts.push(<span key={idx++}>{token}</span>)
      continue
    }

    if (token.toLowerCase() === 'robocopy') {
      parts.push(
        <span key={idx++} className="cmd-exe">
          {token}
        </span>
      )
    } else if (token.startsWith('/')) {
      // Flag with value
      const colonIdx = token.indexOf(':')
      if (colonIdx > 0) {
        parts.push(
          <span key={idx++}>
            <span className="cmd-flag">{token.slice(0, colonIdx + 1)}</span>
            <span className="cmd-value">{token.slice(colonIdx + 1)}</span>
          </span>
        )
      } else {
        parts.push(
          <span key={idx++} className="cmd-flag">
            {token}
          </span>
        )
      }
    } else if (token.startsWith('"') || /^[A-Za-z]:\\/.test(token) || token.startsWith('\\\\')) {
      parts.push(
        <span key={idx++} className="cmd-path">
          {token}
        </span>
      )
    } else {
      parts.push(<span key={idx++}>{token}</span>)
    }
  }

  return parts
}

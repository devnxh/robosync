import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ArrowDown, Trash2, Download, ToggleLeft, ToggleRight } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { getLogDotColor } from '../../utils/logHighlighter'

export const LiveLogViewer: React.FC = () => {
  const { logLines, clearLogs } = useAppStore()
  const parentRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const [newLinesCount, setNewLinesCount] = useState(0)
  const lastCountRef = useRef(0)

  const virtualizer = useVirtualizer({
    count: logLines.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 24,
    overscan: 20,
  })

  // Auto-scroll when new lines arrive
  useEffect(() => {
    if (autoScroll && logLines.length > 0) {
      virtualizer.scrollToIndex(logLines.length - 1, { behavior: 'auto' })
      lastCountRef.current = logLines.length
      setNewLinesCount(0)
    } else if (!autoScroll && logLines.length > lastCountRef.current) {
      setNewLinesCount(logLines.length - lastCountRef.current)
    }
  }, [logLines.length, autoScroll, virtualizer])

  const handleScroll = useCallback(() => {
    if (!parentRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = parentRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40
    if (isAtBottom && !autoScroll) {
      setAutoScroll(true)
      setNewLinesCount(0)
      lastCountRef.current = logLines.length
    }
  }, [autoScroll, logLines.length])

  const scrollToBottom = () => {
    virtualizer.scrollToIndex(logLines.length - 1, { behavior: 'auto' })
    setAutoScroll(true)
    setNewLinesCount(0)
    lastCountRef.current = logLines.length
  }

  const handleExport = async () => {
    const lines = logLines.map((l) => `[${l.timestamp}] ${l.raw}`)
    try {
      await window.electronAPI.saveLogFile(lines)
    } catch {
      // Fallback: browser download
      const text = lines.join('\n')
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `robosync-log-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Virtualized log content */}
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto font-mono text-xs p-3
          scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        {logLines.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-subtle">
            Log output will appear here when a job is running...
          </div>
        ) : (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const line = logLines[virtualItem.index]
              if (!line) return null
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="flex items-center gap-2 px-1 hover:bg-bg-hover/50"
                >
                  <span className="text-text-subtle shrink-0 w-[72px]">
                    {formatTimestamp(line.timestamp)}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${getLogDotColor(
                      line.type
                    )}`}
                  />
                  <span className={`truncate log-${line.type}`}>
                    {line.raw}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New lines indicator */}
      {!autoScroll && newLinesCount > 0 && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5
            px-3 py-1.5 rounded-full bg-accent text-white text-xs font-medium shadow-lg
            hover:bg-accent-hover transition-colors z-10"
        >
          <ArrowDown size={12} />
          ↓ Resume auto-scroll ({newLinesCount} new lines)
        </button>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-surface shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAutoScroll(!autoScroll)
              if (!autoScroll) {
                lastCountRef.current = logLines.length
                setNewLinesCount(0)
              }
            }}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            {autoScroll ? (
              <ToggleRight size={16} className="text-accent" />
            ) : (
              <ToggleLeft size={16} />
            )}
            Auto-scroll
          </button>

          <span className="text-xs text-text-subtle">
            {logLines.length.toLocaleString()} lines
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleExport}
            disabled={logLines.length === 0}
            className="p-1.5 rounded-md hover:bg-bg-hover text-text-muted hover:text-text-primary
              transition-colors disabled:opacity-40"
            title="Export log"
          >
            <Download size={13} />
          </button>
          <button
            onClick={clearLogs}
            disabled={logLines.length === 0}
            className="p-1.5 rounded-md hover:bg-bg-hover text-text-muted hover:text-text-primary
              transition-colors disabled:opacity-40"
            title="Clear log"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function formatTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch {
    return ts.slice(11, 19)
  }
}

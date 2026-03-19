import React, { useState, useCallback, useRef } from 'react'
import { Folder, File, X, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'

interface FolderPickerProps {
  label: string
  value: string
  onChange: (path: string) => void
  placeholder?: string
  validateAs?: 'source' | 'destination'
  showFileOption?: boolean
}

interface ValidationState {
  valid?: boolean
  message?: string
}

export const FolderPicker: React.FC<FolderPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select a folder...',
  validateAs,
  showFileOption = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [validation, setValidation] = useState<ValidationState>({})
  const [showMenu, setShowMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validatePathAsync = useCallback(
    async (path: string) => {
      if (!path.trim()) {
        setValidation({})
        return
      }

      try {
        const result = (await window.electronAPI.validatePath(path)) as {
          valid: boolean
          writable?: boolean
          error?: string
        }
        if (result.valid) {
          if (validateAs === 'destination' && !result.writable) {
            setValidation({ valid: false, message: 'Destination is not writable' })
          } else {
            setValidation({ valid: true, message: 'Path is valid' })
          }
        } else {
          setValidation({ valid: false, message: result.error || 'Invalid path' })
        }
      } catch {
        setValidation({ valid: false, message: 'Could not validate path' })
      }
    },
    [validateAs]
  )

  const handleBrowseFolder = async () => {
    setShowMenu(false)
    const path = await window.electronAPI.openFolderDialog()
    if (path) {
      onChange(path)
      validatePathAsync(path)
    }
  }

  const handleBrowseFile = async () => {
    setShowMenu(false)
    const paths = await window.electronAPI.openFileDialog()
    if (paths && paths.length > 0) {
      onChange(paths[0])
      validatePathAsync(paths[0])
    }
  }

  const handleBrowseClick = () => {
    if (showFileOption) {
      setShowMenu(!showMenu)
    } else {
      // No file option — just open folder dialog directly
      handleBrowseFolder()
    }
  }

  const handleClear = () => {
    onChange('')
    setValidation({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleInputBlur = () => {
    if (value.trim()) {
      validatePathAsync(value)
    }
    // Delay closing menu so button clicks register
    setTimeout(() => setShowMenu(false), 200)
  }

  // Drag & drop (Electron-compatible)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const droppedPath = (files[0] as File & { path?: string }).path
    if (droppedPath) {
      onChange(droppedPath)
      validatePathAsync(droppedPath)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-text-muted font-medium">{label}</label>

      <div
        className={`relative flex items-center gap-2 bg-elevated border rounded-lg px-3 py-2
          transition-colors duration-150
          ${isDragOver ? 'border-accent border-dashed bg-accent/[0.04]' : 'border-border hover:border-text-subtle'}
          ${validation.valid === false ? 'border-error' : ''}
          ${validation.valid === true ? 'border-success/40' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drop zone overlay */}
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg pointer-events-none z-10">
            <span className="text-xs font-medium text-accent">Drop here</span>
          </div>
        )}

        <Folder size={14} className="text-text-subtle shrink-0" />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-text-primary placeholder:text-text-subtle"
        />

        {value && (
          <button
            onClick={handleClear}
            className="p-0.5 rounded hover:bg-bg-hover text-text-subtle hover:text-text-muted transition-colors"
          >
            <X size={12} />
          </button>
        )}

        {/* Browse button — split dropdown only if showFileOption */}
        <div className="relative shrink-0">
          <button
            onClick={handleBrowseClick}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-bg-hover hover:bg-border rounded-md
              text-text-muted hover:text-text-primary transition-colors"
          >
            Browse
            {showFileOption && <ChevronDown size={11} />}
          </button>

          {/* Dropdown menu — only for source */}
          {showMenu && showFileOption && (
            <div
              className="absolute right-0 top-[calc(100%+4px)] z-30 w-44 bg-surface border border-border
                rounded-lg shadow-2xl shadow-black/40 overflow-hidden animate-in"
            >
              <button
                onClick={handleBrowseFolder}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs text-text-primary
                  hover:bg-bg-hover transition-colors text-left"
              >
                <Folder size={13} className="text-accent shrink-0" />
                <div>
                  <div className="font-medium">Select Folder</div>
                  <div className="text-text-subtle mt-0.5">Copy entire directory</div>
                </div>
              </button>
              <div className="border-t border-border" />
              <button
                onClick={handleBrowseFile}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs text-text-primary
                  hover:bg-bg-hover transition-colors text-left"
              >
                <File size={13} className="text-success shrink-0" />
                <div>
                  <div className="font-medium">Select File(s)</div>
                  <div className="text-text-subtle mt-0.5">Transfer specific files</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Validation status */}
      {validation.message && (
        <div
          className={`flex items-center gap-1.5 text-xs ${
            validation.valid ? 'text-success' : 'text-error'
          }`}
        >
          {validation.valid ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          <span>{validation.message}</span>
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { Plus, X, FileX, FolderX } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export const FilterPanel: React.FC = () => {
  const { jobConfig, setJobConfig } = useAppStore()
  const [newExcludeFile, setNewExcludeFile] = useState('')
  const [newExcludeDir, setNewExcludeDir] = useState('')
  const [newIncludeFile, setNewIncludeFile] = useState('')

  const addFilter = (
    type: 'excludeFiles' | 'excludeDirs' | 'includeFiles',
    value: string,
    setter: (v: string) => void
  ) => {
    const trimmed = value.trim()
    if (!trimmed) return
    const current = jobConfig[type]
    if (!current.includes(trimmed)) {
      setJobConfig({ [type]: [...current, trimmed] })
    }
    setter('')
  }

  const removeFilter = (
    type: 'excludeFiles' | 'excludeDirs' | 'includeFiles',
    index: number
  ) => {
    const current = [...jobConfig[type]]
    current.splice(index, 1)
    setJobConfig({ [type]: current })
  }

  const handleKeyDown = (
    e: React.KeyboardEvent,
    type: 'excludeFiles' | 'excludeDirs' | 'includeFiles',
    value: string,
    setter: (v: string) => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFilter(type, value, setter)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Include Files */}
      <FilterSection
        label="Include Files (/IF)"
        icon={<Plus size={13} />}
        items={jobConfig.includeFiles}
        inputValue={newIncludeFile}
        onInputChange={setNewIncludeFile}
        onAdd={() => addFilter('includeFiles', newIncludeFile, setNewIncludeFile)}
        onRemove={(i) => removeFilter('includeFiles', i)}
        onKeyDown={(e) =>
          handleKeyDown(e, 'includeFiles', newIncludeFile, setNewIncludeFile)
        }
        placeholder="*.txt, *.docx"
      />

      {/* Exclude Files */}
      <FilterSection
        label="Exclude Files (/XF)"
        icon={<FileX size={13} />}
        items={jobConfig.excludeFiles}
        inputValue={newExcludeFile}
        onInputChange={setNewExcludeFile}
        onAdd={() => addFilter('excludeFiles', newExcludeFile, setNewExcludeFile)}
        onRemove={(i) => removeFilter('excludeFiles', i)}
        onKeyDown={(e) =>
          handleKeyDown(e, 'excludeFiles', newExcludeFile, setNewExcludeFile)
        }
        placeholder="*.tmp, *.bak, Thumbs.db"
      />

      {/* Exclude Directories */}
      <FilterSection
        label="Exclude Directories (/XD)"
        icon={<FolderX size={13} />}
        items={jobConfig.excludeDirs}
        inputValue={newExcludeDir}
        onInputChange={setNewExcludeDir}
        onAdd={() => addFilter('excludeDirs', newExcludeDir, setNewExcludeDir)}
        onRemove={(i) => removeFilter('excludeDirs', i)}
        onKeyDown={(e) =>
          handleKeyDown(e, 'excludeDirs', newExcludeDir, setNewExcludeDir)
        }
        placeholder="node_modules, .git, __pycache__"
      />
    </div>
  )
}

interface FilterSectionProps {
  label: string
  icon: React.ReactNode
  items: string[]
  inputValue: string
  onInputChange: (v: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder: string
}

const FilterSection: React.FC<FilterSectionProps> = ({
  label,
  icon,
  items,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  onKeyDown,
  placeholder
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-text-muted font-medium flex items-center gap-1.5">
      {icon}
      {label}
    </label>

    <div className="flex items-center gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-elevated border border-border rounded-lg px-3 py-1.5 text-sm
          text-text-primary font-mono placeholder:text-text-subtle
          focus:border-border-focus focus:ring-2 focus:ring-accent/20 outline-none"
      />
      <button
        onClick={onAdd}
        disabled={!inputValue.trim()}
        className="p-1.5 rounded-md bg-elevated border border-border hover:bg-bg-hover
          text-text-muted hover:text-text-primary transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus size={14} />
      </button>
    </div>

    {items.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono
              bg-elevated border border-border rounded-md text-text-muted"
          >
            {item}
            <button
              onClick={() => onRemove(index)}
              className="p-0.5 rounded hover:bg-bg-hover hover:text-text-primary transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
    )}
  </div>
)

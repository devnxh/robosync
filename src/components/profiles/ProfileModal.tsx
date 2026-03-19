import React, { useState } from 'react'
import { Modal } from '../shared/Modal'
import { Button } from '../shared/Button'

interface ProfileModalProps {
  open: boolean
  onClose: () => void
  onSave: (name: string, icon: string) => void
  initialName?: string
  initialIcon?: string
}

const emojiOptions = ['📁', '🗂️', '💼', '🔄', '⚡', '🛡️', '📦', '🖥️', '🌐', '🏠', '📸', '🎵']

export const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onClose,
  onSave,
  initialName = '',
  initialIcon = '📁'
}) => {
  const [name, setName] = useState(initialName)
  const [icon, setIcon] = useState(initialIcon)

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), icon)
      setName('')
      setIcon('📁')
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save Profile"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
            Save Profile
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Profile name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-muted font-medium">Profile Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="e.g. Daily Backup, Project Sync..."
            autoFocus
            className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm
              text-text-primary placeholder:text-text-subtle
              focus:border-border-focus focus:ring-2 focus:ring-accent/20 outline-none"
          />
        </div>

        {/* Icon picker */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-muted font-medium">Icon</label>
          <div className="flex flex-wrap gap-2">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setIcon(emoji)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg
                  transition-all duration-150 border
                  ${
                    icon === emoji
                      ? 'border-accent bg-accent/10 scale-110'
                      : 'border-border bg-elevated hover:border-text-subtle'
                  }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

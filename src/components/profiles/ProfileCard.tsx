import React from 'react'
import { Play, Pencil, Trash2, ArrowRight } from 'lucide-react'
import type { Profile } from '../../types/RobocopyJob'
import { truncatePath, formatRelativeTime } from '../../utils/formatters'

interface ProfileCardProps {
  profile: Profile
  onRun: (p: Profile) => void
  onEdit: (p: Profile) => void
  onDelete: (id: string) => void
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onRun,
  onEdit,
  onDelete
}) => {
  return (
    <div className="group relative flex flex-col gap-3 p-4 bg-elevated border border-border rounded-xl
      hover:border-text-subtle transition-all duration-200 cursor-default">
      {/* Icon + Name */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{profile.icon || '📁'}</span>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-semibold text-text-primary truncate">
            {profile.name}
          </span>
          <span className="text-xs text-text-subtle">
            {formatRelativeTime(profile.updatedAt)}
          </span>
        </div>
      </div>

      {/* Source → Destination */}
      <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
        <span className="truncate max-w-[120px]" title={profile.config.source}>
          {truncatePath(profile.config.source, 25)}
        </span>
        <ArrowRight size={10} className="shrink-0 text-text-subtle" />
        <span className="truncate max-w-[120px]" title={profile.config.destination}>
          {truncatePath(profile.config.destination, 25)}
        </span>
      </div>

      {/* Hover actions */}
      <div className="absolute top-2 right-2 flex items-center gap-1
        opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onRun(profile)}
          className="p-1.5 rounded-md bg-accent/10 hover:bg-accent/20 text-accent transition-colors"
          title="Run Now"
        >
          <Play size={12} />
        </button>
        <button
          onClick={() => onEdit(profile)}
          className="p-1.5 rounded-md hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors"
          title="Edit"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={() => onDelete(profile.id)}
          className="p-1.5 rounded-md hover:bg-error/10 text-text-muted hover:text-error transition-colors"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

export const NewProfileCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed
      border-border rounded-xl hover:border-text-subtle hover:bg-bg-hover/50
      transition-all duration-200 min-h-[120px]"
  >
    <span className="text-2xl text-text-subtle">+</span>
    <span className="text-xs text-text-muted font-medium">Save Current Job</span>
  </button>
)

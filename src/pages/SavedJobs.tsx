import React, { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { useProfiles } from '../hooks/useProfiles'
import { useAppStore } from '../store/useAppStore'
import { ProfileCard, NewProfileCard } from '../components/profiles/ProfileCard'
import { ProfileModal } from '../components/profiles/ProfileModal'
import { EmptyState } from '../components/shared/EmptyState'
import type { Profile } from '../types/RobocopyJob'

export const SavedJobs: React.FC = () => {
  const { profiles, saveProfile, deleteProfile, loadProfile } = useProfiles()
  const setActiveTab = useAppStore((s) => s.setActiveTab)
  const [showModal, setShowModal] = useState(false)

  const handleRun = (profile: Profile) => {
    loadProfile(profile)
    setActiveTab('newjob')
  }

  const handleEdit = (profile: Profile) => {
    loadProfile(profile)
    setActiveTab('newjob')
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this profile? This cannot be undone.')) {
      deleteProfile(id)
    }
  }

  const handleSave = (name: string, icon: string) => {
    saveProfile(name, icon)
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-text-primary">Saved Jobs</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Manage your saved job profiles for quick re-use
          </p>
        </div>

        {profiles.length === 0 ? (
          <EmptyState
            icon={<Bookmark size={40} />}
            title="No Saved Profiles"
            description="Configure a job on the New Job page and save it as a profile for quick access."
            action={
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium
                  hover:bg-accent-hover transition-colors"
              >
                Save Current Job
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onRun={handleRun}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            <NewProfileCard onClick={() => setShowModal(true)} />
          </div>
        )}
      </div>

      <ProfileModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  )
}

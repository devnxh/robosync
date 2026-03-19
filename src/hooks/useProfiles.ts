import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

/**
 * Hook for profile CRUD operations. Loads profiles on mount.
 */
export function useProfiles() {
  const {
    profiles,
    loadProfiles,
    saveProfile,
    deleteProfile,
    loadProfile
  } = useAppStore()

  useEffect(() => {
    loadProfiles()
  }, [loadProfiles])

  return { profiles, loadProfiles, saveProfile, deleteProfile, loadProfile }
}

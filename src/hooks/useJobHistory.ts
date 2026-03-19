import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

/**
 * Hook for job history operations. Loads history on mount.
 */
export function useJobHistory() {
  const { history, loadHistory, clearHistory } = useAppStore()

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return { history, loadHistory, clearHistory }
}

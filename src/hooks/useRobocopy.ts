import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

/**
 * Sets up IPC event listeners for job execution events.
 * Must be called once (e.g., in App.tsx) to wire up the main → renderer event stream.
 */
export function useRobocopy(): void {
  const addLogLine = useAppStore((s) => s.addLogLine)
  const setProgress = useAppStore((s) => s.setProgress)
  const setJobResult = useAppStore((s) => s.setJobResult)
  const setJobError = useAppStore((s) => s.setJobError)

  useEffect(() => {
    const unsubOutput = window.electronAPI.onJobOutput((line) => {
      addLogLine(line)
    })

    const unsubProgress = window.electronAPI.onJobProgress((progress) => {
      setProgress(progress)
    })

    const unsubComplete = window.electronAPI.onJobComplete((result) => {
      setJobResult(result)
    })

    const unsubError = window.electronAPI.onJobError((err) => {
      setJobError(err)
    })

    return () => {
      unsubOutput()
      unsubProgress()
      unsubComplete()
      unsubError()
    }
  }, [addLogLine, setProgress, setJobResult, setJobError])
}

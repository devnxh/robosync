import { useState, useCallback } from 'react'

/**
 * Hook for Task Scheduler create/delete/list via IPC.
 */
export function useScheduler() {
  const [tasks, setTasks] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const listTasks = useCallback(async () => {
    setLoading(true)
    try {
      const result = await window.electronAPI.listTasks()
      setTasks(result)
    } catch {
      setTasks([])
    }
    setLoading(false)
  }, [])

  const createTask = useCallback(
    async (opts: { taskName: string; command: string; scheduleType: 'daily' | 'weekly' | 'once'; time: string; days?: number[] }) => {
      await window.electronAPI.createTask(opts)
      await listTasks()
    },
    [listTasks]
  )

  const deleteTask = useCallback(
    async (name: string) => {
      await window.electronAPI.deleteTask(name)
      await listTasks()
    },
    [listTasks]
  )

  return { tasks, loading, listTasks, createTask, deleteTask }
}

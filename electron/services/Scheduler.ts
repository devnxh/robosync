import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface ScheduleOptions {
  taskName: string
  command: string
  scheduleType: 'daily' | 'weekly' | 'once'
  time: string
  days?: number[]
}

const TASK_PREFIX = 'RoboSync_'

/**
 * Windows Task Scheduler integration using schtasks.exe
 * (Using schtasks instead of node-windows for simpler, dependency-free implementation)
 */
export class Scheduler {
  async createTask(options: ScheduleOptions): Promise<void> {
    const taskName = `${TASK_PREFIX}${options.taskName}`
    const args: string[] = [
      'schtasks',
      '/Create',
      '/TN', `"${taskName}"`,
      '/TR', `"${options.command}"`,
      '/F' // Force overwrite
    ]

    switch (options.scheduleType) {
      case 'daily':
        args.push('/SC', 'DAILY')
        args.push('/ST', options.time)
        break
      case 'weekly':
        args.push('/SC', 'WEEKLY')
        args.push('/ST', options.time)
        if (options.days && options.days.length > 0) {
          const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
          const dayStr = options.days.map((d) => dayNames[d]).join(',')
          args.push('/D', dayStr)
        }
        break
      case 'once':
        args.push('/SC', 'ONCE')
        args.push('/ST', options.time)
        args.push('/SD', new Date().toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }))
        break
    }

    const cmd = args.join(' ')
    try {
      await execAsync(cmd)
    } catch (err) {
      throw new Error(
        `Failed to create scheduled task: ${err instanceof Error ? err.message : String(err)}`
      )
    }
  }

  async deleteTask(taskName: string): Promise<void> {
    const fullName = taskName.startsWith(TASK_PREFIX) ? taskName : `${TASK_PREFIX}${taskName}`
    const cmd = `schtasks /Delete /TN "${fullName}" /F`

    try {
      await execAsync(cmd)
    } catch (err) {
      throw new Error(
        `Failed to delete scheduled task: ${err instanceof Error ? err.message : String(err)}`
      )
    }
  }

  async listTasks(): Promise<string[]> {
    try {
      const { stdout } = await execAsync(
        `schtasks /Query /FO CSV /NH | findstr "${TASK_PREFIX}"`
      )

      const tasks: string[] = []
      const lines = stdout.trim().split('\n')
      for (const line of lines) {
        const match = /"([^"]*RoboSync_[^"]*)"/.exec(line)
        if (match) {
          tasks.push(match[1].replace(/^\\/, ''))
        }
      }
      return tasks
    } catch {
      // No tasks found or command error
      return []
    }
  }
}

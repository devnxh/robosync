import { spawn, ChildProcess } from 'child_process'
import { createInterface } from 'readline'
import type { JobConfig } from '../../src/types/RobocopyJob'
import { buildCommand } from './CommandBuilder'

/**
 * Manages spawning and controlling robocopy processes.
 * Uses child_process.spawn with shell:false for security.
 */
export class RobocopyRunner {
  private process: ChildProcess | null = null

  start(
    config: JobConfig,
    onOutput: (line: string) => void,
    onComplete: (exitCode: number) => void,
    onError: (err: Error) => void
  ): void {
    if (this.process) {
      onError(new Error('A job is already running. Cancel it first.'))
      return
    }

    const { exe, args } = buildCommand(config)

    try {
      this.process = spawn(exe, args, {
        windowsHide: true,
        shell: false, // CRITICAL: never use shell: true
        stdio: ['ignore', 'pipe', 'pipe']
      })
    } catch (err) {
      onError(
        err instanceof Error
          ? err
          : new Error('Failed to start robocopy process')
      )
      return
    }

    if (!this.process.stdout || !this.process.stderr) {
      onError(new Error('Failed to capture robocopy output streams'))
      return
    }

    // Read stdout line by line
    const rl = createInterface({
      input: this.process.stdout,
      crlfDelay: Infinity
    })

    rl.on('line', (line: string) => {
      onOutput(line)
    })

    // Capture stderr
    const stderrRl = createInterface({
      input: this.process.stderr!,
      crlfDelay: Infinity
    })

    stderrRl.on('line', (line: string) => {
      onOutput(`[STDERR] ${line}`)
    })

    this.process.on('close', (code: number | null) => {
      this.process = null
      onComplete(code ?? -1)
    })

    this.process.on('error', (err: Error) => {
      this.process = null
      if (err.message.includes('ENOENT')) {
        onError(
          new Error(
            'Robocopy not found. Ensure robocopy.exe is available in your system PATH. ' +
              'Robocopy is included with Windows Vista and later.'
          )
        )
      } else {
        onError(err)
      }
    })
  }

  cancel(): void {
    if (this.process && this.process.pid) {
      // Use taskkill to kill the entire process tree on Windows
      try {
        spawn('taskkill', ['/PID', String(this.process.pid), '/T', '/F'], {
          windowsHide: true,
          shell: false
        })
      } catch {
        // Best effort kill
        this.process.kill('SIGKILL')
      }
      this.process = null
    }
  }

  isRunning(): boolean {
    return this.process !== null
  }
}

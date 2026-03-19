import React from 'react'
import { Play, Square, RotateCcw, AlertTriangle } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { Button } from '../shared/Button'

export const JobControls: React.FC = () => {
  const { isRunning, jobConfig, startJob, cancelJob, resetJobConfig, jobResult, jobError } =
    useAppStore()

  const canStart = jobConfig.source.trim() !== '' && jobConfig.destination.trim() !== ''

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <>
            <Button
              variant="primary"
              size="lg"
              icon={<Play size={16} />}
              onClick={startJob}
              disabled={!canStart}
            >
              Start Job
            </Button>
            {jobResult && (
              <Button
                variant="ghost"
                size="lg"
                icon={<RotateCcw size={14} />}
                onClick={resetJobConfig}
              >
                Reset
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="danger"
            size="lg"
            icon={<Square size={14} />}
            onClick={cancelJob}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Mod 10: Robocopy not found error banner */}
      {jobError && jobError.toLowerCase().includes('not found') && (
        <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
          <AlertTriangle size={14} className="text-warning mt-0.5 shrink-0" />
          <div className="text-xs text-warning/80">
            <strong>Robocopy not found.</strong> Robocopy is built into Windows.
            Ensure RoboSync is running on Windows and{' '}
            <code className="font-mono">C:\Windows\System32</code> is in your system PATH.
          </div>
        </div>
      )}
    </div>
  )
}

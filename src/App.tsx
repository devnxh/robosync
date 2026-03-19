import React, { useEffect, useCallback } from 'react'
import { useAppStore } from './store/useAppStore'
import { useRobocopy } from './hooks/useRobocopy'
import { Sidebar } from './components/layout/Sidebar'
import { TitleBar } from './components/layout/TitleBar'
import { StatusBar } from './components/layout/StatusBar'
import { ToastContainer } from './components/shared/Toast'
import { NewJob } from './pages/NewJob'
import { SavedJobs } from './pages/SavedJobs'
import { RunHistory } from './pages/RunHistory'
import { Logs } from './pages/Logs'

const App: React.FC = () => {
  const activeTab = useAppStore((s) => s.activeTab)
  const setActiveTab = useAppStore((s) => s.setActiveTab)
  const isRunning = useAppStore((s) => s.isRunning)
  const startJob = useAppStore((s) => s.startJob)
  const cancelJob = useAppStore((s) => s.cancelJob)
  const jobConfig = useAppStore((s) => s.jobConfig)
  const setShowSaveProfileModal = useAppStore((s) => s.setShowSaveProfileModal)

  // Wire up IPC event listeners
  useRobocopy()

  // --- Mod 11: Global keyboard shortcuts ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrl+N → New Job
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        setActiveTab('newjob')
      }
      // Ctrl+S → Save current job as profile
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        if (activeTab === 'newjob') {
          setShowSaveProfileModal(true)
        }
      }
      // Ctrl+Enter → Start job
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        if (
          activeTab === 'newjob' &&
          !isRunning &&
          jobConfig.source.trim() &&
          jobConfig.destination.trim()
        ) {
          startJob()
        }
      }
      // Ctrl+. → Cancel running job
      if (e.ctrlKey && e.key === '.') {
        e.preventDefault()
        if (isRunning) {
          cancelJob()
        }
      }
      // Ctrl+L → Logs tab
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault()
        setActiveTab('logs')
      }
      // Ctrl+H → History tab
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault()
        setActiveTab('history')
      }
    },
    [activeTab, isRunning, jobConfig.source, jobConfig.destination, startJob, cancelJob, setActiveTab, setShowSaveProfileModal]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const renderPage = () => {
    switch (activeTab) {
      case 'newjob':
        return <NewJob />
      case 'savedjobs':
        return <SavedJobs />
      case 'history':
        return <RunHistory />
      case 'logs':
        return <Logs />
      default:
        return <NewJob />
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-base overflow-hidden">
      {/* Custom title bar */}
      <TitleBar />

      {/* Main layout: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden bg-base">
          {renderPage()}
        </main>
      </div>

      {/* Status bar */}
      <StatusBar />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  )
}

export default App

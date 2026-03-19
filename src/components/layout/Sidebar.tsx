import React from 'react'
import { Zap, Bookmark, Clock, Terminal, ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { useAppStore, type TabId } from '../../store/useAppStore'
import { Tooltip } from '../shared/Tooltip'

const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'newjob', label: 'New Job', icon: <Zap size={18} /> },
  { id: 'savedjobs', label: 'Saved Jobs', icon: <Bookmark size={18} /> },
  { id: 'history', label: 'History', icon: <Clock size={18} /> },
  { id: 'logs', label: 'Logs', icon: <Terminal size={18} /> }
]

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <div
      className={`flex flex-col h-full bg-surface border-r border-border transition-sidebar shrink-0
        ${sidebarOpen ? 'w-[240px]' : 'w-[56px]'}`}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 h-[52px] border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
          <Zap size={14} className="text-accent" />
        </div>
        {sidebarOpen && (
          <span className="text-md font-bold text-text-primary tracking-tight">
            RoboSync
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-2 mt-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const button = (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium
                transition-colors duration-150 relative
                ${
                  isActive
                    ? 'bg-bg-hover text-text-primary'
                    : 'text-text-muted hover:bg-bg-hover hover:text-text-primary'
                }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
              )}
              <span className={`shrink-0 ${isActive ? 'text-accent' : ''}`}>
                {item.icon}
              </span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          )

          return sidebarOpen ? (
            button
          ) : (
            <Tooltip key={item.id} content={item.label} position="right">
              {button}
            </Tooltip>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-2 border-t border-border">
        {sidebarOpen && (
          <div className="flex items-center justify-between px-3 py-1.5 mb-1">
            <span className="text-xs text-text-subtle">v1.0.0</span>
            <button className="p-1 rounded-md hover:bg-bg-hover text-text-subtle hover:text-text-muted transition-colors">
              <Settings size={14} />
            </button>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
            text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors text-xs"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft size={14} />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight size={14} />
          )}
        </button>
      </div>
    </div>
  )
}

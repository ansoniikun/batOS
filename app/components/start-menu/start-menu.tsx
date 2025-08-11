'use client'

import React, { useState } from 'react'
import { cn } from '@/app/lib/utils'
import { Button } from '@/app/components/ui/button'
import { DesktopApp } from '@/app/types/desktop'
import { 
  Play, 
  FileText, 
  Monitor, 
  Settings, 
  Power,
  Search,
  User
} from 'lucide-react'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onAppLaunch: (app: DesktopApp) => void
}

const sampleApps: DesktopApp[] = [
  {
    id: 'notepad',
    name: 'Notepad',
    icon: '📝',
    description: 'Simple text editor',
    category: 'utilities',
    executable: () => <div>Notepad App</div>,
    defaultSize: { width: 600, height: 400 },
    defaultPosition: { x: 100, y: 100 }
  },
  {
    id: 'system-info',
    name: 'System Info',
    icon: '💻',
    description: 'System information and monitoring',
    category: 'system',
    executable: () => <div>System Info App</div>,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 150, y: 150 }
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    description: 'System settings and preferences',
    category: 'system',
    executable: () => <div>Settings App</div>,
    defaultSize: { width: 700, height: 500 },
    defaultPosition: { x: 200, y: 200 }
  }
]

export function StartMenu({ isOpen, onClose, onAppLaunch }: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredApps = sampleApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAppClick = (app: DesktopApp) => {
    onAppLaunch(app)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute top-12 left-0 w-80 bg-gray-900/95 backdrop-blur-md border border-blue-400/50 shadow-2xl rounded-b-lg">
        {/* Search Bar */}
        <div className="p-4 border-b border-blue-400/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400/70" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-blue-400/30 rounded text-blue-400 placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              autoFocus
            />
          </div>
        </div>

        {/* Apps List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                className="w-full p-3 flex items-center space-x-3 hover:bg-blue-400/10 transition-colors border-b border-blue-400/10 last:border-b-0"
              >
                <div className="text-2xl">{app.icon}</div>
                <div className="flex-1 text-left">
                  <div className="text-yellow-400 font-medium">{app.name}</div>
                  <div className="text-yellow-400/70 text-sm">{app.description}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-blue-400/70">
              No apps found matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-blue-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-blue-400 font-medium">Bruce Wayne</div>
                <div className="text-blue-400/70 text-sm">Administrator</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-blue-400 hover:bg-blue-400/10"
            >
              <Power className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

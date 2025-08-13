'use client'

import React, { useState } from 'react'
import { cn } from '@/app/lib/utils'
import { Button } from '@/app/components/ui/button'
import { DesktopApp } from '@/app/types/desktop'
import { useTheme } from '@/app/contexts/theme-context'
import { 
  Play, 
  FileText, 
  Monitor, 
  Settings, 
  Power,
  Search,
  User,
  Terminal,
  Folder,
  Music,
  Clock,
  Calendar,
  Cpu,
  Activity,
  MapPin,
  Cloud,
  Database,
  Shield
} from 'lucide-react'
import AlfredApp from '@/app/features/apps/alfred-app'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onAppLaunch: (app: DesktopApp) => void
}

const applications: DesktopApp[] = [
  {
    id: 'alfred',
    name: 'Alfred',
    icon: 'user',
    description: 'AI Assistant & Voice Control',
    category: 'system',
    executable: () => <AlfredApp />,
    defaultSize: { width: 300, height: 400 },
    defaultPosition: { x: 300, y: 150 }
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'terminal',
    description: 'Command line interface',
    category: 'system',
    executable: () => <div>Terminal App</div>,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 100, y: 100 }
  },
  {
    id: 'file-manager',
    name: 'File Manager',
    icon: 'folder',
    description: 'Browse files and folders',
    category: 'system',
    executable: () => <div>File Manager App</div>,
    defaultSize: { width: 900, height: 700 },
    defaultPosition: { x: 150, y: 150 }
  },
  {
    id: 'ipod',
    name: 'Batplayer',
    icon: 'music',
    description: 'Retro music player',
    category: 'entertainment',
    executable: () => <div>Batplayer App</div>,
    defaultSize: { width: 240, height: 320 },
    defaultPosition: { x: 200, y: 200 }
  },
  {
    id: 'notepad',
    name: 'Notepad',
    icon: 'file-text',
    description: 'Simple text editor',
    category: 'utilities',
    executable: () => <div>Notepad App</div>,
    defaultSize: { width: 600, height: 400 },
    defaultPosition: { x: 200, y: 200 }
  },
  {
    id: 'system-info',
    name: 'System Info',
    icon: 'monitor',
    description: 'System information and monitoring',
    category: 'system',
    executable: () => <div>System Info App</div>,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 250, y: 250 }
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'settings',
    description: 'System settings and preferences',
    category: 'system',
    executable: () => <div>Settings App</div>,
    defaultSize: { width: 700, height: 500 },
    defaultPosition: { x: 300, y: 300 }
  }
]

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'terminal': <Terminal className="w-6 h-6" />,
    'folder': <Folder className="w-6 h-6" />,
    'file-text': <FileText className="w-6 h-6" />,
    'monitor': <Monitor className="w-6 h-6" />,
    'settings': <Settings className="w-6 h-6" />,
    'music': <Music className="w-6 h-6" />,
    'user': <User className="w-6 h-6" />,
    'clock': <Clock className="w-6 h-6" />,
    'calendar': <Calendar className="w-6 h-6" />,
    'cpu': <Cpu className="w-6 h-6" />,
    'activity': <Activity className="w-6 h-6" />,
    'map-pin': <MapPin className="w-6 h-6" />,
    'cloud': <Cloud className="w-6 h-6" />,
    'database': <Database className="w-6 h-6" />,
    'shield': <Shield className="w-6 h-6" />
  }
  return iconMap[iconName] || <FileText className="w-6 h-6" />
}

export function StartMenu({ isOpen, onClose, onAppLaunch }: StartMenuProps) {
  const { getThemeClass } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'apps' | 'about'>('apps')

  const filteredApps = applications.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAppClick = (app: DesktopApp) => {
    onAppLaunch(app)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0" style={{ zIndex: 9999 }} onClick={onClose}>
      <div 
        className={`absolute top-14 left-0 w-80 ${getThemeClass()} backdrop-blur-md border border-blue-400/50 shadow-2xl rounded-b-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-blue-400/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400/70" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-blue-400/30 rounded text-blue-400 placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              autoFocus
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-blue-400/30">
          <button
            onClick={() => setActiveTab('apps')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === 'apps' 
                ? "text-blue-400 border-b-2 border-blue-400" 
                : "text-blue-400/70 hover:text-blue-400"
            )}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === 'about' 
                ? "text-blue-400 border-b-2 border-blue-400" 
                : "text-blue-400/70 hover:text-blue-400"
            )}
          >
            About This System
          </button>
        </div>

        {/* Content */}
                    <div 
              className="max-h-96 overflow-y-auto"
              style={{ 
                scrollbarWidth: 'thin', 
                scrollbarColor: '#3b82f6 #000000',
                scrollbarGutter: 'stable'
              }}
            >
          {activeTab === 'apps' ? (
            <>
              {/* Applications Folder */}
              <div className="p-3 border-b border-blue-400/20">
                <div className="text-blue-400/70 text-xs font-medium uppercase tracking-wider">
                  Applications
                </div>
              </div>
              
              {searchQuery ? (
                // Search Results
                filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleAppClick(app)}
                      className="w-full p-3 flex items-center space-x-3 hover:bg-blue-400/10 transition-colors border-b border-blue-400/10 last:border-b-0"
                    >
                      <div className="text-blue-400">
                        {getIconComponent(app.icon)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-blue-400 font-medium">{app.name}</div>
                        <div className="text-blue-400/70 text-sm">{app.description}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-blue-400/70">
                    No applications found matching "{searchQuery}"
                  </div>
                )
              ) : (
                // All Applications
                applications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    className="w-full p-3 flex items-center space-x-3 hover:bg-blue-400/10 transition-colors border-b border-blue-400/10 last:border-b-0"
                  >
                    <div className="text-blue-400">
                      {getIconComponent(app.icon)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-blue-400 font-medium">{app.name}</div>
                      <div className="text-blue-400/70 text-sm">{app.description}</div>
                    </div>
                  </button>
                ))
              )}
            </>
          ) : (
            // About This System Tab
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/batman-logo.png" 
                    alt="Batman Logo" 
                    className="w-12 h-12 object-contain filter drop-shadow-lg drop-shadow-blue-400/80"
                  />
                  <div>
                    <div className="text-blue-400 font-bold text-lg">BatOS</div>
                    <div className="text-blue-400/70 text-sm">Dark Knight Edition</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-400/70">Version:</span>
                    <span className="text-blue-400 font-mono">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400/70">OS:</span>
                    <span className="text-blue-400">BatOS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400/70">CPU:</span>
                    <span className="text-blue-400">WayneTech Quantum Core</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400/70">Memory:</span>
                    <span className="text-blue-400">64GB RAM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400/70">Storage:</span>
                    <span className="text-blue-400">2TB SSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400/70">Uptime:</span>
                    <span className="text-blue-400">47 days, 12 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400/70">Battery:</span>
                    <span className="text-blue-400">87%</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-blue-400/30">
                  <div className="text-blue-400/70 text-xs">
                    Built with Next.js and TypeScript
                  </div>
                  <div className="text-blue-400/70 text-xs mt-1">
                    © 2025 Wayne Enterprises
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-blue-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/30">
                <User className="w-5 h-5 text-blue-400" />
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

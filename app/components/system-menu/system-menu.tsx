'use client'

import React, { useState } from 'react'
import { cn } from '@/app/lib/utils'
import { Button } from '@/app/components/ui/button'
import { 
  Info, 
  Terminal, 
  Folder, 
  Settings, 
  Monitor, 
  Database,
  Shield,
  Activity,
  Cpu,
  HardDrive,
  Network,
  Battery,
  Calendar,
  Clock
} from 'lucide-react'

interface SystemMenuProps {
  isOpen: boolean
  onClose: () => void
  onLaunchApp: (appId: string) => void
  systemInfo: {
    os: string
    version: string
    cpu: string
    memory: string
    storage: string
    uptime: string
    battery: number
  }
}

export function SystemMenu({ isOpen, onClose, onLaunchApp, systemInfo }: SystemMenuProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'apps'>('about')

  if (!isOpen) return null

  const apps = [
    { id: 'terminal', name: 'Terminal', icon: <Terminal className="w-5 h-5" />, description: 'Command line interface' },
    { id: 'file-manager', name: 'File Manager', icon: <Folder className="w-5 h-5" />, description: 'Browse files and folders' },
    { id: 'system-info', name: 'System Info', icon: <Monitor className="w-5 h-5" />, description: 'System monitoring' },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" />, description: 'System preferences' }
  ]

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute top-16 right-4 w-96 bg-black/95 backdrop-blur-md border border-blue-400/50 shadow-2xl rounded-lg">
        {/* Header */}
        <div className="p-4 border-b border-blue-400/30">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-black text-2xl font-bold">🦇</span>
            </div>
            <div>
              <div className="text-blue-400 font-bold text-lg">BatOS</div>
              <div className="text-blue-400/70 text-sm">Dark Knight Edition</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-blue-400/30">
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
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'about' ? (
            <div className="space-y-4">
              {/* System Overview */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">System Overview</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-blue-400/70">Operating System</div>
                    <div className="text-blue-400">{systemInfo.os}</div>
                  </div>
                  <div>
                    <div className="text-blue-400/70">Version</div>
                    <div className="text-blue-400">{systemInfo.version}</div>
                  </div>
                  <div>
                    <div className="text-blue-400/70">Processor</div>
                    <div className="text-blue-400">{systemInfo.cpu}</div>
                  </div>
                  <div>
                    <div className="text-blue-400/70">Memory</div>
                    <div className="text-blue-400">{systemInfo.memory}</div>
                  </div>
                  <div>
                    <div className="text-blue-400/70">Storage</div>
                    <div className="text-blue-400">{systemInfo.storage}</div>
                  </div>
                  <div>
                    <div className="text-blue-400/70">Uptime</div>
                    <div className="text-blue-400">{systemInfo.uptime}</div>
                  </div>
                </div>
              </div>

              {/* Hardware Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Hardware Details</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400/70">CPU Usage</span>
                    <span className="text-blue-400">12.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400/70">Memory Usage</span>
                    <span className="text-blue-400">39%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400/70">Storage Usage</span>
                    <span className="text-blue-400">42%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400/70">Battery</span>
                    <span className="text-blue-400">{systemInfo.battery}%</span>
                  </div>
                </div>
              </div>

              {/* Security Status */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Security Status</span>
                </div>
                <div className="text-sm text-blue-400/80">
                  All security protocols are active and operational. 
                  Surveillance network is online and monitoring for threats.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    onLaunchApp(app.id)
                    onClose()
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded hover:bg-blue-400/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-blue-400/20 rounded flex items-center justify-center text-blue-400">
                    {app.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-blue-400 font-medium">{app.name}</div>
                    <div className="text-blue-400/70 text-sm">{app.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

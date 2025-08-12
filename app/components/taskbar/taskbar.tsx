'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/app/lib/utils'
import { TaskbarItem } from '@/app/types/desktop'
import { Button } from '@/app/components/ui/button'
import { useTheme } from '@/app/contexts/theme-context'
import { useVolume } from '@/app/contexts/volume-context'
import { 
  Play, 
  Clock, 
  Wifi, 
  Volume2, 
  VolumeX,
  Battery, 
  ChevronDown,
  Settings,
  Search
} from 'lucide-react'
import { formatTime } from '@/app/lib/utils'

interface TaskbarProps {
  items: TaskbarItem[]
  onItemClick: (item: TaskbarItem) => void
  onStartMenuClick: () => void
  onSystemMenuToggle?: () => void
  currentTime: Date
}

export function Taskbar({ items, onItemClick, onStartMenuClick, onSystemMenuToggle, currentTime }: TaskbarProps) {
  const { getThemeClass } = useTheme()
  const { volume, isMuted, setVolume, toggleMute } = useVolume()
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const volumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(event.target as Node)) {
        setShowVolumeControl(false)
      }
    }

    if (showVolumeControl) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showVolumeControl])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
  }

  return (
    <div className={`fixed top-0 left-0 right-0 h-12 ${getThemeClass()} backdrop-blur-md border-b border-blue-400/30 z-50`}>
      <div className="flex items-center justify-between h-full px-2">
        {/* Batman Logo */}
        <div className="flex items-center space-x-2">
          <div 
            className="cursor-pointer transition-all duration-200 hover:scale-120"
            onClick={onSystemMenuToggle}
          >
            <img 
              src="/batman-logo.png" 
              alt="Batman Logo" 
              className="w-10 h-10 object-contain filter drop-shadow-lg drop-shadow-blue-400/80"
            />
          </div>
          
          {/* Start Button */}
          <Button
            variant="batcomputer"
            size="sm"
            onClick={onStartMenuClick}
            className="h-8 px-3 rounded-none shadow-lg shadow-blue-400/50"
          >
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
        </div>

        {/* Taskbar Items */}
        <div className="flex items-center space-x-1 flex-1 justify-center">
          {items.map((item) => (
                      <Button
            key={item.id}
            variant={item.isActive ? "batcomputer" : "ghost"}
            size="sm"
            onClick={() => onItemClick(item)}
            className={cn(
              "h-8 px-2 rounded-none min-w-0",
              item.isMinimized && "opacity-50"
            )}
          >
            <div className="w-4 h-4 mr-1">
              {/* Icon placeholder - replace with actual icon */}
              <div className="w-full h-full bg-blue-400 rounded-sm shadow-sm shadow-blue-400/50" />
            </div>
            <span className="text-xs truncate">{item.title}</span>
          </Button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Search className="w-4 h-4 text-blue-400" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="w-4 h-4 text-blue-400" />
          </Button>

          {/* System Icons */}
          <div className="flex items-center space-x-1">
            <Wifi className="w-4 h-4 text-blue-400" />
            <div className="relative" ref={volumeRef}>
              <button
                onClick={() => setShowVolumeControl(!showVolumeControl)}
                className="p-2 hover:bg-blue-400/20 rounded transition-colors border-2 border-blue-400/50 bg-blue-400/10"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-blue-400" /> : <Volume2 className="w-5 h-5 text-blue-400" />}
              </button>
              
              {showVolumeControl && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-black/95 backdrop-blur-md border border-blue-400/50 rounded-lg shadow-2xl z-50">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="p-1 hover:bg-blue-400/10 rounded transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-blue-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${isMuted ? 0 : volume}%, #4b5563 ${isMuted ? 0 : volume}%, #4b5563 100%)`
                      }}
                    />
                    <span className="text-xs text-blue-400 min-w-[2rem] text-center">
                      {isMuted ? 0 : volume}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Battery className="w-4 h-4 text-blue-400" />
          </div>

          {/* Time */}
          <div className="flex flex-col items-end text-blue-400 text-xs px-2">
            <div className="font-mono">{formatTime(currentTime)}</div>
            <div className="text-blue-400/70">
              {currentTime.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Show Desktop */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className="w-4 h-4 text-blue-400" />
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import { cn } from '@/app/lib/utils'
import { TaskbarItem } from '@/app/types/desktop'
import { Button } from '@/app/components/ui/button'
import { 
  Play, 
  Clock, 
  Wifi, 
  Volume2, 
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
  currentTime: Date
}

export function Taskbar({ items, onItemClick, onStartMenuClick, currentTime }: TaskbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-md border-b border-blue-400/30 z-50">
      <div className="flex items-center justify-between h-full px-2">
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
            <Volume2 className="w-4 h-4 text-blue-400" />
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

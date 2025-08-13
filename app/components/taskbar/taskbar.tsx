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
  
  // File search functionality
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{
    name: string
    path: string
    type: 'file' | 'folder'
    icon: string
  }>>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Filesystem data for search
  const filesystemData = [
    { name: 'batmobile', path: '/batcave/batmobile', type: 'folder' as const, icon: '🚗' },
    { name: 'batwing', path: '/batcave/batwing', type: 'folder' as const, icon: '✈️' },
    { name: 'batarangs', path: '/batcave/batarangs', type: 'folder' as const, icon: '🥷' },
    { name: 'gadgets', path: '/batcave/gadgets', type: 'folder' as const, icon: '🛠️' },
    { name: 'surveillance', path: '/batcave/surveillance', type: 'folder' as const, icon: '📹' },
    { name: 'evidence', path: '/batcave/evidence', type: 'folder' as const, icon: '🔍' },
    { name: 'case_files', path: '/batcave/case_files', type: 'folder' as const, icon: '📁' },
    { name: 'wayne_tech', path: '/batcave/wayne_tech', type: 'folder' as const, icon: '🏢' },
    { name: 'gotham_map', path: '/batcave/gotham_map', type: 'folder' as const, icon: '🗺️' },
    { name: 'criminal_database', path: '/batcave/criminal_database', type: 'folder' as const, icon: '👥' },
    { name: 'status.txt', path: '/batcave/batmobile/status.txt', type: 'file' as const, icon: '📄' },
    { name: 'specs.txt', path: '/batcave/batmobile/specs.txt', type: 'file' as const, icon: '📄' },
    { name: 'maintenance.log', path: '/batcave/batmobile/maintenance.log', type: 'file' as const, icon: '📄' },
    { name: 'active_targets.txt', path: '/batcave/surveillance/active_targets.txt', type: 'file' as const, icon: '📄' },
    { name: 'joker_case.txt', path: '/batcave/case_files/joker_case.txt', type: 'file' as const, icon: '📄' },
    { name: 'penguin_case.txt', path: '/batcave/case_files/penguin_case.txt', type: 'file' as const, icon: '📄' },
    { name: 'riddler_case.txt', path: '/batcave/case_files/riddler_case.txt', type: 'file' as const, icon: '📄' }
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const results = filesystemData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.path.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8) // Limit to 8 results

    setSearchResults(results)
    setShowSearchResults(results.length > 0)
  }

  const handleSearchResultClick = (result: typeof filesystemData[0]) => {
    console.log(`Opening: ${result.path}`)
    setSearchQuery('')
    setShowSearchResults(false)
    // Here you could add logic to open the file/folder
  }

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
    <div className={`fixed top-0 left-0 right-0 h-14 ${getThemeClass()} backdrop-blur-md border-b-2 border-blue-400/50 z-50`} style={{
      boxShadow: '0 2px 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(59, 130, 246, 0.1)'
    }}>
      <div className="flex items-center justify-between h-full px-4">
        {/* Batman Logo */}
        <div className="flex items-center space-x-3">
          <div 
            className="cursor-pointer transition-all duration-300 hover:scale-110 group relative"
            onClick={onStartMenuClick}
          >
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md group-hover:bg-blue-400/40 transition-all duration-300"></div>
            <img 
              src="/batman-logo.png" 
              alt="Batman Logo" 
              className="relative w-12 h-12 object-contain filter drop-shadow-lg drop-shadow-blue-400/80 group-hover:drop-shadow-blue-400 transition-all duration-300"
            />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-400 group-hover:w-8 transition-all duration-300"></div>
          </div>
          <div className="h-8 w-px bg-gradient-to-b from-blue-400/50 to-transparent"></div>
        </div>

        {/* Taskbar Items */}
        <div className="flex items-center space-x-2 flex-1 justify-center">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className={cn(
                "relative group cursor-pointer transition-all duration-300",
                item.isMinimized && "opacity-50"
              )}
            >
              {/* Background glow */}
              <div className={cn(
                "absolute inset-0 rounded-lg transition-all duration-300",
                item.isActive 
                  ? "bg-blue-400/20 shadow-lg shadow-blue-400/30" 
                  : "bg-transparent group-hover:bg-blue-400/10"
              )}></div>
              
              {/* Content */}
              <div className="relative flex items-center space-x-2 px-3 py-2">
                <div className="w-5 h-5 relative">
                  {/* Icon glow */}
                  <div className={cn(
                    "absolute inset-0 rounded-sm transition-all duration-300",
                    item.isActive 
                      ? "bg-blue-400/30 blur-sm" 
                      : "bg-transparent group-hover:bg-blue-400/20"
                  )}></div>
                  {/* Icon */}
                  <div className="relative w-full h-full bg-blue-400 rounded-sm shadow-sm shadow-blue-400/50 flex items-center justify-center">
                    <span className="text-xs font-bold text-black">A</span>
                  </div>
                </div>
                <span className={cn(
                  "text-xs font-medium transition-all duration-300",
                  item.isActive ? "text-blue-400" : "text-blue-400/70 group-hover:text-blue-400"
                )}>
                  {item.title}
                </span>
              </div>
              
              {/* Active indicator */}
              {item.isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-400 rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* File Search Box */}
        <div className="flex items-center space-x-2 mr-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400/70" />
            <input
              type="text"
              placeholder="Search filesystem..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSearchResults(searchResults.length > 0)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="pl-10 pr-4 py-1 bg-gray-800/50 border border-blue-400/30 rounded text-blue-400 placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 w-48 text-sm"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div 
                className={`absolute top-full left-0 right-0 mt-1 ${getThemeClass()} backdrop-blur-md border border-blue-400/50 shadow-2xl rounded-lg max-h-64 overflow-y-auto z-50`}
                style={{ 
                  scrollbarWidth: 'thin', 
                  scrollbarColor: '#3b82f6 #000000',
                  scrollbarGutter: 'stable'
                }}
              >
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full p-3 flex items-center space-x-3 hover:bg-blue-400/10 transition-colors border-b border-blue-400/10 last:border-b-0"
                  >
                    <span className="text-lg">{result.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-blue-400 font-medium">{result.name}</div>
                      <div className="text-blue-400/70 text-sm">{result.path}</div>
                    </div>
                    <span className="text-blue-400/50 text-xs">
                      {result.type === 'folder' ? '📁' : '📄'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-4">
          {/* Settings */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-sm group-hover:bg-blue-400/20 transition-all duration-300"></div>
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 hover:bg-blue-400/10 border border-blue-400/20">
              <Settings className="w-4 h-4 text-blue-400" />
            </Button>
          </div>

          {/* System Icons */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-sm group-hover:bg-blue-400/20 transition-all duration-300"></div>
              <div className="relative p-1.5 rounded-full border border-blue-400/20">
                <Wifi className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            
            <div className="relative" ref={volumeRef}>
              <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-sm group-hover:bg-blue-400/20 transition-all duration-300"></div>
              <button
                onClick={() => setShowVolumeControl(!showVolumeControl)}
                className="relative p-1.5 hover:bg-blue-400/10 rounded-full border border-blue-400/20 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-blue-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
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
            
            <div className="flex items-center space-x-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-sm group-hover:bg-blue-400/20 transition-all duration-300"></div>
                <div className="relative p-1.5 rounded-full border border-blue-400/20">
                  <Battery className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <span className="text-xs text-blue-400 font-mono font-bold">87%</span>
            </div>
          </div>

          {/* Time */}
          <div className="flex flex-col items-end text-blue-400 text-xs px-4 py-1">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-400/10 rounded-lg blur-sm group-hover:bg-blue-400/20 transition-all duration-300"></div>
              <div className="relative px-3 py-1 rounded-lg border border-blue-400/20">
                <div className="font-mono font-bold">{formatTime(currentTime)}</div>
                <div className="text-blue-400/70 text-xs">
                  {currentTime.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Show Desktop */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-sm group-hover:bg-blue-400/20 transition-all duration-300"></div>
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 hover:bg-blue-400/10 border border-blue-400/20">
              <ChevronDown className="w-4 h-4 text-blue-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

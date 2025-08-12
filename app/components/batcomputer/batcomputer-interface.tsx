'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import { 
  Cpu, 
  HardDrive, 
  Network, 
  Battery, 
  Wifi, 
  Volume2, 
  Settings,
  Search,
  Calendar,
  MapPin,
  Thermometer,
  Activity,
  Database,
  Monitor,
  Shield
} from 'lucide-react'

interface BatcomputerInterfaceProps {
  currentTime: Date
  onSystemMenuToggle?: () => void
  onStartMenuClick?: () => void
}

export function BatcomputerInterface({ currentTime, onSystemMenuToggle, onStartMenuClick }: BatcomputerInterfaceProps) {
  const [systemInfo, setSystemInfo] = useState({
    cpu: 60,
    ram: 3.0,
    battery: 97,
    temperature: 36.0,
    uptime: '3 DAYS 3 HRS 00 MINS',
    networkSpeed: '00100 KM/H',
    download: '0.0 B',
    upload: '0.0 B',
    ipAddress: '192.168.1.100',
    lanAddress: '192.168.1.1',
    dnsAddress: '8.8.8.8'
  })

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

  const [consoleOutput, setConsoleOutput] = useState([
    'Batcomputer v.978.0.06.51...',
    'Checking system status: ACTIVE',
    'Analyzing last activated location: Batcave - 1007 Mountain Drive, Crest Hill, 60035. Gotham City',
    'Welcome back, Bruce Wayne.',
    'All systems operational.',
    'Security protocols: ENABLED',
    'Surveillance network: ONLINE',
    'Vehicle systems: STANDBY'
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemInfo(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 40) + 40, // 40-80%
        temperature: Math.floor(Math.random() * 20) + 30, // 30-50°C
        download: `${(Math.random() * 100).toFixed(1)} MB`,
        upload: `${(Math.random() * 50).toFixed(1)} MB`
      }))
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 bg-black">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Circuit Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 L20 10 M10 0 L10 20" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5" fill="none"/>
              <circle cx="10" cy="10" r="1" fill="rgba(59, 130, 246, 0.5)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-sm border-b border-blue-400/30 z-20">
        <div className="flex items-center justify-between h-full px-6">
          {/* Left - System Info */}
          <div className="flex items-center space-x-6 text-blue-400 text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="cursor-pointer transition-all duration-200 hover:scale-110"
                onClick={onStartMenuClick}
              >
                <img 
                  src="/batman-logo.png" 
                  alt="Batman Logo" 
                  className="w-8 h-8 object-contain filter drop-shadow-lg drop-shadow-blue-400/80"
                />
              </div>
              <div className="w-8 h-8 border-2 border-blue-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-mono">{systemInfo.ram.toFixed(1)}G</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Battery className="w-4 h-4" />
              <span className="font-mono">High {systemInfo.battery}% Battery</span>
            </div>
            <div className="text-xs">RAM</div>
          </div>

          {/* Center - Search */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400/70" />
              <input
                type="text"
                placeholder="Search filesystem..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowSearchResults(searchResults.length > 0)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-blue-400/30 rounded text-blue-400 placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 w-64"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 backdrop-blur-md border border-blue-400/50 shadow-2xl rounded-lg max-h-64 overflow-y-auto z-50">
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

          {/* Right - System Controls and Info */}
          <div className="flex items-center space-x-6 text-blue-400 text-sm">
            {/* System Icons */}
            <div className="flex items-center space-x-4">
              <Volume2 className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Settings className="w-4 h-4" />
            </div>

            {/* Storage Info */}
            <div className="flex items-center space-x-4 font-mono">
              <div>D:/ 0.0 Used</div>
              <div>C:/ 719.9 G Used</div>
            </div>

            {/* Data Visualization */}
            <div className="flex items-center space-x-2">
              <div className="w-24 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>

            {/* Date and Time */}
            <div className="font-mono">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
              })} {currentTime.toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>



      {/* Main Content Area */}
      <div className="absolute left-0 right-0 top-16 bottom-0 z-10">
        {/* Central Area - Empty for terminal placement */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          {/* Terminal will be placed here */}
        </div>
      </div>
    </div>
  )
}

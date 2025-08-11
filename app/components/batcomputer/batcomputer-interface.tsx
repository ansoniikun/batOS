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
}

export function BatcomputerInterface({ currentTime }: BatcomputerInterfaceProps) {
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
              <span className="font-mono font-bold">BCv.978</span>
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

          {/* Center - Time and Search */}
          <div className="flex items-center space-x-6">
            <div className="text-blue-400 font-mono">
              <div className="text-sm">Galactic Standard Time</div>
              <div className="text-lg font-bold">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false, 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400/70" />
              <input
                type="text"
                placeholder="Google"
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-blue-400/30 rounded text-blue-400 placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 w-48"
              />
            </div>
          </div>

          {/* Right - Metrics */}
          <div className="flex items-center space-x-6 text-blue-400 text-sm">
            <div className="text-center">
              <div className="font-mono font-bold">{systemInfo.networkSpeed}</div>
              <div className="text-xs">REB COLORS</div>
            </div>
            <div className="text-center">
              <div className="font-mono">Average {systemInfo.temperature}% CPU</div>
              <div className="text-xs">11 km/h</div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${systemInfo.cpu}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute left-0 top-16 bottom-16 w-20 bg-black/80 backdrop-blur-sm border-r border-blue-400/30 z-20">
        <div className="flex flex-col items-center space-y-6 py-6">
          {/* Wayne Tech Assets */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/30">
              <span className="text-blue-400 text-xs font-bold">WT</span>
            </div>
            <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/30">
              <span className="text-blue-400 text-xs font-bold">BW</span>
            </div>
            <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/30">
              <span className="text-blue-400 text-xs font-bold">BC</span>
            </div>
            <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/30">
              <span className="text-blue-400 text-xs font-bold">BM</span>
            </div>
            <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/30">
              <span className="text-blue-400 text-xs font-bold">BW</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-xs">T</span>
            </div>
            <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-xs">F</span>
            </div>
            <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-xs">S</span>
            </div>
            <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-xs">G+</span>
            </div>
          </div>

          {/* Adventure Status */}
          <div className="text-center">
            <div className="text-blue-400 text-xs font-bold">Adventure Begins</div>
            <div className="text-blue-400/70 text-xs">11/55</div>
            <div className="w-6 h-6 bg-blue-400/20 rounded-full flex items-center justify-center mt-2">
              <span className="text-blue-400 text-xs">⚡</span>
            </div>
          </div>

          {/* U TECH Logo */}
          <div className="text-center mt-auto">
            <div className="text-blue-400 text-xs font-bold">U TECH</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute left-20 right-0 top-16 bottom-16 z-10">
        {/* Central Batman Logo */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center border-2 border-blue-400/30 backdrop-blur-sm">
            <div className="text-white text-6xl font-bold">🦇</div>
          </div>
        </div>

        {/* Top Left - Map */}
        <div className="absolute top-4 left-4 w-64 h-48 bg-black/80 backdrop-blur-sm border border-blue-400/30 rounded">
          <div className="p-3">
            <div className="text-blue-400 text-sm font-bold mb-2">Europe Surveillance</div>
            <div className="w-full h-32 bg-blue-400/10 rounded border border-blue-400/20 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-blue-400/50" />
            </div>
          </div>
        </div>

        {/* Top Center - Console Output */}
        <div className="absolute top-4 left-72 right-72 h-48 bg-black/80 backdrop-blur-sm border border-blue-400/30 rounded">
          <div className="p-3 h-full">
            <div className="text-blue-400 text-sm font-bold mb-2">System Console</div>
            <div className="h-36 overflow-y-auto font-mono text-xs text-blue-400/80 space-y-1">
              {consoleOutput.map((line, index) => (
                <div key={index} className="flex">
                  <span className="text-blue-400/50 mr-2">{'>'}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="absolute top-4 right-4 w-80 h-96 bg-black/80 backdrop-blur-sm border border-blue-400/30 rounded">
          <div className="p-3 h-full overflow-y-auto">
            {/* Calendar */}
            <div className="mb-4">
              <div className="text-blue-400 text-sm font-bold mb-2">January 2016</div>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {Array.from({ length: 31 }, (_, i) => (
                  <div key={i} className="w-6 h-6 flex items-center justify-center text-blue-400/70">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* CPU Gauge */}
            <div className="mb-4">
              <div className="text-blue-400 text-sm font-bold mb-2">CPU {systemInfo.cpu}</div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${systemInfo.cpu}%` }} />
              </div>
            </div>

            {/* Network Info */}
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-xs text-blue-400">
                <span>DOWNLOAD {systemInfo.download}</span>
                <span>UPLOAD {systemInfo.upload}</span>
              </div>
            </div>

            {/* Bruce Wayne Profile */}
            <div className="mb-4 p-2 bg-blue-400/10 rounded border border-blue-400/20">
              <div className="text-blue-400 text-sm font-bold mb-2">Bruce Wayne</div>
              <div className="grid grid-cols-2 gap-1 text-xs text-blue-400/80">
                <div>Age: 35</div>
                <div>Gender: Male</div>
                <div>Height: 6'2"</div>
                <div>Eye Color: Blue</div>
                <div>Hair Color: Black</div>
              </div>
            </div>

            {/* System Metrics */}
            <div className="space-y-2 text-xs text-blue-400/80">
              <div>CPU Temp: {systemInfo.temperature}°C</div>
              <div>GPU Temp: 42°C</div>
              <div>HDD Temp: 38°C</div>
              <div>LAN IP: {systemInfo.ipAddress}</div>
              <div>Network: {systemInfo.lanAddress}</div>
              <div>DNS: {systemInfo.dnsAddress}</div>
              <div>Uptime: {systemInfo.uptime}</div>
            </div>
          </div>
        </div>

        {/* Bottom Left - Weather/System */}
        <div className="absolute bottom-4 left-4 w-64 h-32 bg-black/80 backdrop-blur-sm border border-blue-400/30 rounded">
          <div className="p-3">
            <div className="text-blue-400 text-sm font-bold mb-2">Weather & System</div>
            <div className="space-y-1 text-xs text-blue-400/80">
              <div>7°C Partly Cloudy</div>
              <div>Feels Like: 5°C</div>
              <div>Core Active Since: {systemInfo.uptime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-20 right-0 h-16 bg-black/80 backdrop-blur-sm border-t border-blue-400/30 z-20">
        <div className="flex items-center justify-between h-full px-6">
          {/* System Icons */}
          <div className="flex items-center space-x-4 text-blue-400">
            <Volume2 className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <Settings className="w-4 h-4" />
          </div>

          {/* Storage Info */}
          <div className="flex items-center space-x-6 text-blue-400 text-sm">
            <div className="font-mono">D:/ 0.0 Used</div>
            <div className="font-mono">C:/ 719.9 G Used</div>
          </div>

          {/* Data Visualization */}
          <div className="flex items-center space-x-2">
            <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>

          {/* Date and Time */}
          <div className="text-blue-400 font-mono text-sm">
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
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Database, 
  Network, 
  Shield, 
  Activity,
  RefreshCw
} from 'lucide-react'

export function SystemInfoApp() {
  const [systemInfo, setSystemInfo] = useState({
    os: 'BatOS v1.0',
    cpu: 'Intel Core i9-12900K',
    memory: '32GB DDR5',
    storage: '2TB NVMe SSD',
    network: 'Gigabit Ethernet',
    uptime: '00:00:00',
    load: '0.5%'
  })

  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const uptime = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000)
      const hours = Math.floor(uptime / 3600)
      const minutes = Math.floor((uptime % 3600) / 60)
      const seconds = uptime % 60
      
      setSystemInfo(prev => ({
        ...prev,
        uptime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        load: `${(Math.random() * 100).toFixed(1)}%`
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [lastUpdate])

  const refreshSystemInfo = () => {
    setLastUpdate(new Date())
  }

  return (
    <div className="w-full h-full bg-gray-900 text-blue-400 p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-400">System Information</h1>
        <Button 
          variant="batcomputerOutline" 
          size="sm"
          onClick={refreshSystemInfo}
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800/50 border-blue-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-lg flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              Operating System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div><span className="text-blue-400/70">OS:</span> {systemInfo.os}</div>
              <div><span className="text-blue-400/70">Architecture:</span> x86_64</div>
              <div><span className="text-blue-400/70">Kernel:</span> Linux 6.15.8</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-blue-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-lg flex items-center">
              <Cpu className="w-5 h-5 mr-2" />
              Processor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div><span className="text-blue-400/70">Model:</span> {systemInfo.cpu}</div>
              <div><span className="text-blue-400/70">Cores:</span> 16 (8P + 8E)</div>
              <div><span className="text-blue-400/70">Load:</span> {systemInfo.load}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-blue-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-lg flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div><span className="text-blue-400/70">Total:</span> {systemInfo.memory}</div>
              <div><span className="text-blue-400/70">Used:</span> 12.5GB (39%)</div>
              <div><span className="text-blue-400/70">Available:</span> 19.5GB</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-blue-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-lg flex items-center">
              <HardDrive className="w-5 h-5 mr-2" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div><span className="text-blue-400/70">Total:</span> {systemInfo.storage}</div>
              <div><span className="text-blue-400/70">Used:</span> 850GB (42%)</div>
              <div><span className="text-blue-400/70">Available:</span> 1.15TB</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-blue-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-lg flex items-center">
              <Network className="w-5 h-5 mr-2" />
              Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div><span className="text-blue-400/70">Interface:</span> {systemInfo.network}</div>
              <div><span className="text-blue-400/70">IP Address:</span> 192.168.1.100</div>
              <div><span className="text-blue-400/70">Status:</span> Connected</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-blue-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-400 text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div><span className="text-blue-400/70">Uptime:</span> {systemInfo.uptime}</div>
              <div><span className="text-blue-400/70">Security:</span> <span className="text-green-400">Active</span></div>
              <div><span className="text-blue-400/70">Status:</span> <span className="text-green-400">Operational</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 p-4 bg-blue-400/10 border border-blue-400/30 rounded-lg">
        <div className="flex items-center mb-2">
          <Shield className="w-5 h-5 text-blue-400 mr-2" />
          <span className="font-semibold text-blue-400">Security Status</span>
        </div>
        <div className="text-sm text-blue-400/80">
          All systems are secure and operational. Batcomputer protocols are active and monitoring for any threats.
        </div>
      </div>
    </div>
  )
}

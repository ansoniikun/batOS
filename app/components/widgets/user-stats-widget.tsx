'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Widget } from '@/app/types/desktop'
import { User, GripVertical, Shield, Database } from 'lucide-react'

interface UserStatsWidgetProps {
  widget: Widget
  onMove?: (position: { x: number; y: number }) => void
}

export function UserStatsWidget({ widget, onMove }: UserStatsWidgetProps) {
  const [userStats, setUserStats] = useState({
    networkSpeed: '1.2 GB/s',
    temperature: 42,
    battery: 87,
    ram: 6.8
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate stats changes
      setUserStats(prev => ({
        networkSpeed: `${(Math.random() * 2 + 0.5).toFixed(1)} GB/s`,
        temperature: Math.floor(Math.random() * 20 + 35),
        battery: Math.max(10, Math.min(100, prev.battery + (Math.random() * 10 - 5))),
        ram: Math.max(2, Math.min(8, prev.ram + (Math.random() * 2 - 1)))
      }))
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = widgetRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && onMove) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        onMove({ x: Math.max(0, newX), y: Math.max(0, newY) })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, onMove])

  return (
    <div 
      ref={widgetRef}
      className="bg-black/80 backdrop-blur-sm border border-blue-400/50 rounded-lg p-4 shadow-lg shadow-blue-400/20 cursor-move"
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-center space-x-2 mb-3">
        <GripVertical className="w-4 h-4 text-blue-400/70" />
        <User className="w-4 h-4 text-blue-400" />
        <span className="text-xs text-blue-400/70">DRAG</span>
      </div>
      
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-blue-400 font-mono font-bold text-lg">
            {userStats.networkSpeed}
          </div>
          <div className="text-xs text-blue-400/70">REB COLORS</div>
        </div>
        
        <div className="text-center">
          <div className="text-blue-400 font-mono">
            Average {userStats.temperature}% CPU
          </div>
          <div className="text-xs text-blue-400/70">11 km/h</div>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <div className="text-xs text-blue-400/70">Security Active</div>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Database className="w-4 h-4 text-blue-400" />
          <div className="text-xs text-blue-400/70">{userStats.ram.toFixed(1)}G RAM</div>
        </div>
      </div>
    </div>
  )
}

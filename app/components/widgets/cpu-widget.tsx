'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Widget } from '@/app/types/desktop'
import { Activity, GripVertical, Cpu } from 'lucide-react'
import { useTheme } from '@/app/contexts/theme-context'

interface CpuWidgetProps {
  widget: Widget
  onMove?: (position: { x: number; y: number }) => void
}

export function CpuWidget({ widget, onMove }: CpuWidgetProps) {
  const { getThemeClass } = useTheme()
  const [cpuUsage, setCpuUsage] = useState(60)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate CPU usage changes
      setCpuUsage(prev => {
        const change = Math.random() * 20 - 10
        return Math.max(10, Math.min(90, prev + change))
      })
    }, 2000)

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
      className={`${getThemeClass()} backdrop-blur-sm border border-blue-400/50 rounded-lg p-4 shadow-lg shadow-blue-400/20 cursor-move`}
      onMouseDown={handleMouseDown}
    >

      
      <div className="text-center">
        <div className="text-blue-400 font-mono mb-3">
          <div className="text-lg font-bold">
            {cpuUsage.toFixed(1)}%
          </div>
          <div className="text-sm opacity-80">CPU Usage</div>
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400 rounded-full transition-all duration-500" 
              style={{ width: `${cpuUsage}%` }} 
            />
          </div>
        </div>
        
        <div className="text-xs text-blue-400/70">
          WayneTech Quantum Core
        </div>
      </div>
    </div>
  )
}

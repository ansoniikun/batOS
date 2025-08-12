'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Widget } from '@/app/types/desktop'
import { Terminal, GripVertical, Activity } from 'lucide-react'

interface ConsoleWidgetProps {
  widget: Widget
  onMove?: (position: { x: number; y: number }) => void
}

export function ConsoleWidget({ widget, onMove }: ConsoleWidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)
  const [consoleOutput, setConsoleOutput] = useState([
    'Initializing Batcomputer systems...',
    'Loading surveillance networks...',
    'Connecting to WayneTech satellites...',
    'Establishing secure communications...',
    'Monitoring Gotham City grid...',
    'All systems operational.',
    'Dark Knight protocol active.',
    'Ready for mission deployment.'
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      const newMessages = [
        'Scanning for criminal activity...',
        'Updating threat assessment...',
        'Monitoring police frequencies...',
        'Analyzing traffic patterns...',
        'Checking security protocols...',
        'Surveillance systems online.',
        'Database synchronization complete.',
        'All systems nominal.'
      ]
      
      setConsoleOutput(prev => {
        const newOutput = [...prev, newMessages[Math.floor(Math.random() * newMessages.length)]]
        return newOutput.slice(-8) // Keep only last 8 messages
      })
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
        <Terminal className="w-4 h-4 text-blue-400" />
        <span className="text-xs text-blue-400/70">DRAG</span>
      </div>
      
      <div className="h-48 overflow-hidden">
        <div className="text-blue-400 text-sm font-bold mb-2 flex items-center space-x-2">
          <Activity className="w-4 h-4" />
          <span>System Console</span>
        </div>
        
        <div className="h-36 overflow-y-auto font-mono text-xs text-blue-400/80 space-y-1 bg-black/50 rounded p-2">
          {consoleOutput.map((line, index) => (
            <div key={index} className="flex">
              <span className="text-blue-400/50 mr-2">{'>'}</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Widget } from '@/app/types/desktop'
import { formatTime, formatDate } from '@/app/lib/utils'
import { GripVertical } from 'lucide-react'

interface ClockWidgetProps {
  widget: Widget
  onMove?: (position: { x: number; y: number }) => void
}

export function ClockWidget({ widget, onMove }: ClockWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

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
      document.addEventListener('mousemove', handleMouseMove)
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
      className="bg-black/70 backdrop-blur-sm text-blue-400 p-4 rounded-lg border border-blue-400/30 shadow-lg shadow-blue-400/20 cursor-move"
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-center space-x-2 mb-2">
        <GripVertical className="w-4 h-4 text-blue-400/70" />
        <span className="text-xs text-blue-400/70">DRAG</span>
      </div>
      <div className="text-center">
        <div className="text-2xl font-mono font-bold tracking-wider">
          {formatTime(currentTime)}
        </div>
        <div className="text-xs opacity-70 mt-1">
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Widget } from '@/app/types/desktop'
import { formatTime, formatDate } from '@/app/lib/utils'
import { GripVertical } from 'lucide-react'
import { useTheme } from '@/app/contexts/theme-context'

interface ClockWidgetProps {
  widget: Widget
  onMove?: (position: { x: number; y: number }) => void
}

export function ClockWidget({ widget, onMove }: ClockWidgetProps) {
  const { getThemeClass } = useTheme()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onMove) return
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - widget.position.x,
      y: e.clientY - widget.position.y
    })
    e.preventDefault()
    e.stopPropagation()
  }

  useEffect(() => {
    let animationFrameId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && onMove) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        
        animationFrameId = requestAnimationFrame(() => {
          const newX = e.clientX - dragStart.x
          const newY = e.clientY - dragStart.y
          const boundedX = Math.max(0, Math.min(newX, window.innerWidth - widget.size.width))
          const boundedY = Math.max(0, Math.min(newY, window.innerHeight - widget.size.height))
          onMove({ x: boundedX, y: boundedY })
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isDragging, dragStart, onMove, widget.size.width, widget.size.height])

  return (
    <div 
      ref={widgetRef}
      className={`${getThemeClass()} backdrop-blur-sm text-blue-400 p-4 rounded-lg border border-blue-400/30 shadow-lg shadow-blue-400/20 transition-transform duration-150 select-none ${
        isDragging ? 'cursor-grabbing opacity-90 scale-[1.02] shadow-2xl' : 'cursor-grab hover:scale-[1.01]'
      }`}
      onMouseDown={handleMouseDown}
    >

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

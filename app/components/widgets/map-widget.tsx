'use client'

import React, { useState, useRef } from 'react'
import { Widget } from '@/app/types/desktop'
import { MapPin, GripVertical, Navigation, Globe } from 'lucide-react'
import { useTheme } from '@/app/contexts/theme-context'

interface MapWidgetProps {
  widget: Widget
  onMove?: (position: { x: number; y: number }) => void
}

export function MapWidget({ widget, onMove }: MapWidgetProps) {
  const { getThemeClass } = useTheme()
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)
  const [currentLocation, setCurrentLocation] = useState('Europe Surveillance')

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

  React.useEffect(() => {
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

      
      <div className="w-64 h-48">
        <div className="text-blue-400 text-sm font-bold mb-2 flex items-center space-x-2">
          <Navigation className="w-4 h-4" />
          <span>{currentLocation}</span>
        </div>
        
        <div className="w-full h-32 bg-blue-400/10 rounded border border-blue-400/20 flex items-center justify-center relative">
          <MapPin className="w-8 h-8 text-blue-400/50" />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>
          </div>
          
          {/* Location markers */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-6 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-8 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        <div className="mt-2 text-xs text-blue-400/70">
          Active surveillance points: 3
        </div>
      </div>
    </div>
  )
}

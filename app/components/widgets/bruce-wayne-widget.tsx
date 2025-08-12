'use client'

import React, { useState, useRef } from 'react'
import { Widget } from '@/app/types/desktop'
import { User, GripVertical, Shield, Eye, Ruler } from 'lucide-react'

interface BruceWayneWidgetProps {
  widget: Widget
  onMove?: (position: { x: number; y: number }) => void
}

export function BruceWayneWidget({ widget, onMove }: BruceWayneWidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

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
      className="bg-black/80 backdrop-blur-sm border border-blue-400/50 rounded-lg p-4 shadow-lg shadow-blue-400/20 cursor-move"
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-center space-x-2 mb-3">
        <GripVertical className="w-4 h-4 text-blue-400/70" />
        <User className="w-4 h-4 text-blue-400" />
        <span className="text-xs text-blue-400/70">DRAG</span>
      </div>
      
      <div className="p-3 bg-blue-400/10 rounded border border-blue-400/20">
        <div className="text-blue-400 text-sm font-bold mb-3 flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Bruce Wayne</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-400/80">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>Age: 35</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>Gender: Male</span>
          </div>
          <div className="flex items-center space-x-1">
            <Ruler className="w-3 h-3" />
            <span>Height: 6'2"</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>Eye Color: Blue</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>Hair Color: Black</span>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-blue-400/20">
          <div className="text-xs text-blue-400/70">
            Status: Active
          </div>
        </div>
      </div>
    </div>
  )
}

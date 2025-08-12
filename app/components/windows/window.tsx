'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import { Window as WindowType } from '@/app/types/desktop'
import { Button } from '@/app/components/ui/button'
import { 
  X, 
  Minus, 
  Square, 
  Maximize2,
  GripVertical
} from 'lucide-react'

interface WindowComponentProps {
  window: WindowType
  onClose: () => void
  onFocus: () => void
  onMinimize: () => void
  onMaximize: () => void
  onMove: (position: { x: number; y: number }) => void
  onResize: (size: { width: number; height: number }) => void
  onClick?: () => void
}

export function WindowComponent({
  window,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  onClick
}: WindowComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onFocus()
      onClick?.()
    }
  }

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (!window.draggable) return
    
    setIsDragging(true)
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
    onFocus()
    e.preventDefault()
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!window.resizable) return
    
    setIsResizing(true)
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height
      })
    }
    onFocus()
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        onMove({ x: Math.max(0, newX), y: Math.max(0, newY) })
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        const newWidth = Math.max(300, resizeStart.width + deltaX)
        const newHeight = Math.max(200, resizeStart.height + deltaY)
        onResize({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, onMove, onResize])

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute pointer-events-auto",
        "bg-gray-900/95 backdrop-blur-sm border border-blue-400/50 shadow-2xl shadow-blue-400/20",
        "transition-all duration-200",
        window.isFocused ? "ring-2 ring-blue-400/50" : "opacity-80"
      )}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.isMaximized ? '100vw' : window.size.width,
        height: window.isMaximized ? 'calc(100vh - 48px)' : window.size.height,
        zIndex: window.zIndex
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Title Bar */}
      <div
        className={cn(
          "flex items-center justify-between h-8 px-2",
          "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm",
          "cursor-move select-none shadow-lg shadow-blue-400/30"
        )}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4" />
          <span className="truncate">{window.title}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-6 w-6 p-0 hover:bg-blue-400/20"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMaximize}
            className="h-6 w-6 p-0 hover:bg-blue-400/20"
          >
            {window.isMaximized ? (
              <Square className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden">
        {window.content}
      </div>

      {/* Resize Handle */}
      {window.resizable && !window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-blue-400" />
        </div>
      )}
    </div>
  )
}

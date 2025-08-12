'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import { Window as WindowType } from '@/app/types/desktop'
import { Button } from '@/app/components/ui/button'
import { useTheme } from '@/app/contexts/theme-context'
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
  const { getThemeClass } = useTheme()
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, 
    y: 0, 
    width: 0, 
    height: 0, 
    startX: 0, 
    startY: 0 
  })
  const [resizeCorner, setResizeCorner] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right'>('bottom-right')
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus()
    onClick?.()
  }

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (!window.draggable) return
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    })
    onFocus()
    e.preventDefault()
    e.stopPropagation()
  }

  const handleResizeMouseDown = (e: React.MouseEvent, corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right') => {
    if (!window.resizable) return
    
    setIsResizing(true)
    setResizeCorner(corner)
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: window.size.width,
        height: window.size.height,
        startX: window.position.x,
        startY: window.position.y
      })
    }
    onFocus()
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        const boundedX = Math.max(0, Math.min(newX, globalThis.innerWidth - window.size.width))
        const boundedY = Math.max(0, Math.min(newY, globalThis.innerHeight - window.size.height))
        onMove({ x: boundedX, y: boundedY })
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newX = resizeStart.startX
        let newY = resizeStart.startY
        
        if (resizeCorner === 'bottom-right') {
          newWidth = Math.max(300, resizeStart.width + deltaX)
          newHeight = Math.max(200, resizeStart.height + deltaY)
        } else if (resizeCorner === 'bottom-left') {
          newWidth = Math.max(300, resizeStart.width - deltaX)
          newHeight = Math.max(200, resizeStart.height + deltaY)
          newX = resizeStart.startX + deltaX
        } else if (resizeCorner === 'top-right') {
          newWidth = Math.max(300, resizeStart.width + deltaX)
          newHeight = Math.max(200, resizeStart.height - deltaY)
          newY = resizeStart.startY + deltaY
        } else if (resizeCorner === 'top-left') {
          newWidth = Math.max(300, resizeStart.width - deltaX)
          newHeight = Math.max(200, resizeStart.height - deltaY)
          newX = resizeStart.startX + deltaX
          newY = resizeStart.startY + deltaY
        } else if (resizeCorner === 'top') {
          newHeight = Math.max(200, resizeStart.height - deltaY)
          newY = resizeStart.startY + deltaY
        } else if (resizeCorner === 'bottom') {
          newHeight = Math.max(200, resizeStart.height + deltaY)
        } else if (resizeCorner === 'left') {
          newWidth = Math.max(300, resizeStart.width - deltaX)
          newX = resizeStart.startX + deltaX
        } else if (resizeCorner === 'right') {
          newWidth = Math.max(300, resizeStart.width + deltaX)
        }
        
        // Ensure window doesn't go off-screen
        newX = Math.max(0, Math.min(newX, globalThis.innerWidth - newWidth))
        newY = Math.max(0, Math.min(newY, globalThis.innerHeight - newHeight))
        
        // Update position and size together to avoid conflicts
        if (newX !== window.position.x || newY !== window.position.y) {
          onMove({ x: newX, y: newY })
        }
        if (newWidth !== window.size.width || newHeight !== window.size.height) {
          onResize({ width: newWidth, height: newHeight })
        }
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
  }, [isDragging, isResizing, dragStart, resizeStart, onMove, onResize, window.size.width, window.size.height])

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute pointer-events-auto",
        `${getThemeClass()} backdrop-blur-sm border border-blue-400/50 shadow-2xl shadow-blue-400/20`,
        "select-none",
        window.isFocused ? "ring-2 ring-blue-400/50" : "opacity-80",
        isDragging ? "cursor-grabbing" : "cursor-default"
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
        onClick={() => onFocus()}
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
      <div 
        className="flex-1 overflow-hidden h-full"
        style={{ height: `calc(100% - 32px)` }}
        onClick={() => onFocus()}
      >
        {window.content}
      </div>

      {/* Resize Handles */}
      {window.resizable && !window.isMaximized && (
        <>
          {/* Corner Handles */}
          {/* Top Left */}
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
          >
            <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-blue-400" />
          </div>
          
          {/* Top Right */}
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
          >
            <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-blue-400" />
          </div>
          
          {/* Bottom Left */}
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
          >
            <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-blue-400" />
          </div>
          
          {/* Bottom Right */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-blue-400" />
          </div>

          {/* Edge Handles */}
          {/* Top Edge */}
          <div
            className="absolute top-0 left-4 right-4 h-2 cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
          />
          
          {/* Bottom Edge */}
          <div
            className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
          />
          
          {/* Left Edge */}
          <div
            className="absolute top-4 bottom-4 left-0 w-2 cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
          />
          
          {/* Right Edge */}
          <div
            className="absolute top-4 bottom-4 right-0 w-2 cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
          />
        </>
      )}
    </div>
  )
}

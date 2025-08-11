'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import { Button } from '@/app/components/ui/button'
import { 
  X, 
  Minus, 
  Square, 
  Maximize2, 
  GripVertical,
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Settings,
  Database,
  Map,
  Shield,
  Car,
  Plane,
  Zap,
  Search,
  ArrowLeft,
  ArrowRight,
  Home
} from 'lucide-react'

interface FileManagerProps {
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  onMove?: (position: { x: number; y: number }) => void
  onResize?: (size: { width: number; height: number }) => void
  isFocused?: boolean
  position?: { x: number; y: number }
  size?: { width: number; height: number }
  isMaximized?: boolean
}

interface FileItem {
  name: string
  type: 'folder' | 'file'
  fileType?: 'text' | 'image' | 'video' | 'music' | 'archive' | 'database' | 'map' | 'settings' | 'vehicle' | 'gadget'
  size?: string
  modified?: string
  path: string
}

export function FileManager({
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  isFocused = false,
  position = { x: 100, y: 100 },
  size = { width: 800, height: 600 },
  isMaximized = false
}: FileManagerProps) {
  const [currentPath, setCurrentPath] = useState('/batcave')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const fileManagerRef = useRef<HTMLDivElement>(null)

  const fileSystem: Record<string, FileItem[]> = {
    '/batcave': [
      { name: 'batmobile', type: 'folder', fileType: 'vehicle', path: '/batcave/batmobile' },
      { name: 'batwing', type: 'folder', fileType: 'vehicle', path: '/batcave/batwing' },
      { name: 'batarangs', type: 'folder', fileType: 'gadget', path: '/batcave/batarangs' },
      { name: 'gadgets', type: 'folder', fileType: 'gadget', path: '/batcave/gadgets' },
      { name: 'surveillance', type: 'folder', fileType: 'database', path: '/batcave/surveillance' },
      { name: 'evidence', type: 'folder', fileType: 'database', path: '/batcave/evidence' },
      { name: 'case_files', type: 'folder', fileType: 'text', path: '/batcave/case_files' },
      { name: 'wayne_tech', type: 'folder', fileType: 'settings', path: '/batcave/wayne_tech' },
      { name: 'gotham_map', type: 'folder', fileType: 'map', path: '/batcave/gotham_map' },
      { name: 'criminal_database', type: 'folder', fileType: 'database', path: '/batcave/criminal_database' }
    ],
    '/batcave/batmobile': [
      { name: 'status.txt', type: 'file', fileType: 'text', size: '2.1 KB', modified: '2024-01-15 10:30', path: '/batcave/batmobile/status.txt' },
      { name: 'specs.txt', type: 'file', fileType: 'text', size: '1.8 KB', modified: '2024-01-15 10:30', path: '/batcave/batmobile/specs.txt' },
      { name: 'maintenance.log', type: 'file', fileType: 'text', size: '5.2 KB', modified: '2024-01-15 10:30', path: '/batcave/batmobile/maintenance.log' }
    ],
    '/batcave/surveillance': [
      { name: 'active_targets.txt', type: 'file', fileType: 'text', size: '3.4 KB', modified: '2024-01-15 10:30', path: '/batcave/surveillance/active_targets.txt' },
      { name: 'camera_feeds', type: 'folder', fileType: 'video', path: '/batcave/surveillance/camera_feeds' },
      { name: 'gps_tracking', type: 'folder', fileType: 'map', path: '/batcave/surveillance/gps_tracking' }
    ],
    '/batcave/case_files': [
      { name: 'joker_case.txt', type: 'file', fileType: 'text', size: '8.7 KB', modified: '2024-01-15 10:30', path: '/batcave/case_files/joker_case.txt' },
      { name: 'penguin_case.txt', type: 'file', fileType: 'text', size: '6.2 KB', modified: '2024-01-15 10:30', path: '/batcave/case_files/penguin_case.txt' },
      { name: 'riddler_case.txt', type: 'file', fileType: 'text', size: '4.9 KB', modified: '2024-01-15 10:30', path: '/batcave/case_files/riddler_case.txt' }
    ]
  }

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      switch (item.fileType) {
        case 'vehicle': return <Car className="w-6 h-6 text-blue-400" />
        case 'gadget': return <Zap className="w-6 h-6 text-blue-400" />
        case 'database': return <Database className="w-6 h-6 text-blue-400" />
        case 'map': return <Map className="w-6 h-6 text-blue-400" />
        case 'settings': return <Settings className="w-6 h-6 text-blue-400" />
        default: return <Folder className="w-6 h-6 text-blue-400" />
      }
    } else {
      switch (item.fileType) {
        case 'text': return <FileText className="w-6 h-6 text-blue-400" />
        case 'image': return <Image className="w-6 h-6 text-blue-400" />
        case 'video': return <Video className="w-6 h-6 text-blue-400" />
        case 'music': return <Music className="w-6 h-6 text-blue-400" />
        case 'archive': return <Archive className="w-6 h-6 text-blue-400" />
        case 'database': return <Database className="w-6 h-6 text-blue-400" />
        case 'map': return <Map className="w-6 h-6 text-blue-400" />
        case 'settings': return <Settings className="w-6 h-6 text-blue-400" />
        default: return <FileText className="w-6 h-6 text-blue-400" />
      }
    }
  }

  const currentFiles = fileSystem[currentPath] || []

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(item.path)
    }
  }

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(item.path)
    }
  }

  const handleBackClick = () => {
    const pathParts = currentPath.split('/')
    if (pathParts.length > 2) {
      pathParts.pop()
      setCurrentPath(pathParts.join('/'))
    }
  }

  const handleHomeClick = () => {
    setCurrentPath('/batcave')
  }

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = fileManagerRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
    e.preventDefault()
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    const rect = fileManagerRef.current?.getBoundingClientRect()
    if (rect) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height
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
      
      if (isResizing && onResize) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        const newWidth = Math.max(600, resizeStart.width + deltaX)
        const newHeight = Math.max(400, resizeStart.height + deltaY)
        onResize({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, onMove, onResize])

  return (
    <div
      ref={fileManagerRef}
      className={cn(
        "absolute bg-black/95 backdrop-blur-sm border border-blue-400/50 shadow-2xl shadow-blue-400/20",
        "transition-all duration-200",
        isFocused ? "ring-2 ring-blue-400/50" : "opacity-80"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: isMaximized ? 'calc(100vw - 80px)' : size.width,
        height: isMaximized ? 'calc(100vh - 128px)' : size.height,
        zIndex: isFocused ? 1000 : 100
      }}
    >
      {/* Title Bar */}
      <div
        className={cn(
          "flex items-center justify-between h-8 px-2",
          "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm",
          "cursor-move select-none shadow-lg shadow-blue-400/50"
        )}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4" />
          <span className="truncate">File Manager</span>
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
            {isMaximized ? (
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

      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-800/50 border-b border-blue-400/30">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            disabled={currentPath === '/batcave'}
            className="h-8 px-2 text-blue-400 hover:bg-blue-400/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHomeClick}
            className="h-8 px-2 text-blue-400 hover:bg-blue-400/10"
          >
            <Home className="w-4 h-4" />
          </Button>
          <div className="text-blue-400 text-sm font-mono px-2">
            {currentPath}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={cn(
              "h-8 px-2 text-blue-400 hover:bg-blue-400/10",
              viewMode === 'grid' && "bg-blue-400/20"
            )}
          >
            Grid
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={cn(
              "h-8 px-2 text-blue-400 hover:bg-blue-400/10",
              viewMode === 'list' && "bg-blue-400/20"
            )}
          >
            List
          </Button>
        </div>
      </div>

      {/* File Content */}
      <div className="flex-1 p-4 overflow-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-6 gap-4">
            {currentFiles.map((item) => (
              <div
                key={item.path}
                className="flex flex-col items-center p-3 rounded border border-blue-400/20 hover:bg-blue-400/10 cursor-pointer transition-colors"
                onClick={() => handleItemClick(item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                  {getFileIcon(item)}
                </div>
                <div className="text-center">
                  <div className="text-blue-400 text-xs font-medium truncate w-16">
                    {item.name}
                  </div>
                  {item.size && (
                    <div className="text-blue-400/70 text-xs">
                      {item.size}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {currentFiles.map((item) => (
              <div
                key={item.path}
                className="flex items-center p-2 rounded hover:bg-blue-400/10 cursor-pointer transition-colors"
                onClick={() => handleItemClick(item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
              >
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  {getFileIcon(item)}
                </div>
                <div className="flex-1">
                  <div className="text-blue-400 text-sm font-medium">
                    {item.name}
                  </div>
                  {item.size && (
                    <div className="text-blue-400/70 text-xs">
                      {item.size} • {item.modified}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
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

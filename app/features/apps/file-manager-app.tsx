'use client'

import React, { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { useTheme } from '@/app/contexts/theme-context'
import { 
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

interface FileItem {
  name: string
  type: 'folder' | 'file'
  fileType?: 'text' | 'image' | 'video' | 'music' | 'archive' | 'database' | 'map' | 'settings' | 'vehicle' | 'gadget'
  size?: string
  modified?: string
  path: string
}

export function FileManagerApp() {
  const { getThemeClass } = useTheme()
  const [currentPath, setCurrentPath] = useState('/batcave')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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

  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case 'vehicle':
        return <Car className="w-6 h-6 text-blue-400" />
      case 'gadget':
        return <Zap className="w-6 h-6 text-blue-400" />
      case 'database':
        return <Database className="w-6 h-6 text-blue-400" />
      case 'map':
        return <Map className="w-6 h-6 text-blue-400" />
      case 'settings':
        return <Settings className="w-6 h-6 text-blue-400" />
      case 'video':
        return <Video className="w-6 h-6 text-blue-400" />
      case 'image':
        return <Image className="w-6 h-6 text-blue-400" />
      case 'music':
        return <Music className="w-6 h-6 text-blue-400" />
      case 'archive':
        return <Archive className="w-6 h-6 text-blue-400" />
      case 'text':
      default:
        return <FileText className="w-6 h-6 text-blue-400" />
    }
  }

  const handleBackClick = () => {
    if (currentPath !== '/batcave') {
      setCurrentPath('/batcave')
    }
  }

  const handleHomeClick = () => {
    setCurrentPath('/batcave')
  }

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(item.path)
    } else {
      console.log(`Opening file: ${item.path}`)
    }
  }

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(item.path)
    } else {
      console.log(`Opening file: ${item.path}`)
    }
  }

  const currentFiles = fileSystem[currentPath] || []

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-blue-400">
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
            className={`h-8 px-2 text-blue-400 hover:bg-blue-400/10 ${
              viewMode === 'grid' ? 'bg-blue-400/20' : ''
            }`}
          >
            Grid
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={`h-8 px-2 text-blue-400 hover:bg-blue-400/10 ${
              viewMode === 'list' ? 'bg-blue-400/20' : ''
            }`}
          >
            List
          </Button>
        </div>
      </div>

      {/* File Content */}
            <div
        className={`flex-1 p-4 overflow-auto ${getThemeClass()}`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#3b82f6 #000000',
          scrollbarGutter: 'stable'
        }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {currentFiles.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                className="flex flex-col items-center p-3 bg-gray-800/50 border border-blue-400/30 rounded-lg hover:bg-blue-400/10 transition-colors cursor-pointer"
              >
                <div className="mb-2">
                  {item.type === 'folder' ? (
                    <Folder className="w-12 h-12 text-blue-400" />
                  ) : (
                    getFileIcon(item.fileType)
                  )}
                </div>
                <div className="text-center">
                  <div className="text-blue-400 text-sm font-medium truncate w-full">
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
            {currentFiles.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                className="flex items-center p-2 bg-gray-800/50 border border-blue-400/30 rounded hover:bg-blue-400/10 transition-colors cursor-pointer"
              >
                <div className="mr-3">
                  {item.type === 'folder' ? (
                    <Folder className="w-6 h-6 text-blue-400" />
                  ) : (
                    getFileIcon(item.fileType)
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-blue-400 font-medium">{item.name}</div>
                  <div className="text-blue-400/70 text-xs">
                    {item.size} • {item.modified}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

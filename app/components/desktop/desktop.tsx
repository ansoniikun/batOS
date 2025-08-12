'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import { DesktopState, Window, DesktopApp } from '@/app/types/desktop'
import { Taskbar } from '@/app/components/taskbar/taskbar'
import { WindowManager } from '@/app/components/windows/window-manager'
import { WidgetManager } from '@/app/components/widgets/widget-manager'
import { NotificationCenter } from '@/app/components/notifications/notification-center'
import { StartMenu } from '@/app/components/start-menu/start-menu'
import { NotepadApp } from '@/app/features/apps/notepad-app'
import { SystemInfoApp } from '@/app/features/apps/system-info-app'
import { BatcomputerInterface } from '@/app/components/batcomputer/batcomputer-interface'
import { BatcomputerTerminal } from '@/app/components/terminal/batcomputer-terminal'
import { FileManager } from '@/app/components/file-manager/file-manager'
import { SystemMenu } from '@/app/components/system-menu/system-menu'

interface DesktopProps {
  className?: string
}

export function Desktop({ className }: DesktopProps) {
  const [desktopState, setDesktopState] = useState<DesktopState>({
    windows: [],
    activeWindowId: null,
    taskbarItems: [],
    notifications: [],
    widgets: [
      {
        id: 'clock-widget',
        name: 'Clock',
        type: 'clock',
        position: { x: 20, y: 100 },
        size: { width: 200, height: 120 }
      },
      {
        id: 'calendar-widget',
        name: 'Calendar',
        type: 'calendar',
        position: { x: 240, y: 100 },
        size: { width: 200, height: 150 }
      },
      {
        id: 'cpu-widget',
        name: 'CPU Usage',
        type: 'cpu',
        position: { x: 460, y: 100 },
        size: { width: 200, height: 150 }
      },
      {
        id: 'user-stats-widget',
        name: 'User Stats',
        type: 'user-stats',
        position: { x: 680, y: 100 },
        size: { width: 200, height: 180 }
      },
      {
        id: 'bruce-wayne-widget',
        name: 'Bruce Wayne Profile',
        type: 'bruce-wayne',
        position: { x: 900, y: 100 },
        size: { width: 200, height: 200 }
      },
      {
        id: 'console-widget',
        name: 'System Console',
        type: 'console',
        position: { x: 20, y: 300 },
        size: { width: 300, height: 250 }
      },
      {
        id: 'map-widget',
        name: 'Surveillance Map',
        type: 'map',
        position: { x: 340, y: 300 },
        size: { width: 280, height: 200 }
      },
      {
        id: 'weather-widget',
        name: 'Weather & System',
        type: 'weather',
        position: { x: 640, y: 300 },
        size: { width: 280, height: 150 }
      }
    ],
    theme: 'batcomputer',
    wallpaper: '/batcomputer-bg.jpg'
  })

  const [currentTime, setCurrentTime] = useState(new Date())
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [terminalState, setTerminalState] = useState({
    isOpen: false,
    position: { x: 200, y: 150 },
    size: { width: 700, height: 500 },
    isMaximized: false,
    isFocused: false
  })

  const [fileManagerState, setFileManagerState] = useState({
    isOpen: false,
    position: { x: 300, y: 200 },
    size: { width: 800, height: 600 },
    isMaximized: false,
    isFocused: false
  })

  const [systemMenuState, setSystemMenuState] = useState({
    isOpen: false
  })

  const [widgetVisibility, setWidgetVisibility] = useState<Record<string, boolean>>({
    'clock-widget': false,
    'calendar-widget': false,
    'cpu-widget': false,
    'user-stats-widget': false,
    'bruce-wayne-widget': false,
    'console-widget': false,
    'map-widget': false,
    'weather-widget': false
  })

  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    x: number
    y: number
  }>({
    isOpen: false,
    x: 0,
    y: 0
  })

  const [globalZIndex, setGlobalZIndex] = useState(1000)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const openWindow = (app: DesktopApp) => {
    let content: React.ReactNode
    
    switch (app.id) {
      case 'notepad':
        content = <NotepadApp />
        break
      case 'system-info':
        content = <SystemInfoApp />
        break
      default:
        content = app.executable()
    }

    const newWindow: Window = {
      id: app.id,
      title: app.name,
      type: 'app',
      position: app.defaultPosition || { x: 100, y: 100 },
      size: app.defaultSize || { width: 800, height: 600 },
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      zIndex: Math.max(...desktopState.windows.map(w => w.zIndex), 0) + 1,
      content: content,
      icon: app.icon,
      resizable: true,
      draggable: true
    }

    setDesktopState(prev => ({
      ...prev,
      windows: [...prev.windows, newWindow],
      activeWindowId: newWindow.id,
      taskbarItems: [...prev.taskbarItems, {
        id: app.id,
        title: app.name,
        icon: app.icon,
        isActive: true,
        isMinimized: false,
        onClick: () => focusWindow(app.id)
      }]
    }))
  }

  const closeWindow = (windowId: string) => {
    setDesktopState(prev => ({
      ...prev,
      windows: prev.windows.filter(w => w.id !== windowId),
      taskbarItems: prev.taskbarItems.filter(t => t.id !== windowId),
      activeWindowId: prev.activeWindowId === windowId ? null : prev.activeWindowId
    }))
  }

  const focusWindow = (windowId: string) => {
    setGlobalZIndex(prev => prev + 1)
    setDesktopState(prev => ({
      ...prev,
      windows: prev.windows.map(w => ({
        ...w,
        isFocused: w.id === windowId,
        zIndex: w.id === windowId ? globalZIndex + 1 : w.zIndex
      })),
      activeWindowId: windowId,
      taskbarItems: prev.taskbarItems.map(t => ({
        ...t,
        isActive: t.id === windowId
      }))
    }))
  }

  const bringWindowToFront = (windowId: string) => {
    setGlobalZIndex(prev => prev + 1)
    setDesktopState(prev => ({
      ...prev,
      windows: prev.windows.map(w => ({
        ...w,
        zIndex: w.id === windowId ? globalZIndex + 1 : w.zIndex
      }))
    }))
  }

  const minimizeWindow = (windowId: string) => {
    setDesktopState(prev => ({
      ...prev,
      windows: prev.windows.map(w => 
        w.id === windowId ? { ...w, isMinimized: true } : w
      ),
      taskbarItems: prev.taskbarItems.map(t => ({
        ...t,
        isMinimized: t.id === windowId ? true : t.isMinimized
      }))
    }))
  }

  const maximizeWindow = (windowId: string) => {
    setDesktopState(prev => ({
      ...prev,
      windows: prev.windows.map(w => 
        w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
      )
    }))
  }

  const updateWindowPosition = (windowId: string, position: { x: number; y: number }) => {
    setDesktopState(prev => ({
      ...prev,
      windows: prev.windows.map(w => 
        w.id === windowId ? { ...w, position } : w
      )
    }))
  }

  const updateWindowSize = (windowId: string, size: { width: number; height: number }) => {
    setDesktopState(prev => ({
      ...prev,
      windows: prev.windows.map(w => 
        w.id === windowId ? { ...w, size } : w
      )
    }))
  }

  const handleSystemMenuToggle = () => {
    // Close start menu if open
    if (isStartMenuOpen) {
      setIsStartMenuOpen(false)
    }
    // Toggle system menu
    setSystemMenuState(prev => ({ ...prev, isOpen: !prev.isOpen }))
  }

  const handleStartMenuToggle = () => {
    // Close system menu if open
    if (systemMenuState.isOpen) {
      setSystemMenuState(prev => ({ ...prev, isOpen: false }))
    }
    // Toggle start menu
    setIsStartMenuOpen(prev => !prev)
  }

  const handleSystemMenuClose = () => {
    setSystemMenuState(prev => ({ ...prev, isOpen: false }))
  }

  const handleLaunchApp = (appId: string) => {
    switch (appId) {
      case 'terminal':
        setTerminalState(prev => ({ ...prev, isOpen: true, isFocused: true }))
        break
      case 'file-manager':
        setFileManagerState(prev => ({ ...prev, isOpen: true, isFocused: true }))
        break
      case 'system-info':
        openWindow({ 
          id: 'system-info', 
          name: 'System Info', 
          icon: 'monitor', 
          description: 'System monitoring and diagnostics',
          category: 'system',
          executable: () => <SystemInfoApp /> 
        })
        break
      case 'settings':
        openWindow({ 
          id: 'settings', 
          name: 'Settings', 
          icon: 'settings', 
          description: 'System preferences and configuration',
          category: 'system',
          executable: () => <div>Settings App</div> 
        })
        break
    }
  }

  const handleStartMenuAppLaunch = (app: DesktopApp) => {
    // Handle special apps that don't use the window system
    if (app.id === 'terminal') {
      setTerminalState(prev => ({ ...prev, isOpen: true, isFocused: true }))
    } else if (app.id === 'file-manager') {
      setFileManagerState(prev => ({ ...prev, isOpen: true, isFocused: true }))
    } else {
      // Use the window system for other apps
      openWindow(app)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleContextMenuClose = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }))
  }

  const toggleWidget = (widgetId: string) => {
    setWidgetVisibility(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }))
    handleContextMenuClose()
  }

  return (
    <div 
      className={cn(
        "relative w-full h-screen overflow-hidden",
        className
      )}
      onContextMenu={handleContextMenu}
      onClick={handleContextMenuClose}
    >
      {/* Batcomputer Interface */}
      <BatcomputerInterface 
        currentTime={currentTime} 
        onSystemMenuToggle={handleSystemMenuToggle}
        onStartMenuClick={handleStartMenuToggle}
      />
      
      {/* Desktop Content */}
      <div className="relative z-10 w-full h-full">
        {/* Widgets Layer */}
        <WidgetManager 
          widgets={desktopState.widgets.filter(widget => widgetVisibility[widget.id])}
          onWidgetUpdate={(widgets: any) => setDesktopState(prev => ({ ...prev, widgets }))}
        />

        {/* Windows Layer */}
        <WindowManager
          windows={desktopState.windows}
          onWindowClose={closeWindow}
          onWindowFocus={focusWindow}
          onWindowMinimize={minimizeWindow}
          onWindowMaximize={maximizeWindow}
          onWindowMove={updateWindowPosition}
          onWindowResize={updateWindowSize}
          onWindowClick={bringWindowToFront}
        />

        {/* Taskbar */}
        <Taskbar
          items={desktopState.taskbarItems}
          onItemClick={(item: any) => {
            if (item.isMinimized) {
              setDesktopState(prev => ({
                ...prev,
                windows: prev.windows.map(w => 
                  w.id === item.id ? { ...w, isMinimized: false } : w
                ),
                taskbarItems: prev.taskbarItems.map(t => ({
                  ...t,
                  isMinimized: t.id === item.id ? false : t.isMinimized
                }))
              }))
            }
            item.onClick()
          }}
          onStartMenuClick={handleStartMenuToggle}
          onSystemMenuToggle={handleSystemMenuToggle}
          currentTime={currentTime}
        />

        {/* Notification Center */}
        <NotificationCenter
          notifications={desktopState.notifications}
          onNotificationDismiss={(id: string) => {
            setDesktopState(prev => ({
              ...prev,
              notifications: prev.notifications.filter(n => n.id !== id)
            }))
          }}
        />

        {/* Start Menu */}
        <StartMenu
          isOpen={isStartMenuOpen}
          onClose={() => setIsStartMenuOpen(false)}
          onAppLaunch={handleStartMenuAppLaunch}
        />

        {/* Terminal */}
        {terminalState.isOpen && (
          <BatcomputerTerminal
            position={terminalState.position}
            size={terminalState.size}
            isMaximized={terminalState.isMaximized}
            isFocused={terminalState.isFocused}
            onClose={() => setTerminalState(prev => ({ ...prev, isOpen: false }))}
            onMinimize={() => setTerminalState(prev => ({ ...prev, isOpen: false }))}
            onMaximize={() => setTerminalState(prev => ({ ...prev, isMaximized: !prev.isMaximized }))}
            onMove={(position) => setTerminalState(prev => ({ ...prev, position }))}
            onResize={(size) => setTerminalState(prev => ({ ...prev, size }))}
            onFocus={() => {
              setGlobalZIndex(prev => prev + 1)
              setTerminalState(prev => ({ ...prev, isFocused: true }))
            }}
          />
        )}

        {/* File Manager */}
        {fileManagerState.isOpen && (
          <FileManager
            position={fileManagerState.position}
            size={fileManagerState.size}
            isMaximized={fileManagerState.isMaximized}
            isFocused={fileManagerState.isFocused}
            onClose={() => setFileManagerState(prev => ({ ...prev, isOpen: false }))}
            onMinimize={() => setFileManagerState(prev => ({ ...prev, isOpen: false }))}
            onMaximize={() => setFileManagerState(prev => ({ ...prev, isMaximized: !prev.isMaximized }))}
            onMove={(position) => setFileManagerState(prev => ({ ...prev, position }))}
            onResize={(size) => setFileManagerState(prev => ({ ...prev, size }))}
            onFocus={() => {
              setGlobalZIndex(prev => prev + 1)
              setFileManagerState(prev => ({ ...prev, isFocused: true }))
            }}
          />
        )}

        {/* System Menu */}
        <SystemMenu
          isOpen={systemMenuState.isOpen}
          onClose={handleSystemMenuClose}
          onLaunchApp={handleLaunchApp}
          systemInfo={{
            os: 'BatOS',
            version: '978.0.06.51',
            cpu: 'WayneTech Quantum Core',
            memory: '64GB RAM',
            storage: '2TB SSD',
            uptime: '47 days, 12 hours',
            battery: 87
          }}
                />

        {/* Context Menu */}
        {contextMenu.isOpen && (
          <div 
            className="fixed z-50 bg-black/95 backdrop-blur-md border border-blue-400/50 shadow-2xl rounded-lg py-2 min-w-48"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-blue-400 text-sm font-bold px-4 py-2 border-b border-blue-400/30">
              Add Widgets
            </div>
            {Object.entries(widgetVisibility).map(([widgetId, isVisible]) => {
              const widget = desktopState.widgets.find(w => w.id === widgetId)
              return (
                <button
                  key={widgetId}
                  onClick={() => toggleWidget(widgetId)}
                  className="w-full text-left px-4 py-2 text-blue-400 hover:bg-blue-400/10 transition-colors flex items-center justify-between"
                >
                  <span>{widget?.name || widgetId}</span>
                  <span className="text-blue-400/70 text-xs">
                    {isVisible ? 'Hide' : 'Show'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

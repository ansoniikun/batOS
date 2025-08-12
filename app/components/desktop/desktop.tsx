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
import { TerminalApp } from '@/app/features/apps/terminal-app'
import { FileManagerApp } from '@/app/features/apps/file-manager-app'
import { IpodApp } from '@/app/features/apps/ipod-app'
import { SystemMenu } from '@/app/components/system-menu/system-menu'
import { useTheme } from '@/app/contexts/theme-context'
import { ClockWidget } from '@/app/components/widgets/clock-widget'
import { CalendarWidget } from '@/app/components/widgets/calendar-widget'
import { CpuWidget } from '@/app/components/widgets/cpu-widget'
import { UserStatsWidget } from '@/app/components/widgets/user-stats-widget'
import { BruceWayneWidget } from '@/app/components/widgets/bruce-wayne-widget'
import { ConsoleWidget } from '@/app/components/widgets/console-widget'
import { MapWidget } from '@/app/components/widgets/map-widget'
import { WeatherWidget } from '@/app/components/widgets/weather-widget'
import { AlertWidget } from '@/app/components/widgets/alert-widget'

interface DesktopProps {
  className?: string
}

export function Desktop({ className }: DesktopProps) {
  const { theme, setTheme, getThemeClass } = useTheme()
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
      },
      {
        id: 'alert-widget',
        name: 'Alert System',
        type: 'alert',
        position: { x: 940, y: 100 },
        size: { width: 300, height: 250 }
      }
    ],
    theme: 'batcomputer',
    wallpaper: '/batcomputer-bg.jpg'
  })

  const [currentTime, setCurrentTime] = useState(new Date())
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)


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
    'weather-widget': false,
    'alert-widget': false
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
  const [contextMenuSections, setContextMenuSections] = useState({
    themes: false,
    widgets: false
  })

  const [globalZIndex, setGlobalZIndex] = useState(1000)

  // Applications data for system menu
  const applications = [
    {
      id: 'terminal',
      name: 'Terminal',
      icon: 'terminal',
      description: 'Command line interface',
      category: 'system' as const,
      executable: () => <div>Terminal App</div>,
      defaultSize: { width: 800, height: 600 },
      defaultPosition: { x: 100, y: 100 }
    },
    {
      id: 'file-manager',
      name: 'File Manager',
      icon: 'folder',
      description: 'Browse files and folders',
      category: 'system' as const,
      executable: () => <div>File Manager App</div>,
      defaultSize: { width: 900, height: 700 },
      defaultPosition: { x: 150, y: 150 }
    },
    {
      id: 'ipod',
      name: 'Batplayer',
      icon: 'music',
      description: 'Retro music player',
      category: 'entertainment' as const,
      executable: () => <div>Batplayer App</div>,
      defaultSize: { width: 240, height: 320 },
      defaultPosition: { x: 200, y: 200 }
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const openWindow = (app: DesktopApp) => {
    // Check if window already exists
    const existingWindow = desktopState.windows.find(w => w.id === app.id)
    
    if (existingWindow) {
      // Window exists, focus it and bring to front
      if (existingWindow.isMinimized) {
        // Unminimize if minimized
        setDesktopState(prev => ({
          ...prev,
          windows: prev.windows.map(w => 
            w.id === app.id ? { ...w, isMinimized: false } : w
          ),
          taskbarItems: prev.taskbarItems.map(t => ({
            ...t,
            isMinimized: t.id === app.id ? false : t.isMinimized
          }))
        }))
      }
      focusWindow(app.id)
      return
    }

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



  const handleStartMenuAppLaunch = (app: DesktopApp) => {
    // Check if window already exists
    const existingWindow = desktopState.windows.find(w => w.id === app.id)
    
    if (existingWindow) {
      // Window exists, focus it and bring to front
      if (existingWindow.isMinimized) {
        // Unminimize if minimized
        setDesktopState(prev => ({
          ...prev,
          windows: prev.windows.map(w => 
            w.id === app.id ? { ...w, isMinimized: false } : w
          ),
          taskbarItems: prev.taskbarItems.map(t => ({
            ...t,
            isMinimized: t.id === app.id ? false : t.isMinimized
          }))
        }))
      }
      focusWindow(app.id)
      return
    }

    // Handle special apps that don't use the window system
    if (app.id === 'terminal') {
      // Create a terminal window in the window manager
      const terminalWindow: Window = {
        id: 'terminal',
        title: 'Terminal',
        type: 'terminal',
        position: { x: 200, y: 150 },
        size: { width: 700, height: 500 },
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        zIndex: globalZIndex + 1,
        content: <TerminalApp />,
        icon: 'terminal',
        resizable: true,
        draggable: true
      }
      setGlobalZIndex(prev => prev + 1)
      setDesktopState(prev => ({
        ...prev,
        windows: [...prev.windows, terminalWindow],
        activeWindowId: 'terminal',
        taskbarItems: [...prev.taskbarItems, {
          id: 'terminal',
          title: 'Terminal',
          icon: 'terminal',
          isActive: true,
          isMinimized: false,
          onClick: () => focusWindow('terminal')
        }]
      }))
    } else if (app.id === 'file-manager') {
      // Create a file manager window in the window manager
      const fileManagerWindow: Window = {
        id: 'file-manager',
        title: 'File Manager',
        type: 'file-manager',
        position: { x: 300, y: 200 },
        size: { width: 800, height: 600 },
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        zIndex: globalZIndex + 1,
        content: <FileManagerApp />,
        icon: 'folder',
        resizable: true,
        draggable: true
      }
      setGlobalZIndex(prev => prev + 1)
      setDesktopState(prev => ({
        ...prev,
        windows: [...prev.windows, fileManagerWindow],
        activeWindowId: 'file-manager',
        taskbarItems: [...prev.taskbarItems, {
          id: 'file-manager',
          title: 'File Manager',
          icon: 'folder',
          isActive: true,
          isMinimized: false,
          onClick: () => focusWindow('file-manager')
        }]
      }))
    } else if (app.id === 'ipod') {
      // Create a Batplayer window in the window manager
      const batplayerWindow: Window = {
        id: 'ipod',
        title: 'Batplayer',
        type: 'app',
        position: { x: 250, y: 150 },
        size: { width: 240, height: 320 },
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        zIndex: globalZIndex + 1,
        content: <IpodApp />,
        icon: 'music',
        resizable: true,
        draggable: true
      }
      setGlobalZIndex(prev => prev + 1)
      setDesktopState(prev => ({
        ...prev,
        windows: [...prev.windows, batplayerWindow],
        activeWindowId: 'ipod',
        taskbarItems: [...prev.taskbarItems, {
          id: 'ipod',
          title: 'Batplayer',
          icon: 'music',
          isActive: true,
          isMinimized: false,
          onClick: () => focusWindow('ipod')
        }]
      }))
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
    setContextMenuSections({ themes: false, widgets: false })
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
          widgets={desktopState.widgets}
          visibleWidgets={widgetVisibility}
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



        {/* System Menu */}
        <SystemMenu
          isOpen={systemMenuState.isOpen}
          onClose={handleSystemMenuClose}
          onLaunchApp={(appId) => {
            if (appId === 'terminal' || appId === 'file-manager') {
              // Handle through start menu launch
              const app = applications.find(a => a.id === appId)
              if (app) {
                handleStartMenuAppLaunch(app)
              }
            } else {
              // Handle other apps
              switch (appId) {
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
          }}
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
            className={`fixed z-50 ${getThemeClass()} backdrop-blur-md border border-blue-400/50 shadow-2xl rounded-lg py-2 min-w-48`}
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Themes Section */}
            <button
              onClick={() => setContextMenuSections(prev => ({ ...prev, themes: !prev.themes }))}
              className="w-full text-left px-4 py-2 text-blue-400 hover:bg-blue-400/10 transition-colors flex items-center justify-between"
            >
              <span className="font-bold">Themes</span>
              <span className="text-blue-400">{contextMenuSections.themes ? '▼' : '▶'}</span>
            </button>
            {contextMenuSections.themes && (
              <div className="border-l-2 border-blue-400/30 ml-2">
                <button
                  onClick={() => {
                    setTheme('liquid')
                    handleContextMenuClose()
                  }}
                  className={`w-full text-left px-4 py-2 text-blue-400 hover:bg-blue-400/10 transition-colors flex items-center justify-between ${
                    theme === 'liquid' ? 'bg-blue-400/20' : ''
                  }`}
                >
                  <span>Liquid</span>
                  {theme === 'liquid' && <span className="text-blue-400">✓</span>}
                </button>
                <button
                  onClick={() => {
                    setTheme('frost')
                    handleContextMenuClose()
                  }}
                  className={`w-full text-left px-4 py-2 text-blue-400 hover:bg-blue-400/10 transition-colors flex items-center justify-between ${
                    theme === 'frost' ? 'bg-blue-400/20' : ''
                  }`}
                >
                  <span>Frost</span>
                  {theme === 'frost' && <span className="text-blue-400">✓</span>}
                </button>
              </div>
            )}
            
            {/* Add Widgets Section */}
            <button
              onClick={() => setContextMenuSections(prev => ({ ...prev, widgets: !prev.widgets }))}
              className="w-full text-left px-4 py-2 text-blue-400 hover:bg-blue-400/10 transition-colors flex items-center justify-between"
            >
              <span className="font-bold">Add Widgets</span>
              <span className="text-blue-400">{contextMenuSections.widgets ? '▼' : '▶'}</span>
            </button>
            {contextMenuSections.widgets && (
              <div className="border-l-2 border-blue-400/30 ml-2">
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
        )}
      </div>
    </div>
  )
}

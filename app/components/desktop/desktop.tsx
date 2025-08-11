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
        position: { x: 20, y: 20 },
        size: { width: 200, height: 100 }
      }
    ],
    theme: 'batcomputer',
    wallpaper: '/batcomputer-bg.jpg'
  })

  const [currentTime, setCurrentTime] = useState(new Date())
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [terminalState, setTerminalState] = useState({
    isOpen: true,
    position: { x: 200, y: 150 },
    size: { width: 700, height: 500 },
    isMaximized: false,
    isFocused: true
  })

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
    setDesktopState(prev => ({
      ...prev,
      windows: prev.windows.map(w => ({
        ...w,
        isFocused: w.id === windowId,
        zIndex: w.id === windowId ? Math.max(...prev.windows.map(w => w.zIndex), 0) + 1 : w.zIndex
      })),
      activeWindowId: windowId,
      taskbarItems: prev.taskbarItems.map(t => ({
        ...t,
        isActive: t.id === windowId
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

  return (
    <div className={cn(
      "relative w-full h-screen overflow-hidden",
      className
    )}>
      {/* Batcomputer Interface */}
      <BatcomputerInterface currentTime={currentTime} />
      
      {/* Desktop Content */}
      <div className="relative z-10 w-full h-full">
        {/* Widgets Layer */}
        <WidgetManager 
          widgets={desktopState.widgets}
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
          onStartMenuClick={() => {
            setIsStartMenuOpen(true)
          }}
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
          onAppLaunch={openWindow}
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
          />
        )}
      </div>
    </div>
  )
}

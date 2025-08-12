import React from 'react'

export interface Window {
  id: string
  title: string
  type: 'app' | 'widget' | 'system' | 'terminal' | 'file-manager'
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
  zIndex: number
  content?: React.ReactNode
  icon?: string
  resizable?: boolean
  draggable?: boolean
}

export interface DesktopApp {
  id: string
  name: string
  icon: string
  description: string
  category: 'system' | 'utilities' | 'development' | 'entertainment' | 'security'
  executable: () => React.ReactNode
  defaultSize?: { width: number; height: number }
  defaultPosition?: { x: number; y: number }
}

export interface TaskbarItem {
  id: string
  title: string
  icon: string
  isActive: boolean
  isMinimized: boolean
  onClick: () => void
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface Widget {
  id: string
  name: string
  type: 'clock' | 'calendar' | 'cpu' | 'user-stats' | 'bruce-wayne' | 'console' | 'map' | 'weather' | 'alert' | 'system' | 'custom'
  position: { x: number; y: number }
  size: { width: number; height: number }
  config?: Record<string, any>
}

export interface DesktopState {
  windows: Window[]
  activeWindowId: string | null
  taskbarItems: TaskbarItem[]
  notifications: Notification[]
  widgets: Widget[]
  theme: 'dark' | 'light' | 'batcomputer'
  wallpaper: string
}

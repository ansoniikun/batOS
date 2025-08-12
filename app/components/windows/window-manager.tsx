'use client'

import React from 'react'
import { Window } from '@/app/types/desktop'
import { WindowComponent } from './window'

interface WindowManagerProps {
  windows: Window[]
  onWindowClose: (windowId: string) => void
  onWindowFocus: (windowId: string) => void
  onWindowMinimize: (windowId: string) => void
  onWindowMaximize: (windowId: string) => void
  onWindowMove: (windowId: string, position: { x: number; y: number }) => void
  onWindowResize: (windowId: string, size: { width: number; height: number }) => void
  onWindowClick?: (windowId: string) => void
}

export function WindowManager({
  windows,
  onWindowClose,
  onWindowFocus,
  onWindowMinimize,
  onWindowMaximize,
  onWindowMove,
  onWindowResize,
  onWindowClick
}: WindowManagerProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {windows
        .filter(window => !window.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => (
          <WindowComponent
            key={window.id}
            window={window}
            onClose={() => onWindowClose(window.id)}
            onFocus={() => onWindowFocus(window.id)}
            onMinimize={() => onWindowMinimize(window.id)}
            onMaximize={() => onWindowMaximize(window.id)}
            onMove={(position) => onWindowMove(window.id, position)}
            onResize={(size) => onWindowResize(window.id, size)}
            onClick={() => onWindowClick?.(window.id)}
          />
        ))}
    </div>
  )
}

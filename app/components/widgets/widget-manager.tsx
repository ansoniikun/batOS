'use client'

import React from 'react'
import { Widget } from '@/app/types/desktop'
import { ClockWidget } from './clock-widget'

interface WidgetManagerProps {
  widgets: Widget[]
  onWidgetUpdate: (widgets: Widget[]) => void
}

export function WidgetManager({ widgets, onWidgetUpdate }: WidgetManagerProps) {
  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'clock':
        return <ClockWidget 
          widget={widget} 
          onMove={(position) => {
            const updatedWidgets = widgets.map(w => 
              w.id === widget.id ? { ...w, position } : w
            )
            onWidgetUpdate(updatedWidgets)
          }}
        />
      case 'weather':
        return <div className="bg-black/50 text-blue-400 p-4 rounded border border-blue-400/30">
          <div className="text-sm font-mono">Weather Widget</div>
          <div className="text-xs opacity-70">Coming soon...</div>
        </div>
      case 'system':
        return <div className="bg-black/50 text-blue-400 p-4 rounded border border-blue-400/30">
          <div className="text-sm font-mono">System Widget</div>
          <div className="text-xs opacity-70">Coming soon...</div>
        </div>
      default:
        return <div className="bg-black/50 text-blue-400 p-4 rounded border border-blue-400/30">
          <div className="text-sm font-mono">Custom Widget</div>
          <div className="text-xs opacity-70">Coming soon...</div>
        </div>
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="absolute pointer-events-auto"
          style={{
            left: widget.position.x,
            top: widget.position.y,
            width: widget.size.width,
            height: widget.size.height
          }}
        >
          {renderWidget(widget)}
        </div>
      ))}
    </div>
  )
}

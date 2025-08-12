'use client'

import React from 'react'
import { Widget } from '@/app/types/desktop'
import { ClockWidget } from './clock-widget'
import { CalendarWidget } from './calendar-widget'
import { CpuWidget } from './cpu-widget'
import { UserStatsWidget } from './user-stats-widget'
import { BruceWayneWidget } from './bruce-wayne-widget'
import { ConsoleWidget } from './console-widget'
import { MapWidget } from './map-widget'
import { WeatherWidget } from './weather-widget'

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
      case 'calendar':
        return <CalendarWidget 
          widget={widget} 
          onMove={(position) => {
            const updatedWidgets = widgets.map(w => 
              w.id === widget.id ? { ...w, position } : w
            )
            onWidgetUpdate(updatedWidgets)
          }}
        />
      case 'cpu':
        return <CpuWidget 
          widget={widget} 
          onMove={(position) => {
            const updatedWidgets = widgets.map(w => 
              w.id === widget.id ? { ...w, position } : w
            )
            onWidgetUpdate(updatedWidgets)
          }}
        />
      case 'user-stats':
        return <UserStatsWidget 
          widget={widget} 
          onMove={(position) => {
            const updatedWidgets = widgets.map(w => 
              w.id === widget.id ? { ...w, position } : w
            )
            onWidgetUpdate(updatedWidgets)
          }}
        />
      case 'bruce-wayne':
        return <BruceWayneWidget 
          widget={widget} 
          onMove={(position) => {
            const updatedWidgets = widgets.map(w => 
              w.id === widget.id ? { ...w, position } : w
            )
            onWidgetUpdate(updatedWidgets)
          }}
        />
      case 'console':
        return <ConsoleWidget 
          widget={widget} 
          onMove={(position) => {
            const updatedWidgets = widgets.map(w => 
              w.id === widget.id ? { ...w, position } : w
            )
            onWidgetUpdate(updatedWidgets)
          }}
        />
      case 'map':
        return <MapWidget 
          widget={widget} 
          onMove={(position) => {
            const updatedWidgets = widgets.map(w => 
              w.id === widget.id ? { ...w, position } : w
            )
            onWidgetUpdate(updatedWidgets)
          }}
        />
      case 'weather':
        return <WeatherWidget 
          widget={widget} 
          onMove={(position) => {
            const updatedWidgets = widgets.map(w => 
              w.id === widget.id ? { ...w, position } : w
            )
            onWidgetUpdate(updatedWidgets)
          }}
        />
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

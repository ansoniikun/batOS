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
import { AlertWidget } from './alert-widget'

interface WidgetManagerProps {
  widgets: Widget[]
  visibleWidgets: Record<string, boolean>
  onWidgetUpdate: (widgets: Widget[]) => void
}

export function WidgetManager({ widgets, visibleWidgets, onWidgetUpdate }: WidgetManagerProps) {
  const bringWidgetToFront = (widgetId: string) => {
    const updatedWidgets = [...widgets]
    const widgetIndex = updatedWidgets.findIndex(w => w.id === widgetId)
    if (widgetIndex !== -1) {
      const widget = updatedWidgets.splice(widgetIndex, 1)[0]
      updatedWidgets.push(widget) // Move to end (highest z-index)
      onWidgetUpdate(updatedWidgets)
    }
  }

  const handleWidgetMove = (widgetId: string, position: { x: number; y: number }) => {
    // Update position and bring to front in one operation
    const updatedWidgets = [...widgets]
    const widgetIndex = updatedWidgets.findIndex(w => w.id === widgetId)
    
    if (widgetIndex !== -1) {
      // Update position
      updatedWidgets[widgetIndex] = { ...updatedWidgets[widgetIndex], position }
      
      // Move to end (bring to front)
      const widget = updatedWidgets.splice(widgetIndex, 1)[0]
      updatedWidgets.push(widget)
      
      onWidgetUpdate(updatedWidgets)
    }
  }

  const renderWidget = (widget: Widget) => {
    console.log('Rendering widget:', widget.id, widget.type, 'visible:', visibleWidgets[widget.id])
    
    try {
      switch (widget.type) {
        case 'clock':
          return <ClockWidget 
            widget={widget} 
            onMove={(position) => handleWidgetMove(widget.id, position)}
          />
        case 'calendar':
          return <CalendarWidget 
            widget={widget} 
            onMove={(position) => handleWidgetMove(widget.id, position)}
          />
        case 'cpu':
          return <CpuWidget 
            widget={widget} 
            onMove={(position) => handleWidgetMove(widget.id, position)}
          />
        case 'user-stats':
          return <UserStatsWidget 
            widget={widget} 
            onMove={(position) => handleWidgetMove(widget.id, position)}
          />
        case 'bruce-wayne':
          return <BruceWayneWidget 
            widget={widget} 
            onMove={(position) => handleWidgetMove(widget.id, position)}
          />
        case 'console':
          return <ConsoleWidget 
            widget={widget} 
            onMove={(position) => handleWidgetMove(widget.id, position)}
          />
        case 'map':
          return <MapWidget 
            widget={widget} 
            onMove={(position) => handleWidgetMove(widget.id, position)}
          />
        case 'weather':
          return <WeatherWidget 
            widget={widget} 
            onMove={(position) => handleWidgetMove(widget.id, position)}
          />
        case 'alert':
          console.log('Rendering AlertWidget with widget prop:', widget)
          return <AlertWidget 
            widget={widget}
            onMove={(position) => handleWidgetMove(widget.id, position)}
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
    } catch (error) {
      console.error('Error rendering widget:', widget.id, error)
      return (
        <div className="bg-red-900/50 text-red-400 p-4 rounded border border-red-400/30">
          <div className="text-sm font-mono">Error Loading Widget</div>
          <div className="text-xs opacity-70">{widget.name}</div>
          <div className="text-xs opacity-50 mt-1">{error instanceof Error ? error.message : 'Unknown error'}</div>
        </div>
      )
    }
  }

  const visibleWidgetsList = widgets.filter(widget => visibleWidgets[widget.id])
  console.log('Visible widgets:', visibleWidgetsList.map(w => ({ id: w.id, type: w.type, visible: visibleWidgets[w.id] })))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {visibleWidgetsList.map((widget, index) => (
        <div
          key={widget.id}
          className="absolute pointer-events-auto"
          style={{
            left: widget.position.x,
            top: widget.position.y,
            width: widget.size.width,
            height: widget.size.height,
            zIndex: 1000 + (widgets.length - widgets.findIndex(w => w.id === widget.id)) // Higher z-index for widgets at the end of array
          }}
        >
          {renderWidget(widget)}
        </div>
      ))}
    </div>
  )
}

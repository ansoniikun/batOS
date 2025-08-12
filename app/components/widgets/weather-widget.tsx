'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Widget } from '@/app/types/desktop'
import { Cloud, GripVertical, Thermometer, Clock } from 'lucide-react'

interface WeatherWidgetProps {
  widget: Widget
  onMove?: (position: { x: number; y: number }) => void
}

export function WeatherWidget({ widget, onMove }: WeatherWidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)
  const [weatherData, setWeatherData] = useState({
    temperature: 7,
    feelsLike: 5,
    condition: 'Partly Cloudy',
    uptime: '47 days, 12 hours'
  })

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate weather changes
      setWeatherData(prev => ({
        temperature: Math.floor(Math.random() * 15 + 2),
        feelsLike: Math.floor(Math.random() * 15 + 2),
        condition: ['Partly Cloudy', 'Clear', 'Overcast', 'Light Rain'][Math.floor(Math.random() * 4)],
        uptime: prev.uptime
      }))
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = widgetRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
    e.preventDefault()
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && onMove) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        onMove({ x: Math.max(0, newX), y: Math.max(0, newY) })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset, onMove])

  return (
    <div 
      ref={widgetRef}
      className="bg-black/80 backdrop-blur-sm border border-blue-400/50 rounded-lg p-4 shadow-lg shadow-blue-400/20 cursor-move"
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-center space-x-2 mb-3">
        <GripVertical className="w-4 h-4 text-blue-400/70" />
        <Cloud className="w-4 h-4 text-blue-400" />
        <span className="text-xs text-blue-400/70">DRAG</span>
      </div>
      
      <div className="w-64 h-32">
        <div className="text-blue-400 text-sm font-bold mb-2 flex items-center space-x-2">
          <Thermometer className="w-4 h-4" />
          <span>Weather & System</span>
        </div>
        
        <div className="space-y-2 text-xs text-blue-400/80">
          <div className="flex items-center space-x-2">
            <Cloud className="w-3 h-3" />
            <span>{weatherData.temperature}°C {weatherData.condition}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Thermometer className="w-3 h-3" />
            <span>Feels Like: {weatherData.feelsLike}°C</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3" />
            <span>Core Active Since: {weatherData.uptime}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

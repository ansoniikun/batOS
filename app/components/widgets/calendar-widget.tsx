'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Widget } from '@/app/types/desktop'
import { Calendar, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '@/app/contexts/theme-context'

interface CalendarWidgetProps {
  widget: Widget
  onMove?: (position: { x: number; y: number }) => void
}

export function CalendarWidget({ widget, onMove }: CalendarWidgetProps) {
  const { getThemeClass } = useTheme()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [displayDate, setDisplayDate] = useState(new Date())
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

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

  useEffect(() => {
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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getPreviousMonth = () => {
    setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const getNextMonth = () => {
    setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(displayDate)
    const firstDayOfMonth = getFirstDayOfMonth(displayDate)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const isToday = (day: number) => {
    return day === currentDate.getDate() && 
           displayDate.getMonth() === currentDate.getMonth() && 
           displayDate.getFullYear() === currentDate.getFullYear()
  }

  const isCurrentMonth = () => {
    return displayDate.getMonth() === currentDate.getMonth() && 
           displayDate.getFullYear() === currentDate.getFullYear()
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const calendarDays = generateCalendarDays()

  return (
    <div 
      ref={widgetRef}
      className={`${getThemeClass()} backdrop-blur-sm border border-blue-400/50 rounded-lg p-3 shadow-lg shadow-blue-400/20 cursor-move`}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-blue-400" />
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={getPreviousMonth}
            className="p-1 hover:bg-blue-400/20 rounded transition-colors"
          >
            <ChevronLeft className="w-3 h-3 text-blue-400" />
          </button>
          <button
            onClick={getNextMonth}
            className="p-1 hover:bg-blue-400/20 rounded transition-colors"
          >
            <ChevronRight className="w-3 h-3 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Current Time */}
      <div className="text-center mb-3">
        <div className="text-blue-400 font-mono">
          <div className="text-sm font-bold tracking-wider">
            {currentDate.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Month and Year */}
      <div className="text-center mb-2">
        <div className="text-blue-400 text-sm font-bold">
          {monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center">
            <div className="text-blue-400/70 text-xs font-bold">
              {day}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div key={index} className="text-center">
            {day ? (
              <div
                className={`
                  w-6 h-6 flex items-center justify-center text-xs font-mono
                  ${isToday(day) 
                    ? 'bg-blue-400 text-black font-bold rounded' 
                    : 'text-blue-400 hover:bg-blue-400/20 rounded transition-colors'
                  }
                  ${!isCurrentMonth() ? 'opacity-50' : ''}
                `}
              >
                {day}
              </div>
            ) : (
              <div className="w-6 h-6" />
            )}
          </div>
        ))}
      </div>

      {/* Current Date Info */}
      <div className="mt-3 text-center">
        <div className="text-blue-400/70 text-xs">
          {currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
    </div>
  )
}

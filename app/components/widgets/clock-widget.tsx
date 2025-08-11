'use client'

import React, { useState, useEffect } from 'react'
import { Widget } from '@/app/types/desktop'
import { formatTime, formatDate } from '@/app/lib/utils'

interface ClockWidgetProps {
  widget: Widget
}

export function ClockWidget({ widget }: ClockWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-black/70 backdrop-blur-sm text-blue-400 p-4 rounded-lg border border-blue-400/30 shadow-lg shadow-blue-400/20">
      <div className="text-center">
        <div className="text-2xl font-mono font-bold tracking-wider">
          {formatTime(currentTime)}
        </div>
        <div className="text-xs opacity-70 mt-1">
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  )
}

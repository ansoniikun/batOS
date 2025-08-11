'use client'

import React from 'react'
import { cn } from '@/app/lib/utils'
import { Notification } from '@/app/types/desktop'
import { Button } from '@/app/components/ui/button'
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'

interface NotificationCenterProps {
  notifications: Notification[]
  onNotificationDismiss: (id: string) => void
}

export function NotificationCenter({ notifications, onNotificationDismiss }: NotificationCenterProps) {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  const getNotificationBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-400/30'
      case 'warning':
        return 'border-yellow-400/30'
      case 'error':
        return 'border-red-400/30'
      default:
        return 'border-blue-400/30'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border shadow-lg",
            "max-w-sm pointer-events-auto",
            "animate-in slide-in-from-right-2 duration-300",
            getNotificationBorderColor(notification.type)
          )}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            
                    <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-blue-400">
            {notification.title}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {notification.message}
          </div>
          
          {notification.action && (
            <Button
              variant="batcomputerOutline"
              size="sm"
              onClick={notification.action.onClick}
              className="mt-2 h-6 px-2 text-xs"
            >
              {notification.action.label}
            </Button>
          )}
        </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNotificationDismiss(notification.id)}
              className="h-6 w-6 p-0 flex-shrink-0 hover:bg-white/10"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

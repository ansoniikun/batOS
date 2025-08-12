'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface VolumeContextType {
  volume: number
  isMuted: boolean
  setVolume: (volume: number) => void
  setIsMuted: (muted: boolean) => void
  toggleMute: () => void
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined)

export function VolumeProvider({ children }: { children: ReactNode }) {
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = () => setIsMuted(!isMuted)

  return (
    <VolumeContext.Provider value={{ 
      volume, 
      isMuted, 
      setVolume, 
      setIsMuted, 
      toggleMute 
    }}>
      {children}
    </VolumeContext.Provider>
  )
}

export function useVolume() {
  const context = useContext(VolumeContext)
  if (context === undefined) {
    throw new Error('useVolume must be used within a VolumeProvider')
  }
  return context
}

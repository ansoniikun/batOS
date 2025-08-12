'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Theme = 'liquid' | 'frost'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  getThemeClass: () => string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('liquid')

  const getThemeClass = () => {
    return theme === 'liquid' ? 'bg-black/95' : 'bg-gray-900/95'
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, getThemeClass }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Widget } from '@/app/types/desktop'
import { useTheme } from '@/app/contexts/theme-context'
import { AlertTriangle, Zap, Shield, MapPin, Clock, Activity, Globe, Building2 } from 'lucide-react'

interface DisasterEvent {
  id: string
  title: string
  category: string
  coordinates: [number, number]
  date: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
}

interface CrimeNews {
  id: string
  title: string
  description: string
  location: string
  date: string
  source: string
  url: string
}

interface AlertWidgetProps {
  widget: Widget
  onMove?: (position: { x: number; y: number }) => void
}

export function AlertWidget({ widget, onMove }: AlertWidgetProps) {
  const { getThemeClass } = useTheme()
  const [activeTab, setActiveTab] = useState<'disasters' | 'crime'>('disasters')
  const [disasters, setDisasters] = useState<DisasterEvent[]>([])
  const [crimeNews, setCrimeNews] = useState<CrimeNews[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

  // Fetch disaster data from multiple real APIs
  const fetchDisasters = async () => {
    try {
      console.log('Fetching real disaster data...')
      
      const disasterEvents: DisasterEvent[] = []
      
      // Fetch from NASA EONET
      try {
        const eonetResponse = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=5&days=7&category=severeStorms,volcanoes,earthquakes,wildfires')
        const eonetData = await eonetResponse.json()
        
        if (eonetData.events && eonetData.events.length > 0) {
          eonetData.events.forEach((event: any, index: number) => {
            disasterEvents.push({
              id: `eonet-${event.id || index}`,
              title: event.title || 'Unknown Event',
              category: event.categories?.[0]?.title || 'Unknown',
              coordinates: event.geometry?.[0]?.coordinates || [0, 0],
              date: event.geometry?.[0]?.date ? new Date(event.geometry[0].date).toLocaleDateString() : new Date().toLocaleDateString(),
              severity: getSeverityLevel(event.categories?.[0]?.title, event.geometry?.[0]?.magnitude),
              source: 'NASA EONET'
            })
          })
        }
      } catch (error) {
        console.error('Error fetching NASA EONET data:', error)
      }
      
      // Fetch from USGS Earthquake API
      try {
        const usgsResponse = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson')
        const usgsData = await usgsResponse.json()
        
        if (usgsData.features && usgsData.features.length > 0) {
          usgsData.features.slice(0, 3).forEach((quake: any, index: number) => {
            const properties = quake.properties
            const coordinates = quake.geometry.coordinates
            disasterEvents.push({
              id: `usgs-${quake.id || index}`,
              title: `Earthquake - ${properties.place}`,
              category: 'Earthquakes',
              coordinates: [coordinates[1], coordinates[0]], // USGS uses [longitude, latitude, depth]
              date: new Date(properties.time).toLocaleDateString(),
              severity: properties.mag >= 6 ? 'critical' : properties.mag >= 5 ? 'high' : 'medium',
              source: 'USGS'
            })
          })
        }
      } catch (error) {
        console.error('Error fetching USGS data:', error)
      }
      
      // Fetch from NOAA Weather Alerts
      try {
        const noaaResponse = await fetch('https://api.weather.gov/alerts/active?status=actual&message_type=alert')
        const noaaData = await noaaResponse.json()
        
        if (noaaData.features && noaaData.features.length > 0) {
          noaaData.features.slice(0, 3).forEach((alert: any, index: number) => {
            const properties = alert.properties
            disasterEvents.push({
              id: `noaa-${alert.id || index}`,
              title: `${properties.event} - ${properties.areaDesc}`,
              category: 'Severe Weather',
              coordinates: [0, 0], // NOAA doesn't provide coordinates in this format
              date: new Date(properties.sent).toLocaleDateString(),
              severity: properties.severity === 'Extreme' ? 'critical' : properties.severity === 'Severe' ? 'high' : 'medium',
              source: 'NOAA'
            })
          })
        }
      } catch (error) {
        console.error('Error fetching NOAA data:', error)
      }
      
      console.log('Processed real disaster events:', disasterEvents)
      setDisasters(disasterEvents)
    } catch (error) {
      console.error('Error in fetchDisasters:', error)
      setDisasters([]) // No fallback data - show empty state
    }
  }

  // Fetch real crime data from news APIs
  const fetchCrimeNews = async () => {
    try {
      console.log('Fetching real crime data...')
      
      // Try to fetch from NewsAPI (requires API key)
      // Uncomment and add your API key to get real crime news
      // const newsApiKey = 'YOUR_NEWS_API_KEY' // Get from https://newsapi.org/
      // const newsResponse = await fetch(`https://newsapi.org/v2/everything?q=crime&apiKey=${newsApiKey}&pageSize=10`)
      // const newsData = await newsResponse.json()
      
      // For now, we'll show empty state since we don't have API keys
      // You can implement real crime data by getting API keys from:
      // - NewsAPI: https://newsapi.org/
      // - GNews: https://gnews.io/
      // - Police data APIs: Various city police departments
      
      console.log('No crime API configured - showing empty state')
      setCrimeNews([]) // No static data - show empty state
    } catch (error) {
      console.error('Error fetching crime data:', error)
      setCrimeNews([]) // No fallback data - show empty state
    }
  }

  const getSeverityLevel = (category: string, magnitude?: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (category === 'Earthquakes' && magnitude && magnitude > 6) return 'critical'
    if (category === 'Severe Storms') return 'high'
    if (category === 'Wildfires') return 'high'
    if (category === 'Volcanoes') return 'critical'
    return 'medium'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400'
      case 'high': return 'text-orange-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-blue-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'earthquakes': return <Activity className="w-4 h-4" />
      case 'severe storms': return <Zap className="w-4 h-4" />
      case 'wildfires': return <Globe className="w-4 h-4" />
      case 'volcanoes': return <Activity className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  useEffect(() => {
    console.log('AlertWidget mounted, fetching data...')
    fetchDisasters()
    fetchCrimeNews()
    setLoading(false)
    setLastUpdate(new Date())

    // Update every 5 minutes
    const interval = setInterval(() => {
      console.log('Updating alert data...')
      fetchDisasters()
      fetchCrimeNews()
      setLastUpdate(new Date())
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onMove) return
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - widget.position.x,
      y: e.clientY - widget.position.y
    })
    e.preventDefault()
    e.stopPropagation()
  }

  React.useEffect(() => {
    let animationFrameId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && onMove) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        
        animationFrameId = requestAnimationFrame(() => {
          const newX = e.clientX - dragStart.x
          const newY = e.clientY - dragStart.y
          const boundedX = Math.max(0, Math.min(newX, window.innerWidth - widget.size.width))
          const boundedY = Math.max(0, Math.min(newY, window.innerHeight - widget.size.height))
          onMove({ x: boundedX, y: boundedY })
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isDragging, dragStart, onMove, widget.size.width, widget.size.height])

  console.log('AlertWidget rendering with:', { widget, activeTab, disasters: disasters.length, crimeNews: crimeNews.length })

  return (
    <div 
      ref={widgetRef}
      className={`${getThemeClass()} backdrop-blur-sm border border-blue-400/50 rounded-lg shadow-lg shadow-blue-400/20 transition-transform duration-150 select-none flex flex-col ${
        isDragging ? 'cursor-grabbing opacity-90 scale-[1.02] shadow-2xl' : 'cursor-grab hover:scale-[1.01]'
      }`}
      style={{
        width: widget.size.width,
        height: widget.size.height
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-blue-400/30">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm font-bold text-blue-400">ALERT SYSTEM</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('disasters')}
            className={`px-2 py-1 rounded text-xs transition-all duration-200 ${
              activeTab === 'disasters' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
            }`}
          >
            <Zap className="w-3 h-3" />
          </button>
          <button
            onClick={() => setActiveTab('crime')}
            className={`px-2 py-1 rounded text-xs transition-all duration-200 ${
              activeTab === 'crime' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
            }`}
          >
            <Shield className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Activity className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-2 min-h-0" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3b82f6 #1f2937',
            scrollbarGutter: 'stable'
          }}>
            {activeTab === 'disasters' ? (
              <div className="space-y-2">
                {disasters.length > 0 ? (
                  disasters.map((disaster) => (
                    <div
                      key={disaster.id}
                      className="p-2 bg-black/30 rounded border border-blue-400/20 hover:bg-blue-400/10 transition-all duration-200"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="text-blue-400">{getCategoryIcon(disaster.category)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs font-bold ${getSeverityColor(disaster.severity)}`}>
                              {disaster.severity.toUpperCase()}
                            </span>
                            <span className="text-xs text-blue-400/70">{disaster.date}</span>
                          </div>
                          <div className="text-xs text-blue-400 font-medium truncate mt-1">
                            {disaster.title}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-3 h-3 text-blue-400/70" />
                            <span className="text-xs text-blue-400/70">
                              {disaster.coordinates[1].toFixed(2)}, {disaster.coordinates[0].toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-blue-400/70 text-sm py-8">
                    <div className="text-lg mb-2">🌍</div>
                    <div>No disaster alerts</div>
                    <div className="text-xs opacity-50 mt-1">Monitoring global events...</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {crimeNews.length > 0 ? (
                  crimeNews.map((crime) => (
                    <div
                      key={crime.id}
                      className="p-2 bg-black/30 rounded border border-blue-400/20 hover:bg-blue-400/10 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="text-red-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-red-400 font-bold">CRIME</span>
                            <span className="text-xs text-blue-400/70">{crime.date}</span>
                          </div>
                          <div className="text-xs text-blue-400 font-medium truncate mt-1">
                            {crime.title}
                          </div>
                          <div className="text-xs text-blue-400/70 truncate mt-1">
                            {crime.description}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-3 h-3 text-blue-400/70" />
                            <span className="text-xs text-blue-400/70">{crime.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-blue-400/70 text-sm py-8">
                    <div className="text-lg mb-2">🚨</div>
                    <div>No crime alerts</div>
                    <div className="text-xs opacity-50 mt-1">Add API key for real-time data</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-2 border-t border-blue-400/30 text-xs text-blue-400/70">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Last Update: {lastUpdate.toLocaleTimeString()}</span>
        </div>
        <div className="text-xs">
          {activeTab === 'disasters' ? `${disasters.length} Events` : `${crimeNews.length} Reports`}
        </div>
      </div>
    </div>
  )
}

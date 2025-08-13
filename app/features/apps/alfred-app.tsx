'use client'

import React, { useState, useEffect, useRef } from 'react'
import {useTheme} from '@/app/contexts/theme-context'
import { Mic, MicOff, Settings, Volume2, VolumeX, Loader2, CheckCircle, XCircle } from 'lucide-react'

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface AlfredAppProps {
  onCommand?: (command: string, action: string, params?: any) => void
}

interface Command {
  id: string
  type: 'system' | 'app' | 'widget' | 'file' | 'custom'
  name: string
  description: string
  keywords: string[]
  action: string
  params?: any
}

const AlfredApp: React.FC<AlfredAppProps> = ({ onCommand }) => {
  const { theme } = useTheme()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastCommand, setLastCommand] = useState('')
  const [lastResponse, setLastResponse] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const [commands, setCommands] = useState<Command[]>([
    {
      id: 'open-terminal',
      type: 'app',
      name: 'Open Terminal',
      description: 'Launch the system terminal',
      keywords: ['terminal', 'command line', 'cli', 'console'],
      action: 'open_app',
      params: { appId: 'terminal' }
    },
    {
      id: 'open-file-manager',
      type: 'app',
      name: 'Open File Manager',
      description: 'Launch the file manager',
      keywords: ['file manager', 'files', 'explorer', 'folders'],
      action: 'open_app',
      params: { appId: 'file-manager' }
    },
    {
      id: 'open-batplayer',
      type: 'app',
      name: 'Open Batplayer',
      description: 'Launch the music player',
      keywords: ['music', 'player', 'batplayer', 'ipod', 'songs'],
      action: 'open_app',
      params: { appId: 'batplayer' }
    },
    {
      id: 'add-clock-widget',
      type: 'widget',
      name: 'Add Clock Widget',
      description: 'Add a clock widget to the desktop',
      keywords: ['clock', 'time', 'widget', 'add'],
      action: 'add_widget',
      params: { widgetId: 'clock' }
    },
    {
      id: 'add-weather-widget',
      type: 'widget',
      name: 'Add Weather Widget',
      description: 'Add a weather widget to the desktop',
      keywords: ['weather', 'temperature', 'widget', 'add'],
      action: 'add_widget',
      params: { widgetId: 'weather' }
    },
    {
      id: 'add-alert-widget',
      type: 'widget',
      name: 'Add Alert Widget',
      description: 'Add an alert system widget to the desktop',
      keywords: ['alert', 'alerts', 'news', 'widget', 'add'],
      action: 'add_widget',
      params: { widgetId: 'alert' }
    },
    {
      id: 'remove-widgets',
      type: 'widget',
      name: 'Remove All Widgets',
      description: 'Remove all widgets from the desktop',
      keywords: ['remove', 'clear', 'widgets', 'all'],
      action: 'remove_widgets',
      params: {}
    },
    {
      id: 'change-theme',
      type: 'system',
      name: 'Change Theme',
      description: 'Switch between liquid and frost themes',
      keywords: ['theme', 'liquid', 'frost', 'switch', 'change'],
      action: 'change_theme',
      params: {}
    },
    {
      id: 'system-status',
      type: 'system',
      name: 'System Status',
      description: 'Display system information',
      keywords: ['status', 'system', 'info', 'information'],
      action: 'system_status',
      params: {}
    },
    {
      id: 'help',
      type: 'custom',
      name: 'Help',
      description: 'Show available commands',
      keywords: ['help', 'commands', 'what can you do'],
      action: 'help',
      params: {}
    }
  ])

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      
      recognition.onstart = () => {
        setIsListening(true)
        setTranscript('Listening...')
      }
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        processCommand(transcript)
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setTranscript('Error: Could not recognize speech')
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognition)
    }
  }, [])

  const processCommand = (input: string) => {
    setIsProcessing(true)
    const lowerInput = input.toLowerCase()
    
    // Find matching command
    const matchedCommand = commands.find(command => 
      command.keywords.some(keyword => lowerInput.includes(keyword))
    )
    
    if (matchedCommand) {
      setLastCommand(input)
      setLastResponse(`Executing: ${matchedCommand.name}`)
      
      // Execute command
      if (onCommand) {
        onCommand(input, matchedCommand.action, matchedCommand.params)
      }
      
      // Simulate processing time
      setTimeout(() => {
        setIsProcessing(false)
        setLastResponse(`Completed: ${matchedCommand.name}`)
      }, 1000)
    } else {
      setLastCommand(input)
      setLastResponse("I'm sorry, sir. I didn't understand that command. Try saying 'help' for available commands.")
      setIsProcessing(false)
    }
  }

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const speakResponse = (text: string) => {
    if (!isMuted && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    if (lastResponse) {
      speakResponse(lastResponse)
    }
  }, [lastResponse, isMuted])

  return (
    <div className={`h-full flex flex-col items-center justify-center ${theme === 'liquid' ? 'bg-black/95' : 'bg-gray-900/95'} text-blue-400`} style={{ padding: 'calc(32px + 1rem) 1rem 1rem 1rem' }}>
      {/* Header Controls - Positioned to avoid titlebar */}
      <div className="absolute top-12 left-4 right-4 z-10 flex justify-between">
        {/* Commands Button */}
        <details>
          <summary className="cursor-pointer flex items-center justify-center p-2 rounded-full bg-blue-600/20 hover:bg-blue-600/30 transition-all duration-300 border border-blue-400/30">
            <div className="w-6 h-6 rounded-full bg-blue-400/20 flex items-center justify-center">
              <span className="text-blue-400 text-xs font-bold">C</span>
            </div>
          </summary>
          <div className="absolute left-0 top-12 w-48 bg-black/80 backdrop-blur-md border border-blue-400/30 shadow-2xl rounded-lg">
            <div className="p-3 max-h-64 flex flex-col">
              <h3 className="text-blue-400 font-medium text-sm mb-3 border-b border-blue-400/30 pb-2">
                Commands
              </h3>
              <div 
                className="flex-1 space-y-2 overflow-y-auto"
                style={{ 
                  scrollbarWidth: 'thin', 
                  scrollbarColor: '#3b82f6 #000000',
                  scrollbarGutter: 'stable'
                }}
              >
                {commands.map(command => (
                  <div key={command.id} className="p-2 rounded bg-blue-400/10 hover:bg-blue-400/20 transition-colors border border-blue-400/20">
                    <div className="text-blue-300 font-medium text-xs mb-1">
                      {command.name}
                    </div>
                    <div className="text-blue-300/70 text-xs leading-tight">
                      {command.description}
                    </div>
                    <div className="text-blue-400/50 text-xs mt-1">
                      {command.keywords.slice(0, 2).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>

        {/* Volume Button */}
        <button
          onClick={toggleMute}
          className={`p-2 rounded-full ${isMuted ? 'bg-red-600/20' : 'bg-blue-600/20'} hover:bg-blue-600/30 transition-all duration-300 border border-blue-400/30`}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Central Pulsing Circle - Centered in available space */}
      <div className="flex flex-col items-center space-y-6 flex-1 justify-center">
        {/* Main Pulsing Circle */}
        <div className="relative">
          {/* Outer pulse ring */}
          <div className={`absolute inset-0 rounded-full ${isListening ? 'bg-blue-400/20 animate-ping' : 'bg-blue-400/10'} transition-all duration-500`}></div>
          
          {/* Inner pulse ring */}
          <div className={`absolute inset-2 rounded-full ${isListening ? 'bg-blue-400/30 animate-ping' : 'bg-blue-400/20'} transition-all duration-500`} style={{ animationDelay: '0.5s' }}></div>
          
          {/* Main circle */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 ${
              isListening 
                ? 'bg-blue-600 shadow-lg shadow-blue-600/50' 
                : 'bg-blue-600/80 hover:bg-blue-600 shadow-lg shadow-blue-600/30'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {isListening ? (
              <MicOff size={28} className="text-white" />
            ) : (
              <Mic size={28} className="text-white" />
            )}
          </button>
        </div>

        {/* Status Text */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-blue-400'}`}></div>
            <span className="text-sm font-medium">
              {isListening ? 'Listening...' : 'Ready'}
            </span>
          </div>
          
          {isListening && (
            <p className="text-xs text-blue-300/70 animate-pulse">
              Click to stop listening
            </p>
          )}
        </div>
      </div>

      {/* Minimal Status Display - Only show when there's activity */}
      {(transcript || lastCommand || lastResponse) && (
        <div className="w-full max-w-md mx-auto mb-4">
          <div className={`${theme === 'liquid' ? 'bg-black/50' : 'bg-gray-800/50'} backdrop-blur-sm rounded-lg p-3 border border-blue-400/20`}>
            <div className="space-y-2">
              {/* Transcript */}
              {transcript && (
                <div className="text-center">
                  <p className="text-sm text-blue-300 font-medium">"{transcript}"</p>
                </div>
              )}

              {/* Response */}
              {lastResponse && (
                <div className="flex items-center justify-center space-x-2">
                  {isProcessing ? (
                    <Loader2 size={12} className="animate-spin text-blue-400" />
                  ) : lastResponse.includes('Completed') ? (
                    <CheckCircle size={12} className="text-green-400" />
                  ) : lastResponse.includes('Error') ? (
                    <XCircle size={12} className="text-red-400" />
                  ) : (
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                  <p className="text-xs text-blue-300">{lastResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default AlfredApp

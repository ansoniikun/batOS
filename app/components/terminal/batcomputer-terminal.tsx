'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import { Button } from '@/app/components/ui/button'
import { X, Minus, Square, Maximize2, GripVertical } from 'lucide-react'

interface TerminalProps {
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  onMove?: (position: { x: number; y: number }) => void
  onResize?: (size: { width: number; height: number }) => void
  isFocused?: boolean
  position?: { x: number; y: number }
  size?: { width: number; height: number }
  isMaximized?: boolean
}

interface CommandHistory {
  command: string
  output: string[]
  timestamp: Date
}

export function BatcomputerTerminal({
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  isFocused = false,
  position = { x: 100, y: 100 },
  size = { width: 600, height: 400 },
  isMaximized = false
}: TerminalProps) {
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([
    {
      command: '',
      output: [
        'Batcomputer Terminal v.978.0.06.51 - Read Only Mode',
        'Welcome, Dark Knight. All systems are operational.',
        'Type "help" for available commands.',
        ''
      ],
      timestamp: new Date()
    }
  ])
  const [currentDirectory, setCurrentDirectory] = useState('/batcave')
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Available commands
  const commands = {
    'who am i': () => ['Dark Knight'],
    'whoami': () => ['Dark Knight'],
    'pwd': () => [currentDirectory],
    'ls': () => [
      'batmobile/',
      'batwing/',
      'batarangs/',
      'gadgets/',
      'surveillance/',
      'evidence/',
      'case_files/',
      'wayne_tech/',
      'gotham_map/',
      'criminal_database/'
    ],
    'ls -la': () => [
      'drwxr-xr-x  2 darkknight  batfamily  4096 Jan 15 10:30 batmobile/',
      'drwxr-xr-x  2 darkknight  batfamily  4096 Jan 15 10:30 batwing/',
      'drwxr-xr-x  2 darkknight  batfamily  4096 Jan 15 10:30 batarangs/',
      'drwxr-xr-x  2 darkknight  batfamily  4096 Jan 15 10:30 gadgets/',
      'drwxr-xr-x  2 darkknight  batfamily  4096 Jan 15 10:30 surveillance/',
      'drwxr-xr-x  2 darkknight  batfamily  4096 Jan 15 10:30 evidence/',
      'drwxr-xr-x  2 darkknight  batfamily  4096 Jan 15 10:30 case_files/',
      'drwxr-xr-x  2 darkknight  batfamily  4096 Jan 15 10:30 wayne_tech/',
      'drwxr-xr-x  2 darkknight  batfamily  4096 Jan 15 10:30 gotham_map/',
      'drwxr-xr-x  2 darkknight  batfamily  4096 Jan 15 10:30 criminal_database/'
    ],
    'cd': () => ['Usage: cd <directory>'],
    'cd batmobile': () => {
      setCurrentDirectory('/batcave/batmobile')
      return ['Changed directory to /batcave/batmobile']
    },
    'cd batwing': () => {
      setCurrentDirectory('/batcave/batwing')
      return ['Changed directory to /batcave/batwing']
    },
    'cd gadgets': () => {
      setCurrentDirectory('/batcave/gadgets')
      return ['Changed directory to /batcave/gadgets']
    },
    'cd surveillance': () => {
      setCurrentDirectory('/batcave/surveillance')
      return ['Changed directory to /batcave/surveillance']
    },
    'cd ..': () => {
      if (currentDirectory !== '/batcave') {
        setCurrentDirectory('/batcave')
        return ['Changed directory to /batcave']
      }
      return ['Already at root directory']
    },
    'cat': () => ['Usage: cat <filename>'],
    'cat batmobile/status': () => [
      'Batmobile Status Report:',
      'Engine: Operational',
      'Fuel: 95%',
      'Armor: Intact',
      'Weapons: Armed',
      'Navigation: GPS Active',
      'Last Maintenance: 2 days ago'
    ],
    'cat surveillance/active_targets': () => [
      'Active Surveillance Targets:',
      '1. Joker - Last seen: Gotham City Bank',
      '2. Penguin - Last seen: Iceberg Lounge',
      '3. Riddler - Last seen: Gotham Museum',
      '4. Two-Face - Last seen: Gotham Courthouse',
      '5. Scarecrow - Last seen: Gotham University'
    ],
    'cat case_files/joker_case': () => [
      'Case File: The Joker',
      'Status: Active',
      'Last Crime: Bank robbery at Gotham Central Bank',
      'Victims: 0 (prevented)',
      'Evidence: Playing cards, green hair dye',
      'Pattern: Chemical weapons, psychological warfare',
      'Threat Level: EXTREME'
    ],
    'ps': () => [
      'PID TTY          TIME CMD',
      '1234 pts/0    00:00:01 batcomputer',
      '1235 pts/0    00:00:00 surveillance',
      '1236 pts/0    00:00:00 gps_tracking',
      '1237 pts/0    00:00:00 comm_system',
      '1238 pts/0    00:00:00 security_protocols'
    ],
    'top': () => [
      'top - 18:30:45 up 3 days, 3:15, 1 user, load average: 0.52, 0.48, 0.45',
      'Tasks: 15 total, 1 running, 14 sleeping, 0 stopped, 0 zombie',
      '%Cpu(s): 12.5 us, 8.2 sy, 0.0 ni, 79.3 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st',
      'MiB Mem : 32768.0 total, 12500.0 free, 8500.0 used, 11768.0 buff/cache',
      'MiB Swap: 0.0 total, 0.0 free, 0.0 used. 22500.0 avail Mem',
      '',
      'PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
      '1234 darkknight  20   0  204800  12500   8500 S  12.5   0.4   0:01.23 batcomputer',
      '1235 darkknight  20   0  102400   8500   4250 S   8.2   0.3   0:00.45 surveillance',
      '1236 darkknight  20   0   51200   4250   2125 S   4.1   0.1   0:00.23 gps_tracking'
    ],
    'df': () => [
      'Filesystem     1K-blocks    Used Available Use% Mounted on',
      '/dev/batcave   104857600  8500000  96357600   9% /batcave',
      '/dev/evidence   52428800  1250000  51178800   2% /evidence',
      '/dev/surveillance 26214400  850000  25364400   3% /surveillance',
      '/dev/gadgets    13107200  425000  12682200   3% /gadgets'
    ],
    'free': () => [
      '              total        used        free      shared  buff/cache   available',
      'Mem:       33554432    8704000   12582912     1048576   12267520   22544384',
      'Swap:             0          0          0'
    ],
    'date': () => [new Date().toLocaleString()],
    'uptime': () => ['up 3 days, 3 hours, 15 minutes'],
    'uname': () => ['BatOS v.978.0.06.51'],
    'uname -a': () => ['BatOS v.978.0.06.51 #1 SMP PREEMPT Jan 15 10:30:00 UTC 2024 x86_64 BatOS'],
    'help': () => [
      'Available Commands:',
      '  who am i, whoami  - Show current user (Dark Knight)',
      '  pwd               - Print working directory',
      '  ls, ls -la        - List directory contents',
      '  cd <dir>          - Change directory',
      '  cat <file>        - Display file contents',
      '  ps                - Show running processes',
      '  top               - Show system resources',
      '  df                - Show disk usage',
      '  free              - Show memory usage',
      '  date              - Show current date/time',
      '  uptime            - Show system uptime',
      '  uname             - Show system information',
      '  clear             - Clear terminal',
      '  help              - Show this help message',
      '',
      'Note: This is a read-only terminal. File creation/deletion is disabled.'
    ],
    'clear': () => {
      setCommandHistory([])
      return []
    }
  }

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) return

    let output: string[] = []
    
    if (commands[trimmedCommand as keyof typeof commands]) {
      output = commands[trimmedCommand as keyof typeof commands]()
    } else if (trimmedCommand.startsWith('cd ')) {
      const dir = trimmedCommand.substring(3)
      if (commands[`cd ${dir}` as keyof typeof commands]) {
        output = commands[`cd ${dir}` as keyof typeof commands]()
      } else {
        output = [`cd: ${dir}: No such file or directory`]
      }
    } else if (trimmedCommand.startsWith('cat ')) {
      const file = trimmedCommand.substring(4)
      if (commands[`cat ${file}` as keyof typeof commands]) {
        output = commands[`cat ${file}` as keyof typeof commands]()
      } else {
        output = [`cat: ${file}: No such file or directory`]
      }
    } else {
      output = [`bash: ${trimmedCommand}: command not found`]
    }

    setCommandHistory(prev => [...prev, {
      command: trimmedCommand,
      output,
      timestamp: new Date()
    }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      executeCommand(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const rect = terminalRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
    e.preventDefault()
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    const rect = terminalRef.current?.getBoundingClientRect()
    if (rect) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height
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
      
      if (isResizing && onResize) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        const newWidth = Math.max(400, resizeStart.width + deltaX)
        const newHeight = Math.max(300, resizeStart.height + deltaY)
        onResize({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, onMove, onResize])

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  // Auto-focus on mount and when terminal is clicked
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div
      ref={terminalRef}
      className={cn(
        "absolute bg-black/95 backdrop-blur-sm border border-blue-400/50 shadow-2xl shadow-blue-400/20",
        "transition-all duration-200",
        isFocused ? "ring-2 ring-blue-400/50" : "opacity-80"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: isMaximized ? 'calc(100vw - 80px)' : size.width,
        height: isMaximized ? 'calc(100vh - 128px)' : size.height,
        zIndex: isFocused ? 1000 : 100
      }}
    >
      {/* Title Bar */}
      <div
        className={cn(
          "flex items-center justify-between h-8 px-2",
          "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm",
          "cursor-move select-none shadow-lg shadow-blue-400/30"
        )}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4" />
          <span className="truncate">Batcomputer Terminal - Dark Knight</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-6 w-6 p-0 hover:bg-blue-400/20"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMaximize}
            className="h-6 w-6 p-0 hover:bg-blue-400/20"
          >
            {isMaximized ? (
              <Square className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 p-3 h-full overflow-hidden" onClick={handleTerminalClick}>
        <div className="h-full flex flex-col">
          {/* Output Area */}
          <div className="flex-1 overflow-y-auto font-mono text-sm text-blue-400/90 mb-2">
            {commandHistory.map((entry, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400/50">darkknight@batcomputer</span>
                  <span className="text-blue-400/50">:</span>
                  <span className="text-blue-400">{currentDirectory}</span>
                  <span className="text-blue-400/50">$</span>
                  <span className="text-blue-400">{entry.command}</span>
                </div>
                {entry.output.map((line, lineIndex) => (
                  <div key={lineIndex} className="ml-4 text-blue-400/80">
                    {line}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <span className="text-blue-400/50">darkknight@batcomputer</span>
            <span className="text-blue-400/50">:</span>
            <span className="text-blue-400">{currentDirectory}</span>
            <span className="text-blue-400/50">$</span>
            <div className="flex-1 flex items-center min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-blue-400 font-mono text-sm outline-none border-none min-w-0"
                placeholder="Enter command..."
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              {isFocused && (
                <span className="text-blue-400 animate-pulse">|</span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-blue-400" />
        </div>
      )}
    </div>
  )
}

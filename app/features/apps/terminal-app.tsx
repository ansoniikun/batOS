'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/app/contexts/theme-context'

interface CommandHistory {
  command: string
  output: string[]
  timestamp: Date
}

export function TerminalApp() {
  const { getThemeClass } = useTheme()
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([
    {
      command: '',
      output: [
        '⠈⠙⠲⢶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣿⡀⠀⠀⠀⠀⠀⠀⠀⡄⠀⠀⡄⠀⠀⠀⠀⠀⠀⠀⣼⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣿⠟⠓⠉',
        '⠀⠀⠀⠀⠈⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⢀⣧⣶⣦⣇⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠉⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣶⣾⣿⣿⣿⣿⣶⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠛⠛⠛⠛⠛⠛⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠟⠛⠛⠛⠛⠛⠛⠃⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        'Batcomputer Terminal v.0.0.1',
        'Welcome, Dark Knight. All systems are operational.',
        'Type "help" for available commands.',
      ],
      timestamp: new Date()
    }
  ])
  const [currentDirectory, setCurrentDirectory] = useState('/batcave')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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
    'clear': () => {
      setCommandHistory([{
        command: '',
        output: [
          '',
        ],
        timestamp: new Date()
      }])
      return []
    },
    'exit': () => ['Terminal closed.'],
    'quit': () => ['Terminal closed.'],
    'df': () => [
      'Filesystem     1K-blocks    Used Available Use% Mounted on',
      '/dev/batcave   2097152  1048576   1048576  50% /',
      '/dev/surveillance  1048576   524288   524288  50% /surveillance',
      '/dev/evidence   524288   262144   262144  50% /evidence',
      '/dev/wayne_tech  2097152  1572864   524288  75% /wayne_tech'
    ],
    'free': () => [
      '              total        used        free      shared  buff/cache   available',
      'Mem:       32768       8500      12500       1024      11768      22500',
      'Swap:          0          0          0'
    ],
    'uptime': () => [
      ' 18:30:45 up 3 days, 3:15,  1 user,  load average: 0.52, 0.48, 0.45'
    ],
    'date': () => [new Date().toLocaleString()],
    'help': () => [
      'Available commands:',
      '  whoami, who am i  - Show current user',
      '  pwd              - Print working directory',
      '  ls, ls -la       - List directory contents',
      '  cd <dir>         - Change directory',
      '  cat <file>       - Display file contents',
      '  ps               - Show running processes',
      '  top              - Show system resources',
      '  df               - Show disk usage',
      '  free             - Show memory usage',
      '  uptime           - Show system uptime',
      '  date             - Show current date/time',
      '  clear            - Clear terminal screen',
      '  exit, quit       - Close terminal',
      '  help             - Show this help'
    ]
  }

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) return

    const commandFn = commands[trimmedCommand as keyof typeof commands]
    const output = commandFn ? commandFn() : [`Command not found: ${trimmedCommand}`]

    setCommandHistory(prev => [...prev, {
      command: trimmedCommand,
      output: Array.isArray(output) ? output : [output],
      timestamp: new Date()
    }])

    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    }
  }

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Scroll to bottom when command history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [commandHistory])

  return (
        <div
      ref={scrollRef}
      className={`w-full h-full ${getThemeClass()} text-blue-400 font-mono text-sm overflow-y-auto overflow-x-hidden p-4`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#3b82f6 #000000',
        scrollbarGutter: 'stable'
      }}
    >
      {/* Command History */}
      {commandHistory.map((entry, index) => (
        <div key={index} className="mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-blue-400/50">darkknight@batcomputer</span>
            <span className="text-blue-400/50">:</span>
            <span className="text-blue-400">{currentDirectory}</span>
            <span className="text-blue-400/50">$</span>
            <span className="text-blue-400">{entry.command}</span>
          </div>
          {entry.output.map((line, lineIndex) => (
            <div key={lineIndex} className="ml-4 text-blue-400/80 mb-1">
              {line}
            </div>
          ))}
        </div>
      ))}
      
      {/* Current Input Line */}
      <div className="flex items-center space-x-2">
        <span className="text-blue-400/50">darkknight@batcomputer</span>
        <span className="text-blue-400/50">:</span>
        <span className="text-blue-400">{currentDirectory}</span>
        <span className="text-blue-400/50">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent text-blue-400 outline-none font-mono text-sm min-w-0"
          spellCheck={false}
          autoComplete="off"
          placeholder=""
        />
        <span className="text-blue-400 animate-pulse">|</span>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { FileText, Save, FolderOpen, File } from 'lucide-react'
import { useTheme } from '@/app/contexts/theme-context'

export function NotepadApp() {
  const { getThemeClass } = useTheme()
  const [content, setContent] = useState('Welcome to BatOS Notepad!\n\nThis is a sample application running in your Batcomputer desktop environment.\n\nYou can:\n- Type and edit text\n- Save files (coming soon)\n- Open files (coming soon)\n- Experience the full desktop environment\n\nEnjoy exploring your new Batcomputer!')

  return (
    <div className={`w-full h-full flex flex-col ${getThemeClass()} text-blue-400`}>
      {/* Toolbar */}
      <div className={`flex items-center space-x-2 p-2 ${getThemeClass()} border-b border-blue-400/30`}>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400 hover:bg-blue-400/10">
          <File className="w-4 h-4 mr-1" />
          New
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400 hover:bg-blue-400/10">
          <FolderOpen className="w-4 h-4 mr-1" />
          Open
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400 hover:bg-blue-400/10">
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full bg-transparent text-blue-400 font-mono text-sm resize-none outline-none border-none"
          placeholder="Start typing..."
        />
      </div>

      {/* Status Bar */}
      <div className={`flex items-center justify-between px-4 py-2 ${getThemeClass()} border-t border-blue-400/30 text-xs text-blue-400/70`}>
        <div>Lines: {content.split('\n').length}</div>
        <div>Characters: {content.length}</div>
        <div>BatOS Notepad v1.0</div>
      </div>
    </div>
  )
}

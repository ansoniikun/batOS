# BatOS - Batcomputer Desktop Environment

A modern web-based desktop environment inspired by the Batcomputer from Batman comics and movies. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Modern Desktop Environment**: Full-featured desktop with windows, taskbar, and start menu
- **Batcomputer Theme**: Dark theme with yellow accents inspired by the Batcomputer
- **Draggable & Resizable Windows**: Windows can be moved and resized
- **Taskbar**: Shows running applications with minimize/maximize functionality
- **Start Menu**: Search and launch applications
- **Widgets**: Desktop widgets (clock, system info, etc.)
- **Notification System**: Toast notifications for system events
- **Sample Applications**: Notepad and System Info apps included

## Project Structure

```
app/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── desktop/           # Main desktop component
│   ├── windows/           # Window management
│   ├── taskbar/           # Taskbar component
│   ├── start-menu/        # Start menu component
│   ├── widgets/           # Desktop widgets
│   └── notifications/     # Notification system
├── features/
│   └── apps/             # Desktop applications
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Start Menu**: Click the "Start" button in the taskbar to open the start menu
- **Launch Apps**: Use the start menu to launch Notepad or System Info
- **Window Management**: 
  - Drag windows by their title bar
  - Resize windows using the bottom-right corner
  - Minimize, maximize, or close windows using the title bar buttons
- **Taskbar**: Click taskbar items to focus or restore minimized windows

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI primitives
- **Lucide React**: Icon library
- **Framer Motion**: Animation library

## Customization

### Adding New Apps

1. Create a new app component in `app/features/apps/`
2. Add the app to the `sampleApps` array in `app/components/start-menu/start-menu.tsx`
3. Update the `openWindow` function in `app/components/desktop/desktop.tsx` to handle the new app

### Theming

The Batcomputer theme uses:
- **Background**: Dark gradients with yellow accents
- **Primary Color**: Yellow (#fbbf24)
- **Text**: Yellow for highlights, white/gray for content
- **Borders**: Yellow with transparency

## Development

This project uses:
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Tailwind CSS**: Styling
- **Next.js**: Development server and build tools

## License

MIT License - feel free to use this project for your own Batcomputer-inspired applications!

# 🦇 BATOS - Batcomputer Operating System

A modern web-based desktop environment inspired by the Batcomputer, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### 🖥️ Desktop Environment
- **Modern UI**: Glowing blue theme with Batman-inspired aesthetics
- **Window Management**: Draggable, resizable, minimizable, and maximizable windows
- **Smooth Interactions**: 60fps dragging with requestAnimationFrame optimization
- **Theme System**: Switch between 'liquid' (black) and 'frost' (gray) themes
- **Z-Index Management**: Proper layering for windows, widgets, and UI elements

### 🎯 Applications
- **Terminal**: Linux-like command interface with custom commands
- **File Manager**: Browse and manage files with drag-and-drop
- **Batplayer**: Music player with YouTube integration (Nirvana, Arctic Monkeys, Jaden Smith)
- **Notepad**: Simple text editor
- **System Info**: Real-time system monitoring

### 📊 Widgets
- **Clock Widget**: Real-time clock with date display
- **Calendar Widget**: Interactive calendar
- **CPU Widget**: System performance monitoring
- **User Stats Widget**: User information display
- **Alert System**: Real-time disaster and crime monitoring
  - NASA EONET API integration
  - USGS Earthquake data
  - NOAA Weather alerts
  - Crime news monitoring

### 🎵 Media Player
- **YouTube Integration**: Real-time music streaming
- **Playlist Management**: 12-track playlist including:
  - Nirvana classics (Smells Like Teen Spirit, Something in the Way, etc.)
  - Arctic Monkeys hits (Do I Wanna Know?, R U Mine?, etc.)
  - Jaden Smith's "Batman"
- **Audio Controls**: Play, pause, seek, volume control
- **Focus Management**: Maintains playback when switching windows

### 🔧 System Features
- **Start Menu**: Application launcher with search functionality
- **Taskbar**: Window management and system controls
- **Context Menus**: Right-click desktop interactions
- **Global Volume Control**: System-wide audio management
- **Real-time APIs**: Live data from multiple sources

## 🛠️ Technology Stack

### Core
- **Next.js 15.4.6**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Framer Motion**: Smooth animations
- **Class Variance Authority**: Component variant management

### APIs & Data
- **NASA EONET**: Natural disaster monitoring
- **USGS**: Earthquake data
- **NOAA**: Weather alerts
- **YouTube IFrame API**: Music streaming

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/batos.git
cd batos

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 🎮 Usage

### Desktop Navigation
- **Left-click Batman logo**: Open start menu
- **Right-click desktop**: Context menu with widgets and themes
- **Drag windows**: Click and drag title bars
- **Resize windows**: Drag corners and edges
- **Minimize/Maximize**: Use window controls

### Applications
- **Terminal**: Type `help` for available commands
- **Batplayer**: Click play to start music
- **File Manager**: Navigate and manage files
- **Widgets**: Drag to reposition, right-click to remove

### Keyboard Shortcuts
- **Escape**: Close start menu
- **Ctrl+Click**: Multi-select in file manager

## 🏗️ Project Structure

```
batos/
├── app/
│   ├── components/
│   │   ├── desktop/          # Desktop environment
│   │   ├── windows/          # Window management
│   │   ├── widgets/          # Desktop widgets
│   │   ├── start-menu/       # Start menu
│   │   ├── taskbar/          # Taskbar
│   │   └── ui/              # Reusable UI components
│   ├── features/apps/        # Application components
│   ├── contexts/            # React contexts
│   ├── types/               # TypeScript definitions
│   └── lib/                 # Utility functions
├── public/
│   └── data/               # JSON data files
└── package.json
```

## 🎨 Customization

### Themes
The system supports two themes:
- **Liquid**: Dark black background (`bg-black/95`)
- **Frost**: Gray background (`bg-gray-900/95`)

### Adding Widgets
1. Create widget component in `app/components/widgets/`
2. Add to widget manager
3. Register in desktop state
4. Add to context menu

### Adding Applications
1. Create app component in `app/features/apps/`
2. Add to start menu applications array
3. Implement required props and methods

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contribution Guidelines](CONTRIBUTING.md) before submitting any changes.

### Before Submitting
- **Preview Required**: Please include a screenshot or video preview of your changes
- **Test Thoroughly**: Ensure all features work correctly
- **Follow Code Style**: Use TypeScript and follow existing patterns
- **Update Documentation**: Keep README and comments up to date

### Contribution Areas
- 🎨 UI/UX improvements
- 🚀 New applications
- 📊 Additional widgets
- 🔧 Bug fixes
- 📚 Documentation updates
- 🎵 Music playlist additions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DC Comics**: For the Batman universe inspiration
- **NASA**: For the EONET API
- **USGS**: For earthquake data
- **NOAA**: For weather alerts
- **YouTube**: For music streaming capabilities

---

**BATOS** - Because even the Dark Knight needs a modern OS 🦇💻

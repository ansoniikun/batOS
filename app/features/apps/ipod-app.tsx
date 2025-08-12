'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/app/contexts/theme-context'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, List } from 'lucide-react'

interface Video {
  id: string
  title: string
  artist: string
  duration: string
  thumbnail: string
  videoId: string
  genre: string
  year: number
  album: string
}

interface IpodData {
  videos: Video[]
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function IpodApp() {
  const { getThemeClass } = useTheme()
  const [videos, setVideos] = useState<Video[]>([])
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [selectedPlaylistItem, setSelectedPlaylistItem] = useState(0)
  const [playerReady, setPlayerReady] = useState(false)
  const [playerError, setPlayerError] = useState(false)
  const [wasPlayingBeforeFocus, setWasPlayingBeforeFocus] = useState(false)
  
  const playerRef = useRef<any>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        createPlayer()
      }
    } else {
      createPlayer()
    }

    // Cleanup function
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current)
      }
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
      }
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy()
        } catch (error) {
          console.log('Player already destroyed')
        }
      }
    }
  }, [])

  const createPlayer = () => {
    try {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player('youtube-player', {
          height: '0',
          width: '0',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            cc_load_policy: 0
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError
          }
        })
      }
    } catch (error) {
      console.error('Error creating YouTube player:', error)
      setPlayerError(true)
    }
  }

  const onPlayerReady = (event: any) => {
    try {
      setPlayerReady(true)
      setPlayerError(false)
      if (event.target && typeof event.target.setVolume === 'function') {
        event.target.setVolume(volume)
        if (isMuted) {
          event.target.mute()
        }
      }
    } catch (error) {
      console.error('Error in player ready:', error)
      setPlayerError(true)
    }
  }

  const onPlayerStateChange = (event: any) => {
    try {
      // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
      if (event.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true)
        setWasPlayingBeforeFocus(true)
        // Clear any existing interval
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current)
        }
        // Start time update interval
        timeIntervalRef.current = setInterval(() => {
          if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
            try {
              const time = playerRef.current.getCurrentTime()
              setCurrentTime(Math.floor(time))
            } catch (error) {
              console.error('Error getting current time:', error)
              if (timeIntervalRef.current) {
                clearInterval(timeIntervalRef.current)
              }
            }
          }
        }, 1000)
      } else if (event.data === window.YT.PlayerState.PAUSED) {
        // Only update state if it's not a focus-related pause
        if (!wasPlayingBeforeFocus) {
          setIsPlaying(false)
        }
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current)
        }
      } else if (event.data === window.YT.PlayerState.ENDED) {
        setIsPlaying(false)
        setWasPlayingBeforeFocus(false)
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current)
        }
        // Handle repeat or next track
        if (repeat) {
          handlePlayPause()
        } else {
          handleNext()
        }
      }
    } catch (error) {
      console.error('Error in player state change:', error)
    }
  }

  const onPlayerError = (event: any) => {
    console.error('YouTube player error:', event.data)
    setPlayerError(true)
    setIsPlaying(false)
    setWasPlayingBeforeFocus(false)
  }

  // Handle window focus events
  useEffect(() => {
    const handleWindowFocus = () => {
      // If music was playing before focus loss, resume it after a short delay
      if (wasPlayingBeforeFocus && playerRef.current && playerReady && !playerError) {
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current)
        }
        focusTimeoutRef.current = setTimeout(() => {
          try {
            if (typeof playerRef.current.playVideo === 'function') {
              playerRef.current.playVideo()
            }
          } catch (error) {
            console.error('Error resuming playback:', error)
          }
        }, 100)
      }
    }

    const handleWindowBlur = () => {
      // Remember if music was playing when window loses focus
      if (isPlaying) {
        setWasPlayingBeforeFocus(true)
      }
    }

    window.addEventListener('focus', handleWindowFocus)
    window.addEventListener('blur', handleWindowBlur)

    return () => {
      window.removeEventListener('focus', handleWindowFocus)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [wasPlayingBeforeFocus, isPlaying, playerReady, playerError])

  useEffect(() => {
    fetch('/data/ipod_videos.json')
      .then(res => res.json())
      .then((data: IpodData) => {
        setVideos(data.videos)
        if (data.videos.length > 0) {
          setCurrentVideo(data.videos[0])
        }
      })
      .catch(err => console.error('Error loading videos:', err))
  }, [])

  useEffect(() => {
    if (currentVideo && playerReady && playerRef.current && !playerError) {
      try {
        if (typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById(currentVideo.videoId)
          setCurrentTime(0)
          setDuration(parseInt(currentVideo.duration.split(':')[0]) * 60 + parseInt(currentVideo.duration.split(':')[1]))
          setWasPlayingBeforeFocus(false)
        }
      } catch (error) {
        console.error('Error loading video:', error)
        setPlayerError(true)
      }
    }
  }, [currentVideo, playerReady, playerError])

  useEffect(() => {
    if (playerRef.current && playerReady && !playerError) {
      try {
        if (typeof playerRef.current.setVolume === 'function') {
          if (isMuted) {
            playerRef.current.mute()
          } else {
            playerRef.current.unMute()
            playerRef.current.setVolume(volume)
          }
        }
      } catch (error) {
        console.error('Error setting volume:', error)
      }
    }
  }, [volume, isMuted, playerReady, playerError])

  const handlePlayPause = () => {
    if (playerRef.current && playerReady && !playerError) {
      try {
        if (typeof playerRef.current.playVideo === 'function' && typeof playerRef.current.pauseVideo === 'function') {
          if (isPlaying) {
            setWasPlayingBeforeFocus(false)
            playerRef.current.pauseVideo()
          } else {
            setWasPlayingBeforeFocus(true)
            playerRef.current.playVideo()
          }
        }
      } catch (error) {
        console.error('Error in play/pause:', error)
        setPlayerError(true)
      }
    }
  }
  
  const handleNext = () => {
    if (videos.length === 0) return
    let nextIndex = shuffle ? Math.floor(Math.random() * videos.length) : (currentIndex + 1) % videos.length
    setCurrentIndex(nextIndex)
    setCurrentVideo(videos[nextIndex])
    setWasPlayingBeforeFocus(true) // Auto-play next track
  }

  const handlePrevious = () => {
    if (videos.length === 0) return
    let prevIndex = shuffle ? Math.floor(Math.random() * videos.length) : currentIndex === 0 ? videos.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setCurrentVideo(videos[prevIndex])
    setWasPlayingBeforeFocus(true) // Auto-play previous track
  }

  const handleVideoSelect = (video: Video, index: number) => {
    setCurrentVideo(video)
    setCurrentIndex(index)
    setWasPlayingBeforeFocus(true) // Auto-play selected track
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration || !playerRef.current || !playerReady || playerError) return
    try {
      const rect = progressRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      const newTime = Math.floor(percentage * duration)
      setCurrentTime(newTime)
      if (typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(newTime, true)
      }
    } catch (error) {
      console.error('Error seeking:', error)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => setIsMuted(!isMuted)

  const retryPlayer = () => {
    setPlayerError(false)
    setPlayerReady(false)
    setWasPlayingBeforeFocus(false)
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      try {
        playerRef.current.destroy()
      } catch (error) {
        console.log('Player already destroyed')
      }
    }
    playerRef.current = null
    createPlayer()
  }

  return (
    <div className={`w-full h-full ${getThemeClass()} text-blue-400 font-mono overflow-hidden`}>
      {/* Hidden YouTube Player */}
      <div id="youtube-player" style={{ display: 'none' }}></div>
      
      {/* Mini Player Container - Now fills entire window */}
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-blue-500/30">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${playerError ? 'bg-red-400' : playerReady ? 'bg-blue-400 animate-pulse' : 'bg-yellow-400'}`}></div>
            <span className="text-sm font-bold text-blue-400">BATPLAYER</span>
            {playerError && (
              <button
                onClick={retryPlayer}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Retry
              </button>
            )}
          </div>
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`p-1 rounded transition-all duration-200 ${
              showPlaylist ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content - Adjusted spacing for smaller window */}
        <div className="flex-1 flex flex-col p-3 space-y-3">
          {/* Now Playing Display */}
          <div className="flex items-center space-x-3 p-2 bg-black/30 rounded-lg border border-blue-500/30">
            {/* Album Art */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="text-lg">🎵</div>
            </div>
            
            {/* Track Info */}
            <div className="flex-1 min-w-0">
              {currentVideo ? (
                <>
                  <div className="text-sm font-bold text-blue-400 truncate">{currentVideo.title}</div>
                  <div className="text-xs text-blue-300 truncate">{currentVideo.artist}</div>
                  <div className="text-xs text-blue-400/70">{currentVideo.album} • {currentVideo.year}</div>
                </>
              ) : (
                <div className="text-sm text-blue-400">No track selected</div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div 
              ref={progressRef}
              className="w-full h-1.5 bg-gray-700 rounded-full cursor-pointer relative overflow-hidden"
              onClick={handleProgressClick}
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full transition-all duration-100" 
                   style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-blue-300">{formatTime(currentTime)}</span>
              <span className="text-blue-300">{currentVideo ? currentVideo.duration : '0:00'}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`p-1.5 rounded transition-all duration-200 ${
                shuffle ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
            
            <button
              onClick={handlePrevious}
              className="p-1.5 rounded text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
              disabled={!playerReady || playerError}
            >
              <SkipBack className="w-4 h-4" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-2.5 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!playerReady || playerError}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
            </button>
            
            <button
              onClick={handleNext}
              className="p-1.5 rounded text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
              disabled={!playerReady || playerError}
            >
              <SkipForward className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setRepeat(!repeat)}
              className={`p-1.5 rounded transition-all duration-200 ${
                repeat ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 p-2 bg-black/30 rounded-lg border border-blue-500/30">
            <button
              onClick={toggleMute}
              className="text-blue-400 hover:text-blue-300 transition-colors"
              disabled={!playerReady || playerError}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${isMuted ? 0 : volume}%, #4b5563 ${isMuted ? 0 : volume}%, #4b5563 100%)`
              }}
              disabled={!playerReady || playerError}
            />
            <span className="text-xs text-blue-300 min-w-[2rem] text-center">
              {isMuted ? 0 : volume}%
            </span>
          </div>
        </div>

        {/* Playlist Panel - Adjusted height for smaller window */}
        {showPlaylist && (
          <div className="h-32 bg-black/50 border-t border-blue-500/30 overflow-hidden">
            <div className="h-full overflow-y-auto p-2" style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#3b82f6 #1f2937',
              scrollbarGutter: 'stable'
            }}>
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className={`h-6 flex items-center px-2 rounded text-xs cursor-pointer transition-all duration-200 ${
                    index === selectedPlaylistItem ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300 hover:text-blue-400 hover:bg-blue-500/10'
                  }`}
                  onClick={() => {
                    handleVideoSelect(video, index)
                    setSelectedPlaylistItem(index)
                  }}
                >
                  <div className="w-3 h-3 mr-2">
                    {currentVideo?.id === video.id && isPlaying ? (
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                    ) : (
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                    )}
                  </div>
                  <span className="truncate flex-1">{video.title}</span>
                  <span className="text-xs text-gray-500 ml-1">{video.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

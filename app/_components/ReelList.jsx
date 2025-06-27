"use client"

import { useState, useRef } from "react"
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, MoreVertical } from "lucide-react"

const ReelList = ({ edits }) => {
  const [playingVideo, setPlayingVideo] = useState(null)
  const [fullscreenVideo, setFullscreenVideo] = useState(null)
  const [mutedVideos, setMutedVideos] = useState(new Set())
  const [gridSize, setGridSize] = useState("md")
  const videoRefs = useRef({})

  if (!edits || !Array.isArray(edits) || edits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-6xl mb-4">🎬</div>
        <p className="text-xl text-gray-600 text-center">No reels found for this category</p>
        <p className="text-sm text-gray-500 mt-2">Check back later for new content!</p>
      </div>
    )
  }

  const togglePlay = (index) => {
    const video = videoRefs.current[index]
    if (!video) return

    if (playingVideo === index) {
      video.pause()
      setPlayingVideo(null)
    } else {
      Object.values(videoRefs.current).forEach((v) => v?.pause())
      video.play()
      setPlayingVideo(index)
    }
  }

  const toggleMute = (index) => {
    const video = videoRefs.current[index]
    if (!video) return

    const newMuted = new Set(mutedVideos)
    if (mutedVideos.has(index)) {
      video.muted = false
      newMuted.delete(index)
    } else {
      video.muted = true
      newMuted.add(index)
    }
    setMutedVideos(newMuted)
  }

  const toggleFullscreen = (index) => {
    const video = videoRefs.current[index]
    if (!video) return

    if (fullscreenVideo === index) {
      document.exitFullscreen?.()
      setFullscreenVideo(null)
    } else {
      video.requestFullscreen?.()
      setFullscreenVideo(index)
    }
  }

  const getGridClasses = () => {
    switch (gridSize) {
      case "sm": return "grid-cols-1 sm:grid-cols-5 md:grid-cols-5"
      case "md": return "grid-cols-1 sm:grid-cols-4 md:grid-cols-4"
      case "lg": return "grid-cols-3 sm:grid-cols-3 md:grid-cols-3"
      default: return "grid-cols-1 sm:grid-cols-3 md:grid-cols-11"
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 px-4">
        <h3 className="text-lg font-semibold text-gray-800">Reels ({edits.length})</h3>
        <div className="flex gap-2">
          {["sm", "md", "lg"].map((size) => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              className={`px-3 py-1 rounded text-sm ${gridSize === size ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid ${getGridClasses()} gap-4 px-4`}>
        {edits.map((edit, index) => {
          const videoUrl = edit?.video?.[0]?.url || edit?.video?.url
          return (
            <div key={edit?.slug || index} className="bg-white rounded-xl overflow-hidden shadow group">
              <div className="relative aspect-[9/16]">
                {videoUrl ? (
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    muted={mutedVideos.has(index)}
                    onClick={() => togglePlay(index)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">No Video</div>
                )}

                <div className="absolute bottom-2 left-2 flex gap-2">
                  <button onClick={() => togglePlay(index)} className="bg-white/80 rounded-full p-2">
                    {playingVideo === index ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button onClick={() => toggleMute(index)} className="bg-white/80 rounded-full p-2">
                    {mutedVideos.has(index) ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <button onClick={() => toggleFullscreen(index)} className="bg-white/80 rounded-full p-2">
                    {fullscreenVideo === index ? <Minimize size={16} /> : <Maximize size={16} />}
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{edit.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{edit.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        Showing {edits.length} reels in {gridSize.toUpperCase()} view
      </div>
    </div>
  )
}

export default ReelList
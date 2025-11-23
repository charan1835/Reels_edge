"use client"

import { useState, useRef } from "react"
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, Heart, Share2, Bookmark } from "lucide-react"
import { toast } from "sonner"

const ReelList = ({ edits }) => {
  const [playingVideo, setPlayingVideo] = useState(null)
  const [fullscreenVideo, setFullscreenVideo] = useState(null)
  const [mutedVideos, setMutedVideos] = useState(new Set())
  const [gridSize, setGridSize] = useState("md")
  const [likedReels, setLikedReels] = useState(new Set())
  const [savedReels, setSavedReels] = useState(new Set())
  const videoRefs = useRef({})

  if (!edits || !Array.isArray(edits) || edits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-6xl mb-4">🎬</div>
        <p className="text-xl text-slate-600 dark:text-slate-400 text-center">No reels found for this category</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Check back later for new content!</p>
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

  const toggleLike = (index, e) => {
    e.stopPropagation()
    const newLiked = new Set(likedReels)
    if (likedReels.has(index)) {
      newLiked.delete(index)
    } else {
      newLiked.add(index)
      toast.success("Added to Liked Reels ❤️")
    }
    setLikedReels(newLiked)
  }

  const toggleSave = (index, e) => {
    e.stopPropagation()
    const newSaved = new Set(savedReels)
    if (savedReels.has(index)) {
      newSaved.delete(index)
    } else {
      newSaved.add(index)
      toast.success("Reel Saved! 🔖")
    }
    setSavedReels(newSaved)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    toast.success("Link copied to clipboard! 🔗")
    navigator.clipboard.writeText(window.location.href)
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
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Reels ({edits.length})</h3>
        <div className="flex gap-2">
          {["sm", "md", "lg"].map((size) => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              className={`px-3 py-1 rounded text-sm transition-colors ${gridSize === size
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
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
            <div key={edit?.slug || index} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group relative border border-slate-200 dark:border-gray-800">
              <div className="relative aspect-[9/16] bg-black">
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
                  <div className="flex items-center justify-center h-full bg-slate-200 dark:bg-gray-800 text-slate-500">No Video</div>
                )}

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

                  {/* Right Side Actions */}
                  <div className="absolute right-2 bottom-16 flex flex-col gap-3">
                    <button
                      onClick={(e) => toggleLike(index, e)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all ${likedReels.has(index) ? "bg-red-500/80 text-white" : "bg-black/40 text-white hover:bg-black/60"}`}
                    >
                      <Heart size={20} className={likedReels.has(index) ? "fill-current" : ""} />
                    </button>
                    <button
                      onClick={(e) => toggleSave(index, e)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all ${savedReels.has(index) ? "bg-blue-500/80 text-white" : "bg-black/40 text-white hover:bg-black/60"}`}
                    >
                      <Bookmark size={20} className={savedReels.has(index) ? "fill-current" : ""} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-all"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>

                  {/* Bottom Controls */}
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex gap-2">
                      <button onClick={() => togglePlay(index)} className="text-white hover:scale-110 transition-transform">
                        {playingVideo === index ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      <button onClick={() => toggleMute(index)} className="text-white hover:scale-110 transition-transform">
                        {mutedVideos.has(index) ? <VolumeX size={24} /> : <Volume2 size={24} />}
                      </button>
                    </div>
                    <button onClick={() => toggleFullscreen(index)} className="text-white hover:scale-110 transition-transform">
                      {fullscreenVideo === index ? <Minimize size={24} /> : <Maximize size={24} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{edit.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{edit.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
        Showing {edits.length} reels in {gridSize.toUpperCase()} view
      </div>
    </div>
  )
}

export default ReelList
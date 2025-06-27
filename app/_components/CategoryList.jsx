"use client"

import { useEffect, useState, useRef } from "react"
import GlobalApi from "../_utils/GlobalApi"
import { ChevronLeft, ChevronRight, Play, Pause, Smartphone } from "lucide-react"
import Link from "next/link"

export default function CategoryList() {
  const [categories, setCategories] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 })
  const [touchCurrent, setTouchCurrent] = useState({ x: 0, y: 0 })
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const scrollRef = useRef(null)
  const autoRotateRef = useRef(null)
  const carouselRef = useRef(null)

  useEffect(() => {
    getCategory()
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768)
  }

  // Auto-rotation effect
  useEffect(() => {
    if (autoRotate && !isHovered && !isTouching && categories.length > 0) {
      autoRotateRef.current = setInterval(() => {
        goToNext()
      }, 3000)
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
      }
    }
  }, [autoRotate, isHovered, isTouching, categories.length, currentIndex])

  const getCategory = async () => {
    const res = await GlobalApi.GetCategory()
    setCategories(res)
    if (res.length > 0) {
      setCurrentIndex(Math.floor(res.length / 2))
    }
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    const nextIndex = (currentIndex + 1) % categories.length
    setCurrentIndex(nextIndex)
    scrollToCategory(nextIndex)
    setTimeout(() => setIsTransitioning(false), 400)
  }

  const goToPrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    const prevIndex = (currentIndex - 1 + categories.length) % categories.length
    setCurrentIndex(prevIndex)
    scrollToCategory(prevIndex)
    setTimeout(() => setIsTransitioning(false), 400)
  }

  const goToIndex = (index) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    scrollToCategory(index)
    setTimeout(() => setIsTransitioning(false), 400)
  }

  const scrollToCategory = (index) => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current
      const itemWidth = 200
      const scrollPosition = index * itemWidth - scrollContainer.clientWidth / 2 + itemWidth / 2
      scrollContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current && !isTransitioning && !isTouching) {
      const scrollContainer = scrollRef.current
      const itemWidth = 200
      const scrollLeft = scrollContainer.scrollLeft
      const newIndex = Math.round(scrollLeft / itemWidth)
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < categories.length) {
        setCurrentIndex(newIndex)
      }
    }
  }

  // Touch Event Handlers
  const handleTouchStart = (e) => {
    if (!isMobile) return

    const touch = e.touches[0]
    setIsTouching(true)
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    })
    setTouchCurrent({
      x: touch.clientX,
      y: touch.clientY,
    })
    setSwipeOffset(0)

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  const handleTouchMove = (e) => {
    if (!isTouching || !isMobile) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    // Prevent vertical scrolling if horizontal swipe is detected
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault()
    }

    setTouchCurrent({
      x: touch.clientX,
      y: touch.clientY,
    })

    // Calculate swipe offset with resistance at edges
    let offset = deltaX
    const maxOffset = 100

    if (currentIndex === 0 && deltaX > 0) {
      offset = deltaX * 0.3 // Resistance when swiping right at first item
    } else if (currentIndex === categories.length - 1 && deltaX < 0) {
      offset = deltaX * 0.3 // Resistance when swiping left at last item
    }

    setSwipeOffset(Math.max(-maxOffset, Math.min(maxOffset, offset)))
  }

  const handleTouchEnd = (e) => {
    if (!isTouching || !isMobile) return

    const deltaX = touchCurrent.x - touchStart.x
    const deltaY = touchCurrent.y - touchStart.y
    const deltaTime = Date.now() - touchStart.time
    const velocity = Math.abs(deltaX) / deltaTime

    setIsTouching(false)
    setSwipeOffset(0)

    // Determine if it's a valid swipe
    const minSwipeDistance = 50
    const maxSwipeTime = 500
    const minVelocity = 0.3

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)
    const isValidSwipe =
      isHorizontalSwipe && (Math.abs(deltaX) > minSwipeDistance || velocity > minVelocity) && deltaTime < maxSwipeTime

    if (isValidSwipe) {
      // Add stronger haptic feedback for successful swipe
      if (navigator.vibrate) {
        navigator.vibrate([20, 10, 20])
      }

      if (deltaX > 0) {
        // Swipe right - go to previous
        goToPrev()
      } else {
        // Swipe left - go to next
        goToNext()
      }
    }
  }

  const handleTouchCancel = () => {
    setIsTouching(false)
    setSwipeOffset(0)
  }

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate)
  }

  if (categories.length === 0) {
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-slate-400">Loading categories...</div>
          </div>
        </div>
      </div>
    )
  }

  const getVisibleCategories = () => {
    const visible = []
    const total = categories.length

    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + total) % total
      visible.push({
        ...categories[index],
        position: i,
        originalIndex: index,
      })
    }
    return visible
  }

  const visibleCategories = getVisibleCategories()

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header with Mobile Indicator */}
        <div className="flex justify-between items-center mb-8 px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-mono text-white tracking-wider animate-fade-in">Categories</h2>

            {/* Mobile Touch Indicator */}
            {isMobile && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Smartphone className="w-3 h-3" />
                <span className="text-xs font-mono">Swipe</span>
              </div>
            )}

            <button
              onClick={toggleAutoRotate}
              className={`
                flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono transition-all duration-300
                ${
                  autoRotate
                    ? "bg-green-600/20 text-green-400 border border-green-500/30"
                    : "bg-slate-700/50 text-slate-400 border border-slate-600/30"
                }
                hover:scale-105 active:scale-95
              `}
            >
              {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {autoRotate ? "Auto" : "Manual"}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={goToPrev}
              disabled={isTransitioning}
              className="group p-2 rounded-full bg-slate-700/80 hover:bg-slate-600 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 group-hover:animate-pulse" />
            </button>
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="group p-2 rounded-full bg-slate-700/80 hover:bg-slate-600 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-6 h-6 group-hover:animate-pulse" />
            </button>
          </div>
        </div>

        {/* Touch Instructions for Mobile */}
        {isMobile && (
          <div className="text-center mb-4">
            <p className="text-xs text-slate-500 font-mono">👆 Swipe left or right to navigate • Tap to select</p>
          </div>
        )}

        {/* Main Carousel Container with Touch Support */}
        <div
          ref={carouselRef}
          className="relative h-80 flex items-center justify-center overflow-hidden rounded-2xl touch-pan-y"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          style={{
            transform: isTouching ? `translateX(${swipeOffset}px)` : "none",
            transition: isTouching ? "none" : "transform 0.3s ease-out",
          }}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-transparent to-slate-900/50 z-0"></div>

          {/* Touch Feedback Overlay */}
          {isTouching && <div className="absolute inset-0 bg-blue-500/5 z-5 animate-pulse"></div>}

          {visibleCategories.map((cat, idx) => {
            const position = cat.position
            const isCenter = position === 0
            const isAdjacent = Math.abs(position) === 1
            const isFar = Math.abs(position) === 2

            const baseTransform = `translateX(${position * 200}px)`
            let scale = 1
            let blur = 0
            let opacity = 1
            let zIndex = 1
            let rotateY = 0

            if (isCenter) {
              scale = isTouching ? 1.35 : 1.3 // Slightly larger when touching
              zIndex = 10
              rotateY = 0
            } else if (isAdjacent) {
              scale = 0.85
              blur = 1
              opacity = 0.8
              zIndex = 5
              rotateY = position * 15
            } else if (isFar) {
              scale = 0.65
              blur = 3
              opacity = 0.5
              zIndex = 1
              rotateY = position * 25
            }

            return (
              <div
                key={`${cat.originalIndex}-${position}`}
                className="absolute transition-all duration-500 ease-out cursor-pointer animate-slide-in select-none"
                style={{
                  transform: `${baseTransform} scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`,
                  filter: `blur(${blur}px)`,
                  opacity,
                  zIndex,
                  animationDelay: `${idx * 100}ms`,
                }}
                onClick={() => !isTouching && goToIndex(cat.originalIndex)}
                onTouchStart={(e) => e.stopPropagation()} // Prevent event bubbling for individual items
              >
                <Link href={`/?category=${cat.slug}`}>
                  <div className="relative group">
                    <div
                      className={`
                      bg-gradient-to-br from-slate-800/90 to-slate-900/90 
                      backdrop-blur-md border border-slate-700/50 
                      rounded-2xl p-6 transition-all duration-500
                      ${isCenter ? "shadow-2xl shadow-blue-900/30 animate-glow" : "shadow-lg"}
                      ${isCenter ? "hover:shadow-3xl hover:shadow-blue-800/40" : "hover:shadow-xl"}
                      w-64 h-64 flex flex-col items-center justify-center
                      hover:border-slate-600/70 group-hover:scale-105
                      ${isTouching && isCenter ? "ring-2 ring-blue-500/50" : ""}
                    `}
                    >
                      {/* Category Icon */}
                      <div
                        className={`
                        relative mb-4 transition-all duration-500
                        ${isCenter ? "w-20 h-20 animate-bounce-subtle" : "w-16 h-16"}
                        group-hover:scale-110
                      `}
                      >
                        <img
                          src={cat.icon?.[0]?.url || "/placeholder.svg"}
                          alt={cat.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:rotate-12"
                          draggable={false}
                        />

                        {/* Animated glow for center item */}
                        {isCenter && (
                          <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl -z-10 animate-pulse-glow"></div>
                        )}
                      </div>

                      {/* Category Name */}
                      <h3
                        className={`
                        font-mono text-center tracking-wide transition-all duration-500
                        ${isCenter ? "text-xl text-white animate-text-glow" : "text-lg text-slate-300"}
                        group-hover:text-blue-300
                      `}
                      >
                        {cat.name}
                      </h3>

                      {/* Center item indicator */}
                      {isCenter && (
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                          <div className="absolute top-0 left-0 w-3 h-3 bg-blue-400 rounded-full"></div>
                        </div>
                      )}

                      {/* Ripple effect on hover/touch */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <div
                          className={`
                          absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full 
                          ${isTouching && isCenter ? "translate-x-full" : "group-hover:translate-x-full"} 
                          transition-transform duration-1000 ease-out
                        `}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}

          {/* Swipe Direction Indicators */}
          {isTouching && (
            <>
              <div
                className={`
                absolute left-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-200
                ${swipeOffset > 20 ? "opacity-100" : "opacity-30"}
              `}
              >
                <ChevronLeft className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <div
                className={`
                absolute right-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-200
                ${swipeOffset < -20 ? "opacity-100" : "opacity-30"}
              `}
              >
                <ChevronRight className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
            </>
          )}
        </div>

        {/* Horizontal Scrollbar with Touch Support */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-400 font-mono">
              {isMobile ? "Swipe or Scroll Categories" : "Scroll Categories"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {currentIndex + 1} / {categories.length}
            </span>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500 pb-4 touch-pan-x"
            style={{ scrollbarWidth: "thin" }}
          >
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                onClick={() => goToIndex(index)}
                className={`
                  min-w-[180px] max-w-[180px] cursor-pointer transition-all duration-300 select-none
                  ${
                    index === currentIndex
                      ? "transform scale-105 animate-border-glow"
                      : "hover:scale-102 opacity-70 hover:opacity-90"
                  }
                `}
              >
                <div
                  className={`
                  bg-gradient-to-br from-slate-800/60 to-slate-900/60 
                  backdrop-blur-sm border rounded-xl p-4 transition-all duration-300
                  ${
                    index === currentIndex
                      ? "border-blue-500/50 shadow-lg shadow-blue-900/20"
                      : "border-slate-700/30 hover:border-slate-600/50"
                  }
                `}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.icon?.[0]?.url || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-8 h-8 object-contain"
                      draggable={false}
                    />
                    <span
                      className={`
                      text-sm font-mono tracking-wide transition-colors duration-300
                      ${index === currentIndex ? "text-blue-300" : "text-slate-300"}
                    `}
                    >
                      {cat.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator with Touch Support */}
        <div className="flex justify-center mt-8 gap-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              disabled={isTransitioning}
              className={`
                h-2 rounded-full transition-all duration-500 hover:scale-125 active:scale-110
                ${index === currentIndex ? "bg-blue-500 w-8 animate-pulse-dot" : "bg-slate-600 hover:bg-slate-500 w-2"}
                disabled:cursor-not-allowed touch-manipulation
              `}
            />
          ))}
        </div>

        {/* Progress Bar */}
        {autoRotate && !isTouching && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-progress"
                style={{ animationDuration: "3000ms" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.5);
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-track-slate-800::-webkit-scrollbar-track {
          background: rgb(30 41 59);
          border-radius: 10px;
        }
        
        .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
          background: rgb(71 85 105);
          border-radius: 10px;
        }
        
        .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb:hover {
          background: rgb(100 116 139);
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }

        .touch-pan-y {
          touch-action: pan-y;
        }

        .touch-pan-x {
          touch-action: pan-x;
        }

        .touch-manipulation {
          touch-action: manipulation;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.5); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
          50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
        }

        @keyframes border-glow {
          0%, 100% { border-color: rgba(59, 130, 246, 0.5); }
          50% { border-color: rgba(59, 130, 246, 0.8); }
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-in { animation: slide-in 0.8s ease-out; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
        .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
        .animate-border-glow { animation: border-glow 2s ease-in-out infinite; }
        .animate-pulse-dot { animation: pulse-dot 1s ease-in-out infinite; }
        .animate-progress { animation: progress linear infinite; }
        .scale-102 { transform: scale(1.02); }
      `}</style>
    </div>
  )
}

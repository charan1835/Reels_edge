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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const scrollRef = useRef(null)
  const autoRotateRef = useRef(null)
  const carouselRef = useRef(null)

  useEffect(() => {
    getCategory()
    checkMobile()
    checkMotionPreference()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768)
  }

  const checkMotionPreference = () => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
  }

  // Auto-rotation effect - disabled on mobile for better performance
  useEffect(() => {
    if (autoRotate && !isHovered && !isTouching && categories.length > 0 && !isMobile) {
      autoRotateRef.current = setInterval(() => {
        goToNext()
      }, 4000) // Increased interval for mobile
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
      }
    }
  }, [autoRotate, isHovered, isTouching, categories.length, currentIndex, isMobile])

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
    setTimeout(() => setIsTransitioning(false), isMobile ? 200 : 400)
  }

  const goToPrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    const prevIndex = (currentIndex - 1 + categories.length) % categories.length
    setCurrentIndex(prevIndex)
    scrollToCategory(prevIndex)
    setTimeout(() => setIsTransitioning(false), isMobile ? 200 : 400)
  }

  const goToIndex = (index) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    scrollToCategory(index)
    setTimeout(() => setIsTransitioning(false), isMobile ? 200 : 400)
  }

  const scrollToCategory = (index) => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current
      const itemWidth = isMobile ? 160 : 200
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
      const itemWidth = isMobile ? 160 : 200
      const scrollLeft = scrollContainer.scrollLeft
      const newIndex = Math.round(scrollLeft / itemWidth)
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < categories.length) {
        setCurrentIndex(newIndex)
      }
    }
  }

  // Optimized Touch Event Handlers
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

    // Lightweight haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(5)
    }
  }

  const handleTouchMove = (e) => {
    if (!isTouching || !isMobile) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault()
    }

    setTouchCurrent({
      x: touch.clientX,
      y: touch.clientY,
    })

    // Simplified swipe offset calculation
    let offset = deltaX
    const maxOffset = 80

    if (currentIndex === 0 && deltaX > 0) {
      offset = deltaX * 0.3
    } else if (currentIndex === categories.length - 1 && deltaX < 0) {
      offset = deltaX * 0.3
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

    const minSwipeDistance = 40
    const maxSwipeTime = 600
    const minVelocity = 0.2

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)
    const isValidSwipe =
      isHorizontalSwipe && (Math.abs(deltaX) > minSwipeDistance || velocity > minVelocity) && deltaTime < maxSwipeTime

    if (isValidSwipe) {
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }

      if (deltaX > 0) {
        goToPrev()
      } else {
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
          <div className="flex justify-center items-center h-48 md:h-64 gap-4">
            {/* Skeleton Loading State */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`relative ${i === 3 ? 'w-56 h-56 scale-110 z-10' : 'w-40 h-40 opacity-50'} hidden sm:block`}>
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800/50 rounded-2xl animate-pulse border border-slate-300 dark:border-slate-700/50"></div>
              </div>
            ))}
            {/* Mobile Skeleton */}
            <div className="sm:hidden w-40 h-40 bg-slate-200 dark:bg-slate-800/50 rounded-xl animate-pulse border border-slate-300 dark:border-slate-700/50"></div>
          </div>
        </div>
      </div>
    )
  }

  const getVisibleCategories = () => {
    const visible = []
    const total = categories.length
    const range = isMobile ? 1 : 2 // Show fewer items on mobile

    for (let i = -range; i <= range; i++) {
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
    <div className="w-full px-2 sm:px-4 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Mobile-Optimized Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 px-2 gap-4 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <h2 className="text-xl sm:text-2xl font-mono text-slate-900 dark:text-white tracking-wider">Categories</h2>

            {/* Mobile Touch Indicator */}
            {isMobile && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                <Smartphone className="w-3 h-3" />
                <span className="text-xs font-mono">Swipe</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {!isMobile && (
              <button
                onClick={toggleAutoRotate}
                className={`
                  flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono transition-colors duration-200
                  ${autoRotate
                    ? "bg-green-100 dark:bg-green-600/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30"
                    : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600/30"
                  }
                `}
              >
                {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {autoRotate ? "Auto" : "Manual"}
              </button>
            )}

            <button
              onClick={goToPrev}
              disabled={isTransitioning}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Touch Instructions for Mobile */}
        {isMobile && (
          <div className="text-center mb-4">
            <p className="text-xs text-slate-500 dark:text-slate-500 font-mono">👆 Swipe left or right • Tap to select</p>
          </div>
        )}

        {/* Optimized Carousel Container */}
        <div
          ref={carouselRef}
          className="relative h-64 sm:h-80 flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl"
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          style={{
            transform: isTouching ? `translateX(${swipeOffset}px)` : "none",
            transition: isTouching ? "none" : "transform 0.2s ease-out",
          }}
        >
          {/* Simplified Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100/30 dark:from-slate-900/30 via-transparent to-slate-100/30 dark:to-slate-900/30"></div>

          {visibleCategories.map((cat, idx) => {
            const position = cat.position
            const isCenter = position === 0
            const isAdjacent = Math.abs(position) === 1

            const spacing = isMobile ? 140 : 200
            const baseTransform = `translateX(${position * spacing}px)`
            let scale = 1
            let opacity = 1
            let zIndex = 1

            if (isCenter) {
              scale = isMobile ? 1.1 : 1.3
              zIndex = 10
            } else if (isAdjacent) {
              scale = isMobile ? 0.9 : 0.85
              opacity = isMobile ? 0.6 : 0.8
              zIndex = 5
            } else {
              scale = 0.7
              opacity = 0.4
              zIndex = 1
            }

            return (
              <div
                key={`${cat.originalIndex}-${position}`}
                className={`absolute cursor-pointer select-none ${prefersReducedMotion ? '' : 'transition-all duration-300 ease-out'
                  }`}
                style={{
                  transform: `${baseTransform} scale(${scale})`,
                  opacity,
                  zIndex,
                }}
                onClick={() => !isTouching && goToIndex(cat.originalIndex)}
              >
                <Link href={`/?category=${cat.slug}`}>
                  <div className="relative group">
                    <div
                      className={`
                        bg-white dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-slate-900/90 
                        backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 
                        rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-colors duration-200
                        ${isCenter ? "shadow-xl shadow-blue-500/10 dark:shadow-blue-900/20 ring-2 ring-blue-500/20 dark:ring-0" : "shadow-lg"}
                        ${isMobile ? "w-40 h-40" : "w-56 h-56"} 
                        flex flex-col items-center justify-center
                        hover:border-slate-300 dark:hover:border-slate-600/70
                      `}
                    >
                      {/* Category Icon */}
                      <div
                        className={`
                          relative mb-3 sm:mb-4 transition-transform duration-200
                          ${isMobile ? "w-12 h-12" : isCenter ? "w-16 h-16" : "w-14 h-14"}
                          group-hover:scale-110
                        `}
                      >
                        <img
                          src={cat.icon?.[0]?.url || "/placeholder.svg"}
                          alt={cat.name}
                          className="w-full h-full object-contain"
                          draggable={false}
                          loading="lazy"
                        />
                      </div>

                      {/* Category Name */}
                      <h3
                        className={`
                          font-mono text-center tracking-wide transition-colors duration-200
                          ${isMobile ? "text-sm" : isCenter ? "text-lg" : "text-base"} 
                          ${isCenter ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-300"}
                          group-hover:text-blue-600 dark:group-hover:text-blue-300
                        `}
                      >
                        {cat.name}
                      </h3>

                      {/* Simple center indicator */}
                      {isCenter && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
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
                  absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-200
                  ${swipeOffset > 20 ? "opacity-100" : "opacity-30"}
                `}
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400" />
              </div>
              <div
                className={`
                  absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-200
                  ${swipeOffset < -20 ? "opacity-100" : "opacity-30"}
                `}
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 dark:text-blue-400" />
              </div>
            </>
          )}
        </div>

        {/* Mobile-Optimized Horizontal Scrollbar */}
        <div className="mt-6 sm:mt-8">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
              {isMobile ? "Scroll Categories" : "Scroll Categories"}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-500 font-mono">
              {currentIndex + 1} / {categories.length}
            </span>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-thin scrollbar-track-slate-100 dark:scrollbar-track-slate-800 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500 pb-4"
            style={{ scrollbarWidth: "thin" }}
          >
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                onClick={() => goToIndex(index)}
                className={`
                  ${isMobile ? "min-w-[140px] max-w-[140px]" : "min-w-[180px] max-w-[180px]"} 
                  cursor-pointer transition-all duration-200 select-none
                  ${index === currentIndex
                    ? "transform scale-105"
                    : "opacity-70 hover:opacity-90"
                  }
                `}
              >
                <div
                  className={`
                    bg-white dark:bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-900/60 
                    backdrop-blur-sm border rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-200
                    ${index === currentIndex
                      ? "border-blue-500/50 shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20 ring-1 ring-blue-500/20 dark:ring-0"
                      : "border-slate-200 dark:border-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={cat.icon?.[0]?.url || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                      draggable={false}
                      loading="lazy"
                    />
                    <span
                      className={`
                        text-xs sm:text-sm font-mono tracking-wide transition-colors duration-200 truncate
                        ${index === currentIndex ? "text-blue-600 dark:text-blue-300" : "text-slate-600 dark:text-slate-300"}
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

        {/* Mobile-Optimized Dots Indicator */}
        <div className="flex justify-center mt-6 sm:mt-8 gap-1 sm:gap-2 overflow-x-auto pb-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              disabled={isTransitioning}
              className={`
                h-2 rounded-full transition-all duration-200 flex-shrink-0
                ${index === currentIndex ? "bg-blue-500 w-6 sm:w-8" : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 w-2"}
                disabled:cursor-not-allowed
              `}
            />
          ))}
        </div>

        {/* Progress Bar - Desktop Only */}
        {autoRotate && !isTouching && !isMobile && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-progress"
                style={{ animationDuration: "4000ms" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
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
          height: 6px;
        }

        @media (max-width: 768px) {
          .scrollbar-thin::-webkit-scrollbar {
            height: 4px;
          }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .animate-progress { 
          animation: progress linear infinite; 
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
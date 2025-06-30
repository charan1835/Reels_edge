"use client"

import { useState, useRef } from "react"
import { 
  Search, 
  TrendingUp, 
  Flame, 
  Heart, 
  Eye, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Sparkles,
  Award,
  Calendar,
  Users,
  Hash,
  ChevronRight,
  Star,
  Zap,
  Camera,
  Music,
  Gamepad2,
  Utensils,
  Dumbbell,
  Palette,
  BookOpen,
  Globe
} from "lucide-react"

const ExplorePage = () => {
  const [activeCategory, setActiveCategory] = useState("trending")
  const [searchQuery, setSearchQuery] = useState("")
  const [playingVideo, setPlayingVideo] = useState(null)
  const [mutedVideos, setMutedVideos] = useState(new Set())
  const videoRefs = useRef({})

  // Mock data - replace with real data
  const categories = [
    { id: "trending", name: "Trending", icon: TrendingUp, color: "from-red-500 to-orange-500" },
    { id: "entertainment", name: "Entertainment", icon: Camera, color: "from-purple-500 to-pink-500" },
    { id: "music", name: "Music", icon: Music, color: "from-blue-500 to-purple-500" },
    { id: "gaming", name: "Gaming", icon: Gamepad2, color: "from-green-500 to-blue-500" },
    { id: "food", name: "Food", icon: Utensils, color: "from-yellow-500 to-red-500" },
    { id: "fitness", name: "Fitness", icon: Dumbbell, color: "from-orange-500 to-red-500" },
    { id: "art", name: "Art", icon: Palette, color: "from-pink-500 to-purple-500" },
    { id: "education", name: "Education", icon: BookOpen, color: "from-indigo-500 to-blue-500" }
  ]

  const trendingHashtags = [
    { tag: "#viral", count: "2.1M", trend: "+15%" },
    { tag: "#creative", count: "890K", trend: "+8%" },
    { tag: "#funny", count: "1.5M", trend: "+12%" },
    { tag: "#art", count: "650K", trend: "+5%" },
    { tag: "#music", count: "1.2M", trend: "+20%" }
  ]

  const featuredCreators = [
    {
      id: 1,
      name: "Alex Chen",
      username: "@alexcreates",
      followers: "2.1M",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      verified: true,
      category: "Art & Design"
    },
    {
      id: 2,
      name: "Maya Rodriguez",
      username: "@mayamusic",
      followers: "1.8M",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
      verified: true,
      category: "Music"
    },
    {
      id: 3,
      name: "Jordan Kim",
      username: "@jordantech",
      followers: "950K",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      verified: false,
      category: "Tech & Gaming"
    }
  ]

  const trendingReels = [
    {
      id: 1,
      title: "Amazing Art Transformation",
      creator: "Alex Chen",
      views: "2.1M",
      likes: "156K",
      thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=400&fit=crop",
      duration: "0:45",
      trending: true
    },
    {
      id: 2,
      title: "Epic Guitar Solo",
      creator: "Maya Rodriguez",
      views: "1.8M",
      likes: "98K",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop",
      duration: "1:20",
      trending: true
    },
    {
      id: 3,
      title: "Cooking Hack That Works",
      creator: "Chef Mike",
      views: "3.2M",
      likes: "201K",
      thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=400&fit=crop",
      duration: "0:32",
      trending: false
    },
    {
      id: 4,
      title: "Dance Challenge 2024",
      creator: "Dance Squad",
      views: "4.1M",
      likes: "287K",
      thumbnail: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=300&h=400&fit=crop",
      duration: "0:28",
      trending: true
    },
    {
      id: 5,
      title: "Mind-Blowing Science",
      creator: "Science Fun",
      views: "1.5M",
      likes: "89K",
      thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=400&fit=crop",
      duration: "1:05",
      trending: false
    },
    {
      id: 6,
      title: "Workout Motivation",
      creator: "Fit Life",
      views: "890K",
      likes: "67K",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop",
      duration: "0:52",
      trending: false
    }
  ]

  const togglePlay = (id) => {
    const video = videoRefs.current[id]
    if (!video) return

    if (playingVideo === id) {
      video.pause()
      setPlayingVideo(null)
    } else {
      Object.values(videoRefs.current).forEach((v) => v?.pause())
      setPlayingVideo(id)
    }
  }

  const toggleMute = (id) => {
    const video = videoRefs.current[id]
    if (!video) return

    const newMuted = new Set(mutedVideos)
    if (mutedVideos.has(id)) {
      video.muted = false
      newMuted.delete(id)
    } else {
      video.muted = true
      newMuted.add(id)
    }
    setMutedVideos(newMuted)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Globe size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search creators, hashtags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-gray-100 rounded-2xl border-0 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <MoreHorizontal size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Pills */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Icon size={16} />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={24} className="text-yellow-300" />
                <span className="text-yellow-300 font-semibold">TRENDING NOW</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Discover What's Hot</h2>
              <p className="text-xl opacity-90 mb-6 max-w-2xl">
                Explore the most viral content, trending creators, and hottest challenges taking the platform by storm
              </p>
              <button className="bg-white text-purple-600 px-8 py-3 rounded-2xl font-bold hover:transform hover:scale-105 transition-all duration-200">
                Start Exploring
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 translate-x-48"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending Reels */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp size={24} className="text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-900">Trending Reels</h3>
              </div>
              <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trendingReels.map((reel) => (
                <div key={reel.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <img
                      src={reel.thumbnail}
                      alt={reel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Trending Badge */}
                    {reel.trending && (
                      <div className="absolute top-4 left-4 flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        <Flame size={12} />
                        TRENDING
                      </div>
                    )}

                    {/* Duration */}
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      {reel.duration}
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        <Play size={24} className="text-white ml-1" />
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Stats */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white font-bold text-lg mb-2 line-clamp-2">{reel.title}</h4>
                      <div className="flex items-center justify-between text-white/80 text-sm">
                        <span className="font-medium">{reel.creator}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            {reel.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={14} />
                            {reel.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Featured Creators */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Star size={24} className="text-yellow-500" />
                <h3 className="text-xl font-bold text-gray-900">Featured Creators</h3>
              </div>
              
              <div className="space-y-4">
                {featuredCreators.map((creator) => (
                  <div key={creator.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="relative">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {creator.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Award size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-sm">{creator.name}</h4>
                      </div>
                      <p className="text-gray-500 text-xs">{creator.username}</p>
                      <p className="text-gray-400 text-xs">{creator.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{creator.followers}</p>
                      <p className="text-xs text-gray-500">followers</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold hover:transform hover:scale-105 transition-all duration-200">
                Discover More Creators
              </button>
            </div>

            {/* Trending Hashtags */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Hash size={24} className="text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900">Trending Hashtags</h3>
              </div>
              
              <div className="space-y-3">
                {trendingHashtags.map((hashtag, index) => (
                  <div key={hashtag.tag} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{hashtag.tag}</p>
                        <p className="text-gray-500 text-sm">{hashtag.count} posts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                      <TrendingUp size={14} />
                      {hashtag.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={24} className="text-yellow-300" />
                <h3 className="text-xl font-bold">Platform Stats</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Active Users</span>
                  <span className="font-bold text-lg">2.1M+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Videos Uploaded Today</span>
                  <span className="font-bold text-lg">15.2K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Total Watch Time</span>
                  <span className="font-bold text-lg">890M hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplorePage
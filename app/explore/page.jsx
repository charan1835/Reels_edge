"use client"

import React, { useEffect, useState, useRef } from 'react';
import GlobalApi from '../_utils/GlobalApi';
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, Search, Filter } from 'lucide-react';

function Explore() {
  const [edits, setEdits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [playingVideo, setPlayingVideo] = useState(null);
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const [mutedVideos, setMutedVideos] = useState(new Set());
  const [videoErrors, setVideoErrors] = useState(new Set());
  const [videoLoading, setVideoLoading] = useState(new Set());
  const videoRefs = useRef({});

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const fetchAllEdits = async () => {
      try {
        console.log('🔍 Starting to fetch edits...');

        // Fetch Categories first
        const allCategories = await GlobalApi.GetCategory();
        setCategories(allCategories || []);

        if (!allCategories || allCategories.length === 0) {
          setEdits([]);
          return;
        }

        let allEdits = [];
        const seenIds = new Set();

        for (const cat of allCategories) {
          try {
            const editsByCat = await GlobalApi.GetEditsByCategory(cat.slug);

            if (editsByCat && Array.isArray(editsByCat)) {
              // Attach category slug and deduplicate
              const newEdits = editsByCat.filter(edit => {
                const id = edit.id || edit.slug; // Use slug as fallback ID
                if (seenIds.has(id)) return false;
                seenIds.add(id);
                return true;
              }).map(edit => ({ ...edit, categorySlug: cat.slug }));

              allEdits = [...allEdits, ...newEdits];
            }
          } catch (catError) {
            console.error(`❌ Error fetching edits for category ${cat.slug}:`, catError);
          }
        }

        // Filter out edits without valid video URLs
        const validEdits = allEdits.filter(edit => {
          const videoUrl = edit?.video?.[0]?.url || edit?.video?.url;
          return videoUrl && typeof videoUrl === 'string' && videoUrl.trim() !== '';
        });

        setEdits(validEdits);

      } catch (error) {
        console.error('💥 Failed to load edits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEdits();
  }, []);

  const handleVideoError = (index, error) => {
    console.error(`Video ${index} error:`, error);
    const newErrors = new Set(videoErrors);
    newErrors.add(index);
    setVideoErrors(newErrors);

    const newLoading = new Set(videoLoading);
    newLoading.delete(index);
    setVideoLoading(newLoading);
  };

  const handleVideoLoad = (index) => {
    const newLoading = new Set(videoLoading);
    newLoading.delete(index);
    setVideoLoading(newLoading);

    const newErrors = new Set(videoErrors);
    newErrors.delete(index);
    setVideoErrors(newErrors);
  };

  const handleVideoLoadStart = (index) => {
    const newLoading = new Set(videoLoading);
    newLoading.add(index);
    setVideoLoading(newLoading);
  };

  const togglePlay = async (index) => {
    const video = videoRefs.current[index];
    if (!video || videoErrors.has(index)) return;

    // Pause all other videos
    Object.entries(videoRefs.current).forEach(([i, v]) => {
      if (parseInt(i) !== index && v) {
        v.pause();
      }
    });

    try {
      if (playingVideo === index) {
        await video.pause();
        setPlayingVideo(null);
      } else {
        if (video.readyState >= 2) {
          await video.play();
          setPlayingVideo(index);
        }
      }
    } catch (err) {
      console.error('Play error:', err);
      handleVideoError(index, err);
    }
  };

  const toggleMute = (index) => {
    const video = videoRefs.current[index];
    if (!video || videoErrors.has(index)) return;

    const newMuted = new Set(mutedVideos);
    if (mutedVideos.has(index)) {
      video.muted = false;
      newMuted.delete(index);
    } else {
      video.muted = true;
      newMuted.add(index);
    }
    setMutedVideos(newMuted);
  };

  const toggleFullscreen = (index) => {
    const video = videoRefs.current[index];
    if (!video || videoErrors.has(index)) return;

    if (fullscreenVideo === index) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setFullscreenVideo(null);
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen();
        setFullscreenVideo(index);
      }
    }
  };

  // Filter Logic
  const filteredEdits = edits.filter(edit => {
    const matchesSearch = (edit.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (edit.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || edit.categorySlug === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  const visibleEdits = filteredEdits.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Explore Reels 🎥</h1>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-full leading-5 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out shadow-sm"
            placeholder="Search edits..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(9); }}
          />
        </div>
      </div>

      {/* Category Pills */}
      {!loading && categories.length > 0 && (
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide">
          <button
            onClick={() => { setActiveCategory('All'); setVisibleCount(9); }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm ${activeCategory === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.slug); setVisibleCount(9); }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm ${activeCategory === cat.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md h-96 animate-pulse border border-gray-200 dark:border-gray-700">
              <div className="h-3/4 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredEdits.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">No video edits found matching your criteria.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="mt-4 text-blue-500 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visibleEdits.map((edit, index) => (
              <div
                key={`${edit.id || index}-${edit.name}`}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 group"
              >
                <div className="relative aspect-[9/16] bg-black group-hover:scale-[1.02] transition-transform duration-300">
                  {videoErrors.has(index) ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <div className="text-center p-4">
                        <p className="text-gray-500 text-sm mb-2">Video unavailable</p>
                        <button
                          onClick={() => {
                            const newErrors = new Set(videoErrors);
                            newErrors.delete(index);
                            setVideoErrors(newErrors);
                            const video = videoRefs.current[index];
                            if (video) video.load();
                          }}
                          className="text-blue-500 text-xs underline"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        src={edit?.video?.[0]?.url || edit?.video?.url}
                        className="w-full h-full object-cover cursor-pointer"
                        loop
                        playsInline
                        muted={mutedVideos.has(index)}
                        preload="metadata"
                        crossOrigin="anonymous"
                        onLoadStart={() => handleVideoLoadStart(index)}
                        onLoadedData={() => handleVideoLoad(index)}
                        onError={(e) => handleVideoError(index, e)}
                        onEnded={() => setPlayingVideo(null)}
                        onPause={() => setPlayingVideo(null)}
                        onClick={() => togglePlay(index)}
                      />

                      {videoLoading.has(index) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                        </div>
                      )}

                      {/* Video Controls Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-center">
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); togglePlay(index); }}
                            className="text-white hover:text-blue-400 transition-colors"
                          >
                            {playingVideo === index ? <Pause size={20} /> : <Play size={20} />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleMute(index); }}
                            className="text-white hover:text-blue-400 transition-colors"
                          >
                            {mutedVideos.has(index) ? <VolumeX size={20} /> : <Volume2 size={20} />}
                          </button>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFullscreen(index); }}
                          className="text-white hover:text-blue-400 transition-colors"
                        >
                          {fullscreenVideo === index ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {edit.name || 'Untitled Edit'}
                    </h3>
                    {edit.categorySlug && (
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800/50">
                        {categories.find(c => c.slug === edit.categorySlug)?.name || edit.categorySlug}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {edit.description || 'No description available'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredEdits.length && (
            <div className="mt-12 text-center">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-900/50"
              >
                Load More Reels
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Explore;
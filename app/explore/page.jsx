"use client"

import React, { useEffect, useState, useRef } from 'react';
import GlobalApi from '../_utils/GlobalApi';
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';

function Explore() {
  const [edits, setEdits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const [mutedVideos, setMutedVideos] = useState(new Set());
  const [videoErrors, setVideoErrors] = useState(new Set());
  const [videoLoading, setVideoLoading] = useState(new Set());
  const videoRefs = useRef({});

  useEffect(() => {
    const fetchAllEdits = async () => {
      try {
        console.log('🔍 Starting to fetch edits...');
        
        // METHOD 1: Try getting all edits directly (if this method exists)
        if (GlobalApi.GetAllEdits) {
          console.log('🎬 Trying GetAllEdits method...');
          try {
            const allEdits = await GlobalApi.GetAllEdits();
            console.log('📹 Direct edits:', allEdits?.length || 0, allEdits);
            if (allEdits && allEdits.length > 0) {
              setEdits(allEdits);
              return;
            }
          } catch (directError) {
            console.log('❌ GetAllEdits failed:', directError);
          }
        }

        // METHOD 2: Try the category approach
        console.log('🔍 Trying category approach...');
        const allCategories = await GlobalApi.GetCategory();
        console.log('📁 Categories received:', allCategories?.length || 0, allCategories);
        
        if (!allCategories || allCategories.length === 0) {
          console.warn('⚠️ No categories found!');
          
          // METHOD 3: Try alternative category method
          if (GlobalApi.GetCategories) {
            console.log('🔄 Trying GetCategories (plural)...');
            const altCategories = await GlobalApi.GetCategories();
            console.log('📁 Alternative categories:', altCategories?.length || 0, altCategories);
          }
          
          setEdits([]);
          return;
        }

        let allEdits = [];

        for (const cat of allCategories) {
          const categoryId = cat.id || cat.slug || cat.name;
          console.log(`🎬 Fetching edits for category: ${categoryId}`);
          
          try {
            // Try multiple approaches
            let editsByCat = null;
            
            // Try with slug
            if (cat.slug && GlobalApi.GetEditsByCategory) {
              editsByCat = await GlobalApi.GetEditsByCategory(cat.slug);
            }
            
            // Try with ID if slug failed
            if (!editsByCat && cat.id && GlobalApi.GetEditsByCategoryId) {
              editsByCat = await GlobalApi.GetEditsByCategoryId(cat.id);
            }
            
            // Try with name if both failed
            if (!editsByCat && cat.name && GlobalApi.GetEditsByCategoryName) {
              editsByCat = await GlobalApi.GetEditsByCategoryName(cat.name);
            }
            
            console.log(`📹 Edits for ${categoryId}:`, editsByCat?.length || 0, editsByCat);
            
            if (editsByCat && Array.isArray(editsByCat)) {
              allEdits = [...allEdits, ...editsByCat];
            }
          } catch (catError) {
            console.error(`❌ Error fetching edits for category ${categoryId}:`, catError);
          }
        }

        console.log('🎥 Total raw edits collected:', allEdits.length, allEdits);

        // Filter out edits without valid video URLs
        const validEdits = allEdits.filter(edit => {
          // Handle both array and object video structures (like in ReelList)
          const videoUrl = edit?.video?.[0]?.url || edit?.video?.url;
          const hasVideo = videoUrl && 
            typeof videoUrl === 'string' && 
            videoUrl.trim() !== '';
          
          if (!hasVideo) {
            console.log('❌ Invalid video for edit:', edit?.name || 'unnamed', edit);
          }
          return hasVideo;
        });

        console.log('✅ Valid edits with videos:', validEdits.length, validEdits);
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
    console.log(`Video ${index} loaded successfully`);
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
        // Ensure video is ready to play
        if (video.readyState >= 2) {
          await video.play();
          setPlayingVideo(index);
        } else {
          console.warn('Video not ready to play yet');
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore All Reels 🎥</h1>
  
      
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading edits...</p>
        </div>
      ) : edits.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">No video edits found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {edits.map((edit, index) => (
            <div
              key={`${edit.id || index}-${edit.name || 'unnamed'}`}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border"
            >
              <div className="relative aspect-[9/16] bg-gray-100">
                {videoErrors.has(index) ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center p-4">
                      <p className="text-gray-500 text-sm mb-2">Video unavailable</p>
                      <button 
                        onClick={() => {
                          const newErrors = new Set(videoErrors);
                          newErrors.delete(index);
                          setVideoErrors(newErrors);
                          // Force video reload
                          const video = videoRefs.current[index];
                          if (video) {
                            video.load();
                          }
                        }}
                        className="text-blue-600 text-xs underline"
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
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay(index);
                        }} 
                        className="bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                        disabled={videoErrors.has(index)}
                      >
                        {playingVideo === index ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute(index);
                        }} 
                        className="bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                        disabled={videoErrors.has(index)}
                      >
                        {mutedVideos.has(index) ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFullscreen(index);
                        }} 
                        className="bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                        disabled={videoErrors.has(index)}
                      >
                        {fullscreenVideo === index ? <Minimize size={16} /> : <Maximize size={16} />}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-1">
                  {edit.name || 'Untitled Edit'}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {edit.description || 'No description available'}
                </p>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;
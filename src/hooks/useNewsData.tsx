
import { useState, useEffect, useCallback } from 'react';
import { NewsStory } from '@/types/news';
import { getTopStories } from '@/services/newsService';
import { toast } from '@/components/ui/use-toast';

export const useNewsData = () => {
  const [featuredVideo, setFeaturedVideo] = useState<NewsStory | null>(null);
  const [videos, setVideos] = useState<NewsStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  // Memoized fetch function to avoid recreating it on each render
  const fetchVideos = useCallback(async (showToast = false, forceRefresh = false) => {
    try {
      console.log(`Starting to fetch videos (forceRefresh: ${forceRefresh}, showToast: ${showToast})...`);
      if (showToast) {
        setIsRefreshing(true);
        toast({
          title: "Refreshing stories",
          description: "Fetching the latest stories for you...",
        });
      } else {
        setLoading(true);
      }
      
      setLoadError(null);
      
      // Always use force refresh when manually refreshing
      const allVideos = await getTopStories(forceRefresh);
      console.log('Fetched videos:', allVideos.length);
      
      if (allVideos && allVideos.length > 0) {
        // Set featured video to the first item
        setFeaturedVideo(allVideos[0]);
        console.log('Set featured video:', allVideos[0].id);
        
        // Set the rest of the videos
        setVideos(allVideos.slice(1));
        console.log('Set regular videos:', allVideos.slice(1).length);
        
        // Reset retry count on success
        setRetryCount(0);
        
        if (showToast) {
          toast({
            title: "Stories refreshed",
            description: `Loaded ${allVideos.length} stories successfully.`,
          });
        }
      } else {
        console.log('No videos returned from API');
        setLoadError('No videos available at this time. Please try again later.');
        
        // Don't clear existing videos on refresh if we get an empty result
        if (!showToast && !forceRefresh && videos.length === 0) {
          setFeaturedVideo(null);
          setVideos([]);
        }
        
        if (showToast) {
          toast({
            title: "No stories available",
            description: "Try refreshing again in a moment.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error in component when fetching videos:', error);
      
      // Don't clear videos if we already have them
      if (videos.length === 0) {
        setLoadError('Failed to load videos. Please try again later.');
      }
      
      // Only auto-retry if we haven't reached max retries and it's not a manual refresh
      if (retryCount < maxRetries && !showToast) {
        setRetryCount(prev => prev + 1);
        console.log(`Auto-retrying fetch (${retryCount + 1}/${maxRetries})...`);
        
        // Wait longer between retries (exponential backoff)
        const retryDelay = Math.min(2000 * Math.pow(2, retryCount), 30000);
        console.log(`Retrying in ${retryDelay}ms`);
        
        setTimeout(() => {
          fetchVideos(false, true);
        }, retryDelay);
      } else if (showToast) {
        // Only show toast for manual refresh failures
        toast({
          title: "Error refreshing stories",
          description: "There was a problem fetching the latest stories.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [retryCount, maxRetries, videos.length]);

  // Filter videos based on search term
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initial load handler
  useEffect(() => {
    console.log('Index component mounted or route changed');
    // On initial load, force refresh to get fresh data
    fetchVideos(false, true);
    
    // Clean up function
    return () => {
      console.log('Index component unmounting');
    };
  }, [fetchVideos]);

  return {
    featuredVideo,
    videos,
    filteredVideos,
    loading,
    searchTerm,
    setSearchTerm,
    loadError,
    isRefreshing,
    fetchVideos,
  };
};

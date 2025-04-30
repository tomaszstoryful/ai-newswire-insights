
import { useState, useEffect } from 'react';
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

  const fetchVideos = async (showToast = false, forceRefresh = false) => {
    try {
      console.log(`Starting to fetch videos (forceRefresh: ${forceRefresh})...`);
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
      
      // Force refresh on manual refresh button click
      const allVideos = await getTopStories(forceRefresh);
      console.log('Fetched videos:', allVideos.length);
      
      if (allVideos.length > 0) {
        // Set featured video to the first item
        setFeaturedVideo(allVideos[0]);
        // Set the rest of the videos
        setVideos(allVideos.slice(1));
        
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
        setFeaturedVideo(null);
        setVideos([]);
        
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
      setLoadError('Failed to load videos. Please try again later.');
      
      // Only auto-retry if we haven't reached max retries
      if (retryCount < maxRetries && !showToast) {
        setRetryCount(prev => prev + 1);
        console.log(`Auto-retrying fetch (${retryCount + 1}/${maxRetries})...`);
        
        // Wait 2 seconds before retrying
        setTimeout(() => {
          fetchVideos(false, true);
        }, 2000);
      } else {
        setFeaturedVideo(null);
        setVideos([]);
        
        if (showToast) {
          toast({
            title: "Error refreshing stories",
            description: "There was a problem fetching the latest stories.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

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
  }, []);

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

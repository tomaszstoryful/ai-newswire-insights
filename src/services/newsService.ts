import { NewsStory } from '@/types/news';
import { fetchData } from '@/utils/apiUtils';
import { getMockData } from '@/utils/mockDataUtils';
import { transformAPIStory, parseRawApiData } from '@/utils/transformUtils';
import { getValidCache, saveToCache } from '@/utils/cacheUtils';
import { toast } from '@/hooks/use-toast';

// Determine if running in development or production
const isDevelopment = import.meta.env.DEV;

// API endpoint configuration
export const STORYFUL_API = isDevelopment
  ? '/api/newswire/stories' // Development (proxy through Vite)
  : '/api/storyfulProxy/stories'; // Production (Vercel proxy)

// Original direct API URL (for reference if needed later)
// export const ORIGINAL_STORYFUL_API = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';

// Flag to determine if we should use mock data as fallback if API fails
const USE_MOCK_DATA_AS_FALLBACK = true;

// Variable to track if we've already shown an API error message
let hasShownApiErrorMessage = false;

export const getTopStories = async (forceRefresh: boolean = false): Promise<NewsStory[]> => {
  try {
    console.log('Starting getTopStories function, forceRefresh:', forceRefresh);
    
    // Check if we have a valid cache and forceRefresh is false
    if (!forceRefresh) {
      const cachedStories = getValidCache();
      if (cachedStories && cachedStories.length > 0) {
        console.log('Using cached stories:', cachedStories.length);
        return cachedStories;
      }
    } else {
      console.log('Force refresh requested, bypassing cache');
    }
    
    console.log('Fetching fresh stories from Storyful API...');
    
    try {
      // Try using the Storyful API
      console.log(`Fetching from: ${STORYFUL_API}`);
      const rawData = await fetchData<any>(STORYFUL_API);
      console.log('Raw Storyful data received:', typeof rawData, Array.isArray(rawData));
      
      const storyfulData = parseRawApiData(rawData);
      console.log('Parsed Storyful data count:', storyfulData?.length || 0);
      
      if (storyfulData && storyfulData.length > 0) {
        console.log('Storyful API returned stories:', storyfulData.length);
        
        // Transform the storyful data to our NewsStory format
        const stories = storyfulData.map(story => transformAPIStory(story));
        
        console.log('Transformed stories from Storyful:', stories.length);
        
        // Cache the result
        saveToCache(stories);
        
        return stories;
      } else {
        throw new Error("Storyful API returned empty or invalid response");
      }
    } catch (apiError) {
      console.error('Storyful API failed:', apiError);
      
      if (USE_MOCK_DATA_AS_FALLBACK) {
        // Return mock data as a fallback
        console.log('Using mock data as fallback after API failure');
        const mockStories = Array.from({ length: 10 }, (_, i) => getMockData(200000 + i));
        
        // Store mock stories in cache
        saveToCache(mockStories);
        
        // Show API error toast only once per session
        if (!hasShownApiErrorMessage) {
          toast({
            title: "API Connection Issue",
            description: "Could not connect to the news API. Using sample data temporarily.",
            variant: "destructive",
            duration: 5000,
          });
          hasShownApiErrorMessage = true;
        }
        
        return mockStories;
      }
      
      throw apiError; // Re-throw if we're not using mock data as fallback
    }
  } catch (error) {
    console.error('All API attempts failed:', error);
    
    if (USE_MOCK_DATA_AS_FALLBACK) {
      // Return mock data as a last resort
      console.log('Using mock data as final fallback');
      const mockStories = Array.from({ length: 10 }, (_, i) => getMockData(200000 + i));
      
      // Store mock stories in cache
      saveToCache(mockStories);
      
      // Show API error message if we haven't already
      if (!hasShownApiErrorMessage) {
        toast({
          title: "API Connection Issue",
          description: "Could not connect to the news API. Using sample data temporarily.",
          variant: "destructive",
          duration: 5000,
        });
        hasShownApiErrorMessage = true;
      }
      
      return mockStories;
    }
    
    throw error; // Re-throw if we're not using mock data as fallback
  }
};

// Re-export story-related functions from storyService 
export { fetchStoryById, getStoryBySlug, getRecommendedStories } from './storyService';

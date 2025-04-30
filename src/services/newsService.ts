
import { NewsStory } from '@/types/news';
import { fetchData } from '@/utils/apiUtils';
import { getMockData } from '@/utils/mockDataUtils';
import { transformAPIStory, transformNewsAPIStory, parseRawApiData } from '@/utils/transformUtils';
import { getValidCache, saveToCache } from '@/utils/cacheUtils';
import { toast } from '@/hooks/use-toast';

// Primary API endpoint - using Storyful API
export const STORYFUL_API = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';

// Fallback API endpoint to use if Storyful API fails
export const FALLBACK_API = 'https://newsapi.org/v2';
export const FALLBACK_API_KEY = '1e1c1fbb85be4bb3a635f8e83d87791e';

// Flag to determine if we should use mock data by default (due to known API limitations)
// Using true here because NewsAPI doesn't allow browser requests except from localhost
const USE_MOCK_DATA = true; // API has CORS restrictions that prevent browser requests

// Variable to track if we've already shown the API limitation toast
let hasShownApiLimitationMessage = false;

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
    
    // If mock data mode is enabled, skip the API calls altogether
    if (USE_MOCK_DATA) {
      console.log('Using mock data due to API browser restrictions');
      const mockStories = Array.from({ length: 10 }, (_, i) => getMockData(200000 + i));
      
      // Store mock stories in cache too
      saveToCache(mockStories);
      
      // Show API limitation toast only once per session
      if (!hasShownApiLimitationMessage) {
        toast({
          title: "Using Sample Data",
          description: "NewsAPI limits browser requests to localhost only. Using sample stories instead.",
          variant: "default",
          duration: 5000,
        });
        hasShownApiLimitationMessage = true;
      }
      
      return mockStories;
    }
    
    console.log('Fetching fresh stories from Storyful API...');
    
    try {
      // Try using the Storyful API first
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
    } catch (storyfulError) {
      console.error('Storyful API failed. Trying NewsAPI as fallback:', storyfulError);
      
      // Try NewsAPI as fallback
      try {
        console.log(`Fetching from fallback: ${FALLBACK_API}/top-headlines`);
        const newsApiData = await fetchData<any>(`${FALLBACK_API}/top-headlines?country=us&apiKey=${FALLBACK_API_KEY}`);
        
        if (newsApiData && newsApiData.articles && Array.isArray(newsApiData.articles)) {
          console.log('NewsAPI returned stories:', newsApiData.articles.length);
          
          if (newsApiData.articles.length === 0) {
            throw new Error('NewsAPI returned empty articles array');
          }
          
          // Transform the articles to our NewsStory format
          const stories = newsApiData.articles.map((article: any, index: number) => 
            transformNewsAPIStory(article, 200000 + index)
          );
          
          console.log('Transformed stories from NewsAPI:', stories.length);
          
          // Cache the result
          saveToCache(stories);
          
          return stories;
        } else {
          throw new Error("NewsAPI returned invalid response");
        }
      } catch (newsApiError) {
        console.error('NewsAPI fallback also failed:', newsApiError);
        throw newsApiError; // rethrow to be caught by outer try/catch
      }
    }
  } catch (error) {
    console.error('All API attempts failed. Using mock data as last resort:', error);
    
    // Return mock data as a last resort
    const mockStories = Array.from({ length: 10 }, (_, i) => getMockData(200000 + i));
    
    // Store mock stories in cache
    saveToCache(mockStories);
    
    // Show a message about API limitations if we haven't already
    if (!hasShownApiLimitationMessage) {
      toast({
        title: "Using Sample Data",
        description: "API access is limited in browser environments. Using sample stories instead.",
        variant: "default",
        duration: 5000,
      });
      hasShownApiLimitationMessage = true;
    }
    
    console.log('Returning mock stories:', mockStories.length);
    return mockStories;
  }
};

// Re-export story-related functions from storyService 
export { fetchStoryById, getStoryBySlug, getRecommendedStories } from './storyService';

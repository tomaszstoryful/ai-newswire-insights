
import { NewsStory } from '@/types/news';
import { toast } from '@/components/ui/use-toast';
import { fetchData } from '@/utils/apiUtils';
import { getMockData } from '@/utils/mockDataUtils';
import { transformAPIStory, transformNewsAPIStory, parseRawApiData } from '@/utils/transformUtils';
import { getValidCache, saveToCache } from '@/utils/cacheUtils';

// Primary API endpoint - using Storyful API
export const STORYFUL_API = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';

// Fallback API endpoint to use if Storyful API fails
export const FALLBACK_API = 'https://newsapi.org/v2';
export const FALLBACK_API_KEY = '1e1c1fbb85be4bb3a635f8e83d87791e';

export const getTopStories = async (forceRefresh: boolean = false): Promise<NewsStory[]> => {
  try {
    console.log('Starting getTopStories function, forceRefresh:', forceRefresh);
    
    // Check if we have a valid cache and forceRefresh is false
    if (!forceRefresh) {
      const cachedStories = getValidCache();
      if (cachedStories) {
        return cachedStories;
      }
    } else {
      console.log('Force refresh requested, bypassing cache');
    }
    
    console.log('Fetching fresh stories from Storyful API...');
    
    try {
      // Try using the Storyful API first
      console.log(`Fetching from: ${STORYFUL_API}`);
      const rawData = await fetchData<any>(STORYFUL_API);
      const storyfulData = parseRawApiData(rawData);
      
      if (storyfulData && storyfulData.length > 0) {
        console.log('Storyful API returned stories:', storyfulData.length);
        
        // Transform the storyful data to our NewsStory format
        const stories = storyfulData.map(story => transformAPIStory(story));
        
        console.log('Transformed stories from Storyful:', stories.length);
        
        // Cache the result
        saveToCache(stories);
        
        // Show success toast
        toast({
          title: "Stories updated",
          description: `Successfully loaded ${stories.length} latest stories from Storyful.`,
        });
        
        return stories;
      } else {
        throw new Error("Storyful API returned empty or invalid response");
      }
    } catch (storyfulError) {
      console.error('Storyful API failed. Trying NewsAPI as fallback:', storyfulError);
      
      // Try NewsAPI as fallback
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
        
        toast({
          title: "Stories updated (fallback)",
          description: `Using NewsAPI fallback. Loaded ${stories.length} stories.`,
        });
        
        return stories;
      } else {
        throw new Error("All API endpoints failed");
      }
    }
  } catch (error) {
    console.error('All API attempts failed. Using mock data:', error);
    
    toast({
      title: "API Connection Issue",
      description: "Using sample data. All API endpoints failed.",
      variant: "destructive",
    });
    
    // Return mock data as a last resort
    const mockStories = Array.from({ length: 10 }, (_, i) => getMockData(200000 + i));
    console.log('Returning mock stories:', mockStories.length);
    return mockStories;
  }
};

// Re-export story-related functions from storyService 
export { fetchStoryById, getStoryBySlug, getRecommendedStories } from './storyService';

import { APIStory, APIStoryResponse, NewsStory } from '@/types/news';
import { toast } from '@/components/ui/use-toast';
import { fetchData } from '@/utils/apiUtils';
import { getMockData, getMockStoryResult } from '@/utils/mockDataUtils';
import { transformAPIStory, transformNewsAPIStory, parseRawApiData } from '@/utils/transformUtils';
import { getValidCache, saveToCache } from '@/utils/cacheUtils';

// Primary API endpoint - using Storyful API
const STORYFUL_API = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';

// Fallback API endpoint to use if Storyful API fails
const FALLBACK_API = 'https://newsapi.org/v2';
const FALLBACK_API_KEY = '1e1c1fbb85be4bb3a635f8e83d87791e';

export const fetchStoryById = async (id: string): Promise<{ story: NewsStory; similarStories: NewsStory[] }> => {
  try {
    console.log(`Fetching story with ID: ${id}`);
    
    try {
      // Try using the Storyful API directly to get a story
      console.log(`Attempting to fetch single story from Storyful API`);
      const rawData = await fetchData<any>(STORYFUL_API);
      const allStories = parseRawApiData(rawData);
      
      if (allStories && allStories.length > 0) {
        // Find a story that matches the ID or use the first one as fallback
        const story = allStories.find(s => s.id === id) || allStories[0];
        
        // Transform the story to our format
        const transformedStory = transformAPIStory(story);
        
        // Get a few similar stories
        const similarStories = allStories
          .filter(s => s.id !== story.id)
          .slice(0, 5)
          .map(transformAPIStory);
        
        return { story: transformedStory, similarStories };
      } else {
        throw new Error("No stories found in API response");
      }
    } catch (storyfulError) {
      console.error('Storyful API failed. Trying fallback NewsAPI:', storyfulError);
      
      // Try NewsAPI as fallback for individual stories
      const data = await fetchData<any>(`${FALLBACK_API}/top-headlines?country=us&apiKey=${FALLBACK_API_KEY}`);
      
      if (data && data.articles && data.articles.length > 0) {
        const articleIndex = parseInt(id) % data.articles.length;
        const article = data.articles[articleIndex];
        
        const story = transformNewsAPIStory(article, parseInt(id));
        const similarStories = data.articles
          .filter((_: any, index: number) => index !== articleIndex)
          .slice(0, 5)
          .map((article: any, index: number) => 
            transformNewsAPIStory(article, 100000 + index)
          );
        
        return { story, similarStories };
      } else {
        throw new Error("No fallback articles found");
      }
    }
  } catch (error) {
    console.error('All API attempts failed. Using mock data as last resort.', error);
    
    toast({
      title: "API Connection Issue",
      description: "Using sample data. All API endpoints failed.",
      variant: "destructive",
    });
    
    return getMockStoryResult(id);
  }
};

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

export const getStoryBySlug = async (slug: string): Promise<NewsStory | undefined> => {
  try {
    // Attempt to parse ID from slug if it's numeric
    if (/^\d+$/.test(slug)) {
      const result = await fetchStoryById(slug);
      return result.story;
    }
    
    // For non-numeric slugs, try to find from API
    try {
      const allStories = await getTopStories();
      return allStories.find(story => story.slug === slug);
    } catch (error) {
      console.error('Error finding story by slug:', error);
      return undefined;
    }
  } catch (error) {
    console.error('Error in getStoryBySlug:', error);
    return undefined;
  }
};

export const getRecommendedStories = async (storyId: number): Promise<NewsStory[]> => {
  try {
    const result = await fetchStoryById(storyId.toString());
    return result.similarStories;
  } catch (error) {
    console.error('Error in getRecommendedStories:', error);
    return [];
  }
};

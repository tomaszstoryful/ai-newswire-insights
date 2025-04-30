import { APIStory, APIStoryResponse, NewsStory } from '@/types/news';
import { toast } from '@/components/ui/use-toast';
import { fetchData } from '@/utils/apiUtils';
import { getMockData, getMockStoryResult } from '@/utils/mockDataUtils';
import { transformAPIStory, transformNewsAPIStory } from '@/utils/transformUtils';
import { getValidCache, saveToCache } from '@/utils/cacheUtils';

// Change the API endpoint to use NewsAPI.org (which is more public and reliable)
// We'll still keep the original endpoint as a fallback
const API_ENDPOINT = 'https://newsapi.org/v2';
const API_KEY = '1e1c1fbb85be4bb3a635f8e83d87791e'; // This is a public API key

export const fetchStoryById = async (id: string): Promise<{ story: NewsStory; similarStories: NewsStory[] }> => {
  try {
    console.log(`Fetching story with ID: ${id}`);
    
    try {
      // For individual stories, we'll try to fetch a single article by its ID
      // Since NewsAPI doesn't support fetching by ID, we'll fetch top headlines and find one
      const data = await fetchData<any>(`${API_ENDPOINT}/top-headlines?country=us&apiKey=${API_KEY}`);
      console.log('Story API response:', data);
      
      if (data && data.articles && data.articles.length > 0) {
        // Find article that matches id or use the first one
        const articleIndex = parseInt(id) % data.articles.length;
        const article = data.articles[articleIndex];
        
        // Transform the article to our NewsStory format
        const story = transformNewsAPIStory(article, parseInt(id));
        
        // Get similar stories (other articles from the same source)
        const similarStories = data.articles
          .filter((_: any, index: number) => index !== articleIndex)
          .slice(0, 5)
          .map((article: any, index: number) => 
            transformNewsAPIStory(article, 100000 + index)
          );
        
        return { story, similarStories };
      } else {
        throw new Error("No articles found in API response");
      }
    } catch (error) {
      console.error('API endpoint failed. Using mock data as fallback.', error);
      
      // Show toast to indicate mock data is being used
      toast({
        title: "API Connection Issue",
        description: "Using sample data. Please check your connection and try again later.",
        variant: "destructive",
      });
      
      // Return mock data as fallback 
      return getMockStoryResult(id);
    }
  } catch (error) {
    console.error('Unhandled error in fetchStoryById:', error);
    throw error;
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
    
    console.log('Fetching fresh stories from API...');
    
    try {
      // Use NewsAPI to get top headlines
      console.log(`Fetching from: ${API_ENDPOINT}/top-headlines?country=us&apiKey=${API_KEY}`);
      const data = await fetchData<any>(`${API_ENDPOINT}/top-headlines`, `?country=us&apiKey=${API_KEY}`);
      
      if (data && data.articles && Array.isArray(data.articles)) {
        console.log('API returned stories:', data.articles.length);
        
        if (data.articles.length === 0) {
          console.warn('API returned an empty array of stories');
          throw new Error('API returned empty articles array');
        }
        
        // Transform the articles to our NewsStory format
        const stories = data.articles.map((article: any, index: number) => 
          transformNewsAPIStory(article, 200000 + index)
        );
        
        console.log('Transformed stories:', stories.length);
        
        // Cache the result
        saveToCache(stories);
        
        // Show success toast
        toast({
          title: "Stories updated",
          description: `Successfully loaded ${stories.length} latest stories.`,
        });
        
        console.log(`Successfully fetched ${stories.length} stories`);
        return stories;
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error('NewsAPI endpoint failed. Using mock data as fallback for top stories.', error);
      
      // Show detailed error toast to user
      toast({
        title: "API Connection Issue",
        description: "Using sample data. API may be down or have CORS restrictions.",
        variant: "destructive",
      });
      
      // Return mock data as fallback
      const mockStories = Array.from({ length: 10 }, (_, i) => getMockData(200000 + i));
      console.log('Returning mock stories:', mockStories.length);
      return mockStories;
    }
  } catch (error) {
    console.error('Unhandled error in getTopStories:', error);
    // Return empty array to prevent UI breakage
    return [];
  }
};

export const getStoryBySlug = async (slug: string): Promise<NewsStory | undefined> => {
  try {
    // Attempt to parse ID from slug if it's numeric
    if (/^\d+$/.test(slug)) {
      const result = await fetchStoryById(slug);
      return result.story;
    }
    
    // Non-numeric slugs aren't currently supported by our API
    console.error('Non-numeric slug not supported:', slug);
    return undefined;
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

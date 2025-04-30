
import { APIStory, APIStoryResponse, NewsStory } from '@/types/news';
import { toast } from '@/components/ui/use-toast';
import { fetchData } from '@/utils/apiUtils';
import { getMockData, getMockStoryResult } from '@/utils/mockDataUtils';
import { transformAPIStory } from '@/utils/transformUtils';
import { getValidCache, saveToCache } from '@/utils/cacheUtils';

const API_ENDPOINT = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';

export const fetchStoryById = async (id: string): Promise<{ story: NewsStory; similarStories: NewsStory[] }> => {
  try {
    console.log(`Fetching story with ID: ${id}`);
    
    try {
      const data = await fetchData<APIStoryResponse>(`${API_ENDPOINT}/${id}`);
      console.log('Story API response:', data);
      
      // If the response has a story property, use that structure
      if (data.story) {
        return {
          story: transformAPIStory(data.story),
          similarStories: data.similar_stories?.map(transformAPIStory) || []
        };
      } 
      // Otherwise, assume the response is just the story itself
      else {
        const story = transformAPIStory(data as unknown as APIStory);
        // Try to get similar stories
        try {
          const similarData = await fetchData<APIStory[]>(`${API_ENDPOINT}/${id}/recommendations`);
          return {
            story,
            similarStories: similarData?.map(transformAPIStory) || []
          };
        } catch (error) {
          console.error('Error fetching similar stories:', error);
          return { story, similarStories: [] };
        }
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
      // Use the direct endpoint with a limit parameter to get multiple stories
      console.log(`Fetching from: ${API_ENDPOINT}?limit=20`);
      const data = await fetchData<APIStory[]>(API_ENDPOINT, '?limit=20');
      
      if (!Array.isArray(data)) {
        console.error('Unexpected API response format (not an array):', data);
        throw new Error('API response is not an array of stories');
      }
      
      if (data.length === 0) {
        console.warn('API returned an empty array of stories');
      } else {
        console.log('API returned stories:', data.length);
      }
      
      const stories = data.map(story => transformAPIStory(story));
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
    } catch (error) {
      console.error('API endpoint failed. Using mock data as fallback for top stories.', error);
      
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

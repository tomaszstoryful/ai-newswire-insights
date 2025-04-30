
import { NewsStory } from '@/types/news';
import { toast } from '@/components/ui/use-toast';
import { fetchData } from '@/utils/apiUtils';
import { getMockData, getMockStoryResult } from '@/utils/mockDataUtils';
import { transformAPIStory, transformNewsAPIStory, parseRawApiData } from '@/utils/transformUtils';

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
      console.log('Raw Storyful data received:', rawData);
      
      const allStories = parseRawApiData(rawData);
      console.log('Parsed stories count:', allStories?.length || 0);
      
      if (allStories && allStories.length > 0) {
        // Find a story that matches the ID or use the first one as fallback
        const story = allStories.find(s => s.id === id) || allStories[0];
        console.log('Found story:', story?.id || 'none');
        
        // Transform the story to our format
        const transformedStory = transformAPIStory(story);
        
        // Get a few similar stories
        const similarStories = allStories
          .filter(s => s.id !== story.id)
          .slice(0, 5)
          .map(transformAPIStory);
        
        console.log(`Returning story ID: ${transformedStory.id} with ${similarStories.length} similar stories`);
        return { story: transformedStory, similarStories };
      } else {
        console.log("No stories found in API response");
        throw new Error("No stories found in API response");
      }
    } catch (storyfulError) {
      console.error('Storyful API failed. Trying fallback NewsAPI:', storyfulError);
      
      // Try NewsAPI as fallback for individual stories
      try {
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
      } catch (newsApiError) {
        console.error('NewsAPI fallback also failed:', newsApiError);
        throw newsApiError; // rethrow to be caught by outer try/catch
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

// Import this function from newsService to avoid circular dependencies
import { getTopStories } from './newsService';

export const getStoryBySlug = async (slug: string): Promise<NewsStory | undefined> => {
  try {
    // Attempt to parse ID from slug if it's numeric
    if (/^\d+$/.test(slug)) {
      const result = await fetchStoryById(slug);
      return result.story;
    }
    
    // For non-numeric slugs, try to find from API
    try {
      const allStories = await getTopStories(true); // Force refresh to get latest stories
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

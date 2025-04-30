
import { NewsStory } from '@/types/news';
import { fetchData } from '@/utils/apiUtils';
import { getMockData, getMockStoryResult } from '@/utils/mockDataUtils';
import { transformAPIStory, transformNewsAPIStory, parseRawApiData } from '@/utils/transformUtils';

// Primary API endpoint - using Storyful API
const STORYFUL_API = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';

// Fallback API endpoint to use if Storyful API fails
const FALLBACK_API = 'https://newsapi.org/v2';
const FALLBACK_API_KEY = '1e1c1fbb85be4bb3a635f8e83d87791e';

// Flag to determine if we should use mock data by default
const USE_MOCK_DATA = false; // Changed from true to false to disable mock data

export const fetchStoryById = async (id: string): Promise<{ story: NewsStory; similarStories: NewsStory[] }> => {
  try {
    console.log(`Fetching story with ID: ${id}`);
    
    // If mock data mode is enabled, immediately return mock data
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for story ID: ${id} (APIs disabled)`);
      return getMockStoryResult(id);
    }
    
    try {
      // Try using the Storyful API directly to get a story
      console.log(`Attempting to fetch single story from Storyful API`);
      const rawData = await fetchData<any>(STORYFUL_API);
      console.log('Raw Storyful data received:', typeof rawData);
      
      const allStories = parseRawApiData(rawData);
      console.log('Parsed stories count:', allStories?.length || 0);
      
      if (allStories && allStories.length > 0) {
        // Find a story that matches the ID or use the first one as fallback
        const story = allStories.find(s => s.id === id || s.id?.toString() === id.toString()) || allStories[0];
        console.log('Found story:', story?.id || 'none');
        
        // Transform the story to our format
        const transformedStory = transformAPIStory(story);
        
        // Get a few similar stories
        const similarStories = allStories
          .filter(s => s.id !== story.id && s.id?.toString() !== story.id?.toString())
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
        console.log('Trying NewsAPI fallback for story');
        const data = await fetchData<any>(`${FALLBACK_API}/top-headlines?country=us&apiKey=${FALLBACK_API_KEY}`);
        
        if (data && data.articles && data.articles.length > 0) {
          // Try to find story by ID or index
          const idNumber = parseInt(id);
          const articleIndex = !isNaN(idNumber) ? (idNumber % data.articles.length) : 0;
          const article = data.articles[articleIndex];
          
          const story = transformNewsAPIStory(article, parseInt(id));
          const similarStories = data.articles
            .filter((_: any, index: number) => index !== articleIndex)
            .slice(0, 5)
            .map((article: any, index: number) => 
              transformNewsAPIStory(article, 100000 + index)
            );
          
          console.log(`Returning NewsAPI story ${story.id} with ${similarStories.length} similar stories`);
          return { story, similarStories };
        } else {
          console.log('NewsAPI returned no articles');
          throw new Error("No fallback articles found");
        }
      } catch (newsApiError) {
        console.error('NewsAPI fallback also failed:', newsApiError);
        throw newsApiError; // rethrow to be caught by outer try/catch
      }
    }
  } catch (error) {
    console.error('All API attempts failed. Using mock data as last resort.', error);
    
    console.log(`Returning mock story for ID: ${id}`);
    return getMockStoryResult(id);
  }
};

// Import this function from newsService to avoid circular dependencies
import { getTopStories } from './newsService';

export const getStoryBySlug = async (slug: string): Promise<NewsStory | undefined> => {
  try {
    console.log(`Looking for story with slug: ${slug}`);
    
    // If mock data is enabled, use mock data
    if (USE_MOCK_DATA) {
      // For mock data, just use the slug as the ID
      const mockId = isNaN(parseInt(slug)) ? 200001 : parseInt(slug);
      const result = await getMockStoryResult(mockId);
      return result.story;
    }
    
    // Attempt to parse ID from slug if it's numeric
    if (/^\d+$/.test(slug)) {
      console.log('Slug is numeric, treating as ID');
      const result = await fetchStoryById(slug);
      return result.story;
    }
    
    // For non-numeric slugs, try to find from API
    try {
      console.log('Fetching all stories to find by slug');
      const allStories = await getTopStories(true); // Force refresh to get latest stories
      const matchedStory = allStories.find(story => story.slug === slug);
      
      if (matchedStory) {
        console.log(`Found story with matching slug: ${matchedStory.id}`);
      } else {
        console.log('No story with matching slug found');
      }
      
      return matchedStory;
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
    console.log(`Getting recommended stories for ID: ${storyId}`);
    if (USE_MOCK_DATA) {
      const result = await getMockStoryResult(storyId.toString());
      return result.similarStories;
    }
    const result = await fetchStoryById(storyId.toString());
    return result.similarStories;
  } catch (error) {
    console.error('Error in getRecommendedStories:', error);
    return [];
  }
};

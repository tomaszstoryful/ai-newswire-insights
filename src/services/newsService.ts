import { APIStory, APIStoryResponse, NewsStory } from '@/types/news';

const API_BASE_URL = 'https://api.allorigins.win/raw?url=';
const API_ENDPOINT = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';

// Utility function to handle errors
const handleErrors = async (response: Response) => {
  if (!response.ok) {
    const message = `HTTP error! Status: ${response.status}`;
    console.error(message);
    throw new Error(message);
  }
  return response;
};

// Function to fetch data from the API
const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);
    await handleErrors(response);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${encodeURIComponent(endpoint)}&_t=${Date.now()}`;
};

export const getStoryBySlug = async (slug: string): Promise<NewsStory | undefined> => {
  try {
    const apiUrl = getApiUrl(`${API_ENDPOINT}/${slug}`);
    const apiStory = await fetchData<APIStory>(apiUrl);
    return transformAPIStory(apiStory);
  } catch (error) {
    console.error('Error fetching story by slug:', error);
    return undefined;
  }
};

export const getRecommendedStories = async (storyId: number): Promise<NewsStory[]> => {
  try {
    const apiUrl = getApiUrl(`${API_ENDPOINT}/${storyId}/recommendations`);
    const apiStories = await fetchData<APIStory[]>(apiUrl);
    return apiStories.map(transformAPIStory);
  } catch (error) {
    console.error('Error fetching recommended stories:', error);
    return [];
  }
};

const transformAPIStory = (apiStory: APIStory): NewsStory => {
  return {
    id: parseInt(apiStory.id),
    title: apiStory.title,
    slug: apiStory.title_slug,
    summary: apiStory.summary,
    published_date: apiStory.published_date,
    updated_at: apiStory.published_date,
    editorial_updated_at: apiStory.published_date,
    clearance_mark: apiStory.story_mark_clearance,
    lead_image: apiStory.image_url ? {
      url: apiStory.image_url,
      filename: apiStory.title
    } : undefined,
    regions: apiStory.categories ? JSON.parse(apiStory.categories) : [],
    stated_location: apiStory.stated_location,
    media_url: apiStory.media_url
  };
};

export const fetchStoryById = async (id: string): Promise<{ story: NewsStory; similarStories: NewsStory[] }> => {
  try {
    const endpoints = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://newswire-story-recommendation.staging.storyful.com/api/stories/${id}`)}&_t=${Date.now()}`,
      `https://corsproxy.io/?${encodeURIComponent(`https://newswire-story-recommendation.staging.storyful.com/api/stories/${id}`)}&_t=${Date.now()}`
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) continue;
        
        const data = await response.json();
        console.log('Story Response:', data);

        // Transform main story
        const transformedStory = transformAPIStory(data.story);

        // Transform similar stories
        const transformedSimilarStories = data.similar_stories
          ? data.similar_stories.map((story: APIStory) => transformAPIStory(story))
          : [];

        return {
          story: transformedStory,
          similarStories: transformedSimilarStories
        };
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        continue;
      }
    }
    throw new Error('Failed to fetch story from any endpoint');
  } catch (error) {
    console.error('Error in fetchStoryById:', error);
    throw error;
  }
};

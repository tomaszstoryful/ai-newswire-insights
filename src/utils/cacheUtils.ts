
import { NewsStory } from '@/types/news';

export const STORIES_CACHE_KEY = 'newswire_stories_cache';
export const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Check if cache is valid and not expired
export const getValidCache = (): NewsStory[] | null => {
  try {
    console.log('Checking for cached stories');
    const cachedData = sessionStorage.getItem(STORIES_CACHE_KEY);
    
    if (!cachedData) {
      console.log('No cache found');
      return null;
    }
    
    const parsedCache = JSON.parse(cachedData);
    
    if (!parsedCache || !parsedCache.stories || !parsedCache.timestamp) {
      console.log('Cache format invalid');
      return null;
    }
    
    const { stories, timestamp } = parsedCache;
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
    
    if (isExpired) {
      console.log('Cache expired:', new Date(timestamp).toLocaleTimeString());
      return null;
    }
    
    if (!Array.isArray(stories)) {
      console.log('Cached stories is not an array');
      return null;
    }
    
    if (stories.length === 0) {
      console.log('Cached stories array is empty');
      return null;
    }
    
    // Validate that stories have the required fields
    const validStories = stories.every(story => 
      story && 
      typeof story === 'object' && 
      'id' in story && 
      'title' in story &&
      'summary' in story
    );
    
    if (!validStories) {
      console.log('Cached stories contain invalid entries');
      return null;
    }
    
    console.log('Using cached stories:', stories.length);
    return stories;
  } catch (e) {
    console.error('Error parsing cached data:', e);
    // Clear invalid cache
    sessionStorage.removeItem(STORIES_CACHE_KEY);
    return null;
  }
};

// Save stories to cache
export const saveToCache = (stories: NewsStory[]): void => {
  try {
    if (!Array.isArray(stories) || stories.length === 0) {
      console.log('Not caching empty or invalid stories array');
      return;
    }
    
    sessionStorage.setItem(
      STORIES_CACHE_KEY,
      JSON.stringify({
        stories,
        timestamp: Date.now()
      })
    );
    console.log('Successfully cached', stories.length, 'stories');
  } catch (e) {
    console.error('Error caching stories:', e);
  }
};


import { NewsStory } from '@/types/news';

export const STORIES_CACHE_KEY = 'newswire_stories_cache';
export const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Check if cache is valid and not expired
export const getValidCache = (): NewsStory[] | null => {
  try {
    const cachedData = sessionStorage.getItem(STORIES_CACHE_KEY);
    if (cachedData) {
      const { stories, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
      
      if (!isExpired && Array.isArray(stories) && stories.length > 0) {
        console.log('Using cached stories:', stories.length);
        return stories;
      } else {
        console.log('Cache expired or invalid');
        return null;
      }
    }
  } catch (e) {
    console.error('Error parsing cached data:', e);
  }
  return null;
};

// Save stories to cache
export const saveToCache = (stories: NewsStory[]): void => {
  try {
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

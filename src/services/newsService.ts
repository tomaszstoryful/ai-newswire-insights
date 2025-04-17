
import { NewsStory, APIStoryResponse, APIStory } from '@/types/news';

// Function to transform API story data to our NewsStory format
export const transformAPIStoryToNewsStory = (apiStory: APIStory): NewsStory => {
  try {
    // Parse categories from string to array
    let categories = [];
    try {
      if (apiStory.categories && typeof apiStory.categories === 'string') {
        categories = JSON.parse(apiStory.categories);
      } else if (Array.isArray(apiStory.categories)) {
        categories = apiStory.categories;
      }
    } catch (err) {
      console.warn('Error parsing categories:', apiStory.categories);
    }
    
    return {
      id: parseInt(apiStory.id) || Math.floor(Math.random() * 100000),
      title: apiStory.title || 'Untitled Story',
      slug: apiStory.title_slug || `story-${apiStory.id}`,
      summary: apiStory.summary || apiStory.extended_summary || "",
      published_date: apiStory.published_date || new Date().toISOString(),
      updated_at: apiStory.published_date || new Date().toISOString(),
      editorial_updated_at: apiStory.published_date || new Date().toISOString(),
      clearance_mark: apiStory.story_mark_clearance || "PUBLIC",
      in_trending_collection: false,
      lead_image: {
        url: apiStory.image_url || 'https://via.placeholder.com/640x360?text=No+Image',
        filename: apiStory.image_url?.split('/').pop() || 'image.webp'
      },
      lead_item: {
        id: parseInt(apiStory.id) + 1000 || Math.floor(Math.random() * 100000),
        media_button: {
          first_time: true,
          already_downloaded_by_relative: false,
          action: apiStory.media_url || ''
        },
        resource_type: "video",
        type: "ItemYoutube"
      },
      regions: Array.isArray(categories) ? categories : [],
      stated_location: apiStory.stated_location,
      media_url: apiStory.media_url
    };
  } catch (parseError) {
    console.error('Error transforming story data:', parseError, apiStory);
    return null as unknown as NewsStory;
  }
};

// Function to fetch stories from the provided API endpoint - CORE FUNCTION
export const fetchStoriesFromAPI = async (forceRefresh = false): Promise<NewsStory[]> => {
  try {
    console.log('Fetching stories from API with forceRefresh =', forceRefresh);
    
    // Always clear the cache in session storage when forcing refresh
    if (forceRefresh) {
      sessionStorage.removeItem('cachedStories');
      sessionStorage.removeItem('storiesTimestamp');
      console.log('Cleared story cache due to forceRefresh');
    }
    
    // Use the updated API endpoint
    const apiUrl = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';
    
    // Try different CORS proxy options
    const corsProxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(apiUrl);
    
    console.log('Attempting to fetch stories with CORS proxy:', corsProxyUrl);
    
    const timestamp = Date.now(); // Add timestamp to bust cache
    
    const response = await fetch(`${corsProxyUrl}&_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store' as RequestCache // Always prioritize network request
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status} ${response.statusText}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const rawData = await response.text();
    console.log('Raw API response length:', rawData.length);
    
    let apiStories;
    try {
      apiStories = JSON.parse(rawData);
      console.log('Successfully parsed JSON data:', apiStories.length, 'stories found');
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error('Invalid JSON response from API');
    }
    
    if (!Array.isArray(apiStories)) {
      console.error('API response is not an array:', typeof apiStories);
      throw new Error('Expected array of stories but got ' + typeof apiStories);
    }
    
    if (apiStories.length === 0) {
      console.warn('API returned empty array of stories');
      throw new Error('API returned empty array');
    } else {
      console.log('First story from API:', apiStories[0].title);
    }
    
    // Transform API response to match our NewsStory type
    const transformedStories = apiStories.map((story: any) => {
      return transformAPIStoryToNewsStory(story);
    }).filter(Boolean) as NewsStory[];
    
    console.log(`Successfully transformed ${transformedStories.length} stories`);
    
    // Store the stories in sessionStorage to avoid dummy data on navigation
    sessionStorage.setItem('cachedStories', JSON.stringify(transformedStories));
    sessionStorage.setItem('storiesTimestamp', Date.now().toString());
    
    return transformedStories;
  } catch (error) {
    console.error('Error in primary fetch method:', error);
    
    // Try an alternative CORS proxy
    try {
      console.log('Trying alternative CORS proxy...');
      const apiUrl = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';
      const backupProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(apiUrl);
      
      const timestamp = Date.now(); // Add timestamp to bust cache
      const response = await fetch(`${backupProxyUrl}&_t=${timestamp}`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store' as RequestCache // Always use network request
      });
      
      if (response.ok) {
        const apiStories = await response.json();
        console.log('Successfully fetched stories with backup proxy:', apiStories.length);
        
        // Transform and cache
        const transformedStories = apiStories.map((story: any) => {
          return transformAPIStoryToNewsStory(story);
        }).filter(Boolean) as NewsStory[];
        
        // Store in sessionStorage
        sessionStorage.setItem('cachedStories', JSON.stringify(transformedStories));
        sessionStorage.setItem('storiesTimestamp', Date.now().toString());
        
        return transformedStories;
      }
    } catch (backupError) {
      console.error('Backup CORS proxy failed:', backupError);
    }
    
    // Check if we have cached stories in sessionStorage
    try {
      const cachedStoriesJson = sessionStorage.getItem('cachedStories');
      const timestamp = sessionStorage.getItem('storiesTimestamp');
      
      if (cachedStoriesJson && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        console.log(`Found cached stories, ${Math.round(age / 1000)} seconds old`);
        
        // Only use cache if it's less than 1 minute old
        if (age < 60 * 1000) {
          const cachedStories = JSON.parse(cachedStoriesJson) as NewsStory[];
          console.log(`Using ${cachedStories.length} cached stories`);
          return cachedStories;
        } else {
          console.log('Cached stories too old');
          // Clear old cache
          sessionStorage.removeItem('cachedStories');
          sessionStorage.removeItem('storiesTimestamp');
        }
      } else {
        console.log('No cached stories found in sessionStorage');
      }
    } catch (cacheError) {
      console.error('Error accessing cached stories:', cacheError);
    }
    
    // We have COMPLETELY eliminated the hardcoded sample data fallback
    // Instead, throw an error to indicate failure
    console.error('All API attempts failed, throwing error');
    throw new Error('Failed to fetch stories from API and no valid cache found');
  }
};

// Function to fetch individual story by ID
export const fetchStoryById = async (storyId: string | number, forceRefresh = false): Promise<{ story: NewsStory, similarStories: NewsStory[] } | null> => {
  console.log(`Fetching story with ID: ${storyId}, forceRefresh: ${forceRefresh}`);
  
  try {
    // If forceRefresh, clear the story-specific cache
    if (forceRefresh) {
      sessionStorage.removeItem(`story_${storyId}`);
      sessionStorage.removeItem(`story_${storyId}_timestamp`);
    }
    
    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedStoryJson = sessionStorage.getItem(`story_${storyId}`);
      const timestamp = sessionStorage.getItem(`story_${storyId}_timestamp`);
      
      if (cachedStoryJson && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        console.log(`Found cached story ${storyId}, ${Math.round(age / 1000)} seconds old`);
        
        // Only use cache if it's less than 1 minute old (reduced from 5 minutes)
        if (age < 60 * 1000) {
          console.log('Using cached story data');
          return JSON.parse(cachedStoryJson);
        } else {
          console.log('Cached story too old');
          // Remove old cache
          sessionStorage.removeItem(`story_${storyId}`);
          sessionStorage.removeItem(`story_${storyId}_timestamp`);
        }
      }
    }
    
    // Use the API endpoint for individual stories
    const apiUrl = `https://newswire-story-recommendation.staging.storyful.com/api/stories/${storyId}`;
    
    // Try different CORS proxy options
    const corsProxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(apiUrl);
    
    console.log('Attempting to fetch individual story with CORS proxy:', corsProxyUrl);
    
    const timestamp = Date.now(); // Add timestamp to bust cache
    const response = await fetch(`${corsProxyUrl}&_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store' as RequestCache // Always use network request
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status} ${response.statusText}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const rawData = await response.text();
    console.log('Raw API response for story, length:', rawData.length);
    
    let apiResponse: APIStoryResponse;
    try {
      apiResponse = JSON.parse(rawData);
      console.log('Successfully parsed JSON story data:', apiResponse.story?.title);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error('Invalid JSON response from API');
    }
    
    if (!apiResponse.story) {
      console.error('API response does not contain a story:', apiResponse);
      throw new Error('No story found in API response');
    }
    
    // Transform API response to match our NewsStory type
    const mainStory = transformAPIStoryToNewsStory(apiResponse.story);
    
    // Transform similar stories
    const similarStories = apiResponse.similar_stories?.map(story => 
      transformAPIStoryToNewsStory(story)
    ).filter(Boolean) || [];
    
    console.log('Transformed story:', mainStory.title);
    console.log(`Transformed ${similarStories.length} similar stories`);
    
    const result = { 
      story: mainStory,
      similarStories
    };
    
    // Cache the result
    sessionStorage.setItem(`story_${storyId}`, JSON.stringify(result));
    sessionStorage.setItem(`story_${storyId}_timestamp`, Date.now().toString());
    
    return result;
  } catch (error) {
    console.error('Error fetching story by ID:', error);
    
    // Check if we have this story in our all-stories cache
    try {
      const cachedStoriesJson = sessionStorage.getItem('cachedStories');
      if (cachedStoriesJson) {
        const cachedStories = JSON.parse(cachedStoriesJson) as NewsStory[];
        const matchingStory = cachedStories.find(s => s.id.toString() === storyId.toString());
        
        if (matchingStory) {
          console.log('Found story in cached stories collection:', matchingStory.title);
          const similarStories = cachedStories
            .filter(s => s.id.toString() !== storyId.toString())
            .slice(0, 3);
            
          const result = {
            story: matchingStory,
            similarStories
          };
          
          // Cache this result
          sessionStorage.setItem(`story_${storyId}`, JSON.stringify(result));
          sessionStorage.setItem(`story_${storyId}_timestamp`, Date.now().toString());
          
          return result;
        }
      }
    } catch (cacheError) {
      console.error('Error checking cached stories for story:', cacheError);
    }
    
    // No fallback to hardcoded data - just throw an error
    throw new Error(`Failed to fetch story with ID ${storyId}`);
  }
};

// Function to fetch top stories
export const getTopStories = async (forceRefresh = false): Promise<NewsStory[]> => {
  console.log('Getting top stories with forceRefresh =', forceRefresh);
  try {
    // When on home page, ALWAYS force a refresh
    const apiStories = await fetchStoriesFromAPI(true);
    console.log(`Retrieved ${apiStories.length} stories`);
    return apiStories;
  } catch (error) {
    console.error('Error getting top stories:', error);
    throw error; // Rethrow to handle in component
  }
};

// Function to fetch story by slug
export const getStoryBySlug = async (slug: string, forceRefresh = false): Promise<NewsStory | undefined> => {
  try {
    console.log(`Getting story by slug: ${slug}, forceRefresh: ${forceRefresh}`);
    
    // Check if the slug itself is a numeric ID
    if (/^\d+$/.test(slug)) {
      console.log(`Slug "${slug}" is a numeric ID, fetching directly`);
      const result = await fetchStoryById(slug, forceRefresh);
      if (result && result.story) {
        return result.story;
      }
    }
    
    // Try to get all stories first with a forced refresh
    const allStories = await getTopStories(true);
    
    // Check if any story matches this slug
    const matchingStory = allStories.find(s => s.slug === slug || s.id.toString() === slug);
    
    if (matchingStory) {
      console.log(`Found matching story with slug/id "${slug}": ${matchingStory.title}`);
      return matchingStory;
    }
    
    // If no match found, return undefined
    console.warn(`No story found with slug: ${slug}`);
    return undefined;
  } catch (error) {
    console.error('Error in getStoryBySlug:', error);
    throw error; // Rethrow to handle in component
  }
};

// Function to fetch recommended stories
export const getRecommendedStories = async (storyId?: number, forceRefresh = false): Promise<NewsStory[]> => {
  try {
    if (storyId) {
      // Try to get similar stories from the API
      console.log(`Fetching recommended stories for story ID: ${storyId}`);
      const result = await fetchStoryById(storyId, forceRefresh);
      if (result && result.similarStories && result.similarStories.length > 0) {
        console.log(`Found ${result.similarStories.length} similar stories from API`);
        return result.similarStories;
      }
    }
    
    // Fallback to getting top stories with forced refresh
    console.log('No similar stories found, using top stories instead');
    const allStories = await getTopStories(true);
    
    // Filter out the current story if needed
    const filteredStories = storyId 
      ? allStories.filter(story => story.id !== storyId)
      : allStories;
    
    return filteredStories.slice(0, 5);
  } catch (error) {
    console.error('Error getting recommended stories:', error);
    throw error; // Rethrow to handle in component
  }
};

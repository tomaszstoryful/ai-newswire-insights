
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
    
    // Use the updated API endpoint
    const apiUrl = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';
    
    // Try different CORS proxy options
    const corsProxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(apiUrl);
    
    console.log('Attempting to fetch stories with CORS proxy:', corsProxyUrl);
    
    const cacheOption = forceRefresh ? 'no-store' : 'no-cache';
    const timestamp = Date.now(); // Add timestamp to bust cache
    
    const response = await fetch(`${corsProxyUrl}&_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: cacheOption as RequestCache
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
        headers: { 'Accept': 'application/json' },
        cache: forceRefresh ? 'no-store' : 'no-cache' as RequestCache
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
        
        // Only use cache if it's less than 5 minutes old and we're not forcing refresh
        if (age < 5 * 60 * 1000 && !forceRefresh) {
          const cachedStories = JSON.parse(cachedStoriesJson) as NewsStory[];
          console.log(`Using ${cachedStories.length} cached stories`);
          return cachedStories;
        } else {
          console.log('Cached stories too old or force refresh requested');
        }
      } else {
        console.log('No cached stories found in sessionStorage');
      }
    } catch (cacheError) {
      console.error('Error accessing cached stories:', cacheError);
    }
    
    // Last resort - hardcoded sample data
    console.error('All API attempts failed, using hardcoded sample data');
    
    // Use the array of actual API data (not the mock stories)
    const hardcodedApiStories = [
      {
        "categories":"[\"US\", \"news & politics\"]",
        "channels":"[\"MRSS Licensed\", \"Viral\", \"Licensed\"]",
        "collections":"[]",
        "extended_summary":"Footage filmed by Spencer White shows the funnel spinning near Sam Bishkin Road on Thursday afternoon.\n\nAccording to the Wharton County Office of Emergency Management, the tornado damaged multiple barns as it touched down near Highway 59. There were no injuries reported.",
        "id":"317273",
        "image_url":"https://img.news.storyful.com/stories/317273/rt:fill/el:1/s:495:250/original.gif@webp",
        "keywords":"[\"Social media\", \"Tornado\", \"Google Maps\", \"Office of Emergency Management\", \"Chimney\", \"U.S. Route 59\", \"Wharton County, Texas\", \"Uniform Resource Locator\", \"Storyful\", \"El Campo, Texas\", \"Local insertion\"]",
        "media_url":"https://videos.storyful.com/syfl-71dbddba8a15e4015c89eadb1aff8671d5d812b3-original.mp4",
        "provider_url":"https://www.youtube.com/watch?v=qljyTulWMms",
        "published_date":"2024-12-27 03:40:58 UTC",
        "stated_location":"El Campo, Texas",
        "story_mark_clearance":"LICENSED",
        "story_mark_guidance":"",
        "summary":"A tornado touched down in El Campo, Texas, damaging structures and whipping up dust on December 26.\n\nFootage filmed by Spencer White shows the funnel spinning near Sam Bishkin Road on Thursday afternoon.\n\nAccording to the Wharton County Office of Emergency Management, the tornado damaged multiple barns as it touched down near Highway 59. There were no injuries reported.",
        "title":"Tornado Spotted Swirling Over El Campo",
        "title_date":"December 26 2024",
        "title_slug":"US-TX",
        "total_downloads":"1",
        "total_views":"11",
        "unique_downloads":"1",
        "unique_views":"4"
      },
      {
        "categories":"[\"Australia\", \"Human Interest\"]",
        "channels":"[\"MRSS Licensed\", \"Viral\", \"Licensed\"]",
        "collections":"[]",
        "extended_summary":"Footage filmed by Matt Roberts shows his neighbor moving his mower toward the reptile on Thursday afternoon. Roberts' neighbors said they were concerned for the safety of children living in the area, so they contacted a local snake catcher.\n\nSpeaking to Storyful, Roberts said that the snake was eventually captured humanely by a wildlife removal service and relocated.",
        "id":"317285",
        "image_url":"https://img.news.storyful.com/stories/317285/rt:fill/el:1/s:495:250/original.gif@webp",
        "keywords":"[\"Reptile\", \"Snake catcher\", \"Lawn mower\", \"Snake\", \"Neighbor\", \"Storyful\", \"Australia\", \"Eastern brown snake\", \"Service animal\", \"Lawn\"]",
        "media_url":"https://videos.storyful.com/syfl-d7f67d83fd3d1faa9c301cba5c8ba5f30efb6b11-original.mp4",
        "provider_url":"https://www.youtube.com/watch?v=DdmhkL04UHE",
        "published_date":"2024-12-26 23:35:08 UTC",
        "stated_location":"Moruya, New South Wales, Australia",
        "story_mark_clearance":"LICENSED",
        "story_mark_guidance":"",
        "summary":"A homeowner in Moruya, New South Wales, had a close encounter with a venomous eastern brown snake while mowing his lawn on December 19.\n\nFootage filmed by Matt Roberts shows his neighbor moving his mower toward the reptile on Thursday afternoon. Roberts' neighbors said they were concerned for the safety of children living in the area, so they contacted a local snake catcher.\n\nSpeaking to Storyful, Roberts said that the snake was eventually captured humanely by a wildlife removal service and relocated.",
        "title":"Venomous Eastern Brown Snake Stops Man From Mowing Lawn in New South Wales",
        "title_date":"December 19 2024",
        "title_slug":"AU-NSW",
        "total_downloads":"2",
        "total_views":"11",
        "unique_downloads":"2",
        "unique_views":"6"
      }
    ];
    
    // Transform the hardcoded stories
    const transformedHardcodedStories = hardcodedApiStories.map((story: any) => {
      return transformAPIStoryToNewsStory(story);
    });
    
    console.log(`Returning ${transformedHardcodedStories.length} hardcoded stories as last resort`);
    return transformedHardcodedStories;
  }
};

// Function to fetch individual story by ID
export const fetchStoryById = async (storyId: string | number, forceRefresh = false): Promise<{ story: NewsStory, similarStories: NewsStory[] } | null> => {
  console.log(`Fetching story with ID: ${storyId}, forceRefresh: ${forceRefresh}`);
  
  try {
    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cachedStoryJson = sessionStorage.getItem(`story_${storyId}`);
      const timestamp = sessionStorage.getItem(`story_${storyId}_timestamp`);
      
      if (cachedStoryJson && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        console.log(`Found cached story ${storyId}, ${Math.round(age / 1000)} seconds old`);
        
        // Only use cache if it's less than 5 minutes old
        if (age < 5 * 60 * 1000) {
          console.log('Using cached story data');
          return JSON.parse(cachedStoryJson);
        } else {
          console.log('Cached story too old');
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
      },
      cache: forceRefresh ? 'no-store' : 'no-cache' as RequestCache
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
    
    // If it's story ID 317273 or 317285, use the hardcoded example data
    if (storyId === '317273' || storyId === 317273) {
      console.log('Using hardcoded data for tornado story ID 317273');
      const hardcodedExample = {
        "story": {
          "categories": "[\"US\", \"news & politics\"]",
          "channels": "[\"MRSS Licensed\", \"Viral\", \"Licensed\"]",
          "collections": "[]",
          "extended_summary": "Footage filmed by Spencer White shows the funnel spinning near Sam Bishkin Road on Thursday afternoon.\n\nAccording to the \"\nWharton County Office of Emergency Management\":https://www.facebook.com/permalink.php?story_fbid=612586047964256&id=100076385977807, the tornado damaged multiple barns as it touched down near Highway 59. There were no injuries reported.",
          "id": "317273",
          "image_url": "https://img.news.storyful.com/stories/317273/rt:fill/el:1/s:495:250/original.gif@webp",
          "keywords": "[\"Social media\", \"Tornado\", \"Google Maps\", \"Office of Emergency Management\", \"Chimney\", \"U.S. Route 59\", \"Wharton County, Texas\", \"Uniform Resource Locator\", \"Storyful\", \"El Campo, Texas\", \"Local insertion\"]",
          "media_url": "https://videos.storyful.com/syfl-71dbddba8a15e4015c89eadb1aff8671d5d812b3-original.mp4",
          "provider_url": "https://www.youtube.com/watch?v=qljyTulWMms",
          "published_date": "2024-12-27 03:40:58 UTC",
          "stated_location": "El Campo, Texas",
          "story_mark_clearance": "LICENSED",
          "story_mark_guidance": "",
          "summary": "A tornado \"touched down\":https://www.facebook.com/permalink.php?story_fbid=612586047964256&id=100076385977807 in El Campo, Texas, damaging structures and whipping up dust on December 26.\n\nFootage filmed by Spencer White shows the funnel spinning near Sam Bishkin Road on Thursday afternoon.\n\nAccording to the \"\nWharton County Office of Emergency Management\":https://www.facebook.com/permalink.php?story_fbid=612586047964256&id=100076385977807, the tornado damaged multiple barns as it touched down near Highway 59. There were no injuries reported.",
          "title": "Tornado Spotted Swirling Over El Campo",
          "title_date": "December 26 2024",
          "title_slug": "US-TX",
          "total_downloads": "1",
          "total_views": "11",
          "unique_downloads": "1",
          "unique_views": "4"
        },
        "similar_stories": [
          {
            "categories": "[\"weather\", \"others\", \"storms\"]",
            "channels": "[]",
            "collections": "[\"US Weather\"]",
            "extended_summary": "This video shows rain and light hail falling in north Dallas, according to the source.\n\nThe storms were expected move eastward out of the Dallas-Fort Worth area by 2pm, the National Weather Service \"said\":https://x.com/NWSFortWorth/status/1872266112609476875.",
            "id": "317266",
            "image_url": "https://img.news.storyful.com/stories/317266/rt:fill/el:1/s:495:250/original.gif@webp",
            "keywords": "[\"Thunderstorm\", \"Rain\", \"Hail\", \"Weather\", \"National Weather Service\", \"Flash flood\", \"Dallas–Fort Worth metroplex\", \"Dallas\", \"Central Texas\", \"Mesquite, Texas\", \"2PM\", \"The Thunder Rolls\", \"Local news\", \"Thunder\", \"Storyful\", \"Meteorologist\"]",
            "media_url": "https://videos.storyful.com/syfl-26772d25d7867bc2833b5f9b2e471ca6bd1b8d69-original.mp4",
            "provider_url": "https://x.com/ts_texam/status/1872350247369756895",
            "published_date": "2024-12-26 20:09:43 UTC",
            "stated_location": "Dallas, Texas",
            "story_mark_clearance": "CLEARED",
            "story_mark_guidance": "",
            "summary": "A round of thunderstorms hit north and central Texas on Thursday, December 26, bringing heavy rain and hail, thunder and lightning, and a risk of flash flooding, weather officials \"said.\":https://x.com/NWSFortWorth/status/1872307108814999852\n\nThis video shows rain and light hail falling in north Dallas, according to the source.\n\nThe storms were expected move eastward out of the Dallas-Fort Worth area by 2pm, the National Weather Service \"said\":https://x.com/NWSFortWorth/status/1872266112609476875.",
            "title": "Rain and Hail Dampen Dallas Area",
            "title_date": "December 26 2024",
            "title_slug": "US-TX",
            "total_downloads": "11",
            "total_views": "35",
            "unique_downloads": "9",
            "unique_views": "13"
          }
        ]
      };
      
      const mainStory = transformAPIStoryToNewsStory(hardcodedExample.story as unknown as APIStory);
      const similarStories = hardcodedExample.similar_stories.map(story => 
        transformAPIStoryToNewsStory(story as unknown as APIStory)
      );
      
      const result = {
        story: mainStory,
        similarStories
      };
      
      // Cache this result
      sessionStorage.setItem(`story_${storyId}`, JSON.stringify(result));
      sessionStorage.setItem(`story_${storyId}_timestamp`, Date.now().toString());
      
      return result;
    } else if (storyId === '317285' || storyId === 317285) {
      console.log('Using hardcoded data for snake story ID 317285');
      const hardcodedExample = {
        "story": {
          "categories": "[\"Australia\", \"Human Interest\"]",
          "channels": "[\"MRSS Licensed\", \"Viral\", \"Licensed\"]",
          "collections": "[]",
          "extended_summary": "Footage filmed by Matt Roberts shows his neighbor moving his mower toward the reptile on Thursday afternoon. Roberts' neighbors said they were concerned for the safety of children living in the area, so they contacted a local snake catcher.\n\nSpeaking to Storyful, Roberts said that the snake was eventually captured humanely by a wildlife removal service and relocated.",
          "id": "317285",
          "image_url": "https://img.news.storyful.com/stories/317285/rt:fill/el:1/s:495:250/original.gif@webp",
          "keywords": "[\"Reptile\", \"Snake catcher\", \"Lawn mower\", \"Snake\", \"Neighbor\", \"Storyful\", \"Australia\", \"Eastern brown snake\", \"Service animal\", \"Lawn\"]",
          "media_url": "https://videos.storyful.com/syfl-d7f67d83fd3d1faa9c301cba5c8ba5f30efb6b11-original.mp4",
          "provider_url": "https://www.youtube.com/watch?v=DdmhkL04UHE",
          "published_date": "2024-12-26 23:35:08 UTC",
          "stated_location": "Moruya, New South Wales, Australia",
          "story_mark_clearance": "LICENSED",
          "story_mark_guidance": "",
          "summary": "A homeowner in Moruya, New South Wales, had a close encounter with a venomous eastern brown snake while mowing his lawn on December 19.\n\nFootage filmed by Matt Roberts shows his neighbor moving his mower toward the reptile on Thursday afternoon. Roberts' neighbors said they were concerned for the safety of children living in the area, so they contacted a local snake catcher.\n\nSpeaking to Storyful, Roberts said that the snake was eventually captured humanely by a wildlife removal service and relocated.",
          "title": "Venomous Eastern Brown Snake Stops Man From Mowing Lawn in New South Wales",
          "title_date": "December 19 2024",
          "title_slug": "AU-NSW",
          "total_downloads": "2",
          "total_views": "11",
          "unique_downloads": "2",
          "unique_views": "6"
        },
        "similar_stories": [
          {
            "categories": "[\"weather\", \"others\", \"storms\"]",
            "channels": "[]",
            "collections": "[\"US Weather\"]",
            "extended_summary": "This video shows rain and light hail falling in north Dallas, according to the source.\n\nThe storms were expected move eastward out of the Dallas-Fort Worth area by 2pm, the National Weather Service \"said\":https://x.com/NWSFortWorth/status/1872266112609476875.",
            "id": "317266",
            "image_url": "https://img.news.storyful.com/stories/317266/rt:fill/el:1/s:495:250/original.gif@webp",
            "keywords": "[\"Thunderstorm\", \"Rain\", \"Hail\", \"Weather\", \"National Weather Service\", \"Flash flood\", \"Dallas–Fort Worth metroplex\", \"Dallas\", \"Central Texas\", \"Mesquite, Texas\", \"2PM\", \"The Thunder Rolls\", \"Local news\", \"Thunder\", \"Storyful\", \"Meteorologist\"]",
            "media_url": "https://videos.storyful.com/syfl-26772d25d7867bc2833b5f9b2e471ca6bd1b8d69-original.mp4",
            "provider_url": "https://x.com/ts_texam/status/1872350247369756895",
            "published_date": "2024-12-26 20:09:43 UTC",
            "stated_location": "Dallas, Texas",
            "story_mark_clearance": "CLEARED",
            "story_mark_guidance": "",
            "summary": "A round of thunderstorms hit north and central Texas on Thursday, December 26, bringing heavy rain and hail, thunder and lightning, and a risk of flash flooding, weather officials \"said.\":https://x.com/NWSFortWorth/status/1872307108814999852\n\nThis video shows rain and light hail falling in north Dallas, according to the source.\n\nThe storms were expected move eastward out of the Dallas-Fort Worth area by 2pm, the National Weather Service \"said\":https://x.com/NWSFortWorth/status/1872266112609476875.",
            "title": "Rain and Hail Dampen Dallas Area",
            "title_date": "December 26 2024",
            "title_slug": "US-TX",
            "total_downloads": "11",
            "total_views": "35",
            "unique_downloads": "9",
            "unique_views": "13"
          }
        ]
      };
      
      const mainStory = transformAPIStoryToNewsStory(hardcodedExample.story as unknown as APIStory);
      const similarStories = hardcodedExample.similar_stories.map(story => 
        transformAPIStoryToNewsStory(story as unknown as APIStory)
      );
      
      const result = {
        story: mainStory,
        similarStories
      };
      
      // Cache this result
      sessionStorage.setItem(`story_${storyId}`, JSON.stringify(result));
      sessionStorage.setItem(`story_${storyId}_timestamp`, Date.now().toString());
      
      return result;
    }
    
    console.error('No hardcoded or cached data available for this story');
    return null;
  }
};

// Function to fetch top stories
export const getTopStories = async (forceRefresh = false): Promise<NewsStory[]> => {
  console.log('Getting top stories with forceRefresh =', forceRefresh);
  try {
    const apiStories = await fetchStoriesFromAPI(forceRefresh);
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
    
    // Try to get all stories first
    const allStories = await getTopStories(forceRefresh);
    
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
    
    // Fallback to getting top stories
    console.log('No similar stories found, using top stories instead');
    const allStories = await getTopStories(forceRefresh);
    
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


import { APIStory, NewsStory } from '@/types/news';

// Transform API response to our app model
export const transformAPIStory = (apiStory: APIStory): NewsStory => {
  console.log('Transforming Storyful API story:', apiStory);
  
  // Helper function to safely parse JSON strings
  const safeJsonParse = (jsonString: string | null | undefined, fallback: any = []) => {
    if (!jsonString) return fallback;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse JSON string:', jsonString);
      return fallback;
    }
  };
  
  // Ensure we have a valid ID (handle both string and number)
  const id = apiStory.id ? parseInt(apiStory.id.toString()) : Math.floor(Math.random() * 900000) + 100000;
  
  // Create a cleaner slug from title or ID
  const title = apiStory.title || 'Untitled';
  const titleSlug = apiStory.title_slug || title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
  const slug = titleSlug || `story-${id}`;
  
  // Use the first available description text
  const summary = apiStory.summary || apiStory.extended_summary || "No summary available";
  
  // Make sure we have a valid date
  const pubDate = apiStory.published_date || new Date().toISOString();
  
  // Extract regions/categories with better error handling
  let regions: string[] = [];
  if (apiStory.categories) {
    if (typeof apiStory.categories === 'string') {
      regions = safeJsonParse(apiStory.categories);
    } else if (Array.isArray(apiStory.categories)) {
      regions = apiStory.categories;
    }
  }
  
  // Ensure we have a lead image, even if just a placeholder
  const leadImage = apiStory.image_url ? {
    url: apiStory.image_url,
    filename: title || `image-${apiStory.id}`
  } : undefined;
  
  return {
    id: id,
    title: title,
    slug: slug,
    summary: summary,
    published_date: pubDate,
    updated_at: pubDate,
    editorial_updated_at: pubDate,
    clearance_mark: apiStory.story_mark_clearance || "LICENSED",
    lead_image: leadImage,
    regions: regions,
    stated_location: apiStory.stated_location || "Unknown",
    media_url: apiStory.media_url || "",
    in_trending_collection: false,
    video_providing_partner: false,
    collection_headline: '',
    collection_summary_html: '',
    lead_item: {
      id: id,
      resource_type: 'video',
      type: 'video',
      media_button: {
        first_time: false,
        already_downloaded_by_relative: false,
        action: 'preview'
      }
    }
  };
};

// Helper function to parse raw API data - this handles malformed or unusual formats
export const parseRawApiData = (data: any): APIStory[] => {
  console.log('Parsing raw API data, type:', typeof data);
  
  // If data is null or undefined, return empty array
  if (!data) {
    console.error('API returned null or undefined data');
    return [];
  }
  
  // If data is a string (happens with some proxies), try to parse it
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
      console.log('Successfully parsed string data to object');
    } catch (e) {
      console.error('Failed to parse string data:', data.substring(0, 100));
      return [];
    }
  }
  
  // If data is already an array, use it directly
  if (Array.isArray(data)) {
    console.log(`API returned an array with ${data.length} items`);
    return data;
  }
  
  // If data is an object with specific properties, extract stories array
  if (data && typeof data === 'object') {
    // Check common API response structures
    if (data.stories && Array.isArray(data.stories)) {
      console.log(`API returned object with stories array (${data.stories.length} items)`);
      return data.stories;
    }
    
    if (data.data && Array.isArray(data.data)) {
      console.log(`API returned object with data array (${data.data.length} items)`);
      return data.data;
    }
    
    if (data.results && Array.isArray(data.results)) {
      console.log(`API returned object with results array (${data.results.length} items)`);
      return data.results;
    }
    
    // If it's a simple object, wrap it in an array
    if (data.id || data.title) {
      console.log('API returned a single story object');
      return [data];
    }
    
    // If we have keys that look like indices, try to convert to array
    if (Object.keys(data).every(key => !isNaN(Number(key)))) {
      console.log('API returned object with numeric keys, converting to array');
      return Object.values(data);
    }
  }
  
  // If we couldn't parse it as expected
  console.error('Unexpected API data format:', data);
  return [];
};

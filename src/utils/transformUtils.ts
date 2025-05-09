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
  
  // Process title - ensure we use a real title when available
  // The API response has a real title, so we should use it rather than a fallback
  const title = apiStory.title || `Story #${id}`;
  
  // Process slug carefully
  const titleSlug = apiStory.title_slug || (apiStory.title ? apiStory.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-') : `story-${id}`);
  const slug = titleSlug || `story-${id}`;
  
  // Use the first available description text
  const summary = apiStory.summary || apiStory.extended_summary || `Description for story #${id}`;
  
  // Make sure we have a valid date
  const pubDate = apiStory.published_date || new Date().toISOString();
  
  // Parse categories
  let categories: string[] = [];
  if (apiStory.categories) {
    if (typeof apiStory.categories === 'string') {
      categories = safeJsonParse(apiStory.categories);
    } else if (Array.isArray(apiStory.categories)) {
      categories = apiStory.categories;
    }
  }
  
  // Parse collections
  let collections: string[] = [];
  if (apiStory.collections) {
    if (typeof apiStory.collections === 'string') {
      collections = safeJsonParse(apiStory.collections);
    } else if (Array.isArray(apiStory.collections)) {
      collections = apiStory.collections;
    }
  }
  
  // Parse channels
  let channels: string[] = [];
  if (apiStory.channels) {
    if (typeof apiStory.channels === 'string') {
      channels = safeJsonParse(apiStory.channels);
    } else if (Array.isArray(apiStory.channels)) {
      channels = apiStory.channels;
    }
  }
  
  // Parse keywords
  let keywords: string[] = [];
  if (apiStory.keywords) {
    if (typeof apiStory.keywords === 'string') {
      keywords = safeJsonParse(apiStory.keywords);
    } else if (Array.isArray(apiStory.keywords)) {
      keywords = apiStory.keywords;
    }
  }
  
  // Process image data - carefully handle different image URL formats
  let leadImage;
  if (apiStory.image_url) {
    // Ensure we have a real URL, not just a placeholder
    const imageUrl = apiStory.image_url.includes('@webp') ? 
      apiStory.image_url :  // Use as is if it already has @webp format
      `${apiStory.image_url}@webp`; // Add @webp if missing
    
    leadImage = {
      url: imageUrl,
      // Use a better fallback for filename
      filename: apiStory.title || `Video Source: ${apiStory.provider_url || apiStory.stated_location || 'Unknown'}`
    };
  }
  
  // Create collection headline from title_date or other fields
  const collectionHeadline = apiStory.title_date || pubDate.split(' ')[0] || '';
  
  return {
    id: id,
    title: title,
    slug: slug,
    summary: summary,
    extended_summary: apiStory.extended_summary || summary,
    published_date: pubDate,
    updated_at: pubDate,
    editorial_updated_at: pubDate,
    clearance_mark: apiStory.story_mark_clearance || "LICENSED",
    lead_image: leadImage,
    regions: categories,
    stated_location: apiStory.stated_location || (categories.length > 0 ? categories[0] : "Location Unknown"),
    media_url: apiStory.media_url || "",
    provider_url: apiStory.provider_url || "",
    in_trending_collection: collections.length > 0,
    video_providing_partner: channels.length > 0,
    collection_headline: collectionHeadline,
    collection_summary_html: '',
    categories: categories,
    collections: collections,
    channels: channels,
    keywords: keywords,
    total_downloads: parseInt(apiStory.total_downloads || '0'),
    total_views: parseInt(apiStory.total_views || '0'),
    unique_downloads: parseInt(apiStory.unique_downloads || '0'),
    unique_views: parseInt(apiStory.unique_views || '0'),
    title_date: apiStory.title_date || '',
    story_mark_guidance: apiStory.story_mark_guidance || '',
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
  
  // If response has a story and similar_stories structure
  if (data && data.story) {
    console.log('Found APIStoryResponse structure with main story and similar stories');
    return [data.story, ...(data.similar_stories || [])];
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
    
    // If it's a simple object with story properties, wrap it in an array
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

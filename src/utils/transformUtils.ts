
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
  
  return {
    id: parseInt(apiStory.id),
    title: apiStory.title || 'Untitled',
    slug: apiStory.title_slug || `story-${apiStory.id}`,
    summary: apiStory.summary || apiStory.extended_summary || "No summary available",
    published_date: apiStory.published_date || new Date().toISOString(),
    updated_at: apiStory.published_date || new Date().toISOString(),
    editorial_updated_at: apiStory.published_date || new Date().toISOString(),
    clearance_mark: apiStory.story_mark_clearance || "LICENSED",
    lead_image: apiStory.image_url ? {
      url: apiStory.image_url,
      filename: apiStory.title || `image-${apiStory.id}`
    } : undefined,
    regions: apiStory.categories ? safeJsonParse(apiStory.categories) : [],
    stated_location: apiStory.stated_location || "Unknown",
    media_url: apiStory.media_url || "",
    in_trending_collection: false,
    video_providing_partner: false,
    collection_headline: '',
    collection_summary_html: '',
    lead_item: {
      id: parseInt(apiStory.id),
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

// Transform NewsAPI stories to our app model
export const transformNewsAPIStory = (article: any, id: number): NewsStory => {
  console.log('Transforming NewsAPI article:', article);
  
  return {
    id: id,
    title: article.title || 'Untitled Article',
    slug: article.title ? article.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-') : 'untitled',
    summary: article.description || article.content || "No summary available",
    published_date: article.publishedAt || new Date().toISOString(),
    updated_at: article.publishedAt || new Date().toISOString(),
    editorial_updated_at: article.publishedAt || new Date().toISOString(),
    clearance_mark: "LICENSED", // Default to licensed for these stories
    lead_image: article.urlToImage ? {
      url: article.urlToImage,
      filename: article.title || 'image'
    } : undefined,
    regions: article.source?.name ? [article.source.name] : ["Global"],
    stated_location: article.source?.name || "Global",
    media_url: article.url || "",
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

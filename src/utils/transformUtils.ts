
import { APIStory, NewsStory } from '@/types/news';

// Transform API response to our app model
export const transformAPIStory = (apiStory: APIStory): NewsStory => {
  // Ensure we're getting the right data structure and logging it for debugging
  console.log('Transforming API story:', apiStory);
  
  return {
    id: parseInt(apiStory.id),
    title: apiStory.title,
    slug: apiStory.title_slug,
    summary: apiStory.summary || apiStory.extended_summary || "No summary available",
    published_date: apiStory.published_date,
    updated_at: apiStory.published_date,
    editorial_updated_at: apiStory.published_date,
    clearance_mark: apiStory.story_mark_clearance,
    lead_image: apiStory.image_url ? {
      url: apiStory.image_url,
      filename: apiStory.title
    } : undefined,
    regions: apiStory.categories ? (
      typeof apiStory.categories === 'string' ? 
        JSON.parse(apiStory.categories) : 
        apiStory.categories
    ) : [],
    stated_location: apiStory.stated_location,
    media_url: apiStory.media_url,
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

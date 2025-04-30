
import { NewsStory } from '@/types/news';

// Mock data to use as fallback when API requests fail
export const getMockData = (storyId?: string | number): NewsStory => {
  return {
    id: storyId ? Number(storyId) : 12345,
    title: "Example Story - API Unavailable",
    slug: "example-story",
    summary: "This is a placeholder story shown when the API is unavailable. Please try again later or check your connection.",
    published_date: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    editorial_updated_at: new Date().toISOString(),
    clearance_mark: "LICENSED",
    regions: ["Global"],
    stated_location: "Internet",
    media_url: "",
    in_trending_collection: false,
    collection_headline: "",
    collection_summary_html: "",
    lead_image: {
      url: "https://via.placeholder.com/800x450?text=API+Unavailable",
      filename: "Placeholder"
    },
    lead_item: {
      id: storyId ? Number(storyId) : 12345,
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

// Get a mock result for when all API attempts fail
export const getMockStoryResult = (storyId: string | number) => {
  const mainStory = getMockData(storyId);
  const similarStories = Array.from({ length: 5 }, (_, i) => ({
    ...getMockData(100000 + i),
    title: `Similar Story Example ${i + 1}`,
    id: 100000 + i
  }));
  
  return {
    story: mainStory,
    similarStories
  };
};

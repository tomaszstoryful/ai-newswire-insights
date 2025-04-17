import { NewsStory } from '@/types/news';

// API URL
const API_URL = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';

// Transform API data to match our existing NewsStory type
const transformApiData = (apiData: any[]): NewsStory[] => {
  return apiData.map(item => ({
    id: parseInt(item.id),
    title: item.title,
    slug: item.title_slug || `story-${item.id}`,
    summary: item.summary || item.extended_summary || '',
    published_date: item.published_date,
    updated_at: item.published_date, // Using published_date as updated_at
    editorial_updated_at: item.published_date, // Using published_date as editorial_updated_at
    clearance_mark: item.story_mark_clearance || 'PUBLIC',
    lead_image: item.image_url ? {
      url: item.image_url,
      filename: 'image.webp'
    } : undefined,
    lead_item: {
      id: parseInt(item.id),
      media_button: {
        first_time: true,
        already_downloaded_by_relative: false,
        action: item.media_url || ''
      },
      resource_type: "video",
      type: "ItemYoutube"
    },
    in_trending_collection: false,
    regions: item.categories ? JSON.parse(item.categories.replace(/'/g, '"')) : []
  }));
};

// Fetch real stories from the API
export const getTopStories = async (): Promise<NewsStory[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }
    const data = await response.json();
    return transformApiData(data);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return []; // Return empty array on error
  }
};

// Generate some mock news stories based on the sample
const generateMockStories = (): NewsStory[] => {
  const stories: NewsStory[] = [sampleStory];
  
  const otherTitles = [
    "Global Markets Rally as Central Banks Announce New Policy Measures",
    "Tech Giant Unveils Revolutionary AI Assistant at Annual Conference",
    "Climate Summit Concludes with New International Commitments",
    "Major Pharmaceutical Company Announces Breakthrough Treatment",
    "Election Results Show Surprising Shift in Voter Demographics",
    "Investigation Reveals Corporate Finance Irregularities",
    "Transportation Strike Affects Millions of Commuters",
    "Record-Breaking Weather Event Impacts Coastal Communities",
    "International Trade Agreement Faces New Challenges",
    "Cultural Heritage Site Receives Protected Status"
  ];
  
  for (let i = 0; i < otherTitles.length; i++) {
    stories.push({
      ...sampleStory,
      id: 322511 + i,
      title: otherTitles[i],
      slug: `story-${322511 + i}`,
      summary: `This is a mock summary for the story "${otherTitles[i]}". In a real implementation, this would contain actual story content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.`,
      published_date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return stories;
};

const mockStories = generateMockStories();

export const getStoryBySlug = (slug: string): Promise<NewsStory | undefined> => {
  return Promise.resolve(mockStories.find(story => story.slug === slug));
};

export const getRecommendedStories = (storyId?: number): Promise<NewsStory[]> => {
  // Return 5 random stories, except the current one
  const filtered = storyId 
    ? mockStories.filter(story => story.id !== storyId)
    : mockStories;
  
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return Promise.resolve(shuffled.slice(0, 5));
};

export const getLatestStories = (): Promise<NewsStory[]> => {
  // Sort by published date and return latest
  return Promise.resolve([...mockStories].sort(
    (a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
  ).slice(0, 5));
};

export const getTrendingStories = (): Promise<NewsStory[]> => {
  // For mock data, just return some random stories
  return Promise.resolve([...mockStories].sort(() => 0.5 - Math.random()).slice(0, 3));
};

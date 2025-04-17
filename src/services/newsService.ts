
import { NewsStory } from '@/types/news';

// Sample news data based on the provided JSON
const sampleStory: NewsStory = {
  updated_at: "2025-04-16T06:30:05Z",
  lead_image: {
    url: "https://storyful.s3.amazonaws.com/production/stories/322510/original.gif",
    filename: "original.gif"
  },
  lead_item: {
    id: 4415051,
    media_button: {
      first_time: true,
      already_downloaded_by_relative: false,
      action: "/stories/322510/media/4415051/download?exclude_from_home_page=true&format=json&page=1"
    },
    resource_type: "video",
    type: "ItemYoutube"
  },
  in_trending_collection: false,
  editorial_updated_at: "2025-04-16T06:30:05Z",
  collection_headline: "13/04/2025",
  collection_summary_html: "",
  id: 322510,
  title: "Stranded Dog Rescued From Rooftop After Escaping Through Attic Window",
  slug: "US-CT",
  published_date: "2025-04-15T20:59:23Z",
  clearance_mark: "LICENSED",
  video_providing_partner: false,
  summary: "Firefighters in Hartford, Connecticut, rescued a dog from the roof of a 2.5-story home on April 13, according to local media, citing officials.\n\nOfficials said the dog escaped through an open attic window and jumped onto the main roof of the home, located on the 200 block of New Park Avenue.\n\nVideo filmed by Kari L Bramhall shows firefighters using a ladder truck to safely retrieve the dog around 3:45 pm on Sunday.\n\nThe dog was not injured, did not fall, and was brought down safely, reports say.\n\n\"Based on his bravery, climbing, and comfort being on that roof, I may have to offer this puppy a job,\" joked Hartford Fire Department District Chief Mario Oquendo Jr.",
  place_id: "ChIJOThsZkohTIYRhvmYx7ZKWeY",
  regions: ["North America"]
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

// Generate real-looking stories from the sample API response format
const generateApiBasedStories = (): NewsStory[] => {
  const apiSampleData = [
    {
      "categories": "[\"US\", \"news & politics\"]",
      "channels": "[\"MRSS Licensed\", \"Viral\", \"Licensed\"]",
      "collections": "[]",
      "extended_summary": "Footage filmed by Spencer White shows the funnel spinning near Sam Bishkin Road on Thursday afternoon.\n\nAccording to the Wharton County Office of Emergency Management, the tornado damaged multiple barns as it touched down near Highway 59. There were no injuries reported.",
      "id": "317273",
      "image_url": "https://img.news.storyful.com/stories/317273/rt:fill/el:1/s:495:250/original.gif@webp",
      "keywords": "[\"Social media\", \"Tornado\", \"Google Maps\", \"Office of Emergency Management\", \"Chimney\", \"U.S. Route 59\", \"Wharton County, Texas\", \"Uniform Resource Locator\", \"Storyful\", \"El Campo, Texas\", \"Local insertion\"]",
      "media_url": "https://videos.storyful.com/syfl-71dbddba8a15e4015c89eadb1aff8671d5d812b3-original.mp4",
      "provider_url": "https://www.youtube.com/watch?v=qljyTulWMms",
      "published_date": "2024-12-27 03:40:58 UTC",
      "stated_location": "El Campo, Texas",
      "story_mark_clearance": "LICENSED",
      "story_mark_guidance": "",
      "summary": "A tornado touched down in El Campo, Texas, damaging structures and whipping up dust on December 26.\n\nFootage filmed by Spencer White shows the funnel spinning near Sam Bishkin Road on Thursday afternoon.\n\nAccording to the Wharton County Office of Emergency Management, the tornado damaged multiple barns as it touched down near Highway 59. There were no injuries reported.",
      "title": "Tornado Spotted Swirling Over El Campo",
      "title_date": "December 26 2024",
      "title_slug": "US-TX",
      "total_downloads": "1",
      "total_views": "11",
      "unique_downloads": "1",
      "unique_views": "4"
    },
    {
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
    }
  ];

  return apiSampleData.map((story, index) => {
    try {
      // Parse categories from string to array
      const categories = story.categories ? JSON.parse(story.categories) : [];
      
      return {
        id: parseInt(story.id),
        title: story.title,
        slug: story.title_slug || `story-${story.id}`,
        summary: story.summary || story.extended_summary || "",
        published_date: story.published_date,
        updated_at: story.published_date, // Using published_date for updated_at
        editorial_updated_at: story.published_date, // Using published_date for editorial_updated_at
        clearance_mark: story.story_mark_clearance || "PUBLIC",
        in_trending_collection: false,
        lead_image: {
          url: story.image_url,
          filename: story.image_url?.split('/').pop() || 'image.webp'
        },
        lead_item: {
          id: parseInt(story.id) + 1000, // Creating a unique ID for lead_item
          media_button: {
            first_time: true,
            already_downloaded_by_relative: false,
            action: story.media_url || ''
          },
          resource_type: "video",
          type: "ItemYoutube"
        },
        regions: categories
      };
    } catch (parseError) {
      console.error('Error parsing story data:', parseError, story);
      return null;
    }
  }).filter(Boolean) as NewsStory[];
};

// Use the simulated API stories as a fallback
const apiBasedMockStories = generateApiBasedStories();

// Function to fetch stories from the provided API endpoint
export const fetchStoriesFromAPI = async (): Promise<NewsStory[]> => {
  try {
    // Use the updated API endpoint specified by the user
    const apiUrl = 'https://newswire-story-recommendation.staging.storyful.com/api/stories';
    const corsProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(apiUrl);
    
    console.log('Fetching stories from API (with CORS proxy):', corsProxyUrl);
    
    const response = await fetch(corsProxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const apiStories = await response.json();
    console.log('Successfully fetched stories:', apiStories.length);
    
    // Transform API response to match our NewsStory type
    return apiStories.map((story: any) => {
      try {
        // Parse categories from string to array
        const categories = story.categories ? JSON.parse(story.categories) : [];
        
        return {
          id: parseInt(story.id),
          title: story.title,
          slug: story.title_slug || `story-${story.id}`,
          summary: story.summary || story.extended_summary || "",
          published_date: story.published_date,
          updated_at: story.published_date, // Using published_date for updated_at
          editorial_updated_at: story.published_date, // Using published_date for editorial_updated_at
          clearance_mark: story.story_mark_clearance || "PUBLIC",
          in_trending_collection: false,
          lead_image: {
            url: story.image_url,
            filename: story.image_url?.split('/').pop() || 'image.webp'
          },
          lead_item: {
            id: parseInt(story.id) + 1000, // Creating a unique ID for lead_item
            media_button: {
              first_time: true,
              already_downloaded_by_relative: false,
              action: story.media_url || ''
            },
            resource_type: "video",
            type: "ItemYoutube"
          },
          regions: categories
        };
      } catch (parseError) {
        console.error('Error parsing story data:', parseError, story);
        return null;
      }
    }).filter(Boolean) as NewsStory[];
  } catch (error) {
    console.error('Error fetching stories from API:', error);
    console.log('Falling back to API-based mock data');
    // Fallback to API-based mock data in case of API failure
    return apiBasedMockStories;
  }
};

export const getTopStories = async (): Promise<NewsStory[]> => {
  console.log('Getting top stories...');
  try {
    const apiStories = await fetchStoriesFromAPI();
    console.log(`Retrieved ${apiStories.length} stories`);
    return apiStories;
  } catch (error) {
    console.error('Error getting top stories:', error);
    return apiBasedMockStories; // Use API-based mock stories as fallback
  }
};

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

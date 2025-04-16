
import { NewsStory } from '@/types/news';

// Sample data for simulating Python code execution
const sampleData = {
  regions: {
    'North America': 423,
    'Europe': 356,
    'Asia': 289,
    'Africa': 134,
    'South America': 156,
    'Australia/Oceania': 89
  },
  categories: {
    'Politics': 321,
    'Economy': 256,
    'Technology': 312,
    'Climate': 189,
    'Entertainment': 234,
    'Sports': 178,
    'Health': 144
  },
  trends: {
    'AI Developments': { stories: 134, growth: '+28%', engagement: 'High' },
    'Climate Crisis': { stories: 187, growth: '+12%', engagement: 'Medium' },
    'Global Elections': { stories: 201, growth: '+8%', engagement: 'Very High' },
    'Digital Privacy': { stories: 88, growth: '+32%', engagement: 'Medium' },
    'Space Exploration': { stories: 72, growth: '+18%', engagement: 'High' }
  }
};

// Python code execution simulation
export const simulatePythonExecution = async (userQuery: string): Promise<{code: string, result: string}> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const lowercaseQuery = userQuery.toLowerCase();
  
  // Generate Python code based on user query
  let code = '';
  let result = '';
  
  if (lowercaseQuery.includes('trend') || lowercaseQuery.includes('top')) {
    code = `import numpy as np

# Load news data (simplified sample)
news_data = {
    'topics': ['AI', 'Climate', 'Elections', 'Privacy', 'Space', 'AI', 'Climate', 
              'Elections', 'AI', 'Climate', 'Elections', 'Elections'],
    'engagement': [0.8, 0.6, 0.9, 0.7, 0.8, 0.7, 0.5, 0.8, 0.9, 0.6, 0.7, 0.9],
    'dates': ['2025-04-10', '2025-04-11', '2025-04-12', '2025-04-13', '2025-04-14', 
             '2025-04-12', '2025-04-13', '2025-04-14', '2025-04-10', '2025-04-13', 
             '2025-04-10', '2025-04-11']
}

# Convert to numpy arrays for faster processing
topics = np.array(news_data['topics'])
engagement = np.array(news_data['engagement'])

# Find unique topics and count occurrences
unique_topics, counts = np.unique(topics, return_counts=True)

# Calculate average engagement per topic
topic_engagement = {}
for topic in unique_topics:
    topic_indices = topics == topic
    topic_engagement[topic] = np.mean(engagement[topic_indices])

# Sort topics by count
sorted_indices = np.argsort(counts)[::-1]
top_topics = unique_topics[sorted_indices][:3]
top_counts = counts[sorted_indices][:3]

# Prepare results
results = []
for i, topic in enumerate(top_topics):
    growth_rates = {'Elections': 0.08, 'Climate': 0.12, 'AI': 0.28, 'Privacy': 0.32, 'Space': 0.18}
    eng_level = 'High' if topic_engagement[topic] > 0.7 else 'Medium'
    results.append({
        'topic': topic,
        'stories': int(top_counts[i]),
        'growth': f"+{int(growth_rates.get(topic, 0) * 100)}%",
        'engagement': eng_level
    })

print("Top 3 trending topics:")
for i, trend in enumerate(results, 1):
    print(f"{i}. {trend['topic']}: {trend['stories']} stories, {trend['growth']} growth")

# Calculate number of relevant stories
total_relevant = np.sum(top_counts) * 3 // 10  # Approximately 30% of top topics
print(f"\\nFound {total_relevant} relevant stories for these trends")`;

    result = `Top 3 trending topics:
1. Elections: 4 stories, +8% growth
2. Climate: 3 stories, +12% growth
3. AI: 3 stories, +28% growth

Found 3 relevant stories for these trends

These results show that while Elections has the most stories, AI is growing at the fastest rate. I'll retrieve the most relevant stories for these trending topics.`;
  } 
  else if (lowercaseQuery.includes('region') || lowercaseQuery.includes('geographic')) {
    code = `import numpy as np

# Load news data (simplified sample)
regions = ['North America', 'Europe', 'Asia', 'North America', 'Europe', 
           'Asia', 'Africa', 'South America', 'North America', 'Europe', 
           'Australia/Oceania', 'North America', 'Asia', 'South America']
engagement = [0.8, 0.7, 0.6, 0.9, 0.8, 0.7, 0.6, 0.5, 0.8, 0.7, 0.5, 0.8, 0.6, 0.5]

# Convert to numpy arrays
regions_array = np.array(regions)
engagement_array = np.array(engagement)

# Get unique regions and count stories
unique_regions, counts = np.unique(regions_array, return_counts=True)

# Calculate average engagement by region
region_engagement = {}
for region in unique_regions:
    indices = regions_array == region
    region_engagement[region] = np.mean(engagement_array[indices])

# Sort regions by count and print results
sorted_indices = np.argsort(counts)[::-1]
sorted_regions = unique_regions[sorted_indices]
sorted_counts = counts[sorted_indices]

print("News stories by region:")
for region, count in zip(sorted_regions, sorted_counts):
    print(f"{region}: {count} stories")

print("\\nRegions by engagement level:")
for region in sorted_regions:
    eng = region_engagement[region]
    eng_level = "High" if eng > 0.7 else "Medium" if eng > 0.4 else "Low"
    print(f"{region}: {eng_level} engagement ({eng:.2f})")`;

    result = `News stories by region:
North America: 4 stories
Europe: 3 stories
Asia: 3 stories
South America: 2 stories
Africa: 1 stories
Australia/Oceania: 1 stories

Regions by engagement level:
North America: High engagement (0.83)
Europe: High engagement (0.73)
Asia: Medium engagement (0.63)
South America: Medium engagement (0.50)
Africa: Medium engagement (0.60)
Australia/Oceania: Medium engagement (0.50)

The analysis shows that North America and Europe lead both in story count and engagement levels. This suggests these regions receive more comprehensive coverage and audience interest.`;
  } 
  else {
    code = `import numpy as np
from datetime import datetime, timedelta

# Sample news data for the last 7 days
categories = ['Politics', 'Technology', 'Politics', 'Economy', 'Economy', 
              'Technology', 'Technology', 'Health', 'Politics', 'Entertainment',
              'Climate', 'Sports', 'Politics', 'Technology', 'Economy']
engagement = [0.7, 0.8, 0.6, 0.5, 0.6, 0.7, 0.9, 0.6, 0.7, 0.8, 0.5, 0.6, 0.7, 0.8, 0.5]
dates = np.array(['2025-04-10', '2025-04-11', '2025-04-11', '2025-04-12', 
                 '2025-04-12', '2025-04-13', '2025-04-13', '2025-04-14', 
                 '2025-04-14', '2025-04-15', '2025-04-15', '2025-04-15', 
                 '2025-04-16', '2025-04-16', '2025-04-16'])

# Convert to numpy arrays
categories_array = np.array(categories)
engagement_array = np.array(engagement)

# Basic statistics
total_stories = len(categories)
avg_engagement = np.mean(engagement_array)

# Top categories
unique_categories, counts = np.unique(categories_array, return_counts=True)
sorted_indices = np.argsort(counts)[::-1]
top_categories = unique_categories[sorted_indices][:3]
top_counts = counts[sorted_indices][:3]

print(f"News statistics for the past 7 days:")
print(f"Total stories published: {total_stories}")
print(f"Average engagement score: {avg_engagement:.2f}")
print("\\nTop 3 categories by story count:")
for category, count in zip(top_categories, top_counts):
    percentage = (count / total_stories) * 100
    print(f"{category}: {count} stories ({percentage:.1f}% of total)")`;

    result = `News statistics for the past 7 days:
Total stories published: 15
Average engagement score: 0.67

Top 3 categories by story count:
Politics: 4 stories (26.7% of total)
Technology: 4 stories (26.7% of total)
Economy: 3 stories (20.0% of total)

This analysis shows a high volume of political and technology news in the past week, with economy stories also featured prominently. The average engagement score of 0.67 indicates moderate-to-high audience interest across all news stories.`;
  }
  
  return { code, result };
};

// Mock news stories
const mockNewsStories: NewsStory[] = [
  {
    id: 101,
    title: "Global Climate Summit Reaches Historic Agreement on Emissions",
    slug: "global-climate-summit-agreement",
    summary: "World leaders have reached a landmark decision to cut carbon emissions by 45% by 2030 at the Global Climate Summit.",
    published_date: "2025-04-15T10:30:00Z",
    updated_at: "2025-04-15T14:45:00Z",
    editorial_updated_at: "2025-04-15T15:20:00Z",
    clearance_mark: "LICENSED",
    in_trending_collection: true,
    lead_image: {
      url: "https://picsum.photos/id/1015/600/400",
      filename: "climate_summit.jpg"
    },
    regions: ["Global", "Europe"]
  },
  {
    id: 102,
    title: "Tech Giant Unveils Revolutionary AI System for News Analysis",
    slug: "tech-giant-ai-news-analysis",
    summary: "A leading technology company has introduced an advanced AI system capable of analyzing thousands of news stories in real-time.",
    published_date: "2025-04-14T16:20:00Z",
    updated_at: "2025-04-14T18:15:00Z",
    editorial_updated_at: "2025-04-14T19:00:00Z",
    clearance_mark: "RESTRICTED",
    in_trending_collection: true,
    lead_image: {
      url: "https://picsum.photos/id/1011/600/400",
      filename: "ai_news_system.jpg"
    },
    regions: ["North America", "Global"]
  },
  {
    id: 103,
    title: "Presidential Elections Set to Reshape Global Politics",
    slug: "presidential-elections-global-politics",
    summary: "Upcoming elections in three major countries are expected to significantly impact international relations and global politics.",
    published_date: "2025-04-13T08:45:00Z",
    updated_at: "2025-04-13T11:30:00Z",
    editorial_updated_at: "2025-04-13T12:15:00Z",
    clearance_mark: "LICENSED",
    in_trending_collection: true,
    lead_image: {
      url: "https://picsum.photos/id/1012/600/400",
      filename: "global_elections.jpg"
    },
    regions: ["Global", "North America", "Asia"]
  },
  {
    id: 104,
    title: "Breakthrough in Renewable Energy Storage Technology",
    slug: "renewable-energy-storage-breakthrough",
    summary: "Scientists have developed a new battery technology that could solve the long-standing issue of renewable energy storage.",
    published_date: "2025-04-12T14:10:00Z",
    updated_at: "2025-04-12T16:45:00Z",
    editorial_updated_at: "2025-04-12T17:30:00Z",
    clearance_mark: "RESTRICTED",
    in_trending_collection: false,
    lead_image: {
      url: "https://picsum.photos/id/1013/600/400",
      filename: "energy_storage.jpg"
    },
    regions: ["Europe", "North America"]
  },
  {
    id: 105,
    title: "World Health Organization Warns of New Viral Outbreak",
    slug: "who-new-viral-outbreak-warning",
    summary: "The WHO has issued an alert regarding a new viral strain detected in Southeast Asia with potential for rapid spread.",
    published_date: "2025-04-11T09:20:00Z",
    updated_at: "2025-04-11T13:15:00Z",
    editorial_updated_at: "2025-04-11T14:00:00Z",
    clearance_mark: "LICENSED",
    in_trending_collection: true,
    lead_image: {
      url: "https://picsum.photos/id/1014/600/400",
      filename: "viral_outbreak.jpg"
    },
    regions: ["Asia", "Global"]
  }
];

// Simulate news search
export const simulateNewsSearch = async (query: string): Promise<NewsStory[]> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Shuffle the array and take 3 items to simulate different results
  const shuffled = [...mockNewsStories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

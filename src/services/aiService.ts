
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
    code = `import pandas as pd
import matplotlib.pyplot as plt
from collections import Counter

# Load news data
news_data = pd.read_csv('news_archive.csv')

# Analyze trending topics
def analyze_trends(data, top_n=3):
    # Extract trending topics based on frequency and engagement
    topics = Counter(data['topic'])
    engagement = {topic: data[data['topic'] == topic]['engagement'].mean() 
                 for topic in topics.keys()}
    
    # Calculate growth rate compared to previous period
    growth = {
        'AI Developments': 0.28,
        'Climate Crisis': 0.12,
        'Global Elections': 0.08,
        'Digital Privacy': 0.32,
        'Space Exploration': 0.18
    }
    
    # Rank topics by a combined score of frequency and engagement
    topic_score = {topic: (topics[topic] * 0.6) + (engagement.get(topic, 0) * 0.4) 
                  for topic in topics.keys()}
    
    # Get top N topics
    top_topics = sorted(topic_score.items(), key=lambda x: x[1], reverse=True)[:top_n]
    
    return [{
        'topic': topic,
        'stories': topics[topic],
        'growth': f"+{int(growth.get(topic, 0) * 100)}%",
        'engagement': 'High' if engagement.get(topic, 0) > 0.7 else 'Medium'
    } for topic, _ in top_topics]

# Execute the analysis
top_trends = analyze_trends(news_data)
print(f"Top {len(top_trends)} trending topics:")
for i, trend in enumerate(top_trends, 1):
    print(f"{i}. {trend['topic']}: {trend['stories']} stories, {trend['growth']} growth")

# Find relevant stories for each trend
top_stories = []
for trend in top_trends:
    trending_stories = data[data['topic'] == trend['topic']].sort_values(
        by='engagement', ascending=False).head(3)
    top_stories.extend(trending_stories['id'].tolist())

print(f"\\nFound {len(top_stories)} relevant stories for these trends")`;

    result = `Top 3 trending topics:
1. Global Elections: 201 stories, +8% growth
2. Climate Crisis: 187 stories, +12% growth
3. AI Developments: 134 stories, +28% growth

Found 9 relevant stories for these trends

These results show that while Global Elections has the most stories, AI Developments is growing at the fastest rate. I'll retrieve the most relevant stories for these trending topics.`;
  } 
  else if (lowercaseQuery.includes('region') || lowercaseQuery.includes('geographic')) {
    code = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load news data
news_data = pd.read_csv('news_archive.csv')

# Analyze regions
regions = news_data['region'].value_counts()

# Calculate engagement by region
engagement_by_region = news_data.groupby('region')['engagement'].mean().sort_values(ascending=False)

print("News stories by region:")
for region, count in regions.items():
    print(f"{region}: {count} stories")

print("\\nRegions by engagement level:")
for region, engagement in engagement_by_region.items():
    engagement_level = "High" if engagement > 0.7 else "Medium" if engagement > 0.4 else "Low"
    print(f"{region}: {engagement_level} engagement ({engagement:.2f})")`;

    result = `News stories by region:
North America: 423 stories
Europe: 356 stories
Asia: 289 stories
South America: 156 stories
Africa: 134 stories
Australia/Oceania: 89 stories

Regions by engagement level:
North America: High engagement (0.82)
Europe: High engagement (0.76)
Asia: Medium engagement (0.65)
Africa: Medium engagement (0.58)
South America: Medium engagement (0.52)
Australia/Oceania: Medium engagement (0.47)

The analysis shows that North America and Europe lead both in story count and engagement levels. This suggests these regions receive more comprehensive coverage and audience interest.`;
  } 
  else {
    code = `import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Load news data
news_data = pd.read_csv('news_archive.csv')

# Filter to recent news (last 7 days)
now = datetime.now()
week_ago = now - timedelta(days=7)
recent_news = news_data[pd.to_datetime(news_data['published_date']) > week_ago]

# Calculate basic statistics
total_stories = len(recent_news)
avg_engagement = recent_news['engagement'].mean()
top_categories = recent_news['category'].value_counts().head(3)

print(f"News statistics for the past 7 days:")
print(f"Total stories published: {total_stories}")
print(f"Average engagement score: {avg_engagement:.2f}")
print("\\nTop 3 categories by story count:")
for category, count in top_categories.items():
    percentage = (count / total_stories) * 100
    print(f"{category}: {count} stories ({percentage:.1f}% of total)")`;

    result = `News statistics for the past 7 days:
Total stories published: 1447
Average engagement score: 0.64

Top 3 categories by story count:
Politics: 321 stories (22.2% of total)
Technology: 312 stories (21.6% of total)
Economy: 256 stories (17.7% of total)

This analysis shows a high volume of political and technology news in the past week, with economy stories also featured prominently. The average engagement score of 0.64 indicates moderate-to-high audience interest across all news stories.`;
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

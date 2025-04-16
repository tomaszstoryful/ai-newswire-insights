
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import FeaturedStory from '@/components/news/FeaturedStory';
import NewsCard from '@/components/news/NewsCard';
import AIAssistant from '@/components/ai/AIAssistant';
import { NewsStory } from '@/types/news';
import { getTopStories, getLatestStories, getTrendingStories } from '@/services/newsService';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [featuredStory, setFeaturedStory] = useState<NewsStory | null>(null);
  const [topStories, setTopStories] = useState<NewsStory[]>([]);
  const [latestStories, setLatestStories] = useState<NewsStory[]>([]);
  const [trendingStories, setTrendingStories] = useState<NewsStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const stories = await getTopStories();
        const latest = await getLatestStories();
        const trending = await getTrendingStories();
        
        if (stories.length > 0) {
          setFeaturedStory(stories[0]);
          setTopStories(stories.slice(1, 7));
        }
        
        setLatestStories(latest);
        setTrendingStories(trending);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-newswire-lightGray rounded w-1/4 mb-4"></div>
            <div className="h-40 bg-newswire-lightGray rounded mb-6"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-40 bg-newswire-lightGray rounded"></div>
                  <div className="h-4 bg-newswire-lightGray rounded w-3/4"></div>
                  <div className="h-4 bg-newswire-lightGray rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <AIAssistant />
        
        {/* Featured Story */}
        {featuredStory && <FeaturedStory story={featuredStory} />}
        
        {/* Top Stories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {topStories.slice(0, 3).map((story) => (
            <NewsCard key={story.id} story={story} size="medium" />
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {topStories.slice(3, 6).map((story) => (
            <NewsCard key={story.id} story={story} size="medium" />
          ))}
        </div>
        
        {/* Latest and Trending Section */}
        <div className="grid md:grid-cols-12 gap-8 mt-12">
          {/* Latest Stories */}
          <div className="md:col-span-8">
            <h2 className="text-2xl font-display font-bold mb-6 pb-2 border-b border-newswire-lightGray">
              Latest News
            </h2>
            <div className="space-y-6">
              {latestStories.map((story) => (
                <div key={story.id} className="border-b border-newswire-lightGray pb-6 last:border-0">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/4 flex-shrink-0">
                      <div className="aspect-video w-full bg-newswire-lightGray overflow-hidden">
                        {story.lead_image && (
                          <img 
                            src={story.lead_image.url} 
                            alt={story.title} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <NewsCard story={story} size="small" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Trending Section */}
          <div className="md:col-span-4">
            <h2 className="text-2xl font-display font-bold mb-6 pb-2 border-b border-newswire-lightGray">
              Trending
            </h2>
            <div className="space-y-6">
              {trendingStories.map((story, index) => (
                <div key={story.id} className="flex gap-3 items-start pb-5 border-b border-newswire-lightGray last:border-0">
                  <div className="text-3xl font-display font-bold text-newswire-mediumGray">
                    {index + 1}
                  </div>
                  <div>
                    <NewsCard story={story} size="small" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

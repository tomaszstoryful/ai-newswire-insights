
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import FeaturedStory from '@/components/news/FeaturedStory';
import NewsCard from '@/components/news/NewsCard';
import AIAssistant from '@/components/ai/AIAssistant';
import { NewsStory } from '@/types/news';
import { getTopStories } from '@/services/newsService';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [featuredStory, setFeaturedStory] = useState<NewsStory | null>(null);
  const [stories, setStories] = useState<NewsStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const allStories = await getTopStories();
        
        if (allStories.length > 0) {
          setFeaturedStory(allStories[0]);
          setStories(allStories.slice(1));
        }
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
        
        {/* All Stories */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6 pb-2 border-b border-newswire-lightGray">
            Latest News Stories
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <NewsCard key={story.id} story={story} size="medium" />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

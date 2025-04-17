
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import VideoCard from '@/components/news/NewsCard';
import { NewsStory } from '@/types/news';
import { getTopStories } from '@/services/newsService';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import AIOverviewSection from '@/components/ai/AIOverviewSection';
import AIAssistant from '@/components/ai/AIAssistant';

const Index = () => {
  const [featuredVideo, setFeaturedVideo] = useState<NewsStory | null>(null);
  const [videos, setVideos] = useState<NewsStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const allVideos = await getTopStories();
        
        if (allVideos.length > 0) {
          setFeaturedVideo(allVideos[0]);
          setVideos(allVideos.slice(1));
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
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
        {/* AI Insights Section */}
        {featuredVideo && <AIOverviewSection story={featuredVideo} />}
        
        {/* Available Videos */}
        <div className="mb-12 flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold">
            Available Videos
          </h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-newswire-mediumGray" size={16} />
              <input 
                type="text" 
                placeholder="Search videos..." 
                className="pl-10 pr-4 py-2 border border-newswire-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-newswire-accent focus:border-transparent"
              />
            </div>
            <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
              <Filter size={14} />
              Filters
            </Button>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} story={video} size="medium" />
          ))}
        </div>
      </div>

      {/* AI Assistant with showAssistantButton set to false */}
      <AIAssistant showAssistantButton={false} />
    </Layout>
  );
};

export default Index;


import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import VideoCard from '@/components/news/NewsCard';
import { NewsStory } from '@/types/news';
import { getTopStories } from '@/services/newsService';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import AIOverviewSection from '@/components/ai/AIOverviewSection';
import AIAssistant from '@/components/ai/AIAssistant';
import { Skeleton } from '@/components/ui/skeleton';

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

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* AI Insights Section - show skeleton when loading */}
        {loading ? (
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-56 w-full" />
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-4 space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          featuredVideo && <AIOverviewSection story={featuredVideo} />
        )}
        
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
        
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden h-full">
                <Skeleton className="w-full h-48" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-6 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} story={video} size="medium" />
            ))}
          </div>
        )}
      </div>

      {/* Add AI Assistant component */}
      <AIAssistant showAssistantButton={false} />
    </Layout>
  );
};

export default Index;

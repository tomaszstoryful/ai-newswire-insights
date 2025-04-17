
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import VideoCard from '@/components/news/NewsCard';
import NewsCardSkeleton from '@/components/news/NewsCardSkeleton';
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
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter videos based on search term
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render skeleton loaders when loading
  const renderSkeletons = () => {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-newswire-lightGray rounded w-1/4 mb-4"></div>
          <div className="h-40 bg-newswire-lightGray rounded mb-6"></div>
          <div className="mb-12 flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <NewsCardSkeleton key={i} size="medium" />
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        {renderSkeletons()}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
              <Filter size={14} />
              Filters
            </Button>
          </div>
        </div>
        
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-newswire-darkGray mb-2">No videos found</h3>
            <p className="text-newswire-mediumGray">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
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

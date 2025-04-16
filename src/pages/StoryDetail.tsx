
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AIOverviewSection from '@/components/ai/AIOverviewSection';
import RecommendedStories from '@/components/news/RecommendedStories';
import { NewsStory } from '@/types/news';
import { formatDate } from '@/lib/utils';
import { getStoryBySlug, getRecommendedStories } from '@/services/newsService';
import { Calendar, MapPin, Share2, Bookmark, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const StoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [story, setStory] = useState<NewsStory | null>(null);
  const [recommendedStories, setRecommendedStories] = useState<NewsStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const fetchedStory = await getStoryBySlug(slug);
        
        if (fetchedStory) {
          setStory(fetchedStory);
          const recommended = await getRecommendedStories(fetchedStory.id);
          setRecommendedStories(recommended);
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-newswire-lightGray rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-newswire-lightGray rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-newswire-lightGray rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-newswire-lightGray rounded"></div>
              <div className="h-4 bg-newswire-lightGray rounded"></div>
              <div className="h-4 bg-newswire-lightGray rounded w-3/4"></div>
              <div className="h-4 bg-newswire-lightGray rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!story) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Story Not Found</h1>
          <p>The story you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="mb-6">
              <div className="flex flex-wrap items-center text-sm text-newswire-mediumGray gap-4 mb-4">
                <span>News</span>
                <span className="w-1 h-1 bg-newswire-mediumGray rounded-full"></span>
                <span>U.S.</span>
                {story.regions && story.regions.length > 0 && (
                  <>
                    <span className="w-1 h-1 bg-newswire-mediumGray rounded-full"></span>
                    <span>{story.regions[0]}</span>
                  </>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-4">
                {story.title}
              </h1>
              
              <div className="flex flex-wrap items-center text-sm text-newswire-mediumGray gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDate(story.published_date)}</span>
                </div>
                {story.place_id && (
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    <span>Hartford, Connecticut</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mb-6">
                <Button variant="outline" size="sm" className="text-xs">
                  <Share2 size={14} className="mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Bookmark size={14} className="mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="text-xs hidden md:flex">
                  <Printer size={14} className="mr-1" />
                  Print
                </Button>
              </div>
              
              {/* Story Image */}
              {story.lead_image && (
                <div className="aspect-video w-full overflow-hidden mb-6 bg-newswire-lightGray">
                  <img 
                    src={story.lead_image.url} 
                    alt={story.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="text-sm text-newswire-mediumGray mt-2">
                    <span className="italic">A dog was rescued from a rooftop in Hartford, Connecticut. Credit: Kari L Bramhall</span>
                  </div>
                </div>
              )}
              
              {/* Story Content */}
              <div className="prose max-w-none">
                {story.summary.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <Separator className="my-8" />
              
              {/* AI Overview Section */}
              <AIOverviewSection story={story} />
            </div>
          </div>
          
          <div className="lg:col-span-4">
            {/* Recommended Stories */}
            <RecommendedStories stories={recommendedStories} currentStoryId={story.id} />
            
            {/* Ad Space */}
            <div className="mt-6 p-6 bg-newswire-lightGray/50 border border-newswire-lightGray text-center">
              <div className="text-xs text-newswire-mediumGray uppercase mb-2">Advertisement</div>
              <div className="aspect-square w-full bg-newswire-lightGray flex items-center justify-center">
                <span className="text-newswire-mediumGray">Ad Space</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoryDetail;

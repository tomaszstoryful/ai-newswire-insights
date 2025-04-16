
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AIOverviewSection from '@/components/ai/AIOverviewSection';
import RecommendedStories from '@/components/news/RecommendedStories';
import { NewsStory } from '@/types/news';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { getStoryBySlug, getRecommendedStories } from '@/services/newsService';
import { Calendar, MapPin, Share2, Bookmark, Printer, Clock, FileText, Globe, Video, Check, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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

  const getClearanceBadge = (clearance: string) => {
    switch (clearance) {
      case 'LICENSED':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1">
            <Check size={12} />
            LICENSED
          </Badge>
        );
      case 'RESTRICTED':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1">
            <AlertTriangle size={12} />
            RESTRICTED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1">
            PUBLIC
          </Badge>
        );
    }
  };

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
                {story.slug && (
                  <span>{story.slug.includes('-') ? story.slug.split('-')[0] : story.slug}</span>
                )}
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
              
              <div className="flex flex-wrap items-center text-sm text-newswire-mediumGray gap-4 mb-3">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDate(story.published_date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{formatTimeAgo(story.published_date)}</span>
                </div>
                {story.place_id && (
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    <span>Hartford, Connecticut</span>
                  </div>
                )}
                <div>
                  {getClearanceBadge(story.clearance_mark)}
                </div>
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
                    <span className="italic">Image credit: {story.lead_image.filename}</span>
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
              
              {/* Story Metadata */}
              <Card className="mt-8 mb-6">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Story Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <FileText size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">ID</p>
                        <p className="text-sm text-newswire-mediumGray">{story.id}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Info size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Clearance Mark</p>
                        <p className="text-sm text-newswire-mediumGray">{story.clearance_mark}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Published Date</p>
                        <p className="text-sm text-newswire-mediumGray">{formatDate(story.published_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Updated At</p>
                        <p className="text-sm text-newswire-mediumGray">{formatDate(story.updated_at)}</p>
                      </div>
                    </div>
                    {story.regions && (
                      <div className="flex items-start">
                        <Globe size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Regions</p>
                          <p className="text-sm text-newswire-mediumGray">{story.regions.join(', ')}</p>
                        </div>
                      </div>
                    )}
                    {story.lead_item && (
                      <div className="flex items-start">
                        <Video size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Resource Type</p>
                          <p className="text-sm text-newswire-mediumGray">{story.lead_item.resource_type}</p>
                        </div>
                      </div>
                    )}
                    {story.collection_headline && (
                      <div className="flex items-start">
                        <FileText size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Collection Headline</p>
                          <p className="text-sm text-newswire-mediumGray">{story.collection_headline}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start">
                      <Video size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Video Providing Partner</p>
                        <p className="text-sm text-newswire-mediumGray">{story.video_providing_partner ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
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

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AIOverviewSection from '@/components/ai/AIOverviewSection';
import RecommendedStories from '@/components/news/RecommendedStories';
import { NewsStory } from '@/types/news';
import { formatDate, formatTimeAgo, getRandomInt } from '@/lib/utils';
import { fetchStoryById } from '@/services/newsService';
import { Calendar, MapPin, Share2, Bookmark, Printer, Clock, FileText, Globe, Video, Check, AlertTriangle, Info, Download, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AIAssistant from '@/components/ai/AIAssistant';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

const StoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<NewsStory | null>(null);
  const [recommendedStories, setRecommendedStories] = useState<NewsStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const minutes = getRandomInt(2, 15);
  const seconds = getRandomInt(10, 59);
  const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  useEffect(() => {
    if (slug) {
      setLoading(true);
      setError(null);
      setStory(null);
      setRecommendedStories([]);
    }
  }, [slug]);

  useEffect(() => {
    const fetchStory = async () => {
      if (!slug) return;
      
      try {
        console.log(`Fetching story with slug: ${slug}`);
        
        // Check if slug is a numeric ID
        if (/^\d+$/.test(slug)) {
          console.log(`Slug "${slug}" appears to be a numeric ID, fetching directly by ID`);
          const result = await fetchStoryById(slug);
          if (result) {
            setStory(result.story);
            setRecommendedStories(result.similarStories);
            console.log('Successfully loaded story with ID:', result.story.id, result.story.title);
          }
        } else {
          // Handle non-numeric slugs with a redirect to home page
          console.error('Invalid slug format:', slug);
          setError('Invalid story identifier');
          toast({
            title: "Story not found",
            description: "The requested story could not be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching story:', error);
        setError('Failed to load the story');
        toast({
          title: "Error loading story",
          description: "There was a problem loading the story. Please try again.",
          variant: "destructive",
        });
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
      case 'CLEARED':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1">
            <Check size={12} />
            CLEARED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-1">
            PUBLIC
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="animate-pulse">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                
                <Skeleton className="h-12 w-3/4 mb-2" />
                <Skeleton className="h-12 w-1/2 mb-6" />
                
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-40" />
                </div>
                
                <div className="flex gap-3 mb-6">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-36" />
                  <Skeleton className="h-10 w-24" />
                </div>
                
                <Skeleton className="h-96 w-full mb-6" />
                
                <div className="space-y-3 mb-8">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                
                <Skeleton className="h-64 w-full mb-8" />
                
                <Skeleton className="h-2 w-full mb-8" />
                
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !story) {
    return (
      <Layout>
        <div className="container mx-auto px-4 md:px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Story Not Found</h1>
          <p>{error || "The story you're looking for doesn't exist or has been removed."}</p>
          <Button 
            className="mt-6"
            onClick={() => navigate('/')}
          >
            Return to Homepage
          </Button>
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
                <span>Videos</span>
                <span className="w-1 h-1 bg-newswire-mediumGray rounded-full"></span>
                {story?.categories && story.categories.length > 0 ? (
                  <span>{story.categories.join(', ')}</span>
                ) : (
                  <span>General</span>
                )}
                {story?.regions && story.regions.length > 0 && story.regions[0] !== story?.categories?.[0] && (
                  <>
                    <span className="w-1 h-1 bg-newswire-mediumGray rounded-full"></span>
                    <span>{story.regions[0]}</span>
                  </>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-4">
                {story?.title || `Story #${story?.id || 'Details'}`}
              </h1>
              
              <div className="flex flex-wrap items-center text-sm text-newswire-mediumGray gap-4 mb-3">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{story && story.title_date ? story.title_date : formatDate(story.published_date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{durationString}</span>
                </div>
                {story?.stated_location && (
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    <span>{story.stated_location}</span>
                  </div>
                )}
                <div>
                  {story && getClearanceBadge(story.clearance_mark)}
                </div>
              </div>
              
              <div className="flex gap-3 mb-6">
                <Button 
                  className="bg-newswire-accent hover:bg-newswire-accent/90 flex items-center gap-2"
                  onClick={() => {
                    if (story?.media_url) {
                      window.open(story.media_url, '_blank');
                    } else {
                      toast({
                        title: "Video preview unavailable",
                        description: "This video cannot be previewed at this time.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Play size={16} />
                  Preview Video
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    toast({
                      title: "License request sent",
                      description: `Licensing request for "${story?.title}" has been submitted.`,
                    });
                  }}
                >
                  <Download size={16} />
                  License Content
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Share2 size={14} className="mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Bookmark size={14} className="mr-1" />
                  Save
                </Button>
              </div>
              
              {story?.lead_image && (
                <div className="relative aspect-video w-full overflow-hidden mb-6 bg-newswire-lightGray rounded-lg shadow-md">
                  <img 
                    src={story.lead_image.url} 
                    alt={story.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, replace with a placeholder
                      console.error('Image failed to load:', story.lead_image?.url);
                      e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Video+Preview';
                    }}
                  />
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                    <Clock size={12} className="mr-1" />
                    {durationString}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
                      onClick={() => {
                        if (story.media_url) {
                          window.open(story.media_url, '_blank');
                        } else {
                          toast({
                            title: "Video preview unavailable",
                            description: "This video cannot be previewed at this time.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Play size={40} className="text-newswire-accent ml-1" />
                    </button>
                  </div>
                  {story.lead_image.filename && (
                    <div className="text-sm text-newswire-mediumGray mt-2">
                      <span className="italic">
                        {story.lead_image.filename.startsWith('Video Source:') 
                          ? story.lead_image.filename 
                          : `Video credit: ${story.lead_image.filename}`}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {!story?.lead_image && (
                <div className="relative aspect-video w-full overflow-hidden mb-6 bg-newswire-lightGray rounded-lg shadow-md flex items-center justify-center">
                  <div className="text-newswire-mediumGray">
                    <Video size={48} className="mx-auto mb-2 opacity-30" />
                    <p>Video preview not available</p>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                    <Clock size={12} className="mr-1" />
                    {durationString}
                  </div>
                </div>
              )}
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-2">Video Description</h3>
                {story?.summary && story.summary.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                
                {!story?.summary && (
                  <p className="mb-4 text-lg leading-relaxed text-newswire-mediumGray italic">
                    No description available for this video.
                  </p>
                )}
                
                {story?.extended_summary && story.extended_summary !== story.summary && (
                  <>
                    <h3 className="text-xl font-semibold mb-2 mt-6">Extended Description</h3>
                    {story.extended_summary.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-lg leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </>
                )}
              </div>
              
              <Card className="mt-8 mb-6">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Licensing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <FileText size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Video ID</p>
                        <p className="text-sm text-newswire-mediumGray">{story?.id}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Info size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Clearance Mark</p>
                        <p className="text-sm text-newswire-mediumGray">{story?.clearance_mark}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Published Date</p>
                        <p className="text-sm text-newswire-mediumGray">{story && formatDate(story.published_date)}</p>
                      </div>
                    </div>
                    {story?.title_date && (
                      <div className="flex items-start">
                        <Calendar size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Title Date</p>
                          <p className="text-sm text-newswire-mediumGray">{story.title_date}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start">
                      <Clock size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Updated At</p>
                        <p className="text-sm text-newswire-mediumGray">{story && formatDate(story.updated_at)}</p>
                      </div>
                    </div>
                    {story?.stated_location && (
                      <div className="flex items-start">
                        <MapPin size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-newswire-mediumGray">{story.stated_location}</p>
                        </div>
                      </div>
                    )}
                    {story?.categories && story.categories.length > 0 && (
                      <div className="flex items-start">
                        <FileText size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Categories</p>
                          <p className="text-sm text-newswire-mediumGray">{story.categories.join(', ')}</p>
                        </div>
                      </div>
                    )}
                    {story?.collections && story.collections.length > 0 && (
                      <div className="flex items-start">
                        <FileText size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Collections</p>
                          <p className="text-sm text-newswire-mediumGray">{story.collections.join(', ')}</p>
                        </div>
                      </div>
                    )}
                    {story?.channels && story.channels.length > 0 && (
                      <div className="flex items-start">
                        <FileText size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Channels</p>
                          <p className="text-sm text-newswire-mediumGray">{story.channels.join(', ')}</p>
                        </div>
                      </div>
                    )}
                    {story?.keywords && story.keywords.length > 0 && (
                      <div className="flex items-start">
                        <FileText size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Keywords</p>
                          <p className="text-sm text-newswire-mediumGray">{story.keywords.join(', ')}</p>
                        </div>
                      </div>
                    )}
                    {story?.total_views !== undefined && (
                      <div className="flex items-start">
                        <FileText size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Total Views</p>
                          <p className="text-sm text-newswire-mediumGray">{story.total_views}</p>
                        </div>
                      </div>
                    )}
                    {story?.provider_url && (
                      <div className="flex items-start">
                        <Globe size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Source URL</p>
                          <p className="text-sm text-newswire-mediumGray">
                            <a href={story.provider_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                              {story.provider_url.slice(0, 35)}{story.provider_url.length > 35 ? '...' : ''}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                    {story?.media_url && (
                      <div className="flex items-start">
                        <Video size={18} className="mr-2 text-newswire-mediumGray mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Media URL</p>
                          <p className="text-sm text-newswire-mediumGray">
                            <a href={story.media_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                              View Original Media
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="col-span-2 mt-4">
                      <Button 
                        className="w-full bg-newswire-accent hover:bg-newswire-accent/90"
                        onClick={() => {
                          toast({
                            title: "License request sent",
                            description: `Licensing request for "${story?.title}" has been submitted.`,
                          });
                        }}
                      >
                        <Download className="mr-2" size={16} />
                        License This Video
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Separator className="my-8" />
              
              {story && <AIOverviewSection story={story} isStoryDetail={true} />}
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <RecommendedStories stories={recommendedStories} currentStoryId={story?.id} />
          </div>
        </div>
      </div>
      
      <AIAssistant showAssistantButton={false} />
    </Layout>
  );
};

export default StoryDetail;

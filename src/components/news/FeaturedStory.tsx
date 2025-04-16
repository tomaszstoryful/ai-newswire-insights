
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Check, AlertTriangle, Film, Download, Play, Globe } from 'lucide-react';
import { NewsStory } from '@/types/news';
import { formatDate, formatTimeAgo, getRandomInt } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeaturedStoryProps {
  story: NewsStory;
}

const FeaturedStory: React.FC<FeaturedStoryProps> = ({ story }) => {
  // Generate a random video duration for demo purposes
  const minutes = getRandomInt(2, 15);
  const seconds = getRandomInt(10, 59);
  const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
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

  return (
    <div className="border-b border-newswire-lightGray pb-8 mb-10">
      <Link to={`/story/${story.slug}`} className="group">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <div className="mb-3 flex items-center gap-2">
              {getClearanceBadge(story.clearance_mark)}
              <Badge variant="outline" className="bg-gray-100">Featured</Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4 group-hover:text-newswire-accent transition-colors">
              {story.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4 text-newswire-mediumGray">
              <div className="flex items-center text-xs">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(story.published_date)}</span>
              </div>
              <div className="flex items-center text-xs">
                <Clock size={14} className="mr-1" />
                <span>{durationString}</span>
              </div>
              <div className="flex items-center text-xs">
                <Film size={14} className="mr-1" />
                <span>{story.lead_item?.resource_type || 'video'}</span>
              </div>
            </div>
            
            <p className="text-newswire-darkGray leading-relaxed mb-4 text-base">
              {story.summary.substring(0, 200)}...
            </p>
            
            <div className="flex gap-3 mt-6">
              <Button className="bg-newswire-accent hover:bg-newswire-accent/90 flex items-center gap-2">
                <Play size={16} />
                Preview
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                License Now
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-newswire-lightGray shadow-md group-hover:shadow-lg transition-shadow">
              {story.lead_image && (
                <img 
                  src={story.lead_image.url} 
                  alt={story.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                <Clock size={12} className="mr-1" />
                {durationString}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <Play size={30} className="text-newswire-accent ml-1" />
                </div>
              </div>
              {story.regions && story.regions.length > 0 && (
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                  <Globe size={12} className="mr-1" />
                  {story.regions[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedStory;

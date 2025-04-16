
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Check, AlertTriangle } from 'lucide-react';
import { NewsStory } from '@/types/news';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FeaturedStoryProps {
  story: NewsStory;
}

const FeaturedStory: React.FC<FeaturedStoryProps> = ({ story }) => {
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

  return (
    <div className="border-b border-newswire-lightGray pb-8 mb-8">
      <Link to={`/story/${story.slug}`}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4">
              {story.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center text-xs text-newswire-mediumGray">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(story.published_date)}</span>
              </div>
              <div className="flex items-center text-xs text-newswire-mediumGray">
                <Clock size={14} className="mr-1" />
                <span>{formatTimeAgo(story.published_date)}</span>
              </div>
              <div>
                {getClearanceBadge(story.clearance_mark)}
              </div>
            </div>
            
            <p className="text-newswire-darkGray leading-relaxed mb-4">
              {story.summary.substring(0, 200)}...
            </p>
            <span className="text-newswire-accent font-medium text-sm">
              Continue Reading
            </span>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-video w-full overflow-hidden bg-newswire-lightGray">
              {story.lead_image && (
                <img 
                  src={story.lead_image.url} 
                  alt={story.title} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedStory;

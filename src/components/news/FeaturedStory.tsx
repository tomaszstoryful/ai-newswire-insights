
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
    <div className="border-b border-newswire-lightGray pb-8 mb-10">
      <Link to={`/story/${story.slug}`} className="group">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <div className="mb-3">
              {getClearanceBadge(story.clearance_mark)}
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
                <span>{formatTimeAgo(story.published_date)}</span>
              </div>
            </div>
            
            <p className="text-newswire-darkGray leading-relaxed mb-4 text-base">
              {story.summary.substring(0, 200)}...
            </p>
            <span className="inline-flex items-center text-newswire-accent font-medium text-sm group-hover:underline">
              Continue Reading
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-newswire-lightGray shadow-md group-hover:shadow-lg transition-shadow">
              {story.lead_image && (
                <img 
                  src={story.lead_image.url} 
                  alt={story.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

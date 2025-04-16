
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Check, AlertTriangle, Clock } from 'lucide-react';
import { NewsStory } from '@/types/news';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NewsCardProps {
  story: NewsStory;
  size?: 'small' | 'medium' | 'large';
}

const NewsCard: React.FC<NewsCardProps> = ({ story, size = 'medium' }) => {
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
    <Link to={`/story/${story.slug}`} className="group block">
      <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md h-full">
        <div className={`relative aspect-video overflow-hidden bg-newswire-lightGray`}>
          {story.lead_image && (
            <img 
              src={story.lead_image.url} 
              alt={story.title} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-serif font-semibold leading-tight group-hover:text-newswire-accent ${
              size === 'small' ? 'text-base' : size === 'medium' ? 'text-xl' : 'text-2xl'
            }`}>
              {story.title}
            </h3>
          </div>
          
          {size !== 'small' && (
            <p className="text-newswire-darkGray text-sm line-clamp-2 mb-3">
              {story.summary}
            </p>
          )}
          
          <div className="flex flex-wrap items-center justify-between mt-2">
            <div className="flex items-center text-xs text-newswire-mediumGray">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(story.published_date)}</span>
              <span className="mx-2">•</span>
              <Clock size={14} className="mr-1" />
              <span>{formatTimeAgo(story.published_date)}</span>
            </div>
            
            <div className="mt-2 md:mt-0">
              {getClearanceBadge(story.clearance_mark)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;

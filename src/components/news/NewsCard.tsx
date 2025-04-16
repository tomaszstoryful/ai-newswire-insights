
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Check, AlertTriangle, Clock, Play, Film, Download } from 'lucide-react';
import { NewsStory } from '@/types/news';
import { formatDate, formatTimeAgo, getRandomInt } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NewsCardProps {
  story: NewsStory;
  size?: 'small' | 'medium' | 'large';
}

const NewsCard: React.FC<NewsCardProps> = ({ story, size = 'medium' }) => {
  // Generate a random video duration for demo purposes
  const minutes = getRandomInt(1, 10);
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
    <Link to={`/story/${story.slug}`} className="group block h-full">
      <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md h-full bg-white hover:border-newswire-accent/30">
        <div className={`relative aspect-video overflow-hidden bg-newswire-lightGray`}>
          {story.lead_image && (
            <img 
              src={story.lead_image.url} 
              alt={story.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute top-3 left-3">
            {getClearanceBadge(story.clearance_mark)}
          </div>
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
            <Clock size={12} className="mr-1" />
            {durationString}
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play size={24} className="text-newswire-accent ml-1" />
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className={`font-serif font-semibold leading-tight group-hover:text-newswire-accent transition-colors ${
            size === 'small' ? 'text-base' : size === 'medium' ? 'text-xl' : 'text-2xl'
          }`}>
            {story.title}
          </h3>
          
          {size !== 'small' && (
            <p className="text-newswire-darkGray text-sm line-clamp-2 mt-2 mb-3">
              {story.summary.split('\n')[0]}
            </p>
          )}
          
          <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-newswire-mediumGray">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(story.published_date)}</span>
              <span className="mx-2">•</span>
              <Film size={14} className="mr-1" />
              <span>{story.lead_item?.resource_type || 'video'}</span>
            </div>
            <div className="flex items-center">
              <button className="p-1 rounded-full hover:bg-newswire-lightGray/50 transition-colors">
                <Download size={16} className="text-newswire-mediumGray" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;

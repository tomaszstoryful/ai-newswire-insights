
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { NewsStory } from '@/types/news';
import { formatDate } from '@/lib/utils';

interface NewsCardProps {
  story: NewsStory;
  size?: 'small' | 'medium' | 'large';
}

const NewsCard: React.FC<NewsCardProps> = ({ story, size = 'medium' }) => {
  return (
    <Link to={`/story/${story.slug}`} className="group">
      <div className="flex flex-col h-full">
        <div className={`relative aspect-video overflow-hidden mb-3 bg-newswire-lightGray`}>
          {story.lead_image && (
            <img 
              src={story.lead_image.url} 
              alt={story.title} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          )}
        </div>
        <div>
          <h3 className={`font-serif font-semibold mb-2 leading-tight group-hover:text-newswire-accent ${
            size === 'small' ? 'text-base' : size === 'medium' ? 'text-xl' : 'text-2xl'
          }`}>
            {story.title}
          </h3>
          
          <div className="flex items-center text-xs text-newswire-mediumGray mb-2">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(story.published_date)}</span>
          </div>
          
          {size !== 'small' && (
            <p className="text-newswire-darkGray text-sm line-clamp-3">
              {story.summary}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;

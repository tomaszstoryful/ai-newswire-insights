
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { NewsStory } from '@/types/news';
import { formatDate } from '@/lib/utils';

interface FeaturedStoryProps {
  story: NewsStory;
}

const FeaturedStory: React.FC<FeaturedStoryProps> = ({ story }) => {
  return (
    <div className="border-b border-newswire-lightGray pb-8 mb-8">
      <Link to={`/story/${story.slug}`}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4">
              {story.title}
            </h1>
            <div className="flex items-center text-xs text-newswire-mediumGray mb-3">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(story.published_date)}</span>
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

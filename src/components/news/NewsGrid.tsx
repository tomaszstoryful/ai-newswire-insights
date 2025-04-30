
import React from 'react';
import { NewsStory } from '@/types/news';
import NewsCard from '@/components/news/NewsCard';

interface NewsGridProps {
  videos: NewsStory[];
}

const NewsGrid: React.FC<NewsGridProps> = ({ videos }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <NewsCard 
          key={video.id} 
          story={video} 
          size="medium" 
        />
      ))}
    </div>
  );
};

export default NewsGrid;

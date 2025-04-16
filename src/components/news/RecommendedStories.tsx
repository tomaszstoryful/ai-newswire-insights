
import React from 'react';
import { NewsStory } from '@/types/news';
import { formatDate, getRandomInt } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Clock, Video } from 'lucide-react';

interface RecommendedStoriesProps {
  stories: NewsStory[];
  currentStoryId?: number;
}

const RecommendedStories: React.FC<RecommendedStoriesProps> = ({ stories, currentStoryId }) => {
  // Filter out the current story if it's in the recommended list
  const filteredStories = currentStoryId 
    ? stories.filter(story => story.id !== currentStoryId).slice(0, 5)
    : stories.slice(0, 5);

  return (
    <div className="border border-newswire-lightGray rounded-lg overflow-hidden">
      <div className="bg-newswire-lightGray p-4 border-b border-newswire-lightGray">
        <h3 className="font-display font-bold text-lg">Similar Videos</h3>
      </div>
      <div className="divide-y divide-newswire-lightGray">
        {filteredStories.map((story) => {
          // Generate a random video duration for demo purposes
          const minutes = getRandomInt(1, 8);
          const seconds = getRandomInt(10, 59);
          const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          return (
            <Link 
              key={story.id} 
              to={`/story/${story.slug}`}
              className="block p-4 hover:bg-newswire-lightGray/30 transition-colors"
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 flex-shrink-0 bg-newswire-lightGray overflow-hidden relative rounded">
                  {story.lead_image && (
                    <img 
                      src={story.lead_image.url} 
                      alt={story.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Video size={16} className="text-white" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <Clock size={8} className="mr-0.5" />
                    {durationString}
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">{story.title}</h4>
                  <p className="text-xs text-newswire-mediumGray">
                    {formatDate(story.published_date)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedStories;

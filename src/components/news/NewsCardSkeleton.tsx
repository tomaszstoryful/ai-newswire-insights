
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsCardSkeletonProps {
  size?: 'small' | 'medium' | 'large';
}

const NewsCardSkeleton: React.FC<NewsCardSkeletonProps> = ({ size = 'medium' }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden h-full bg-white">
      <div className="aspect-video overflow-hidden bg-newswire-lightGray">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-5">
        {/* Title */}
        <Skeleton className={`h-6 mb-2 ${size === 'large' ? 'w-full' : 'w-3/4'}`} />
        {size !== 'small' && (
          <>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-3" />
          </>
        )}
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-6 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCardSkeleton;

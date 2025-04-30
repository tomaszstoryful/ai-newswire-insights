
import React from 'react';
import NewsCardSkeleton from '@/components/news/NewsCardSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeletons: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="animate-pulse">
        <div className="h-6 bg-newswire-lightGray rounded w-1/4 mb-4"></div>
        <div className="h-40 bg-newswire-lightGray rounded mb-6"></div>
        <div className="mb-12 flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <NewsCardSkeleton key={i} size="medium" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeletons;

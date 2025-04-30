
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface NoResultsDisplayProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const NoResultsDisplay: React.FC<NoResultsDisplayProps> = ({ onRefresh, isRefreshing }) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium text-newswire-darkGray mb-2">No videos found</h3>
      <p className="text-newswire-mediumGray mb-4">Try adjusting your search criteria or refreshing</p>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw size={14} className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
};

export default NoResultsDisplay;

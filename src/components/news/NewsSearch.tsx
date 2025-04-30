
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, RefreshCw, Search } from 'lucide-react';

interface NewsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const NewsSearch: React.FC<NewsSearchProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onRefresh, 
  isRefreshing 
}) => {
  return (
    <div className="mb-12 flex justify-between items-center">
      <h2 className="text-2xl font-display font-bold">
        Available Videos
      </h2>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-newswire-mediumGray" size={16} />
          <input 
            type="text" 
            placeholder="Search videos..." 
            className="pl-10 pr-4 py-2 border border-newswire-lightGray rounded-md focus:outline-none focus:ring-2 focus:ring-newswire-accent focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
            <Filter size={14} />
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsSearch;

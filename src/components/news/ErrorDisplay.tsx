
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  errorMessage: string;
  onRetry: () => void;
  isRetrying: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, onRetry, isRetrying }) => {
  return (
    <div className="text-center py-12 bg-red-50 rounded-lg">
      <AlertCircle size={40} className="mx-auto text-red-500 mb-2" />
      <h3 className="text-xl font-medium text-red-700 mb-2">{errorMessage}</h3>
      <p className="text-newswire-mediumGray mb-4">Try refreshing the page or check back later</p>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onRetry}
        disabled={isRetrying}
      >
        <RefreshCw size={14} className={`mr-2 ${isRetrying ? "animate-spin" : ""}`} />
        {isRetrying ? "Refreshing..." : "Try Again"}
      </Button>
    </div>
  );
};

export default ErrorDisplay;

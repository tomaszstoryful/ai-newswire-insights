
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import AIOverviewSection from '@/components/ai/AIOverviewSection';
import AIAssistant from '@/components/ai/AIAssistant';
import { useNewsData } from '@/hooks/useNewsData';
import NewsSearch from '@/components/news/NewsSearch';
import ErrorDisplay from '@/components/news/ErrorDisplay';
import NoResultsDisplay from '@/components/news/NoResultsDisplay';
import NewsGrid from '@/components/news/NewsGrid';
import LoadingSkeletons from '@/components/news/LoadingSkeletons';

const Index = () => {
  const navigate = useNavigate();
  const {
    featuredVideo,
    filteredVideos,
    loading,
    searchTerm,
    setSearchTerm,
    loadError,
    isRefreshing,
    fetchVideos
  } = useNewsData();

  const handleManualRefresh = () => {
    console.log('Manual refresh requested');
    fetchVideos(true, true);
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSkeletons />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* AI Insights Section - Only show if featured video exists */}
        {featuredVideo && <AIOverviewSection story={featuredVideo} />}
        
        {/* Search and filter section */}
        <NewsSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
        />
        
        {/* Error state */}
        {loadError && (
          <ErrorDisplay 
            errorMessage={loadError}
            onRetry={handleManualRefresh}
            isRetrying={isRefreshing}
          />
        )}
        
        {/* Empty search results */}
        {!loadError && filteredVideos.length === 0 ? (
          <NoResultsDisplay 
            onRefresh={handleManualRefresh}
            isRefreshing={isRefreshing}
          />
        ) : (
          <NewsGrid videos={filteredVideos} />
        )}
      </div>

      {/* Add AI Assistant component */}
      <AIAssistant showAssistantButton={false} />
    </Layout>
  );
};

export default Index;

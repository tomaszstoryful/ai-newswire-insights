
import React, { useState } from 'react';
import { Bot, MessageSquare, Send, Link, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { NewsStory } from '@/types/news';
import AINewsModal from './AINewsModal';

interface AIOverviewSectionProps {
  story: NewsStory;
  isStoryDetail?: boolean;
}

const AIOverviewSection: React.FC<AIOverviewSectionProps> = ({ story, isStoryDetail = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialModalMessage, setInitialModalMessage] = useState('');

  // Sample trending news data for homepage
  const trendingTopics = [
    { id: 1, title: "Climate Crisis", count: 43, change: "+12%" },
    { id: 2, title: "Tech Innovations", count: 38, change: "+8%" },
    { id: 3, title: "Global Conflicts", count: 31, change: "-3%" },
  ];

  const keyHighlights = [
    { id: 1, title: "Animal Rescues Surge", link: "/category/animal-rescues" },
    { id: 2, title: "Natural Disaster Coverage", link: "/category/disasters" },
    { id: 3, title: "Technological Breakthroughs", link: "/category/technology" },
  ];

  // Story-specific data for story detail page
  const getStoryContext = () => {
    if (story.title.includes("Dog Rescued")) {
      return {
        summary: "Animal rescue operations have become increasingly common in urban areas, with a 28% rise in incidents reported in the last year. This particular rescue in Hartford follows standard firefighter protocols for animal rescue situations.",
        insights: [
          "Hartford Fire Department has responded to 17 animal-related incidents in 2025 so far",
          "Urban animal rescues have increased by 31% nationwide in the past two years",
          "Similar pet escape incidents are most common during spring months when windows are often left open"
        ],
        locationInfo: "Hartford, Connecticut (location of this rescue) ranks 3rd in New England for animal rescue response effectiveness, with specialized training for first responders."
      };
    } else {
      // Generic context for other stories
      return {
        summary: `This story is part of our extensive coverage on ${story.regions?.[0] || "global"} events. Our analysis shows increased media attention on this topic in recent weeks.`,
        insights: [
          `${story.title.split(' ').slice(0, 3).join(' ')} related stories have increased by 24% this quarter`,
          `Similar content has seen high licensing demand from media outlets in ${story.regions?.[0] || "multiple regions"}`,
          "Exclusive footage like this typically generates 37% more licensing interest than standard coverage"
        ],
        locationInfo: story.regions?.[0] ? `This story originates from ${story.regions[0]}, a region currently experiencing heightened media attention.` : "This story covers a topic of global significance with regional implications."
      };
    }
  };

  const storyContext = isStoryDetail ? getStoryContext() : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setInitialModalMessage(inputValue);
      setIsModalOpen(true);
      setInputValue('');
    }
  };

  return (
    <>
      <Card className="border border-newswire-lightGray shadow-md mb-8">
        <div className="bg-gradient-to-r from-newswire-accent/10 to-transparent p-6">
          <div className="flex items-center mb-4">
            <Bot size={24} className="text-newswire-accent mr-3" />
            <h2 className="text-2xl font-display font-bold">
              {isStoryDetail ? "Story Intelligence" : "AI News Intelligence"}
            </h2>
          </div>
          
          {isStoryDetail ? (
            // Content for individual story view
            <div className="mb-6">
              <h3 className="font-medium text-sm uppercase text-newswire-mediumGray mb-2">Story Context & Analysis</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-base">{storyContext?.summary}</p>
              </div>
              
              <div className="mt-4 grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-sm uppercase text-newswire-mediumGray mb-2">Key Insights</h3>
                  <ul className="space-y-2">
                    {storyContext?.insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block w-4 h-4 bg-newswire-accent/20 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                        <span className="text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm uppercase text-newswire-mediumGray mb-2">Location Information</h3>
                  <p className="text-sm">{storyContext?.locationInfo}</p>
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-sm uppercase text-newswire-mediumGray mb-2">Related Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {story.title.toLowerCase().includes("dog") ? (
                        <>
                          <Button variant="outline" size="sm" className="text-xs">Animal Rescue</Button>
                          <Button variant="outline" size="sm" className="text-xs">Emergency Services</Button>
                          <Button variant="outline" size="sm" className="text-xs">Urban News</Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" className="text-xs">{story.regions?.[0] || "Global"}</Button>
                          <Button variant="outline" size="sm" className="text-xs">{story.title.split(' ')[0]}</Button>
                          <Button variant="outline" size="sm" className="text-xs">Latest News</Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Original content for homepage
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="col-span-2">
                <h3 className="font-medium text-sm uppercase text-newswire-mediumGray mb-2">Last 24 Hours Media Insights</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-base">
                    <span className="font-semibold">432 new video stories</span> were added to our platform in the last 24 hours, 
                    with <span className="font-semibold">86 featuring animal-related content</span> similar to the dog rescue. 
                    Animal rescue stories have seen a <span className="text-green-600 font-semibold">28% increase in licensing requests</span> compared 
                    to previous weeks, making them particularly valuable for media outlets.
                  </p>
                </div>
                
                <div className="mt-4 space-y-3">
                  <h3 className="font-medium text-sm uppercase text-newswire-mediumGray">Key Events Worth Licensing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {keyHighlights.map(highlight => (
                      <a 
                        key={highlight.id} 
                        href={highlight.link} 
                        className="flex items-center p-2 hover:bg-newswire-lightGray/50 rounded group"
                      >
                        <Link size={16} className="mr-2 text-newswire-accent" />
                        <span className="text-sm font-medium">{highlight.title}</span>
                        <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-newswire-mediumGray" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-sm uppercase text-newswire-mediumGray mb-2">Trending Topics</h3>
                <div className="space-y-3">
                  {trendingTopics.map(topic => (
                    <div key={topic.id} className="flex justify-between items-center p-2 border-b border-newswire-lightGray last:border-0">
                      <span className="text-sm font-medium">{topic.title}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold">{topic.count} stories</span>
                        <span className={`text-xs ${topic.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {topic.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 border-t border-newswire-lightGray pt-4">
            <div className="flex items-center mb-3">
              <MessageSquare size={18} className="mr-2 text-newswire-accent" />
              <h3 className="font-medium">
                {isStoryDetail 
                  ? "Ask about this story or explore licensing options" 
                  : "Ask about these insights or explore licensing options"}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                className="flex-grow"
                placeholder={isStoryDetail 
                  ? "Ask about this story or licensing options..." 
                  : "Ask about news trends or licensing options..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button type="submit" className="bg-newswire-black text-white hover:bg-newswire-darkGray">
                <Send size={16} />
              </Button>
            </form>
          </div>
          
          <div className="flex justify-between items-center text-xs text-newswire-mediumGray mt-4 pt-2">
            <span>Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <div className="flex items-center gap-2">
              <button className="hover:text-newswire-black flex items-center">
                <ThumbsUp size={14} className="mr-1" />
                <span>Helpful</span>
              </button>
              <button className="hover:text-newswire-black flex items-center">
                <ThumbsDown size={14} className="mr-1" />
                <span>Not helpful</span>
              </button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Full-page Modal */}
      <AINewsModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialMessage={initialModalMessage}
      />
    </>
  );
};

export default AIOverviewSection;

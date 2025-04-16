
import React, { useState } from 'react';
import { Bot, MessageSquare, Send, Link, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AIMessage, NewsStory } from '@/types/news';

interface AIOverviewSectionProps {
  story: NewsStory;
}

const AIOverviewSection: React.FC<AIOverviewSectionProps> = ({ story }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample trending news data
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newUserMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: inputValue.trim(),
        timestamp: new Date(),
      };
      
      setMessages([...messages, newUserMessage]);
      setInputValue('');
      setIsGenerating(true);
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponse: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Based on our news archive analysis, I found 28 similar animal rescue stories from the past month. Emergency responders have been involved in animal rescues 37% more often in urban areas compared to last year. Would you like to see licensing options for similar content?`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsGenerating(false);
      }, 1500);
    }
  };

  return (
    <Card className="border border-newswire-lightGray shadow-md mb-8">
      <div className="bg-gradient-to-r from-newswire-accent/10 to-transparent p-6">
        <div className="flex items-center mb-4">
          <Bot size={24} className="text-newswire-accent mr-3" />
          <h2 className="text-2xl font-display font-bold">AI News Intelligence</h2>
        </div>
        
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
        
        <div className="mt-6 border-t border-newswire-lightGray pt-4">
          <div className="flex items-center mb-3">
            <MessageSquare size={18} className="mr-2 text-newswire-accent" />
            <h3 className="font-medium">Ask about these insights or explore licensing options</h3>
          </div>
          
          <div className="mb-3 max-h-[200px] overflow-y-auto">
            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-newswire-accent text-white' 
                          : 'bg-newswire-lightGray/70 text-newswire-black'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-newswire-lightGray/70">
                      <div className="flex space-x-2">
                        <Skeleton className="h-3 w-3 rounded-full bg-newswire-mediumGray/30" />
                        <Skeleton className="h-3 w-3 rounded-full bg-newswire-mediumGray/30" />
                        <Skeleton className="h-3 w-3 rounded-full bg-newswire-mediumGray/30" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-newswire-mediumGray bg-newswire-lightGray/50 p-3 rounded-lg">
                Ask questions about recent news trends, content licensing options, or specific details about available footage.
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              className="flex-grow"
              placeholder="Ask about news trends or licensing options..."
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
  );
};

export default AIOverviewSection;

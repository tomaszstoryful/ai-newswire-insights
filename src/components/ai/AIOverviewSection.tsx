
import React, { useState } from 'react';
import { Bot, MessageSquare, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIOverview, AIMessage, NewsStory } from '@/types/news';

interface AIOverviewSectionProps {
  story: NewsStory;
}

const AIOverviewSection: React.FC<AIOverviewSectionProps> = ({ story }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [overview, setOverview] = useState<AIOverview>({
    summary: "A dog was rescued by firefighters in Hartford, Connecticut after escaping through an attic window onto the roof of a 2.5-story home. Video footage captured the rescue operation, which occurred around 3:45 pm on April 13. According to officials, the dog was safely retrieved using a ladder truck and suffered no injuries during the incident. District Chief Mario Oquendo Jr. joked about offering the dog a job due to its climbing abilities and comfort on the roof.",
    keyPoints: [
      "Incident occurred on April 13, 2025 in Hartford, Connecticut",
      "Dog escaped through an open attic window onto the main roof",
      "Hartford Fire Department responded and safely rescued the dog",
      "The rescue was captured on video by a witness",
      "The dog suffered no injuries during the incident"
    ],
    relatedTopics: [
      "Pet Safety",
      "Urban Animal Rescues",
      "Emergency Response",
      "Firefighter Operations",
      "Animal Behavior"
    ]
  });

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
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponse: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `This is a simulated response about "${story.title}" related to your query. In a real implementation, this would be connected to Perplexity or another AI service to provide relevant information.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <Card className="border border-newswire-lightGray shadow-sm">
      <CardHeader className="bg-newswire-lightGray/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bot size={20} className="mr-2" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-newswire-lightGray">
          <TabsList className="bg-transparent border-b-0 h-auto p-0">
            <TabsTrigger 
              value="overview" 
              className={`px-4 py-2 border-b-2 font-medium text-sm rounded-none ${
                activeTab === 'overview' 
                  ? 'border-newswire-black text-newswire-black' 
                  : 'border-transparent text-newswire-mediumGray'
              }`}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className={`px-4 py-2 border-b-2 font-medium text-sm rounded-none ${
                activeTab === 'chat' 
                  ? 'border-newswire-black text-newswire-black' 
                  : 'border-transparent text-newswire-mediumGray'
              }`}
            >
              Ask AI
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="p-4 mt-0">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-newswire-darkGray">{overview.summary}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Key Points</h4>
              <ul className="text-sm text-newswire-darkGray space-y-1 list-disc pl-5">
                {overview.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Related Topics</h4>
              <div className="flex flex-wrap gap-2">
                {overview.relatedTopics.map((topic, index) => (
                  <span key={index} className="bg-newswire-lightGray px-2 py-1 text-xs rounded">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-newswire-mediumGray pt-2 border-t border-newswire-lightGray">
              <div className="flex items-center">
                <button className="flex items-center hover:text-newswire-black mr-4">
                  <RefreshCw size={14} className="mr-1" />
                  Refresh
                </button>
                <span>Generated on {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="hover:text-newswire-black">
                  <ThumbsUp size={14} />
                </button>
                <button className="hover:text-newswire-black">
                  <ThumbsDown size={14} />
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="mt-0 flex flex-col h-96">
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-newswire-mediumGray py-8">
                <MessageSquare size={24} className="mx-auto mb-2" />
                <p>Ask questions about this article or related topics</p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-newswire-accent text-white' 
                        : 'bg-newswire-lightGray text-newswire-black'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-newswire-lightGray p-3 flex gap-2">
            <Input
              className="flex-grow"
              placeholder="Ask about this article..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button type="submit" className="bg-newswire-black text-white hover:bg-newswire-darkGray">
              Ask
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AIOverviewSection;


import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, MessageSquare, Code, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAIChat } from '@/hooks/useAIChat';
import { formatDate } from '@/lib/utils';
import { NewsStory } from '@/types/news';
import { Link } from 'react-router-dom';

interface AINewsModalProps {
  open: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const AINewsModal: React.FC<AINewsModalProps> = ({ open, onClose, initialMessage = '' }) => {
  const { 
    messages, 
    appendUserMessage, 
    isGenerating,
    newsResults
  } = useAIChat(initialMessage);
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      appendUserMessage(inputValue);
      setInputValue('');
    }
  };

  // For scrolling news results
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Close when user clicks on news story
  const handleNewsCardClick = () => {
    onClose();
  };

  const MessageContent = ({ content, type }: { content: string; type: 'text' | 'code' | 'loading' }) => {
    if (type === 'loading') {
      return (
        <div className="flex space-x-2">
          <div className="h-2 w-2 bg-newswire-accent/70 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-newswire-accent/70 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-newswire-accent/70 rounded-full animate-bounce"></div>
        </div>
      );
    }
    
    if (type === 'code') {
      return (
        <div className="bg-newswire-black/90 text-newswire-lightGray p-4 rounded-md font-mono text-sm my-2 overflow-x-auto">
          <div className="flex items-center mb-2">
            <Code size={14} className="mr-2" />
            <span className="text-xs text-newswire-accent">Python Code Execution</span>
          </div>
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      );
    }
    
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0" onEscapeKeyDown={onClose}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-newswire-lightGray p-4 flex justify-between items-center bg-gradient-to-r from-newswire-accent/20 to-transparent">
            <div className="flex items-center">
              <Bot size={20} className="text-newswire-accent mr-2" />
              <h2 className="text-xl font-display font-bold">Newswire AI Assistant</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
          
          {/* Chat Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] ${
                    message.role === 'user' 
                      ? 'bg-newswire-accent text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl p-3'
                      : 'bg-newswire-lightGray rounded-tl-xl rounded-tr-xl rounded-br-xl p-3'
                  }`}
                >
                  {message.role === 'assistant' && message.content.includes('```python') ? (
                    <>
                      <MessageContent 
                        content={message.content.split('```python')[0]} 
                        type="text" 
                      />
                      <MessageContent 
                        content={message.content.split('```python')[1].split('```')[0]} 
                        type="code" 
                      />
                      {message.content.split('```')[2] && (
                        <MessageContent 
                          content={message.content.split('```')[2]} 
                          type="text" 
                        />
                      )}
                    </>
                  ) : (
                    <MessageContent content={message.content} type="text" />
                  )}
                  
                  {/* Render news stories for this message */}
                  {message.role === 'assistant' && newsResults.length > 0 && 
                   newsResults[0].messageIndex === index && (
                    <div className="mt-4">
                      <div className="mb-2 text-sm font-medium">Top Stories:</div>
                      <div className="relative">
                        <button 
                          onClick={scrollLeft}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        
                        <div 
                          ref={scrollContainerRef}
                          className="flex overflow-x-auto gap-4 py-2 px-6 hide-scrollbar"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                          {newsResults.map((story, i) => (
                            <Link 
                              key={i} 
                              to={`/story/${story.slug}`}
                              onClick={handleNewsCardClick}
                              className="flex-shrink-0 w-[260px] bg-white rounded-lg shadow border border-newswire-lightGray overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <div className="h-32 bg-newswire-lightGray overflow-hidden">
                                {story.lead_image && (
                                  <img 
                                    src={story.lead_image.url}
                                    alt={story.title}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                  {story.title}
                                </h4>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-newswire-mediumGray">
                                    {formatDate(story.published_date)}
                                  </span>
                                  {story.clearance_mark && (
                                    <Badge 
                                      variant="outline" 
                                      className="text-[9px] h-4 px-1.5 border-newswire-accent text-newswire-accent"
                                    >
                                      {story.clearance_mark}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        
                        <button 
                          onClick={scrollRight}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-newswire-lightGray rounded-tl-xl rounded-tr-xl rounded-br-xl p-3">
                  <MessageContent type="loading" content="" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="border-t border-newswire-lightGray p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Ask about news trends, data analysis, or search for stories..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={isGenerating}>
                <MessageSquare size={16} className="mr-1" />
                Send
              </Button>
            </form>
            <div className="mt-2 text-xs text-newswire-mediumGray">
              <span>The AI can analyze news data with Python code and display interactive results.</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AINewsModal;

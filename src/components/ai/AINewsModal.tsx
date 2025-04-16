
import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, MessageSquare, Code, ChevronRight, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAIChat } from '@/hooks/useAIChat';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  }, [messages, isGenerating, newsResults]);

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

  // Function to find news stories for a specific message index
  const findNewsResults = (messageIndex: number) => {
    return newsResults.filter(story => story.messageIndex === messageIndex);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent 
        className="w-full h-full max-w-none p-0 m-0 border-none rounded-none modal-zoom-in"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          transform: 'translate(0, 0)'
        }}
        onEscapeKeyDown={onClose}
      >
        <DialogTitle className="sr-only">Newswire AI Assistant</DialogTitle>
        <DialogDescription className="sr-only">
          Chat with the Newswire AI Assistant to analyze news data and find stories
        </DialogDescription>
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="border-b border-newswire-lightGray p-4 flex justify-between items-center bg-gradient-to-r from-newswire-accent/20 to-transparent sticky top-0 z-10">
            <div className="flex items-center">
              <Bot size={20} className="text-newswire-accent mr-2" />
              <h2 className="text-xl font-display font-bold">Newswire AI Assistant</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-newswire-lightGray/50 transition-colors">
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          {/* Chat Area - Using ScrollArea for better scrolling behavior */}
          <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-[calc(100vh-8rem)] px-4 py-4">
              <div className="space-y-6 max-w-5xl mx-auto pb-4">
                {messages.map((message, index) => (
                  <React.Fragment key={message.id}>
                    <div 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-50 slide-in-from-bottom-3 duration-300`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div 
                        className={`max-w-[85%] ${
                          message.role === 'user' 
                            ? 'bg-newswire-accent text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl p-3 shadow-sm'
                            : 'bg-newswire-lightGray rounded-tl-xl rounded-tr-xl rounded-br-xl p-3 shadow-sm'
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
                      </div>
                    </div>
                    
                    {/* Render news stories right after the message that references them */}
                    {message.role === 'assistant' && 
                     message.content.includes('Here are some relevant news stories I found') && (
                      <div className="flex justify-start w-full mt-4">
                        {(() => {
                          const relatedNewsResults = findNewsResults(index);
                          
                          if (relatedNewsResults.length === 0) {
                            // If no news stories are found for this message, show a placeholder
                            return (
                              <div className="max-w-[85%] bg-newswire-lightGray rounded-xl p-3 shadow-sm">
                                <p className="text-sm italic text-newswire-mediumGray">Loading news stories...</p>
                              </div>
                            );
                          }
                          
                          return (
                            <div className="w-full animate-in fade-in-50 slide-in-from-bottom-3 duration-300 news-card-animate">
                              <div className="relative">
                                {relatedNewsResults.length > 1 && (
                                  <button 
                                    onClick={scrollLeft}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md transition-all"
                                    aria-label="Scroll left"
                                  >
                                    <ChevronLeft size={20} />
                                  </button>
                                )}
                                
                                <div 
                                  ref={scrollContainerRef}
                                  className="flex overflow-x-auto gap-4 py-2 px-6 hide-scrollbar"
                                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                  {relatedNewsResults.map((story, i) => (
                                    <Link 
                                      key={`story-${story.id}-${i}`}
                                      to={`/story/${story.slug}`}
                                      onClick={handleNewsCardClick}
                                      className="flex-shrink-0 w-[280px] bg-white rounded-lg shadow-md border border-newswire-lightGray overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] news-card-animate"
                                      style={{ animationDelay: `${i * 150}ms` }}
                                    >
                                      <div className="h-36 bg-newswire-lightGray overflow-hidden">
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
                                
                                {relatedNewsResults.length > 1 && (
                                  <button 
                                    onClick={scrollRight}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md transition-all"
                                    aria-label="Scroll right"
                                  >
                                    <ChevronRight size={20} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </React.Fragment>
                ))}
                
                {isGenerating && (
                  <div className="flex justify-start animate-in fade-in-50 slide-in-from-bottom-3 duration-300">
                    <div className="max-w-[85%] bg-newswire-lightGray rounded-tl-xl rounded-tr-xl rounded-br-xl p-3 shadow-sm">
                      <MessageContent type="loading" content="" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>
          
          {/* Input Area */}
          <div className="border-t border-newswire-lightGray p-4 bg-white sticky bottom-0 z-10">
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-5xl mx-auto">
              <Input
                placeholder="Ask about news trends, data analysis, or search for stories..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow shadow-sm"
                autoFocus
              />
              <Button 
                type="submit" 
                disabled={isGenerating}
                className="bg-newswire-accent hover:bg-newswire-accent/90 text-white transition-colors"
              >
                <MessageSquare size={16} className="mr-1" />
                Send
              </Button>
            </form>
            <div className="mt-2 text-xs text-newswire-mediumGray text-center max-w-5xl mx-auto">
              <span>The AI can analyze news data with Python code and display interactive results.</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AINewsModal;

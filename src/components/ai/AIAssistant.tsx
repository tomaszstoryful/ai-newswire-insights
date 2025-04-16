
import React, { useState } from 'react';
import { Bot, X, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AIMessage } from '@/types/news';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Newswire AI assistant. I can help you find articles, summarize content, and answer questions about the news. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);

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
          content: `I'm looking into "${inputValue.trim()}" for you. This is a simulated response and will be connected to a backend service like Perplexity in the future.`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-0 right-4 md:right-8 z-40">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-newswire-black text-white hover:bg-newswire-darkGray"
        >
          <Bot size={20} className="mr-2" />
          <span>AI Assistant</span>
        </Button>
      ) : (
        <Card className="w-full sm:w-96 h-96 shadow-lg border border-newswire-lightGray">
          <div className="flex justify-between items-center p-3 border-b border-newswire-lightGray bg-newswire-lightGray">
            <div className="flex items-center">
              <Bot size={18} className="mr-2" />
              <span className="font-medium">Newswire AI Assistant</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <ChevronDown size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-0 flex flex-col h-[calc(100%-48px)]">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
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
              ))}
            </div>
            
            <form onSubmit={handleSubmit} className="border-t border-newswire-lightGray p-3 flex gap-2">
              <Input
                className="flex-grow"
                placeholder="Ask me anything about the news..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button type="submit" size="icon" className="bg-newswire-black text-white hover:bg-newswire-darkGray">
                <Send size={18} />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;

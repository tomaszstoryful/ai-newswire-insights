
import React, { useState, useEffect } from 'react';
import { Bot, X, ChevronDown, ChevronUp, Send, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AIMessage } from '@/types/news';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Storage key for assistant chat
const STORAGE_KEY = 'newswire_assistant_messages';

interface AIAssistantProps {
  showAssistantButton?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ showAssistantButton = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Initialize messages from localStorage or use default
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        // Parse dates correctly when loading from localStorage
        const parsedMessages = JSON.parse(savedMessages);
        return parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error("Error parsing saved assistant messages:", e);
      }
    }
    
    // Default welcome message
    return [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your Newswire AI assistant. I can help you find articles, summarize content, and answer questions about the news. How can I assist you today?',
        timestamp: new Date(),
      }
    ];
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Add a function to expose opening the assistant
  const openAssistant = () => setIsOpen(true);

  // Add to window object so it can be called from anywhere
  useEffect(() => {
    // @ts-ignore - Add a global function to open the assistant
    window.openAIAssistant = openAssistant;
    
    return () => {
      // @ts-ignore - Clean up when component unmounts
      delete window.openAIAssistant;
    };
  }, []);

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

  const clearChatHistory = () => {
    if (window.confirm("Are you sure you want to clear the chat history? This cannot be undone.")) {
      setMessages([
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Hello! I\'m your Newswire AI assistant. I can help you find articles, summarize content, and answer questions about the news. How can I assist you today?',
          timestamp: new Date(),
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-0 right-4 md:right-8 z-40">
      {!isOpen ? (
        showAssistantButton && (
          <Button 
            onClick={() => setIsOpen(true)}
            className="rounded-full bg-newswire-black text-white hover:bg-newswire-darkGray"
          >
            <Bot size={20} className="mr-2" />
            <span>AI Assistant</span>
          </Button>
        )
      ) : (
        <Card className="w-full sm:w-96 h-96 shadow-lg border border-newswire-lightGray">
          <div className="flex justify-between items-center p-3 border-b border-newswire-lightGray bg-newswire-lightGray">
            <div className="flex items-center">
              <Bot size={18} className="mr-2" />
              <span className="font-medium">Newswire AI Assistant</span>
            </div>
            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={clearChatHistory}>
                    Clear Chat History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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


import { useState, useEffect } from 'react';
import { AIMessage, NewsStory } from '@/types/news';
import { simulatePythonExecution, simulateNewsSearch } from '@/services/aiService';
import { getTrendingStories } from '@/services/newsService';

interface NewsResult extends NewsStory {
  messageId: string; // Changed from messageIndex to messageId for direct linking
}

// Dummy data for news stories
const dummyNewsStories: NewsStory[] = [
  {
    "updated_at": "2025-04-16T06:30:05Z",
    "lead_image": {
      "url": "https://storyful.s3.amazonaws.com/production/stories/322510/original.gif",
      "filename": "original.gif"
    },
    "lead_item": {
      "id": 4415051,
      "media_button": {
        "first_time": true,
        "already_downloaded_by_relative": false,
        "action": "/stories/322510/media/4415051/download?exclude_from_home_page=true&format=json&page=1"
      },
      "resource_type": "video",
      "type": "ItemYoutube"
    },
    "in_trending_collection": false,
    "editorial_updated_at": "2025-04-16T06:30:05Z",
    "collection_headline": "13/04/2025",
    "collection_summary_html": "",
    "id": 322510,
    "title": "Stranded Dog Rescued From Rooftop After Escaping Through Attic Window",
    "slug": "US-CT",
    "published_date": "2025-04-15T20:59:23Z",
    "clearance_mark": "LICENSED",
    "video_providing_partner": false,
    "summary": "Firefighters in Hartford, Connecticut, rescued a dog from the roof of a 2.5-story home on April 13, according to local media, citing officials.\n\nOfficials said the dog escaped through an open attic window and jumped onto the main roof of the home, located on the 200 block of New Park Avenue.\n\nVideo filmed by Kari L Bramhall shows firefighters using a ladder truck to safely retrieve the dog around 3:45 pm on Sunday.\n\nThe dog was not injured, did not fall, and was brought down safely, reports say.\n\n\"Based on his bravery, climbing, and comfort being on that roof, I may have to offer this puppy a job,\" joked Hartford Fire Department District Chief Mario Oquendo Jr.",
    "place_id": "ChIJOThsZkohTIYRhvmYx7ZKWeY",
    "regions": ["North America"]
  },
  {
    "updated_at": "2025-04-16T06:29:57Z",
    "lead_image": {
      "url": "https://storyful.s3.amazonaws.com/production/stories/322529/original.gif",
      "filename": "original.gif"
    },
    "lead_item": {
      "id": 4415228,
      "media_button": {
        "first_time": true,
        "already_downloaded_by_relative": false,
        "action": "/stories/322529/media/4415228/download?exclude_from_home_page=true&format=json&page=1"
      },
      "resource_type": "video",
      "type": "ItemEmbed"
    },
    "in_trending_collection": false,
    "editorial_updated_at": "2025-04-16T06:29:57Z",
    "collection_headline": "April 10 2025",
    "collection_summary_html": "",
    "id": 322529,
    "title": "Karaoke Singer Unwittingly Performs Hit Blink-182 Song in Front of Band Member",
    "slug": "US-CA",
    "published_date": "2025-04-16T05:32:27Z",
    "clearance_mark": "RESTRICTED",
    "video_providing_partner": false,
    "summary": "Blink-182 vocalist and guitarist Tom DeLonge was \"watching, waiting, commiserating\" when a karaoke singer belted out the band's biggest hit in a bar in Indio, California.\n\nThis video shows Monica Polish, (@monicasienkiewicz on TikTok), performing the 1999 song All The Small Things in Neil's Lounge with gusto and to the delight of her friends - blissfully unaware the artist was in the audience.\n\nThe camera then pans to DeLonge who is sitting and watching Polish's rendition.\n\nKyle Goldstein, who goes by @‌WebsiteLandlord on TikTok and recorded the video, told Storyful: \"I saw a girl singing Blink-182 Karaoke at a bar and she had no idea Tom DeLonge was sitting right there.\"\n\nPolish later spoke to DeLonge in the audience, according to further social media posts.",
    "place_id": "ChIJhdffQzX02oARMVAjp83nbBY",
    "regions": ["North America"]
  }
];

// Create local storage keys
const STORAGE_KEYS = {
  MESSAGES: 'newswire_ai_messages',
  NEWS_RESULTS: 'newswire_ai_news_results'
};

export const useAIChat = (initialMessage: string = '') => {
  // Initialize state from localStorage or default values
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (savedMessages) {
      try {
        // Parse dates correctly when loading from localStorage
        const parsedMessages = JSON.parse(savedMessages);
        return parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error("Error parsing saved messages:", e);
      }
    }
    
    // Default welcome message if nothing in localStorage
    return [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your Newswire AI assistant. I can analyze news data, find trends, and answer questions using Python for data analysis. What would you like to know?',
        timestamp: new Date(),
      }
    ];
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Initialize news results from localStorage or empty array
  const [newsResults, setNewsResults] = useState<NewsResult[]>(() => {
    const savedNewsResults = localStorage.getItem(STORAGE_KEYS.NEWS_RESULTS);
    if (savedNewsResults) {
      try {
        return JSON.parse(savedNewsResults);
      } catch (e) {
        console.error("Error parsing saved news results:", e);
      }
    }
    return [];
  });
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);
  
  // Save news results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEWS_RESULTS, JSON.stringify(newsResults));
  }, [newsResults]);
  
  // Handle initial message if provided
  useEffect(() => {
    if (initialMessage && messages.length === 1) { // Only use initialMessage if we're starting fresh
      appendUserMessage(initialMessage);
    }
  }, [initialMessage]);
  
  const appendUserMessage = (content: string) => {
    const newUserMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsGenerating(true);
    
    // Simulate processing user message to determine if Python code is needed
    setTimeout(() => {
      // Check if the message is asking about trending news or needs data analysis
      const needsPythonAnalysis = content.toLowerCase().includes('trend') || 
                                 content.toLowerCase().includes('analyze') || 
                                 content.toLowerCase().includes('calculate') ||
                                 content.toLowerCase().includes('top') ||
                                 content.toLowerCase().includes('stats');
      
      const needsNewsResults = content.toLowerCase().includes('trending') ||
                             content.toLowerCase().includes('top stories') ||
                             content.toLowerCase().includes('popular news') ||
                             content.toLowerCase().includes('latest headlines') ||
                             content.toLowerCase().includes('news') ||
                             content.toLowerCase().includes('stories');
      
      processAIResponse(content, needsPythonAnalysis, needsNewsResults);
    }, 500);
  };
  
  const processAIResponse = async (userMessage: string, needsPythonAnalysis: boolean, needsNewsResults: boolean) => {
    let responseContent = '';
    
    // First part of response
    if (needsPythonAnalysis) {
      responseContent = `I'll analyze this request using Python to process the data.\n\nFirst, let me retrieve the relevant news data and perform some calculations:`;
      
      const initialResponse: AIMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        hasPythonCode: true,  // Flag to indicate that this message has Python code (for collapsible UI)
      };
      
      setMessages(prev => [...prev, initialResponse]);
      
      // "Stream" the Python code execution after a brief delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Execute simulated Python code
      const pythonResult = await simulatePythonExecution(userMessage);
      
      // Update message with Python code result - but now the Python part will be hidden by default
      const updatedContent = responseContent + `\n\n[Python Analysis Results]\n\n${pythonResult.result}`;
      
      const updatedMessage = {
        ...initialResponse,
        content: updatedContent,
        pythonCode: pythonResult.code // Store Python code separately for collapsible section
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === initialResponse.id ? updatedMessage : msg
      ));
      
      // If news results are needed, fetch and add them in a separate message
      if (needsNewsResults) {
        // Create a new message for news stories
        const newsMessage: AIMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Here are some relevant news stories I found:',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newsMessage]);
        
        // Use dummy stories instead of fetching
        const dummyNewsResults = dummyNewsStories.map(story => ({
          ...story,
          messageId: newsMessage.id
        }));
        
        // Add these stories with the message id
        setNewsResults(prev => [...prev, ...dummyNewsResults]);
      }
    } else {
      // Simple response for queries that don't need Python analysis
      responseContent = `Based on the news data in our system, ${
        userMessage.toLowerCase().includes('dog') 
          ? 'I can tell you that animal rescue stories have increased by 32% this quarter. Would you like me to analyze specific aspects of this trend using Python?'
          : 'I can provide insights about this topic. To perform in-depth analysis, I can also use Python to calculate statistics and identify patterns. What specific aspects are you interested in?'
      }`;
      
      const aiResponse: AIMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Simulate streaming by showing response word by word
      let partialContent = '';
      const words = responseContent.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        partialContent += words[i] + ' ';
        const partialResponse = {
          ...aiResponse,
          content: partialContent
        };
        
        setMessages(prev => 
          prev.map(msg => msg.id === aiResponse.id ? partialResponse : msg)
        );
        
        // Pause between words to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // For simple requests, also check if news results are needed
      if (needsNewsResults) {
        // Create a new message for news stories
        const newsMessage: AIMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Here are some relevant news stories I found:',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newsMessage]);
        
        // Use dummy stories directly
        const dummyNewsResults = dummyNewsStories.map(story => ({
          ...story,
          messageId: newsMessage.id
        }));
        
        // Add these stories with the message id
        setNewsResults(prev => [...prev, ...dummyNewsResults]);
      }
    }
    
    setIsGenerating(false);
  };
  
  // Add a function to clear chat history
  const clearChatHistory = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Newswire AI assistant. I can analyze news data, find trends, and answer questions using Python for data analysis. What would you like to know?',
      timestamp: new Date(),
    }]);
    setNewsResults([]);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.NEWS_RESULTS);
  };
  
  return {
    messages,
    appendUserMessage,
    isGenerating,
    newsResults,
    clearChatHistory
  };
};


import { useState, useEffect } from 'react';
import { AIMessage, NewsStory } from '@/types/news';
import { simulatePythonExecution, simulateNewsSearch } from '@/services/aiService';

interface NewsResult extends NewsStory {
  messageIndex: number;
}

export const useAIChat = (initialMessage: string = '') => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Newswire AI assistant. I can analyze news data, find trends, and answer questions using Python for data analysis. What would you like to know?',
      timestamp: new Date(),
    }
  ]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [newsResults, setNewsResults] = useState<NewsResult[]>([]);
  
  // Handle initial message if provided
  useEffect(() => {
    if (initialMessage) {
      appendUserMessage(initialMessage);
    }
  }, []);
  
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
      };
      
      setMessages(prev => [...prev, initialResponse]);
      
      // "Stream" the Python code execution after a brief delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Execute simulated Python code
      const pythonResult = await simulatePythonExecution(userMessage);
      
      // If news results are needed, fetch them
      let newsStoriesMessage = '';
      if (needsNewsResults) {
        // Fetch news stories
        const newsStories = await simulateNewsSearch(userMessage);
        
        // Store these stories with the current message index for proper display
        setNewsResults(prev => [
          ...prev,
          ...newsStories.map(story => ({
            ...story,
            messageIndex: messages.length // This will associate with the AI response message
          }))
        ]);
        
        newsStoriesMessage = '\n\nHere are some relevant news stories I found:';
      }
      
      const updatedMessage = {
        ...initialResponse,
        content: responseContent + `\n\n\`\`\`python\n${pythonResult.code}\n\`\`\`\n\nExecuting the code...\n\n${pythonResult.result}${newsStoriesMessage}`
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === initialResponse.id ? updatedMessage : msg
      ));
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
        
        if (i === 0) {
          setMessages(prev => [...prev, partialResponse]);
        }
        
        // Pause between words to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // For simple requests, also check if news results are needed
      if (needsNewsResults) {
        // Fetch news stories after a brief delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const newsStories = await simulateNewsSearch(userMessage);
        
        // Store these stories with the current message index
        setNewsResults(prev => [
          ...prev,
          ...newsStories.map(story => ({
            ...story,
            messageIndex: messages.length
          }))
        ]);
        
        // Update the message to indicate news stories
        const newsStoriesMessage = '\n\nHere are some relevant news stories I found:';
        const updatedContent = aiResponse.content + newsStoriesMessage;
        
        setMessages(prev => prev.map(msg => 
          msg.id === aiResponse.id ? {...msg, content: updatedContent} : msg
        ));
      }
    }
    
    setIsGenerating(false);
  };
  
  return {
    messages,
    appendUserMessage,
    isGenerating,
    newsResults
  };
};

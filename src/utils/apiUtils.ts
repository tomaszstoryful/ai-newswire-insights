// Handle API request utilities

// Add cache buster to URL to prevent caching
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
};

// Utility function to handle errors with more detailed logging
export const handleErrors = async (response: Response) => {
  if (!response.ok) {
    const statusText = response.statusText || 'Unknown error';
    const message = `HTTP error! Status: ${response.status} ${statusText}`;
    console.error(message);
    
    // Log more details about the response for debugging
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Try to get response text for more context
    try {
      const text = await response.text();
      console.log('Error response body:', text.substring(0, 500)); // Log first 500 chars only
      
      // Check for specific CORS error messages
      if (text.includes('cors') || text.includes('CORS')) {
        console.error('CORS error detected in response');
      }
    } catch (e) {
      console.log('Could not read error response body');
    }
    
    throw new Error(message);
  }
  return response;
};

// Convert to JSON with better error handling
export const toJson = async (response: Response) => {
  try {
    return await response.json();
  } catch (e) {
    console.error('JSON parsing error:', e);
    // Try to log the text that couldn't be parsed
    try {
      const text = await response.text();
      console.log('Failed to parse as JSON:', text.substring(0, 200)); // Log first 200 chars
    } catch (innerError) {
      console.log('Could not read response text');
    }
    throw new Error('Failed to parse response as JSON');
  }
};

// Enhanced list of fetch strategies with more proxy options and better error handling
const fetchStrategies = [
  // Direct fetch with all necessary headers to minimize CORS issues
  async (url: string) => {
    console.log('Trying direct fetch with access-control headers');
    return fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      credentials: 'omit' // Don't send cookies to avoid CORS preflight
    });
  },
  
  // Using fetch with minimal headers
  async (url: string) => {
    console.log('Trying direct fetch with minimal headers');
    return fetch(url, {
      method: 'GET',
      mode: 'cors',
    });
  },
  
  // Using fetch with no-cors mode (limited but may work for some APIs)
  async (url: string) => {
    console.log('Trying no-cors mode fetch');
    return fetch(url, {
      method: 'GET',
      mode: 'no-cors',
    });
  },
  
  // Using allorigins.win proxy (more reliable)
  async (url: string) => {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    console.log('Trying allorigins.win proxy:', proxyUrl);
    return fetch(proxyUrl);
  },
  
  // Using corsproxy.io
  async (url: string) => {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    console.log('Trying corsproxy.io proxy:', proxyUrl);
    return fetch(proxyUrl);
  },
  
  // Using cors-anywhere
  async (url: string) => {
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    console.log('Trying cors-anywhere proxy:', proxyUrl);
    return fetch(proxyUrl);
  },
  
  // Using thingproxy
  async (url: string) => {
    const proxyUrl = `https://thingproxy.freeboard.io/fetch/${url}`;
    console.log('Trying thingproxy proxy:', proxyUrl);
    return fetch(proxyUrl);
  }
];

// Fetch data with multiple strategies and better error handling
export const fetchData = async <T>(endpoint: string, params?: string): Promise<T> => {
  const targetUrl = params ? `${endpoint}${params}` : endpoint;
  console.log(`Starting fetch attempts to: ${targetUrl}`);
  
  // Add cache buster to prevent caching issues
  const urlWithCache = addCacheBuster(targetUrl);
  
  let lastError: Error | null = null;
  
  // Try each strategy in sequence
  for (let i = 0; i < fetchStrategies.length; i++) {
    try {
      // Add a timeout for each fetch attempt
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log(`Fetch strategy ${i} timed out for ${urlWithCache}`);
      }, 15000); // 15-second timeout
      
      const strategy = fetchStrategies[i];
      const response = await strategy(urlWithCache);
      
      clearTimeout(timeoutId); // Clear the timeout
      
      // For no-cors mode, we can't check status or parse JSON, so just return empty array
      if (i === 2) { // Index of the no-cors strategy
        console.log('No-cors mode fetch completed, but response content is opaque');
        return [] as unknown as T;
      }
      
      // Special handling for allorigins.win which returns data in a specific format
      if (i === 3) { // Index of the allorigins.win strategy
        await handleErrors(response);
        const result = await toJson(response);
        
        if (result && typeof result === 'object' && 'contents' in result) {
          console.log('AllOrigins proxy returned data');
          try {
            // Parse the contents string as JSON
            const contents = JSON.parse(result.contents as string);
            return contents as T;
          } catch (e) {
            console.log('AllOrigins returned non-JSON content:', (result.contents as string).substring(0, 100));
            return result.contents as unknown as T;
          }
        }
      }
      
      await handleErrors(response);
      const data = await toJson(response);
      console.log(`Fetch successful via strategy ${i} for: ${targetUrl}`);
      return data as T;
    } catch (error) {
      console.error(`Fetch strategy ${i} failed:`, error);
      lastError = error as Error;
      // Continue to the next strategy
    }
  }
  
  console.error('All fetch strategies failed for:', targetUrl);
  throw new Error(`Failed to fetch data after all attempts: ${lastError?.message || 'Unknown error'}`);
};

// Type definition for story data
export interface Story {
  id: string;
  title: string;
  description?: string;
  publishedAt?: string;
  url?: string;
  // Add other fields as needed based on the API response
}

// Function to fetch stories from the newswire API
export const fetchStories = async (): Promise<Story[]> => {
  try {
    // Use our Vite proxy endpoint to avoid CORS issues
    const response = await fetch('/api/newswire/stories');
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Story[];
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
};

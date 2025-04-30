
// Handle API request utilities

// Add cache buster to URL to prevent caching
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
};

// Utility function to handle errors
export const handleErrors = async (response: Response) => {
  if (!response.ok) {
    const message = `HTTP error! Status: ${response.status}`;
    console.error(message);
    throw new Error(message);
  }
  return response;
};

// List of CORS proxies to try in order
const corsProxies = [
  (url: string) => url, // First try direct access without proxy
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://cors.bridged.cc/${url}`
];

// Fetch data with multiple CORS proxy fallbacks
export const fetchData = async <T>(endpoint: string, params?: string): Promise<T> => {
  const targetUrl = params ? `${endpoint}${params}` : endpoint;
  console.log(`Starting fetch attempts to: ${targetUrl}`);
  
  // Try each proxy in sequence
  for (let i = 0; i < corsProxies.length; i++) {
    const proxyUrl = corsProxies[i](addCacheBuster(targetUrl));
    console.log(`Attempt ${i+1}: Fetching via ${i === 0 ? 'direct connection' : 'proxy'}: ${proxyUrl}`);
    
    try {
      // Add a longer timeout for API requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear the timeout since the request completed
      
      await handleErrors(response);
      const data = await response.json();
      console.log(`Fetch successful via ${i === 0 ? 'direct connection' : 'proxy'} for: ${targetUrl}`);
      return data as T;
    } catch (error) {
      console.error(`Fetch attempt ${i+1} failed:`, error);
      // If this is the last proxy in our list, throw the error
      if (i === corsProxies.length - 1) {
        throw new Error(`All fetch attempts failed for ${targetUrl}: ${(error as Error).message}`);
      }
      // Otherwise continue to the next proxy
      console.log(`Trying next proxy...`);
    }
  }
  
  // This should never execute due to the error handling above, but TypeScript needs it
  throw new Error(`Failed to fetch data after all attempts`);
};

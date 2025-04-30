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

// List of CORS proxies to try in order - adding more proxies and better fallback
const corsProxies = [
  (url: string) => url, // First try direct access without proxy
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://cors.bridged.cc/${url}`,
  (url: string) => `https://cors-anywhere.herokuapp.com/${url}`
];

// Fetch data with multiple CORS proxy fallbacks and better error handling
export const fetchData = async <T>(endpoint: string, params?: string): Promise<T> => {
  const targetUrl = params ? `${endpoint}${params}` : endpoint;
  console.log(`Starting fetch attempts to: ${targetUrl}`);
  
  let lastError: Error | null = null;
  
  // Try each proxy in sequence
  for (let i = 0; i < corsProxies.length; i++) {
    const proxyUrl = corsProxies[i](addCacheBuster(targetUrl));
    console.log(`Attempt ${i+1}: Fetching via ${i === 0 ? 'direct connection' : 'proxy'}: ${proxyUrl}`);
    
    try {
      // Add a longer timeout for API requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Origin': window.location.origin,
          'Referrer-Policy': 'no-referrer-when-downgrade'
        },
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear the timeout since the request completed
      
      await handleErrors(response);
      const data = await response.json();
      console.log(`Fetch successful via ${i === 0 ? 'direct connection' : 'proxy'} for: ${targetUrl}`);
      return data as T;
    } catch (error) {
      console.error(`Fetch attempt ${i+1} failed:`, error);
      lastError = error as Error;
      
      // If this is the last proxy in our list, continue to try the original NewsAPI fallback
      if (i === corsProxies.length - 1) {
        console.error(`All CORS proxies failed`);
        break;
      }
      
      // Otherwise continue to the next proxy
      console.log(`Trying next proxy...`);
    }
  }
  
  // If we've tried all proxies and still failed, try the specific storyful endpoint directly
  // with a different approach as a last resort
  try {
    console.log('Attempting direct API call with modified headers as last resort');
    const directUrl = addCacheBuster(targetUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(directUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': 'XMLHttpRequest'
      },
      mode: 'cors',
      credentials: 'omit',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    await handleErrors(response);
    const data = await response.json();
    console.log('Last resort direct fetch successful!');
    return data as T;
  } catch (error) {
    console.error('Last resort fetch failed:', error);
    throw new Error(`Failed to fetch data after all attempts: ${lastError?.message || 'Unknown error'}`);
  }
};

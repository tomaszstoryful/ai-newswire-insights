
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

// Fetch data directly from the API
export const fetchData = async <T>(endpoint: string, params?: string): Promise<T> => {
  const targetUrl = params ? `${endpoint}${params}` : endpoint;
  console.log(`Attempting direct fetch to: ${addCacheBuster(targetUrl)}`);
  
  try {
    const response = await fetch(addCacheBuster(targetUrl), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
    await handleErrors(response);
    const data = await response.json();
    console.log(`Direct fetch successful: ${targetUrl}`);
    return data as T;
  } catch (error) {
    console.error(`Direct fetch failed: ${error}`);
    throw new Error(`Failed to fetch data: ${(error as Error).message}`);
  }
};

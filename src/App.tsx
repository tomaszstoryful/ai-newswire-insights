
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import StoryDetail from "./pages/StoryDetail";
import NotFound from "./pages/NotFound";
import AIAssistant from "./components/ai/AIAssistant";

// Create a new query client with extremely aggressive settings to prevent stale data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 0, // Consider all data stale immediately
      gcTime: 5 * 60 * 1000, // Cache for 5 minutes (formerly cacheTime)
      retry: 2, // Retry failed requests 2 times
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index key="index-route" />} />
          <Route path="/story/:slug" element={<StoryDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import BookingPage from '@/pages/BookingPage';
import { VoiceProvider } from '@/contexts/VoiceContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VoiceProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/booking" element={<BookingPage />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </VoiceProvider>
    </QueryClientProvider>
  );
}

export default App;

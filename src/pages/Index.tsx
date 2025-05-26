
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrainSearch } from '@/components/TrainSearch';
import { TrainResults, Train } from '@/components/TrainResults';
import { useVoice } from '@/contexts/VoiceContext';

// Mock data for demonstration
const mockTrains: Train[] = [
  {
    id: '1',
    name: 'Express 2001',
    departure: '08:00 AM',
    arrival: '02:30 PM',
    duration: '6h 30m',
    price: 45,
    availableSeats: 23,
    class: 'AC'
  },
  {
    id: '2',
    name: 'Superfast 1234',
    departure: '10:15 AM',
    arrival: '04:45 PM',
    duration: '6h 30m',
    price: 38,
    availableSeats: 8,
    class: 'Non-AC'
  },
  {
    id: '3',
    name: 'Night Express',
    departure: '11:30 PM',
    arrival: '06:00 AM',
    duration: '6h 30m',
    price: 32,
    availableSeats: 45,
    class: 'Sleeper'
  }
];

const Index = () => {
  const [searchResults, setSearchResults] = useState<Train[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const navigate = useNavigate();
  const { speak } = useVoice();

  const handleSearch = (searchParams: any) => {
    console.log('Searching with params:', searchParams);
    // Simulate API call delay
    setTimeout(() => {
      setSearchResults(mockTrains);
      setHasSearched(true);
      speak(`Found ${mockTrains.length} trains for your journey`);
    }, 1000);
  };

  const handleSelectTrain = (train: Train) => {
    setSelectedTrain(train);
    navigate('/booking', { state: { train } });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎙️ Voice Train Booking
          </h1>
          <p className="text-lg text-gray-600">
            Book your train tickets using voice commands or traditional input
          </p>
        </div>

        <TrainSearch onSearch={handleSearch} />
        
        {hasSearched && (
          <div className="animate-fade-in">
            <TrainResults 
              trains={searchResults} 
              onSelectTrain={handleSelectTrain}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { VoiceButton } from './VoiceButton';
import { useVoice } from '@/contexts/VoiceContext';
import { CalendarIcon, Search, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchParams {
  from: string;
  to: string;
  date: Date | undefined;
  passengers: number;
}

interface TrainSearchProps {
  onSearch: (params: SearchParams) => void;
}

export const TrainSearch: React.FC<TrainSearchProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: '',
    to: '',
    date: undefined,
    passengers: 1
  });
  const { speak } = useVoice();

  const handleVoiceInput = (field: keyof SearchParams) => (text: string) => {
    const cleanText = text.toLowerCase().trim();
    
    if (field === 'from' || field === 'to') {
      setSearchParams(prev => ({ ...prev, [field]: cleanText }));
      speak(`${field} station set to ${cleanText}`);
    } else if (field === 'passengers') {
      const number = parseInt(cleanText.match(/\d+/)?.[0] || '1');
      setSearchParams(prev => ({ ...prev, passengers: number }));
      speak(`Number of passengers set to ${number}`);
    }
  };

  const handleSearch = () => {
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      speak('Please fill in all required fields: departure station, destination station, and travel date');
      return;
    }
    
    speak(`Searching trains from ${searchParams.from} to ${searchParams.to} for ${searchParams.passengers} passengers`);
    onSearch(searchParams);
  };

  const swapStations = () => {
    setSearchParams(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
    speak('Stations swapped');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
          🚂 Voice-Enabled Train Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">From Station</label>
            <div className="flex gap-2">
              <Input
                placeholder="Departure station"
                value={searchParams.from}
                onChange={(e) => setSearchParams(prev => ({ ...prev, from: e.target.value }))}
                className="flex-1"
              />
              <VoiceButton onVoiceInput={handleVoiceInput('from')} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">To Station</label>
            <div className="flex gap-2">
              <Input
                placeholder="Destination station"
                value={searchParams.to}
                onChange={(e) => setSearchParams(prev => ({ ...prev, to: e.target.value }))}
                className="flex-1"
              />
              <VoiceButton onVoiceInput={handleVoiceInput('to')} />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={swapStations}
            className="text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftRight className="w-4 h-4 mr-1" />
            Swap
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Travel Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !searchParams.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchParams.date ? format(searchParams.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={searchParams.date}
                  onSelect={(date) => setSearchParams(prev => ({ ...prev, date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Passengers</label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max="9"
                value={searchParams.passengers}
                onChange={(e) => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value) || 1 }))}
                className="flex-1"
              />
              <VoiceButton onVoiceInput={handleVoiceInput('passengers')} />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSearch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          size="lg"
        >
          <Search className="w-5 h-5 mr-2" />
          Search Trains
        </Button>
      </CardContent>
    </Card>
  );
};

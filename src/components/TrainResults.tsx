
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, DollarSign } from 'lucide-react';
import { useVoice } from '@/contexts/VoiceContext';

export interface Train {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  availableSeats: number;
  class: 'AC' | 'Non-AC' | 'Sleeper';
}

interface TrainResultsProps {
  trains: Train[];
  onSelectTrain: (train: Train) => void;
}

export const TrainResults: React.FC<TrainResultsProps> = ({ trains, onSelectTrain }) => {
  const { speak } = useVoice();

  const handleBookTrain = (train: Train) => {
    speak(`Booking ${train.name} departing at ${train.departure} for ${train.price} dollars`);
    onSelectTrain(train);
  };

  if (trains.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No trains found. Please modify your search criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Available Trains</h2>
      {trains.map((train) => (
        <Card key={train.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="text-lg font-semibold">{train.name}</span>
              <Badge variant={train.availableSeats > 10 ? "default" : "destructive"}>
                {train.availableSeats} seats left
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-medium">{train.departure}</p>
                  <p className="text-sm text-gray-500">Departure</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <div>
                  <p className="font-medium">{train.arrival}</p>
                  <p className="text-sm text-gray-500">Arrival</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="font-medium">${train.price}</p>
                  <p className="text-sm text-gray-500">{train.class}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => handleBookTrain(train)}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={train.availableSeats === 0}
              >
                {train.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
              </Button>
            </div>
            
            <div className="mt-3 text-sm text-gray-600">
              <span>Duration: {train.duration}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

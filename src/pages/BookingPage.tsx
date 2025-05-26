
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceButton } from '@/components/VoiceButton';
import { useVoice } from '@/contexts/VoiceContext';
import { ArrowLeft, CreditCard, User } from 'lucide-react';
import { Train } from '@/components/TrainResults';
import { useToast } from '@/hooks/use-toast';

interface PassengerDetails {
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
}

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { speak } = useVoice();
  const { toast } = useToast();
  const train: Train = location.state?.train;

  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails>({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: ''
  });

  const [isBooking, setIsBooking] = useState(false);

  const handleVoiceInput = (field: keyof PassengerDetails) => (text: string) => {
    const cleanText = text.trim();
    setPassengerDetails(prev => ({ ...prev, [field]: cleanText }));
    speak(`${field} set to ${cleanText}`);
  };

  const handleBooking = async () => {
    if (!passengerDetails.name || !passengerDetails.age || !passengerDetails.phone) {
      speak('Please fill in all required fields: name, age, and phone number');
      return;
    }

    setIsBooking(true);
    speak('Processing your booking. Please wait.');

    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false);
      speak('Booking confirmed! Your ticket has been booked successfully.');
      toast({
        title: "Booking Confirmed!",
        description: `Your ticket for ${train.name} has been booked successfully.`,
      });
      
      // Navigate back to home after successful booking
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 3000);
  };

  if (!train) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-lg text-gray-600">No train selected. Please go back and select a train.</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-2xl space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Complete Your Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Train Details Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{train.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Departure:</strong> {train.departure}</p>
                  <p><strong>Arrival:</strong> {train.arrival}</p>
                </div>
                <div>
                  <p><strong>Duration:</strong> {train.duration}</p>
                  <p><strong>Price:</strong> ${train.price}</p>
                </div>
              </div>
            </div>

            {/* Passenger Details Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Passenger Details
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter full name"
                    value={passengerDetails.name}
                    onChange={(e) => setPassengerDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1"
                  />
                  <VoiceButton onVoiceInput={handleVoiceInput('name')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age *</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Age"
                      value={passengerDetails.age}
                      onChange={(e) => setPassengerDetails(prev => ({ ...prev, age: e.target.value }))}
                      className="flex-1"
                    />
                    <VoiceButton onVoiceInput={handleVoiceInput('age')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Gender"
                      value={passengerDetails.gender}
                      onChange={(e) => setPassengerDetails(prev => ({ ...prev, gender: e.target.value }))}
                      className="flex-1"
                    />
                    <VoiceButton onVoiceInput={handleVoiceInput('gender')} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number *</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Phone number"
                    value={passengerDetails.phone}
                    onChange={(e) => setPassengerDetails(prev => ({ ...prev, phone: e.target.value }))}
                    className="flex-1"
                  />
                  <VoiceButton onVoiceInput={handleVoiceInput('phone')} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Email address"
                    value={passengerDetails.email}
                    onChange={(e) => setPassengerDetails(prev => ({ ...prev, email: e.target.value }))}
                    className="flex-1"
                  />
                  <VoiceButton onVoiceInput={handleVoiceInput('email')} />
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </h3>
              <div className="flex justify-between items-center">
                <span>Total Amount:</span>
                <span className="text-2xl font-bold text-green-600">${train.price}</span>
              </div>
            </div>

            <Button
              onClick={handleBooking}
              disabled={isBooking}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
              size="lg"
            >
              {isBooking ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;

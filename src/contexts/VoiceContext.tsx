
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoiceContextType {
  isListening: boolean;
  isSpeaking: boolean;
  startListening: (callback?: (text: string) => void) => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis] = useState<SpeechSynthesis>(window.speechSynthesis);
  const { toast } = useToast();

  const startListening = useCallback((callback?: (text: string) => void) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please try Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();
    
    newRecognition.continuous = false;
    newRecognition.interimResults = false;
    newRecognition.lang = 'en-US';

    newRecognition.onstart = () => {
      setIsListening(true);
      console.log('Voice recognition started');
    };

    newRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice input received:', transcript);
      if (callback) {
        callback(transcript);
      }
    };

    newRecognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast({
        title: "Voice Recognition Error",
        description: "Please try again or check your microphone permissions.",
        variant: "destructive"
      });
      setIsListening(false);
    };

    newRecognition.onend = () => {
      setIsListening(false);
      console.log('Voice recognition ended');
    };

    setRecognition(newRecognition);
    newRecognition.start();
  }, [toast]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  }, [recognition]);

  const speak = useCallback((text: string) => {
    if (synthesis) {
      synthesis.cancel(); // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('Speech synthesis started');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('Speech synthesis ended');
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
      };

      synthesis.speak(utterance);
    }
  }, [synthesis]);

  const stopSpeaking = useCallback(() => {
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  }, [synthesis]);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isSpeaking,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

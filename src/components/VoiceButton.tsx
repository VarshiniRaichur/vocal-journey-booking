
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoice } from '@/contexts/VoiceContext';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  onVoiceInput?: (text: string) => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  onVoiceInput, 
  className,
  size = 'default'
}) => {
  const { isListening, isSpeaking, startListening, stopListening } = useVoice();

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(onVoiceInput);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isListening ? "destructive" : "outline"}
      size={size}
      className={cn(
        "relative transition-all duration-200",
        isListening && "animate-pulse bg-red-500 hover:bg-red-600",
        isSpeaking && "bg-blue-500 hover:bg-blue-600",
        className
      )}
    >
      {isSpeaking ? (
        <Volume2 className="w-4 h-4" />
      ) : isListening ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
      {isListening && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      )}
    </Button>
  );
};

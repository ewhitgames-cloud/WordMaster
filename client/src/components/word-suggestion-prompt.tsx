import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb } from 'lucide-react';

interface WordSuggestionPromptProps {
  word: string;
  onClose: () => void;
}

export function WordSuggestionPrompt({ word, onClose }: WordSuggestionPromptProps) {
  const { toast } = useToast();

  const suggestWord = async () => {
    try {
      const response = await fetch('/api/admin/words/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Word suggestion sent!",
          description: `"${word.toUpperCase()}" has been added to the review queue.`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to suggest word",
          description: data.message
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send word suggestion."
      });
    } finally {
      onClose();
    }
  };

  return (
    <Alert className="border-orange-200 bg-orange-50" data-testid="word-suggestion-prompt">
      <Lightbulb className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          "<strong>{word.toUpperCase()}</strong>" isn't recognized. Want to suggest it as a valid word?
        </span>
        <div className="flex gap-2 ml-4">
          <Button 
            size="sm" 
            onClick={suggestWord}
            data-testid="button-suggest-word"
          >
            Suggest Word
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onClose}
            data-testid="button-dismiss-suggestion"
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface WordExpansionResponse {
  success: boolean;
  totalWords: number;
  message: string;
  categories: string[];
  sampleWords: string[];
  error?: string;
  details?: string;
}

export function WordExpansionButton() {
  const [isExpanding, setIsExpanding] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const handleExpansion = async () => {
    setIsExpanding(true);
    
    try {
      const response = await fetch('/api/word/expand-library', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json() as WordExpansionResponse;

      if (data.success) {
        setExpanded(true);
        toast({
          title: "Word Library Expanded!",
          description: `Activated ${data.totalWords} words from comprehensive built-in library. The game now has access to a much broader English vocabulary!`,
        });
      } else {
        toast({
          title: "Expansion Failed",
          description: data.error || "Failed to expand word library",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to expansion service",
        variant: "destructive",
      });
    } finally {
      setIsExpanding(false);
    }
  };

  if (expanded) {
    return (
      <Button variant="outline" disabled className="text-green-600 border-green-600">
        <Sparkles className="w-4 h-4 mr-2" />
        Expanded Library Active
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleExpansion} 
      disabled={isExpanding}
      variant="outline"
      className="border-blue-500 text-blue-600 hover:bg-blue-50"
    >
      {isExpanding ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Activating Library...
        </>
      ) : (
        <>
          <BookOpen className="w-4 h-4 mr-2" />
          Activate Expanded Library
        </>
      )}
    </Button>
  );
}
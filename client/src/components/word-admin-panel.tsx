import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Plus, Clock } from 'lucide-react';

interface PendingWord {
  word: string;
}

export function WordAdminPanel() {
  const [newWord, setNewWord] = useState('');
  const [pendingWords, setPendingWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load pending words on component mount
  useEffect(() => {
    loadPendingWords();
  }, []);

  const loadPendingWords = async () => {
    try {
      const response = await fetch('/api/admin/words/pending');
      const data = await response.json();
      setPendingWords(data.words || []);
    } catch (error) {
      console.error('Failed to load pending words:', error);
    }
  };

  const addWord = async () => {
    if (!newWord.trim() || newWord.length !== 5) {
      toast({
        variant: "destructive",
        title: "Invalid word",
        description: "Please enter a 5-letter word."
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: newWord.trim() })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Word added!",
          description: `"${data.word}" is now valid for guesses.`
        });
        setNewWord('');
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add word",
          description: data.message
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add word. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveWord = async (word: string) => {
    try {
      const response = await fetch('/api/admin/words/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Word approved!",
          description: `"${word}" has been added to the word list.`
        });
        setPendingWords(prev => prev.filter(w => w !== word));
      } else {
        toast({
          variant: "destructive",
          title: "Failed to approve",
          description: data.message
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve word."
      });
    }
  };

  const rejectWord = async (word: string) => {
    try {
      const response = await fetch('/api/admin/words/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word })
      });

      if (response.ok) {
        toast({
          title: "Word rejected",
          description: `"${word}" has been removed from pending list.`
        });
        setPendingWords(prev => prev.filter(w => w !== word));
      } else {
        const data = await response.json();
        toast({
          variant: "destructive",
          title: "Failed to reject",
          description: data.message
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject word."
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addWord();
    }
  };

  return (
    <div className="space-y-6" data-testid="word-admin-panel">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Word
          </CardTitle>
          <CardDescription>
            Add words directly to the valid guess list. Words will be available immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter 5-letter word"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value.slice(0, 5))}
              onKeyPress={handleKeyPress}
              className="flex-1"
              data-testid="input-new-word"
            />
            <Button 
              onClick={addWord} 
              disabled={isLoading || newWord.length !== 5}
              data-testid="button-add-word"
            >
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {pendingWords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Word Suggestions
              <Badge variant="secondary">{pendingWords.length}</Badge>
            </CardTitle>
            <CardDescription>
              Words suggested by players that need approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingWords.map((word) => (
                <div key={word} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-mono text-lg font-semibold" data-testid={`pending-word-${word}`}>
                    {word}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => approveWord(word)}
                      className="text-green-600 hover:text-green-700"
                      data-testid={`button-approve-${word}`}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectWord(word)}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`button-reject-${word}`}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Custom Word System</CardTitle>
          <CardDescription>
            Words are stored in <code>custom_words.txt</code> and merged with the built-in dictionary.
            All lookups remain O(1) performance with Set-based validation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Words are normalized to uppercase internally</p>
            <p>• Custom words file: <code>custom_words.txt</code> (one word per line)</p>
            <p>• Pending suggestions: <code>pending_words.txt</code></p>
            <p>• All changes take effect immediately</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
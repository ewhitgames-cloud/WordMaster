import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { GameStats, InsertGameResult } from "@shared/schema";
import { calculateScore, isValidWord, getTileState } from "@/lib/game-utils";
import { useToast } from "@/hooks/use-toast";
import { useAudio } from "@/hooks/use-audio";

export function useWordle(challengeMode: boolean = false, dailyChallengeMode: boolean = false, onTimeUp?: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { 
    playKeyPress, 
    playWordSubmit, 
    playCorrectGuess, 
    playWrongGuess, 
    playGameWin, 
    playGameLose, 
    playInvalidWord 
  } = useAudio();
  
  // Game state
  const [grid, setGrid] = useState<string[][]>(Array(6).fill(null).map(() => Array(5).fill('')));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [keyboardState, setKeyboardState] = useState<Record<string, 'default' | 'correct' | 'present' | 'absent'>>({});
  const [targetWord, setTargetWord] = useState('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(challengeMode ? 180 : 0); // 3 minutes for challenge mode
  const [gameEndedByTime, setGameEndedByTime] = useState(false);
  const [evaluatedRows, setEvaluatedRows] = useState<Set<number>>(new Set());
  const [isValidatingWord, setIsValidatingWord] = useState(false);
  const [invalidWord, setInvalidWord] = useState<string>('');
  const [showingInvalidToast, setShowingInvalidToast] = useState(false);

  // Fetch stats
  const { data: stats } = useQuery<GameStats>({
    queryKey: ['/api/stats'],
  });

  // Fetch new word based on mode
  const { data: wordData, refetch: fetchNewWord, error: wordError } = useQuery<{ word: string }>({
    queryKey: dailyChallengeMode ? ['/api/word/daily-challenge'] : ['/api/word', 'current-game'],
    staleTime: Infinity, // Keep the word for the entire game session
    retry: false, // Don't retry if daily challenge already completed
  });

  // Save game result mutation
  const saveResultMutation = useMutation({
    mutationFn: async (result: InsertGameResult) => {
      const response = await apiRequest('POST', '/api/results', result);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });

  // Update stats mutation
  const updateStatsMutation = useMutation({
    mutationFn: async (newStats: Partial<GameStats>) => {
      const response = await apiRequest('POST', '/api/stats', newStats);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });

  // Initialize game with word data or handle daily challenge restrictions
  useEffect(() => {
    // Check daily challenge restriction
    if (dailyChallengeMode) {
      const today = new Date().toISOString().split('T')[0];
      const lastPlayedDaily = localStorage.getItem('lastDailyChallenge');
      
      if (lastPlayedDaily === today) {
        toast({
          title: "Daily Challenge Completed",
          description: "You've already completed today's daily challenge. Come back tomorrow!",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (wordData?.word && !targetWord) {
      setTargetWord(wordData.word);
      setStartTime(Date.now());
      setGameEndedByTime(false);
      console.log('Target word set to:', wordData.word);
      
      // Set timer only once for challenge mode
      if (challengeMode) {
        setTimeRemaining(180);
      }
    }
  }, [wordData, targetWord, challengeMode, dailyChallengeMode, toast]);

  // Challenge mode timer
  useEffect(() => {
    if (challengeMode && gameState === 'playing' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up!
            setGameState('lost');
            setGameEndedByTime(true);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [challengeMode, gameState, timeRemaining, onTimeUp]);



  const updateKeyboardState = useCallback((guess: string, target: string) => {
    const newKeyboardState = { ...keyboardState };
    
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const tileState = getTileState(guess, target, i);
      
      // Convert tile state to keyboard state
      let keyState: 'default' | 'correct' | 'present' | 'absent' = 'default';
      if (tileState === 'correct') keyState = 'correct';
      else if (tileState === 'present') keyState = 'present';
      else if (tileState === 'absent') keyState = 'absent';
      
      // Only update if current state is better than existing
      if (!newKeyboardState[letter] || 
          (keyState === 'correct') ||
          (keyState === 'present' && newKeyboardState[letter] !== 'correct')) {
        newKeyboardState[letter] = keyState;
      }
    }
    
    setKeyboardState(newKeyboardState);
  }, [keyboardState]);

  const onKeyPress = useCallback((key: string) => {
    if (gameState !== 'playing') return;
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
      playKeyPress();
      
      // Don't clear invalid word state when typing - only when deleting
    }
  }, [currentGuess, gameState, playKeyPress]);

  const onBackspace = useCallback(() => {
    if (gameState !== 'playing') return;
    const newGuess = currentGuess.slice(0, -1);
    setCurrentGuess(newGuess);
    
    // Clear invalid word notification when user deletes the last letter (goes below 5 letters)
    if (invalidWord && showingInvalidToast && newGuess.length < 5) {
      setInvalidWord('');
      setShowingInvalidToast(false);
    }
  }, [gameState, currentGuess, invalidWord, showingInvalidToast]);

  const submitResult = async (attempts: number, timeElapsed: number, score: number, won: boolean) => {
    try {
      // Save game result  
      await saveResultMutation.mutateAsync({
        word: targetWord,
        attempts,
        timeElapsed,
        points: score,
        isChallengeMode: challengeMode,
        isWin: won,
      });

      // Mark daily challenge as completed if this was a daily challenge
      if (dailyChallengeMode && won) {
        try {
          const today = new Date().toISOString().split('T')[0];
          localStorage.setItem('lastDailyChallenge', today);
          console.log('Daily challenge marked as completed for:', today);
        } catch (error) {
          console.error('Failed to mark daily challenge as completed:', error);
        }
      }

      // Update stats
      if (stats) {
        const newGuessDistribution = JSON.parse(stats.guessDistribution) as Record<string, number>;
        if (won) {
          newGuessDistribution[attempts.toString()] = (newGuessDistribution[attempts.toString()] || 0) + 1;
        }

        const newCurrentStreak = won ? stats.currentStreak + 1 : 0;
        const newMaxStreak = Math.max(stats.maxStreak, newCurrentStreak);

        await updateStatsMutation.mutateAsync({
          totalGames: stats.totalGames + 1,
          totalWins: stats.totalWins + (won ? 1 : 0),
          currentStreak: newCurrentStreak,
          maxStreak: newMaxStreak,
          totalPoints: stats.totalPoints + score,
          guessDistribution: JSON.stringify(newGuessDistribution),
        });
      }
    } catch (error) {
      console.error('Failed to save game result:', error);
      // Still mark daily challenge as completed even if save fails
      if (dailyChallengeMode && won) {
        try {
          const today = new Date().toISOString().split('T')[0];
          localStorage.setItem('lastDailyChallenge', today);
          console.log('Daily challenge marked as completed (fallback):', today);
        } catch (localStorageError) {
          console.error('Failed to mark daily challenge as completed (fallback):', localStorageError);
        }
      }
    }
  };

  const onEnter = useCallback(async () => {
    if (gameState !== 'playing') return;
    
    if (currentGuess.length !== 5) {
      toast({
        title: "Invalid guess",
        description: "Guess must be 5 letters long",
        variant: "destructive"
      });
      return;
    }

    // Check word validity using official Wordle words
    setIsValidatingWord(true);
    const isValid = isValidWord(currentGuess);
    setIsValidatingWord(false);
    
    // Clear debug logging - validation working correctly
    
    if (!isValid) {
      // Only show the toast if we're not already showing one for this word
      if (!showingInvalidToast || invalidWord !== currentGuess) {
        setInvalidWord(currentGuess);
        setShowingInvalidToast(true);
        playInvalidWord();
        toast({
          title: "Invalid word", 
          description: "Not in official Wordle word list",
          variant: "destructive"
        });
      }
      return;
    }

    // Play word submit sound
    playWordSubmit();

    // Update grid
    const newGrid = [...grid];
    newGrid[currentRow] = currentGuess.split('');
    setGrid(newGrid);
    // Mark this row as evaluated
    setEvaluatedRows(prev => new Set([...Array.from(prev), currentRow]));

    // Update keyboard state (ensure consistent case)
    updateKeyboardState(currentGuess.toUpperCase(), targetWord.toUpperCase());

    // Check win condition (case-insensitive)
    const isWin = currentGuess.toUpperCase() === targetWord.toUpperCase();
    if (isWin) {
      setGameState('won');
      playGameWin();
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      const gameScore = calculateScore(currentRow + 1, timeElapsed, challengeMode);
      setScore(gameScore);
      
      // Save result and update stats
      await submitResult(currentRow + 1, timeElapsed, gameScore, true);
    } else if (currentRow === 5) {
      setGameState('lost');
      playGameLose();
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      await submitResult(6, timeElapsed, 0, false);
    } else {
      setCurrentRow(prev => prev + 1);
      playWrongGuess();
    }

    setCurrentGuess('');
  }, [currentGuess, currentRow, grid, targetWord, startTime, challengeMode, gameState, toast, updateKeyboardState, playWordSubmit, playGameWin, playGameLose, playCorrectGuess, playInvalidWord]);

  // Auto-submit when 5 letters are typed
  useEffect(() => {
    if (currentGuess.length === 5 && gameState === 'playing') {
      const timer = setTimeout(() => {
        onEnter();
      }, 200); // Small delay to allow UI to update

      return () => clearTimeout(timer);
    }
  }, [currentGuess, gameState, onEnter]);

  const resetGame = useCallback(async () => {
    setGrid(Array(6).fill(null).map(() => Array(5).fill('')));
    setCurrentGuess('');
    setCurrentRow(0);
    setGameState('playing');
    setKeyboardState({});
    setScore(0);
    setStartTime(Date.now());
    setTimeRemaining(challengeMode ? 180 : 0);
    setGameEndedByTime(false);
    setEvaluatedRows(new Set());
    
    // Clear the current target word and fetch a new one
    setTargetWord('');
    queryClient.invalidateQueries({ queryKey: ['/api/word', 'current-game'] });
    const { data } = await fetchNewWord();
    if (data?.word) {
      setTargetWord(data.word);
      console.log('🎯 New target word:', data.word);
    }
  }, [fetchNewWord, queryClient]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      if (e.key.match(/[a-zA-Z]/) && e.key.length === 1) {
        onKeyPress(e.key.toUpperCase());
      } else if (e.key === 'Enter') {
        onEnter();
      } else if (e.key === 'Backspace') {
        onBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, onKeyPress, onEnter, onBackspace]);

  return {
    grid,
    currentGuess,
    currentRow,
    gameState,
    keyboardState,
    score,
    targetWord,
    evaluatedRows,
    timeRemaining,
    gameEndedByTime,
    stats: stats || {
      id: '',
      totalGames: 0,
      totalWins: 0,
      currentStreak: 0,
      maxStreak: 0,
      totalPoints: 0,
      guessDistribution: '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0}',
      lastPlayed: null,
      createdAt: new Date(),
    },
    isValidatingWord,
    onKeyPress,
    onEnter,
    onBackspace,
    resetGame,
    submitResult,
    invalidWord,
    clearInvalidWord: () => setInvalidWord(''),
  };
}
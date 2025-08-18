import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { GameStats, InsertGameResult } from "@shared/schema";
import { calculateScore, isValidWord, isValidWordExpanded, TileState, KeyState } from "@/lib/game-utils";
import { useToast } from "@/hooks/use-toast";

export function useWordle(challengeMode: boolean = false) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Game state
  const [grid, setGrid] = useState<string[][]>(Array(6).fill(null).map(() => Array(5).fill('')));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [keyboardState, setKeyboardState] = useState<Record<string, KeyState>>({});
  const [targetWord, setTargetWord] = useState('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [score, setScore] = useState(0);
  const [evaluatedRows, setEvaluatedRows] = useState<Set<number>>(new Set());
  const [invalidWord, setInvalidWord] = useState<string>('');

  // Fetch stats
  const { data: stats } = useQuery<GameStats>({
    queryKey: ['/api/stats'],
  });

  // Fetch new word
  const { data: wordData, refetch: fetchNewWord } = useQuery<{ word: string }>({
    queryKey: ['/api/word'],
    enabled: false,
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

  const updateKeyboardState = (guess: string, target: string) => {
    const newKeyboardState = { ...keyboardState };
    
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      if (target[i] === letter) {
        newKeyboardState[letter] = 'correct';
      } else if (target.includes(letter) && newKeyboardState[letter] !== 'correct') {
        newKeyboardState[letter] = 'present';
      } else if (newKeyboardState[letter] !== 'correct' && newKeyboardState[letter] !== 'present') {
        newKeyboardState[letter] = 'absent';
      }
    }
    
    setKeyboardState(newKeyboardState);
  };

  const onKeyPress = useCallback((key: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess]);

  const onBackspace = useCallback(() => {
    setCurrentGuess(prev => prev.slice(0, -1));
  }, []);

  const onEnter = useCallback(async () => {
    if (currentGuess.length !== 5) {
      toast({
        title: "Invalid guess",
        description: "Guess must be 5 letters long",
        variant: "destructive"
      });
      return;
    }

    if (!isValidWord(currentGuess)) {
      setInvalidWord(currentGuess);
      toast({
        title: "Invalid word",
        description: "Not in word list",
        variant: "destructive"
      });
      return;
    }

    // Update grid
    const newGrid = [...grid];
    newGrid[currentRow] = currentGuess.split('');
    setGrid(newGrid);

    // Mark this row as evaluated
    setEvaluatedRows(prev => {
      const newSet = new Set(prev);
      newSet.add(currentRow);
      return newSet;
    });

    // Update keyboard state
    updateKeyboardState(currentGuess, targetWord);

    // Check win condition
    if (currentGuess === targetWord) {
      setGameState('won');
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      const gameScore = calculateScore(currentRow + 1, timeElapsed, challengeMode);
      setScore(gameScore);
      
      // Save result and update stats
      await submitResult(currentRow + 1, timeElapsed, gameScore, true);
    } else if (currentRow === 5) {
      setGameState('lost');
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      await submitResult(6, timeElapsed, 0, false);
    } else {
      setCurrentRow(prev => prev + 1);
    }

    setCurrentGuess('');
  }, [currentGuess, currentRow, grid, targetWord, startTime, challengeMode, keyboardState, toast]);

  const submitResult = async (attempts: number, timeElapsed: number, points: number, isWin: boolean) => {
    try {
      // Save game result
      await saveResultMutation.mutateAsync({
        word: targetWord,
        attempts,
        timeElapsed,
        points,
        isChallengeMode: challengeMode,
        isWin,
      });

      // Update stats
      if (stats) {
        const newGuessDistribution = JSON.parse(stats.guessDistribution);
        if (isWin) {
          newGuessDistribution[attempts.toString()] = (newGuessDistribution[attempts.toString()] || 0) + 1;
        }

        const newCurrentStreak = isWin ? stats.currentStreak + 1 : 0;
        const newMaxStreak = Math.max(stats.maxStreak, newCurrentStreak);

        await updateStatsMutation.mutateAsync({
          totalGames: stats.totalGames + 1,
          totalWins: stats.totalWins + (isWin ? 1 : 0),
          currentStreak: newCurrentStreak,
          maxStreak: newMaxStreak,
          totalPoints: stats.totalPoints + points,
          guessDistribution: JSON.stringify(newGuessDistribution),
        });
      }
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  };

  const resetGame = useCallback(async () => {
    setGrid(Array(6).fill(null).map(() => Array(5).fill('')));
    setCurrentGuess('');
    setCurrentRow(0);
    setGameState('playing');
    setKeyboardState({});
    setScore(0);
    setStartTime(Date.now());
    setEvaluatedRows(new Set());
    
    // Fetch new word
    const { data } = await fetchNewWord();
    if (data?.word) {
      setTargetWord(data.word);
    }
  }, [fetchNewWord]);

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
    onKeyPress,
    onEnter,
    onBackspace,
    resetGame,
    submitResult,
    invalidWord,
    clearInvalidWord: () => setInvalidWord(''),
  };
}

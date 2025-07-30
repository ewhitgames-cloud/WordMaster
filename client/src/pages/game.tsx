import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import GameGrid from "@/components/game-grid";
import Keyboard from "@/components/keyboard";
import CelebrationModal from "@/components/celebration-modal";
import StatsModal from "@/components/stats-modal";
import MenuModal from "@/components/menu-modal";
import { useWordle } from "@/hooks/use-wordle-simple";
import { Menu, Star, Clock } from "lucide-react";

export default function Game() {
  const { toast } = useToast();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [challengeMode, setChallengeMode] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  
  const {
    grid,
    currentGuess,
    currentRow,
    gameState,
    keyboardState,
    score,
    targetWord,
    evaluatedRows,
    stats,
    onKeyPress,
    onEnter,
    onBackspace,
    resetGame,
    submitResult
  } = useWordle(challengeMode);

  // Challenge mode timer
  useEffect(() => {
    if (challengeMode && gameState === 'playing' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up!
            toast({
              title: "Time's Up!",
              description: "Challenge mode time expired",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [challengeMode, gameState, timeRemaining, toast]);

  // Handle game state changes
  useEffect(() => {
    if (gameState === 'won') {
      setTimeout(() => setShowCelebration(true), 1000);
    } else if (gameState === 'lost') {
      toast({
        title: "Game Over",
        description: `The word was ${targetWord}`,
        variant: "destructive"
      });
    }
  }, [gameState, targetWord, toast]);

  const handleNewGame = () => {
    resetGame();
    setShowCelebration(false);
    setShowStats(false);
    setShowMenu(false);
    if (challengeMode) {
      setTimeRemaining(180);
    }
  };

  const handleToggleChallengeMode = () => {
    setChallengeMode(!challengeMode);
    setTimeRemaining(180);
    handleNewGame();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowMenu(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="button-menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                WordQuest
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <Star className="w-4 h-4 inline mr-1" />
                <span data-testid="text-score">{score}</span>
              </div>
              
              {challengeMode && (
                <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <Clock className="w-4 h-4 inline mr-1" />
                  <span data-testid="text-timer">{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Stats Bar */}
        <motion.div 
          className="bg-white rounded-2xl p-4 mb-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-800" data-testid="text-attempt">{currentRow + 1}</div>
              <div className="text-gray-500">Attempt</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600" data-testid="text-streak">{stats.currentStreak}</div>
              <div className="text-gray-500">Win Streak</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600" data-testid="text-total-points">{stats.totalPoints}</div>
              <div className="text-gray-500">Total Points</div>
            </div>
            <div className="text-center">
              <button 
                onClick={handleToggleChallengeMode}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  challengeMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                data-testid="button-challenge-mode"
              >
                Challenge
              </button>
            </div>
          </div>
        </motion.div>

        {/* Game Grid */}
        <GameGrid 
          grid={grid}
          currentGuess={currentGuess}
          currentRow={currentRow}
          gameState={gameState}
          targetWord={targetWord}
          evaluatedRows={evaluatedRows}
        />

        {/* Keyboard */}
        <Keyboard
          onKeyPress={onKeyPress}
          onEnter={onEnter}
          onBackspace={onBackspace}
          keyboardState={keyboardState}
          disabled={gameState !== 'playing' || (challengeMode && timeRemaining === 0)}
        />
      </main>

      {/* Modals */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        score={score}
        attempts={currentRow + 1}
        challengeMode={challengeMode}
        timeElapsed={challengeMode ? 180 - timeRemaining : 0}
        onPlayAgain={handleNewGame}
        onChallengeMode={handleToggleChallengeMode}
        onViewStats={() => {
          setShowCelebration(false);
          setShowStats(true);
        }}
      />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
      />

      <MenuModal
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onNewGame={handleNewGame}
        onChallengeMode={handleToggleChallengeMode}
        onStats={() => {
          setShowMenu(false);
          setShowStats(true);
        }}
        challengeMode={challengeMode}
      />
    </div>
  );
}

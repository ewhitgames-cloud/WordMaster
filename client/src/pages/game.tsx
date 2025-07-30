import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import GameGrid from "@/components/game-grid";
import Keyboard from "@/components/keyboard";
import CelebrationModal from "@/components/celebration-modal";
import StatsModal from "@/components/stats-modal";
import MenuModal from "@/components/menu-modal";
import { useWordle } from "@/hooks/use-wordle-simple";
import { Menu, Star, Clock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

// Format time as MM:SS
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface GameProps {
  mode?: 'classic' | 'challenge' | 'daily';
}

export default function Game({ mode: propMode }: GameProps = {}) {
  const { toast } = useToast();
  const [location] = useLocation();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Determine game mode from props or URL
  const params = new URLSearchParams(location.split('?')[1] || '');
  const mode = propMode || params.get('mode') || 'classic';
  const challengeMode = mode === 'challenge';
  const dailyChallengeMode = mode === 'daily';
  
  const {
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
    stats,
    onKeyPress,
    onEnter,
    onBackspace,
    resetGame,
    submitResult
  } = useWordle(challengeMode, dailyChallengeMode, () => {
    toast({
      title: "Time's Up!",
      description: "Challenge mode time expired",
      variant: "destructive"
    });
  });

  // Timer is now handled in the hook

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
  };

  // Mode display text
  const getModeText = () => {
    if (dailyChallengeMode) return 'Daily Challenge';
    if (challengeMode) return 'Timed Challenge';
    return 'Classic Game';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-container min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="w-full px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  data-testid="button-home"
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </Button>
              </Link>
              <button 
                onClick={() => setShowMenu(true)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="button-menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <h1 className="font-bold text-lg sm:text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Word Pop! - {getModeText()}
              </h1>
            </div>
            
            <div className="flex items-center space-x-1.5 sm:space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                <span data-testid="text-score">{score}</span>
              </div>
              
              {challengeMode && (
                <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  <span data-testid="text-timer">{formatTime(timeRemaining)}</span>
                </div>
              )}
              
              {dailyChallengeMode && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                  <span data-testid="text-daily-indicator">🔥 DAILY</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-3 py-4 sm:px-4 sm:py-6 max-w-sm sm:max-w-lg mx-auto">
        {/* Stats Bar */}
        <motion.div 
          className="bg-white rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="text-center flex-1">
              <div className="font-semibold text-gray-800" data-testid="text-attempt">{currentRow + 1}</div>
              <div className="text-gray-500 text-xs">Attempt</div>
            </div>
            <div className="text-center flex-1">
              <div className="font-semibold text-green-600" data-testid="text-streak">{stats.currentStreak}</div>
              <div className="text-gray-500 text-xs">Streak</div>
            </div>
            <div className="text-center flex-1">
              <div className="font-semibold text-blue-600" data-testid="text-total-points">{stats.totalPoints}</div>
              <div className="text-gray-500 text-xs">Points</div>
            </div>
            <div className="text-center flex-1">
              <button 
                onClick={() => setShowStats(true)}
                className="font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                data-testid="button-show-stats"
              >
                📊
              </button>
              <div className="text-gray-500 text-xs">Stats</div>
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
        onChallengeMode={() => window.location.href = '/game?mode=challenge'}
        gameEndedByTime={gameEndedByTime}
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
        onChallengeMode={() => window.location.href = '/game?mode=challenge'}
        onStats={() => {
          setShowMenu(false);
          setShowStats(true);
        }}
        challengeMode={challengeMode}
      />
    </div>
  );
}

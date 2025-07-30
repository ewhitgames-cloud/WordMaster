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
    <div className="game-container min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
      </div>

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b-4 border-yellow-400"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-2 sm:p-3 hover:bg-gradient-to-r hover:from-blue-400 hover:to-cyan-400 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  data-testid="button-home"
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <button 
                onClick={() => setShowMenu(true)}
                className="p-2 sm:p-3 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                data-testid="button-menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <motion.h1 
                className="font-bold text-lg sm:text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Word Pop! - {getModeText()}
              </motion.h1>
            </div>
            
            <div className="flex items-center space-x-1.5 sm:space-x-3">
              <motion.div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg border-2 border-white"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                <span data-testid="text-score">{score}</span>
              </motion.div>
              
              {challengeMode && (
                <motion.div 
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg border-2 border-white"
                  animate={{ scale: timeRemaining <= 30 ? [1, 1.2, 1] : [1, 1.05, 1] }}
                  transition={{ duration: timeRemaining <= 30 ? 0.5 : 1.5, repeat: Infinity }}
                >
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  <span data-testid="text-timer">{formatTime(timeRemaining)}</span>
                </motion.div>
              )}
              
              {dailyChallengeMode && (
                <motion.div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg border-2 border-white"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span data-testid="text-daily-indicator">🔥 DAILY</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 w-full px-3 py-4 sm:px-4 sm:py-6 max-w-sm sm:max-w-lg mx-auto relative z-10">
        {/* Stats Bar */}
        <motion.div 
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 shadow-2xl border-4 border-white/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)'
          }}
        >
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <motion.div 
              className="text-center flex-1"
              whileHover={{ scale: 1.1 }}
            >
              <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent" data-testid="text-attempt">{currentRow + 1}</div>
              <div className="text-gray-600 text-xs font-semibold">Attempt</div>
            </motion.div>
            <motion.div 
              className="text-center flex-1"
              whileHover={{ scale: 1.1 }}
            >
              <div className="font-bold text-2xl bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent" data-testid="text-streak">{stats.currentStreak}</div>
              <div className="text-gray-600 text-xs font-semibold">Streak</div>
            </motion.div>
            <motion.div 
              className="text-center flex-1"
              whileHover={{ scale: 1.1 }}
            >
              <div className="font-bold text-2xl bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent" data-testid="text-total-points">{stats.totalPoints}</div>
              <div className="text-gray-600 text-xs font-semibold">Points</div>
            </motion.div>
            <motion.div 
              className="text-center flex-1"
              whileHover={{ scale: 1.1 }}
            >
              <button 
                onClick={() => setShowStats(true)}
                className="font-bold text-lg bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-red-700 transition-all duration-300"
                data-testid="button-show-stats"
              >
                📊
              </button>
              <div className="text-gray-600 text-xs font-semibold">Stats</div>
            </motion.div>
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

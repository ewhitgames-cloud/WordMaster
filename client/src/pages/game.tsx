import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import GameGrid from "@/components/game-grid";
import Keyboard from "@/components/keyboard";
import CelebrationModal from "@/components/celebration-modal";
import StatsModal from "@/components/stats-modal";
import MenuModal from "@/components/menu-modal";
import FontStoreModal from "@/components/font-store-modal";
import HowToPlayModal from "@/components/how-to-play-modal";
import SettingsModal from "@/components/settings-modal";

import { useWordle } from "@/hooks/use-wordle-simple";
import { useSettings } from "@/hooks/use-settings";
import { useAudio } from "@/hooks/use-audio";
import { Menu, Clock, Home, Store, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FontStoreAPI } from "@/components/font-store-modal";
import { useCoins } from "@/components/ad-manager";

// Format time as MM:SS
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface GameProps {
  mode?: 'classic' | 'challenge' | 'daily' | 'blind';
}

export default function Game({ mode: propMode }: GameProps = {}) {
  const { toast } = useToast();
  const [location] = useLocation();
  const { settings, updateSettings } = useSettings();
  const { startBackgroundMusic, stopBackgroundMusic } = useAudio();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showFontStore, setShowFontStore] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [coins, setCoins] = useState(0);
  
  // Determine game mode from props or URL
  const params = new URLSearchParams(location.split('?')[1] || '');
  const mode = propMode || params.get('mode') || 'classic';
  const challengeMode = mode === 'challenge';
  const dailyChallengeMode = mode === 'daily';
  const blindChallengeMode = mode === 'blind';
  
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
    submitResult,
    invalidWord,
    clearInvalidWord
  } = useWordle(challengeMode, dailyChallengeMode, () => {
    toast({
      title: "Time's Up!",
      description: "Challenge mode time expired",
      variant: "destructive"
    });
  });

  // Use the persistent coin system
  const { coins: persistentCoins, addCoins } = useCoins();
  
  
  // Load coin balance on mount and listen for changes
  useEffect(() => {
    const updateCoins = () => setCoins(FontStoreAPI.getState().coins);
    updateCoins();
    
    // Apply stored font styles on game load
    FontStoreAPI.applyStoredStyles();
    
    window.addEventListener('storage', updateCoins);
    return () => window.removeEventListener('storage', updateCoins);
  }, []);

  // Timer is now handled in the hook

  // Handle game state changes and award coins
  useEffect(() => {
    if (gameState === 'won') {
      // Award coins based on performance
      const baseReward = 20;
      const attemptBonus = Math.max(0, (7 - (currentRow + 1)) * 5); // Bonus for fewer attempts
      const timeBonus = challengeMode ? Math.max(0, Math.floor(timeRemaining / 10)) : 0;
      const modeMultiplier = challengeMode ? 1.5 : blindChallengeMode ? 2 : 1;
      
      const totalReward = Math.floor((baseReward + attemptBonus + timeBonus) * modeMultiplier);
      
      FontStoreAPI.addCoins(totalReward);
      setCoins(FontStoreAPI.getState().coins);
      
      // Show celebration modal immediately and also with delay as backup
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(true), 500);
      
      toast({
        title: "Coins Earned!",
        description: `+${totalReward} coins for winning!`,
        duration: 3000,
      });
    } else if (gameState === 'lost') {
      // Small consolation prize
      FontStoreAPI.addCoins(5);
      setCoins(FontStoreAPI.getState().coins);
      
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(true), 500);
      
      toast({
        title: "Game Over",
        description: `The word was ${targetWord} (+5 consolation coins)`,
        variant: "destructive"
      });
    }
  }, [gameState, targetWord, toast, currentRow, challengeMode, blindChallengeMode, timeRemaining]);

  const handleNewGame = () => {
    resetGame();
    setShowCelebration(false);
    setShowStats(false);
    setShowMenu(false);
    setShowFontStore(false);
  };

  // Mode display text
  const getModeText = () => {
    if (dailyChallengeMode) return 'Daily Challenge';
    if (challengeMode) return 'Timed Challenge';
    if (blindChallengeMode) return 'Blind Challenge';
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
      
      {/* Falling letters animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['W', 'O', 'R', 'D', 'S', 'P', 'L', 'A', 'Y', 'F', 'U', 'N'].map((letter, index) => (
          <div
            key={`falling-${letter}-${index}`}
            className="absolute text-6xl font-bold opacity-10 text-white animate-pulse"
            style={{
              left: `${(index * 8.33) % 100}%`,
              top: `-10%`,
              animation: `fall-${index % 4} ${12 + (index % 8)}s linear infinite`,
              animationDelay: `${index * 2}s`,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b-4 border-yellow-400"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full px-2 py-2 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-2 sm:p-3 bg-white/20 text-gray-800 rounded-xl shadow-lg border border-white/30"
                  data-testid="button-home"
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <button 
                onClick={() => setShowMenu(true)}
                className="p-2 sm:p-3 bg-white/20 text-gray-800 rounded-xl shadow-lg border border-white/30"
                data-testid="button-menu"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <motion.h1 
                className="font-bold text-sm sm:text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="hidden sm:inline">Word Pop! - {getModeText()}</span>
                <span className="sm:hidden">Word Pop!</span>
              </motion.h1>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-3">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg border-2 border-white cursor-pointer"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={() => setShowFontStore(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                <span data-testid="text-coins">{persistentCoins}</span>
              </motion.div>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 sm:p-3 bg-white/20 text-gray-800 rounded-xl shadow-lg border border-white/30"
                onClick={() => setShowFontStore(true)}
                data-testid="button-store"
              >
                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              
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
              
              {blindChallengeMode && (
                <motion.div 
                  className="bg-gradient-to-r from-gray-700 to-black text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg border-2 border-white"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span data-testid="text-blind-indicator">👁️ BLIND</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 w-full px-2 py-3 sm:px-4 sm:py-6 max-w-sm sm:max-w-lg mx-auto relative z-10">
        {/* Stats Bar */}
        {/* Blind Challenge Info */}
        {blindChallengeMode && (
          <motion.div 
            className="bg-gradient-to-r from-gray-800 to-black text-white rounded-2xl p-4 mb-4 shadow-2xl border-2 border-white/30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">👁️ BLIND CHALLENGE</div>
              <p className="text-sm opacity-90">
                No keyboard colors shown. Track used letters mentally!
              </p>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 sm:p-5 mb-3 sm:mb-6 shadow-2xl border-4 border-white/50"
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
              <div className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent" data-testid="text-attempt">{currentRow + 1}</div>
              <div className="text-gray-600 text-xs font-semibold">Attempt</div>
            </motion.div>
            <motion.div 
              className="text-center flex-1"
              whileHover={{ scale: 1.1 }}
            >
              <div className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent" data-testid="text-streak">{stats.currentStreak}</div>
              <div className="text-gray-600 text-xs font-semibold">Streak</div>
            </motion.div>
            <motion.div 
              className="text-center flex-1"
              whileHover={{ scale: 1.1 }}
            >
              <div className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent" data-testid="text-coins">{persistentCoins}</div>
              <div className="text-gray-600 text-xs font-semibold">Coins</div>
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
          blindMode={blindChallengeMode}
        />
      </main>

      {/* Modals */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        score={score}
        attempts={currentRow + 1}
        challengeMode={challengeMode}
        blindChallengeMode={blindChallengeMode}
        timeElapsed={challengeMode ? 180 - timeRemaining : 0}
        onPlayAgain={handleNewGame}
        onChallengeMode={() => window.location.href = challengeMode ? '/game' : '/game?mode=challenge'}
        gameEndedByTime={gameEndedByTime}
        onViewStats={() => {
          setShowCelebration(false);
          setShowStats(true);
        }}
        coinsEarned={gameState === 'won' ? Math.floor((20 + Math.max(0, (7 - (currentRow + 1)) * 5) + (challengeMode ? Math.max(0, Math.floor(timeRemaining / 10)) : 0)) * (challengeMode ? 1.5 : blindChallengeMode ? 2 : 1)) : gameState === 'lost' ? 5 : 0}
        onHome={() => window.location.href = '/'}
        targetWord={targetWord}
        won={gameState === 'won'}
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
        onStats={() => {
          setShowMenu(false);
          setShowStats(true);
        }}
        onSettings={() => {
          setShowMenu(false);
          setShowSettings(true);
        }}
        onHowToPlay={() => {
          setShowMenu(false);
          setShowHowToPlay(true);
        }}
        challengeMode={challengeMode}
        blindChallengeMode={blindChallengeMode}
      />

      <FontStoreModal
        isOpen={showFontStore}
        onClose={() => setShowFontStore(false)}
      />

      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      {settings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={updateSettings}
        />
      )}
    </div>
  );
}

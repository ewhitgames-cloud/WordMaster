import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  attempts: number;
  challengeMode: boolean;
  blindChallengeMode?: boolean;
  timeElapsed: number;
  onPlayAgain: () => void;
  onChallengeMode: () => void;
  onViewStats: () => void;
  gameEndedByTime?: boolean;
  coinsEarned?: number;
  onHome: () => void;
  targetWord?: string;
  won: boolean;
}

export default function CelebrationModal({
  isOpen,
  onClose,
  score,
  attempts,
  challengeMode,
  blindChallengeMode = false,
  timeElapsed,
  onPlayAgain,
  onChallengeMode,
  onViewStats,
  gameEndedByTime = false,
  coinsEarned = 0,
  onHome,
  targetWord = '',
  won = true
}: CelebrationModalProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="sr-only">Game Completed</DialogTitle>
            <DialogDescription className="sr-only">
              Congratulations! You completed the word puzzle in {attempts} attempts with a score of {score} points.
            </DialogDescription>
            

            
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center p-6 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl shadow-2xl border-4 border-white/50"
            >
              <motion.div
                animate={{ rotate: won ? [0, 10, -10, 0] : [0] }}
                transition={{ duration: 1, repeat: won ? Infinity : 0 }}
                className="text-6xl mb-4"
              >
                {!won ? '😔' : gameEndedByTime ? '⏰' : blindChallengeMode ? '🔥' : '🎉'}
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                {!won ? 'Game Over!' : blindChallengeMode ? 'Incredible!' : gameEndedByTime ? 'Time\'s Up!' : 'Amazing!'}
              </h2>
              
              {!won && targetWord && (
                <p className="text-white/90 mb-4 text-lg">
                  The word was: <span className="font-bold text-yellow-300">{targetWord}</span>
                </p>
              )}
              
              <p className="text-white/90 mb-6">
                {!won 
                  ? 'Better luck next time!' 
                  : blindChallengeMode 
                    ? `Amazing memory skills! You solved it blind in ${attempts} attempt${attempts !== 1 ? 's' : ''}!`
                    : gameEndedByTime 
                      ? 'Challenge mode completed!' 
                      : `You solved it in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}!`
                }
              </p>

              {/* Score and Coins Display */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-white">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300" data-testid="text-earned-points">{score}</div>
                    <div className="text-sm opacity-90">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300" data-testid="text-earned-coins">+{coinsEarned}</div>
                    <div className="text-sm opacity-90">Coins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300" data-testid="text-completion-time">{formatTime(timeElapsed)}</div>
                    <div className="text-sm opacity-90">Time</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={onPlayAgain}
                    className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 rounded-xl shadow-lg"
                    data-testid="button-play-again"
                  >
                    🎮 Play Again
                  </Button>
                </motion.div>
                
                <div className="grid grid-cols-3 gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={onHome}
                      variant="outline"
                      className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30 font-semibold py-2 rounded-xl text-xs"
                      data-testid="button-home"
                    >
                      🏠 Home
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={onViewStats}
                      variant="outline"
                      className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30 font-semibold py-2 rounded-xl text-xs"
                      data-testid="button-view-stats"
                    >
                      📊 Stats
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={onChallengeMode}
                      variant="outline"
                      className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30 font-semibold py-2 rounded-xl text-xs"
                      data-testid="button-try-challenge"
                    >
                      🏆 Challenge
                    </Button>
                  </motion.div>
                </div>

                {/* Game Mode Selection */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => window.location.href = '/daily'}
                      variant="outline"
                      className="w-full bg-orange-500/30 text-white border-orange-300/30 hover:bg-orange-500/50 font-semibold py-2 rounded-xl text-xs"
                      data-testid="button-daily"
                    >
                      🔥 Daily
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => window.location.href = '/blind'}
                      variant="outline"
                      className="w-full bg-gray-600/30 text-white border-gray-300/30 hover:bg-gray-600/50 font-semibold py-2 rounded-xl text-xs"
                      data-testid="button-blind"
                    >
                      👁️ Blind
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

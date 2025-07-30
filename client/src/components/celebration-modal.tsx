import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  timeElapsed: number;
  onPlayAgain: () => void;
  onChallengeMode: () => void;
  onViewStats: () => void;
  gameEndedByTime?: boolean;
}

export default function CelebrationModal({
  isOpen,
  onClose,
  score,
  attempts,
  challengeMode,
  timeElapsed,
  onPlayAgain,
  onChallengeMode,
  onViewStats,
  gameEndedByTime = false
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
            {showConfetti && (
              <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.3}
              />
            )}
            
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center p-6"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-bold text-3xl text-gray-800 mb-2">Fantastic!</h2>
              <p className="text-gray-600 mb-6">
                You solved it in {attempts} attempt{attempts !== 1 ? 's' : ''}!
              </p>
              
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-4 mb-6">
                <div className="text-2xl font-bold" data-testid="text-earned-points">+{score}</div>
                <div className="text-sm opacity-90">Points Earned</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-semibold text-gray-800" data-testid="text-completion-time">
                    {challengeMode ? formatTime(timeElapsed) : '--'}
                  </div>
                  <div className="text-gray-500">Time</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-semibold text-gray-800" data-testid="text-attempts">{attempts}/6</div>
                  <div className="text-gray-500">Attempts</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={onPlayAgain}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  data-testid="button-play-again"
                >
                  Play Again
                </Button>
                
                <Button 
                  onClick={onChallengeMode}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  data-testid="button-try-challenge"
                >
                  Try Challenge Mode
                </Button>
                
                <Button 
                  onClick={onViewStats}
                  variant="outline"
                  className="w-full"
                  data-testid="button-view-stats"
                >
                  View Stats
                </Button>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

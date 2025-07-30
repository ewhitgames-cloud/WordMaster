import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Calendar, Trophy, BarChart3 } from 'lucide-react';

interface FallingLetter {
  id: string;
  letter: string;
  x: number;
  delay: number;
  finalX: number;
  finalY: number;
  isTitle: boolean;
}

export default function HomePage() {
  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([]);
  const [showContent, setShowContent] = useState(false);

  // Title letters for "WORD POP!"
  const titleLetters = ['W', 'O', 'R', 'D', ' ', 'P', 'O', 'P', '!'];
  
  useEffect(() => {
    // Create falling letters that will settle into the title
    const letters: FallingLetter[] = [];
    const baseY = 120; // Where title should settle
    const letterSpacing = 60;
    const startX = window.innerWidth / 2 - (titleLetters.length * letterSpacing) / 2;

    titleLetters.forEach((letter, index) => {
      if (letter !== ' ') {
        letters.push({
          id: `title-${index}`,
          letter,
          x: Math.random() * window.innerWidth,
          delay: index * 0.2,
          finalX: startX + (index * letterSpacing),
          finalY: baseY,
          isTitle: true
        });
      }
    });

    // Add some decorative letters
    const decorativeLetters = ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N'];
    decorativeLetters.forEach((letter, index) => {
      letters.push({
        id: `deco-${index}`,
        letter,
        x: Math.random() * window.innerWidth,
        delay: 2 + index * 0.1,
        finalX: Math.random() * window.innerWidth,
        finalY: 200 + Math.random() * 300,
        isTitle: false
      });
    });

    setFallingLetters(letters);

    // Show main content after animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 overflow-hidden relative">
      {/* Falling Letters Animation */}
      <AnimatePresence>
        {fallingLetters.map((letter) => (
          <motion.div
            key={letter.id}
            className={`absolute font-bold text-white ${
              letter.isTitle ? 'text-6xl md:text-8xl z-20' : 'text-2xl md:text-4xl z-10 opacity-30'
            }`}
            initial={{
              x: letter.x,
              y: -100,
              rotate: Math.random() * 360,
              scale: 0.5
            }}
            animate={{
              x: letter.finalX,
              y: letter.finalY,
              rotate: 0,
              scale: letter.isTitle ? 1 : 0.8
            }}
            transition={{
              delay: letter.delay,
              duration: 1.5,
              type: "spring",
              stiffness: 60,
              damping: 15
            }}
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
            }}
          >
            {letter.letter}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen px-4 relative z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Spacer for title */}
        <div className="h-32 md:h-40"></div>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-white/90 mb-8 text-center font-medium"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: showContent ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
        >
          The Ultimate Word Guessing Challenge
        </motion.p>

        {/* Game Mode Cards */}
        <motion.div
          className="grid gap-4 w-full max-w-md"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: showContent ? 1 : 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {/* Classic Mode */}
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300">
            <CardContent className="p-6">
              <Link href="/game">
                <Button 
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg"
                  data-testid="button-classic-game"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Classic Game
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Daily Challenge */}
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300">
            <CardContent className="p-6">
              <Link href="/game?mode=daily">
                <Button 
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg"
                  data-testid="button-daily-challenge"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  🔥 Daily Challenge
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Challenge Mode */}
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300">
            <CardContent className="p-6">
              <Link href="/game?mode=challenge">
                <Button 
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
                  data-testid="button-timed-challenge"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  Timed Challenge
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300">
            <CardContent className="p-4">
              <Link href="/stats">
                <Button 
                  variant="ghost" 
                  className="w-full text-white hover:bg-white/20"
                  data-testid="button-view-stats"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Statistics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-white/70 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: showContent ? 1 : 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-sm">
            Guess the word in 6 tries or less!
          </p>
        </motion.div>
      </motion.div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      </div>
    </div>
  );
}
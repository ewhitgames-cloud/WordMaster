import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SettingsModal from '@/components/settings-modal';
import { WordExpansionButton } from '@/components/word-expansion-button';
import { useSettings } from '@/hooks/use-settings';
import { Sparkles, Calendar, Trophy, BarChart3, Settings } from 'lucide-react';

interface FallingLetter {
  id: string;
  letter: string;
  x: number;
  delay: number;
  finalX: number;
  finalY: number;
  isTitle: boolean;
}

interface BackgroundLetter {
  id: string;
  letter: string;
  x: number;
  y: number;
  animationDelay: number;
  animationDuration: number;
}

export default function HomePage() {
  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([]);
  const [backgroundLetters, setBackgroundLetters] = useState<BackgroundLetter[]>([]);
  const [showContent, setShowContent] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { settings, updateSettings } = useSettings();

  // Title letters for "WORD POP!"
  const titleLetters = ['W', 'O', 'R', 'D', ' ', 'P', 'O', 'P', '!'];
  
  useEffect(() => {
    // Create falling letters that will settle into the title
    const letters: FallingLetter[] = [];
    const baseY = 120; // Where title should settle
    const letterSpacing = 85; // Equal spacing between all letters
    const wordSpacing = 120; // Bigger space between WORD and POP!
    
    // Position "WORD" centered over the menu content
    const wordLetters = ['W', 'O', 'R', 'D'];
    const totalTitleWidth = (wordLetters.length - 1) * letterSpacing + wordSpacing + (4 * letterSpacing); // WORD + gap + POP!
    const baseStartX = window.innerWidth / 2 - (totalTitleWidth / 2) + 100; // Move title to the right
    
    wordLetters.forEach((letter, index) => {
      let finalX;
      if (index === 0) {
        // Move W further left for equal spacing
        finalX = baseStartX - 105; // W gets extra space
      } else {
        // O, R, D keep regular spacing from base position
        finalX = baseStartX + ((index - 1) * letterSpacing);
      }
      
      letters.push({
        id: `word-${index}`,
        letter,
        x: Math.random() * window.innerWidth,
        delay: index * 0.2,
        finalX: finalX,
        finalY: baseY,
        isTitle: true
      });
    });

    // Add "POP!" with bigger gap after "WORD"
    const popLetters = ['P', 'O', 'P', '!'];
    const popStartX = baseStartX + (2 * letterSpacing) + wordSpacing; // After "WORD" with big gap
    
    popLetters.forEach((letter, index) => {
      letters.push({
        id: `pop-${index}`,
        letter,
        x: Math.random() * window.innerWidth,
        delay: (wordLetters.length + index) * 0.2,
        finalX: popStartX + (index * letterSpacing),
        finalY: baseY,
        isTitle: true
      });
    });

    setFallingLetters(letters);

    // Create continuous background letters
    const createBackgroundLetters = () => {
      const backgroundLettersList: BackgroundLetter[] = [];
      const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      
      // Create 30 background letters
      for (let i = 0; i < 30; i++) {
        backgroundLettersList.push({
          id: `bg-${i}`,
          letter: allLetters[Math.floor(Math.random() * allLetters.length)],
          x: Math.random() * window.innerWidth,
          y: -100 - Math.random() * 500, // Start above screen
          animationDelay: Math.random() * 10, // Random start time
          animationDuration: 8 + Math.random() * 4, // 8-12 seconds to fall
        });
      }
      
      setBackgroundLetters(backgroundLettersList);
    };

    createBackgroundLetters();

    // Show main content after animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    // Continuously regenerate background letters
    const backgroundInterval = setInterval(() => {
      createBackgroundLetters();
    }, 5000); // New letters every 5 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(backgroundInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 overflow-hidden relative">
      {/* Title Falling Letters Animation */}
      <AnimatePresence>
        {fallingLetters.map((letter) => (
          <motion.div
            key={letter.id}
            className="absolute font-bold text-white text-6xl md:text-8xl z-20"
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
              scale: 1
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

      {/* Continuous Background Letters */}
      <AnimatePresence>
        {backgroundLetters.map((letter) => (
          <motion.div
            key={letter.id}
            className="absolute font-bold text-white/20 text-3xl md:text-5xl z-5 pointer-events-none"
            initial={{
              x: letter.x,
              y: letter.y,
              rotate: Math.random() * 360,
              scale: 0.8
            }}
            animate={{
              x: letter.x + (Math.random() - 0.5) * 100,
              y: window.innerHeight + 100,
              rotate: Math.random() * 360,
              scale: 0.6
            }}
            transition={{
              delay: letter.animationDelay,
              duration: letter.animationDuration,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
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
        <div className="h-48 md:h-56"></div>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-white/90 mb-8 text-center font-medium px-4"
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
              <Link href="/game" data-testid="link-classic-mode">
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
              <Link href="/daily" data-testid="link-daily-challenge">
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
              <Link href="/challenge" data-testid="link-challenge-mode">
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

          {/* Blind Challenge */}
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300">
            <CardContent className="p-6">
              <Link href="/blind" data-testid="link-blind-challenge">
                <Button 
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900 text-white border-0 shadow-lg"
                  data-testid="button-blind-challenge"
                >
                  <span className="mr-2">👁️</span>
                  Blind Challenge
                </Button>
              </Link>
              <p className="text-white/80 text-xs mt-2 text-center">
                Hardcore mode - no keyboard colors!
              </p>
            </CardContent>
          </Card>

          {/* Bottom row with Statistics and Settings */}
          <div className="grid grid-cols-2 gap-4">
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
                    Stats
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300">
              <CardContent className="p-4">
                <Button 
                  variant="ghost" 
                  className="w-full text-white hover:bg-white/20"
                  onClick={() => setShowSettingsModal(true)}
                  data-testid="button-settings"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Word Expansion Feature */}
        <motion.div
          className="mt-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: showContent ? 1 : 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <WordExpansionButton />
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-4 text-white/70 text-center"
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onSettingsChange={updateSettings}
      />
    </div>
  );
}
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import type { GameStats } from '@shared/schema';

export default function StatsPage() {
  const { data: stats, isLoading } = useQuery<GameStats>({
    queryKey: ['/api/stats']
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading statistics...</div>
      </div>
    );
  }

  const winRate = stats ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;
  const avgGuesses = '0'; // We'll calculate this from game results later

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/20" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Your Statistics
          </h1>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="bg-white/20 backdrop-blur-sm border-white/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Games Played
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats?.totalGames || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-sm border-white/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {winRate}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-sm border-white/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Avg Guesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {avgGuesses}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-sm border-white/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats?.totalPoints || 0}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guess Distribution */}
        {stats && stats.guessDistribution && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="bg-white/20 backdrop-blur-sm border-white/30">
              <CardHeader>
                <CardTitle className="text-white">Guess Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((guess) => {
                    const distribution = JSON.parse(stats.guessDistribution);
                    const count = distribution[guess.toString()] || 0;
                    const maxCount = Math.max(...Object.values(distribution).map(v => Number(v)));
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={guess} className="flex items-center gap-4">
                        <span className="text-white font-bold w-4">{guess}</span>
                        <div className="flex-1 bg-white/20 rounded-full h-6 relative overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.6 + guess * 0.1, duration: 0.8 }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Play Again Button */}
        <motion.div
          className="text-center mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link href="/game">
            <Button 
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-bold shadow-lg"
              data-testid="button-play-again"
            >
              Play Again
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
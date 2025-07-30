import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GameStats } from "@shared/schema";
import { X } from "lucide-react";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

export default function StatsModal({ isOpen, onClose, stats }: StatsModalProps) {
  const winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;
  const avgScore = stats.totalGames > 0 ? Math.round(stats.totalPoints / stats.totalGames) : 0;
  
  const guessDistribution = JSON.parse(stats.guessDistribution);
  const maxGuesses = Math.max(...Object.values(guessDistribution));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-bold text-2xl text-gray-800">Your Stats</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-stats"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold" data-testid="text-total-games">{stats.totalGames}</div>
              <div className="text-sm opacity-90">Games Played</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold" data-testid="text-win-rate">{winRate}%</div>
              <div className="text-sm opacity-90">Win Rate</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-semibold text-orange-600" data-testid="text-current-streak">
                {stats.currentStreak} games
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Max Streak</span>
              <span className="font-semibold text-green-600" data-testid="text-max-streak">
                {stats.maxStreak} games
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Score</span>
              <span className="font-semibold text-blue-600" data-testid="text-avg-score">
                {avgScore} pts
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Points</span>
              <span className="font-semibold text-purple-600" data-testid="text-total-points-stats">
                {stats.totalPoints.toLocaleString()} pts
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Guess Distribution</h3>
            <div className="space-y-2">
              {Object.entries(guessDistribution).map(([attempts, count]) => (
                <div key={attempts} className="flex items-center space-x-2">
                  <div className="w-4 text-xs text-gray-600">{attempts}</div>
                  <div className="flex-1 bg-gray-200 rounded h-4 overflow-hidden">
                    <div
                      className="bg-green-500 h-full transition-all duration-500"
                      style={{ width: maxGuesses > 0 ? `${(count / maxGuesses) * 100}%` : '0%' }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 w-6 text-right">{count}</div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            data-testid="button-continue-playing"
          >
            Continue Playing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

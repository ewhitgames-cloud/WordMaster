import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Clock, BarChart3, Settings, HelpCircle } from "lucide-react";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onChallengeMode: () => void;
  onStats: () => void;
  challengeMode: boolean;
  blindChallengeMode?: boolean;
}

export default function MenuModal({ 
  isOpen, 
  onClose, 
  onNewGame, 
  onChallengeMode, 
  onStats,
  challengeMode,
  blindChallengeMode = false
}: MenuModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl text-gray-800">Game Menu</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-3">
          <Button 
            onClick={onNewGame}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 flex items-center justify-center space-x-2"
            data-testid="button-new-game"
          >
            <Play className="w-4 h-4" />
            <span>New Game</span>
          </Button>
          
          <Button 
            onClick={onChallengeMode}
            className={`w-full flex items-center justify-center space-x-2 ${
              challengeMode 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
            }`}
            data-testid="button-challenge-mode-menu"
          >
            <Clock className="w-4 h-4" />
            <span>{challengeMode ? 'Exit Timed Challenge' : 'Timed Challenge'}</span>
          </Button>

          <Button 
            onClick={onStats}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            data-testid="button-statistics"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistics</span>
          </Button>

          <Button 
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            data-testid="button-settings"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>

          <Button 
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            data-testid="button-help"
          >
            <HelpCircle className="w-4 h-4" />
            <span>How to Play</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

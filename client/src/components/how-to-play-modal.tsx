import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-bold text-2xl text-gray-800">How to Play</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-help"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Game Rules</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Guess the 5-letter word in 6 attempts</li>
              <li>• Each guess must be a valid English word</li>
              <li>• Colors will show how close your guess was</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Color Guide</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">
                  W
                </div>
                <span className="text-sm">Green: Letter is correct and in the right position</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-white font-bold text-sm">
                  O
                </div>
                <span className="text-sm">Yellow: Letter is in the word but wrong position</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <span className="text-sm">Gray: Letter is not in the word</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Game Modes</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>Classic:</strong> Standard Wordle gameplay</li>
              <li>• <strong>Timed Challenge:</strong> Complete within 3 minutes for bonus points</li>
              <li>• <strong>Daily Challenge:</strong> One special word per day</li>
              <li>• <strong>Blind Challenge:</strong> No keyboard color hints</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Scoring</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Fewer guesses = higher score</li>
              <li>• Timed challenges give bonus points</li>
              <li>• Earn coins to buy fonts and colors</li>
              <li>• Build streaks for extra rewards</li>
            </ul>
          </div>

          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            data-testid="button-start-playing"
          >
            Start Playing!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
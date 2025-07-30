import { motion } from "framer-motion";
import { TileState, getTileState } from "@/lib/game-utils";

interface GameGridProps {
  grid: string[][];
  currentGuess: string;
  currentRow: number;
  gameState: 'playing' | 'won' | 'lost';
  targetWord: string;
  evaluatedRows: Set<number>;
}

export default function GameGrid({ grid, currentGuess, currentRow, gameState, targetWord, evaluatedRows }: GameGridProps) {

  const getTileStateForPosition = (rowIndex: number, colIndex: number): TileState => {
    // Current row with user input
    if (rowIndex === currentRow && gameState === 'playing') {
      if (colIndex < currentGuess.length) {
        return 'current';
      }
      return 'empty';
    }
    
    // Completed/evaluated rows
    const row = grid[rowIndex];
    if (row && row[colIndex] && evaluatedRows.has(rowIndex)) {
      return getTileState(row.join(''), targetWord, colIndex);
    }
    
    // Empty state
    return 'empty';
  };

  const getTileClass = (state: TileState) => {
    switch (state) {
      case 'correct': return 'tile tile-correct';
      case 'present': return 'tile tile-present';
      case 'absent': return 'tile tile-absent';
      case 'current': return 'tile tile-current';
      default: return 'tile tile-empty';
    }
  };

  return (
    <div className="mb-4 sm:mb-6">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full max-w-[280px] sm:max-w-xs mx-auto">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          Array.from({ length: 5 }).map((_, colIndex) => {
            const state = getTileStateForPosition(rowIndex, colIndex);
            let letter = '';
            
            // Get the letter for this position
            if (rowIndex === currentRow && colIndex < currentGuess.length) {
              // Current row being typed
              letter = currentGuess[colIndex];
            } else if (grid[rowIndex] && grid[rowIndex][colIndex]) {
              // Previously submitted rows
              letter = grid[rowIndex][colIndex];
            }
            
            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={getTileClass(state)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: (rowIndex * 5 + colIndex) * 0.02 
                }}
                whileHover={{ scale: 1.05 }}
                data-testid={`tile-${rowIndex}-${colIndex}`}
              >
                <span className="font-bold text-lg select-none uppercase">
                  {letter}
                </span>
              </motion.div>
            );
          })
        ))}
      </div>
    </div>
  );
}

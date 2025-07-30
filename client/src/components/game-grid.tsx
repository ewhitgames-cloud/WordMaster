import { motion } from "framer-motion";
import { TileState } from "@/lib/game-utils";

interface GameGridProps {
  grid: string[][];
  currentGuess: string;
  currentRow: number;
  gameState: 'playing' | 'won' | 'lost';
}

export default function GameGrid({ grid, currentGuess, currentRow, gameState }: GameGridProps) {
  const getTileState = (rowIndex: number, colIndex: number): TileState => {
    const row = grid[rowIndex];
    if (!row || !row[colIndex]) {
      if (rowIndex === currentRow && colIndex < currentGuess.length) {
        return 'current';
      }
      return 'empty';
    }
    
    // For completed rows, determine the state based on the target word
    // This would normally come from the game logic
    return row[colIndex] === grid[0]?.[colIndex] ? 'correct' : 
           grid[0]?.includes(row[colIndex]) ? 'present' : 'absent';
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
    <div className="mb-6">
      <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          Array.from({ length: 5 }).map((_, colIndex) => {
            const state = getTileState(rowIndex, colIndex);
            const letter = rowIndex === currentRow && colIndex < currentGuess.length
              ? currentGuess[colIndex]
              : grid[rowIndex]?.[colIndex] || '';
            
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
                <motion.span
                  key={letter}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {letter}
                </motion.span>
              </motion.div>
            );
          })
        ))}
      </div>
    </div>
  );
}

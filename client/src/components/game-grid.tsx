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
    <motion.div 
      className="mb-4 sm:mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="grid grid-cols-5 gap-1.5 sm:gap-3 w-full max-w-[280px] sm:max-w-sm mx-auto p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl border-4 border-white/30 shadow-2xl">
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
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rotateY: state !== 'empty' && evaluatedRows.has(rowIndex) ? [0, 180, 360] : 0
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: evaluatedRows.has(rowIndex) ? colIndex * 0.1 : (rowIndex * 5 + colIndex) * 0.02 
                }}
                whileHover={{ scale: gameState === 'playing' ? 1.05 : 1, y: gameState === 'playing' ? -2 : 0 }}
                data-testid={`tile-${rowIndex}-${colIndex}`}
              >
                <span className="font-bold text-base sm:text-xl select-none uppercase">
                  {letter}
                </span>
              </motion.div>
            );
          })
        ))}
      </div>
    </motion.div>
  );
}

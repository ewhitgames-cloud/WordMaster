import { motion } from "framer-motion";
import { Delete } from "lucide-react";
import { KeyState } from "@/lib/game-utils";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  keyboardState: Record<string, KeyState>;
  disabled: boolean;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

export default function Keyboard({ onKeyPress, onEnter, onBackspace, keyboardState, disabled }: KeyboardProps) {
  const getKeyClass = (key: string) => {
    const baseClass = "keyboard-key";
    const state = keyboardState[key] || 'default';
    
    if (key === 'ENTER' || key === 'BACKSPACE') {
      return `${baseClass} keyboard-key-special`;
    }
    
    switch (state) {
      case 'correct': return `${baseClass} keyboard-key-correct`;
      case 'present': return `${baseClass} keyboard-key-present`;
      case 'absent': return `${baseClass} keyboard-key-absent`;
      default: return `${baseClass} keyboard-key-default`;
    }
  };

  const handleKeyClick = (key: string) => {
    if (disabled) return;
    
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'BACKSPACE') {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="space-y-1.5 sm:space-y-2 px-1">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
          {row.map((key) => (
            <motion.button
              key={key}
              className={getKeyClass(key)}
              onClick={() => handleKeyClick(key)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.05 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              data-testid={`key-${key.toLowerCase()}`}
            >
              {key === 'BACKSPACE' ? (
                <Delete className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                key
              )}
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
}

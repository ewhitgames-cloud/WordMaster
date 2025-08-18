export function useAudio() {
  // Placeholder audio hook - keeps the interface but removes actual audio
  const vibrate = (pattern: number | number[] = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // No-op functions for all audio actions
  const playKeyPress = () => {};
  const playWordSubmit = () => {};
  const playCorrectGuess = () => {};
  const playWrongGuess = () => {};
  const playGameWin = () => {};
  const playGameLose = () => {};
  const playInvalidWord = () => {
    // Keep haptic feedback for invalid words
    vibrate([100, 50, 100]);
  };
  const startBackgroundMusic = () => {};
  const stopBackgroundMusic = () => {};

  return {
    playKeyPress,
    playWordSubmit,
    playCorrectGuess,
    playWrongGuess,
    playGameWin,
    playGameLose,
    playInvalidWord,
    startBackgroundMusic,
    stopBackgroundMusic,
    vibrate,
  };
}
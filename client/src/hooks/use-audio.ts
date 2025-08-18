export function useAudio() {
  // Placeholder audio hook - keeps the interface but removes actual audio and vibration
  
  // No-op functions for all audio actions
  const playKeyPress = () => {};
  const playWordSubmit = () => {};
  const playCorrectGuess = () => {};
  const playWrongGuess = () => {};
  const playGameWin = () => {};
  const playGameLose = () => {};
  const playInvalidWord = () => {
    // Removed vibration - no feedback for invalid words
  };
  const startBackgroundMusic = () => {};
  const stopBackgroundMusic = () => {};
  const vibrate = () => {
    // Vibration disabled
  };

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
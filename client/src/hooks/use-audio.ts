import { useRef } from 'react';
import { useSettings } from './use-settings';

// Simple audio system using Web Audio API
const createOscillatorSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
};

// Simple WAV encoder for background music
const audioBufferToWav = (buffer: AudioBuffer): ArrayBuffer => {
  const length = buffer.length;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  const channelData = buffer.getChannelData(0);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);
  
  // Convert float samples to 16-bit PCM
  const offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset + i * 2, sample * 0x7FFF, true);
  }
  
  return arrayBuffer;
};

export function useAudio() {
  const { settings } = useSettings();
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize background music once
  if (!backgroundMusicRef.current) {
    backgroundMusicRef.current = new Audio();
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.15;
    
    // Create simple background music using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sampleRate = audioContext.sampleRate;
      const duration = 30; // 30 seconds loop
      const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
      const channelData = buffer.getChannelData(0);
      
      // Generate gentle ambient music with multiple harmonics
      for (let i = 0; i < channelData.length; i++) {
        const t = i / sampleRate;
        // Base frequency changes slowly
        const baseFreq = 220 + 50 * Math.sin(t * 0.1); // A3 with slow modulation
        
        let value = 0;
        // Layer multiple sine waves for richness
        value += 0.3 * Math.sin(2 * Math.PI * baseFreq * t);
        value += 0.2 * Math.sin(2 * Math.PI * (baseFreq * 1.5) * t);
        value += 0.1 * Math.sin(2 * Math.PI * (baseFreq * 2) * t);
        value += 0.1 * Math.sin(2 * Math.PI * (baseFreq * 0.5) * t);
        
        // Add gentle amplitude modulation
        const envelope = 0.8 + 0.2 * Math.sin(t * 0.5);
        
        channelData[i] = value * envelope * 0.08; // Keep very low volume
      }
      
      // Convert to data URL for playback
      const wav = audioBufferToWav(buffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      backgroundMusicRef.current.src = URL.createObjectURL(blob);
    } catch (error) {
      console.warn('Background music generation failed:', error);
      // Fallback to silent audio
      backgroundMusicRef.current.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    }
  }

  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 1) => {
    if (!settings?.soundEnabled) return;
    
    const effectiveVolume = (settings.musicVolume / 100) * volume;
    if (effectiveVolume > 0) {
      createOscillatorSound(frequency, duration, type);
    }
  };

  const vibrate = (pattern: number | number[] = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const playKeyPress = () => playSound(600, 0.08, 'sine', 0.2);
  const playWordSubmit = () => playSound(440, 0.15, 'triangle', 0.4);
  const playCorrectGuess = () => playSound(523, 0.3, 'sine', 0.6); // C note
  const playWrongGuess = () => playSound(330, 0.25, 'sine', 0.5); // E note, lower
  const playGameWin = () => {
    // Play a victory chord progression
    setTimeout(() => playSound(523, 0.4, 'sine', 0.7), 0);    // C
    setTimeout(() => playSound(659, 0.4, 'sine', 0.7), 150);  // E
    setTimeout(() => playSound(784, 0.6, 'sine', 0.8), 300);  // G
  };
  const playGameLose = () => {
    // Descending sad sound
    setTimeout(() => playSound(330, 0.3, 'sine', 0.6), 0);
    setTimeout(() => playSound(294, 0.3, 'sine', 0.6), 200);
    setTimeout(() => playSound(262, 0.5, 'sine', 0.7), 400);
  };
  const playInvalidWord = () => {
    playSound(200, 0.1, 'square', 0.4);
    vibrate([100, 50, 100]); // Double vibration for invalid word
  };

  const startBackgroundMusic = () => {
    if (!settings?.soundEnabled || !backgroundMusicRef.current) return;
    
    backgroundMusicRef.current.volume = (settings.musicVolume / 100) * 0.2;
    backgroundMusicRef.current.play().catch(console.warn);
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
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
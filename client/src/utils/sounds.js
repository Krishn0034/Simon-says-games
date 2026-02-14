// Sound frequencies for Simon Says game buttons
const frequencies = {
  green: 329.63,  // E4
  red: 261.63,    // C4
  yellow: 293.66, // D4
  blue: 392.00,   // G4
  error: 110.00    // A2
};

// Create audio context lazily (for mobile compatibility)
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Play a tone with the given frequency
const playTone = (frequency, duration = 0.3, type = 'sine') => {
  try {
    const ctx = getAudioContext();
    
    // Resume context if suspended (required for mobile)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
};

// Play sound for a specific color
export const playButtonSound = (color) => {
  const frequency = frequencies[color];
  if (frequency) {
    playTone(frequency, 0.3);
  }
};

// Play error sound
export const playErrorSound = () => {
  playTone(frequencies.error, 0.5, 'square');
};

// Preload audio (call on first user interaction)
export const initAudio = () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch (error) {
    console.warn('Audio initialization failed:', error);
  }
};


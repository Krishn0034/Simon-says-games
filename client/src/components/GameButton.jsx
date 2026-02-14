import { useState, useEffect, useRef } from 'react';
import { playButtonSound } from '../utils/sounds';

const COLORS = {
  green: {
    base: 'bg-game-green',
    light: 'bg-green-400',
    shadow: 'shadow-green-500/50',
    position: 'rounded-tl-2xl'
  },
  red: {
    base: 'bg-game-red',
    light: 'bg-red-400',
    shadow: 'shadow-red-500/50',
    position: 'rounded-tr-2xl'
  },
  yellow: {
    base: 'bg-game-yellow',
    light: 'bg-yellow-400',
    shadow: 'shadow-yellow-500/50',
    position: 'rounded-bl-2xl'
  },
  blue: {
    base: 'bg-game-blue',
    light: 'bg-blue-400',
    shadow: 'shadow-blue-500/50',
    position: 'rounded-br-2xl'
  }
};

const GameButton = ({ color, onClick, disabled, active, size = 'normal' }) => {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef(null);

  const colorConfig = COLORS[color];
  const sizeClasses = size === 'small' 
    ? 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32' 
    : 'w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40';

  useEffect(() => {
    if (active) {
      setIsActive(true);
      playButtonSound(color);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsActive(false);
      }, 300);
    }
  }, [active, color]);

  const handleClick = () => {
    if (!disabled) {
      setIsActive(true);
      playButtonSound(color);
      onClick?.(color);
      
      setTimeout(() => {
        setIsActive(false);
      }, 150);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClasses}
        ${colorConfig.base}
        ${colorConfig.position}
        ${colorConfig.shadow}
        game-button
        ${isActive || active ? 'active brightness-150 shadow-[0_0_40px_currentColor]' : 'opacity-90'}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        transition-all duration-100
        focus:outline-none focus:ring-2 focus:ring-white/50
      `}
      style={{ color: colorConfig.base.replace('bg-game-', '#') }}
    />
  );
};

export default GameButton;


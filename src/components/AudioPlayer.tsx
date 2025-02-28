import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface AudioPlayerProps {
  audioSrc: string;
  isPlaying?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  small?: boolean;
}

// Define a ref type for the AudioPlayer component
export interface AudioPlayerRef {
  reset: () => void;
}

const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ 
  audioSrc, 
  isPlaying = false, 
  onPlayStateChange,
  small = false
}, ref) => {
  const [playing, setPlaying] = useState(isPlaying);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Expose reset method to parent components
  useImperativeHandle(ref, () => ({
    reset: () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    }
  }));

  // Sync playing state with parent component
  useEffect(() => {
    setPlaying(isPlaying);
  }, [isPlaying]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setPlaying(false);
          if (onPlayStateChange) onPlayStateChange(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, onPlayStateChange]);

  // Update duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Update current time during playback
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle end of audio
  const handleEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
    if (onPlayStateChange) onPlayStateChange(false);
  };

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const togglePlay = () => {
    const newPlayingState = !playing;
    setPlaying(newPlayingState);
    if (onPlayStateChange) onPlayStateChange(newPlayingState);
  };

  return (
    <div className={`${small ? 'w-8' : 'w-full'} flex items-center`}>
      <audio
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <button
        onClick={togglePlay}
        className={`flex-shrink-0 ${small ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 focus:outline-none`}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {!small && (
        <>
          <div className="flex-grow mx-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="flex-shrink-0 text-sm text-gray-400 w-16 text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </>
      )}
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer; 
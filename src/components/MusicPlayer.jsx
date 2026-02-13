import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const MusicPlayer = ({ track, audioRef }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Reveal animation
    gsap.fromTo(containerRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );

    const audio = audioRef.current;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [audioRef]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const width = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const pct = clickX / width;
    if (audioRef.current.duration) {
        audioRef.current.currentTime = pct * audioRef.current.duration;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[9999] bg-emerald-950/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex flex-col gap-3"
    >
      <div className="flex items-center gap-4">
        {/* Album Art Placeholder/Icon */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-white/10 animate-spin-slow overflow-hidden relative" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
            {track.cover ? (
               <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
            ) : (
                <div className={`w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-800 flex items-center justify-center`}>
                    <span className="text-xl">🎵</span>
                </div>
            )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm truncate">{track.title}</h4>
          <p className="text-emerald-200/60 text-xs truncate">{track.artist}</p>
        </div>

        {/* Controls */}
        <button 
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3 text-[10px] text-emerald-200/50 font-mono">
        <span>{formatTime(audioRef.current.currentTime)}</span>
        <div 
          className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer relative overflow-hidden"
          onClick={handleSeek}
        >
          {/* Track */}
          <div 
            className="absolute top-0 left-0 h-full bg-emerald-400 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span>{formatTime(duration || 0)}</span>
      </div>
    </div>
  );
};

export default MusicPlayer;

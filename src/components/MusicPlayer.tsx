import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
}

const tracks: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "AI Generated 1",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Syntax Error",
    artist: "AI Generated 2",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Cyber Drift",
    artist: "AI Generated 3",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    // could update progress bar here
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <footer className="h-24 bg-black border-t-2 border-[#ff00ff] flex items-center px-4 md:px-10 gap-4 md:gap-12 z-10 shadow-[0_-4px_0_#00ffff] shrink-0 w-full font-digital uppercase">
      <audio
        ref={audioRef}
        src={track.src}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
      />
      
      {/* Track Info */}
      <div className="flex items-center gap-4 w-40 md:w-64 shrink-0">
         <div className="w-12 h-12 bg-black flex items-center justify-center border-glitch shrink-0">
            <div className="w-4 h-4 bg-[#ff00ff] animate-pulse"></div>
         </div>
         <div className="flex-1 min-w-0">
            <p className="text-xl font-bold truncate text-[#00ffff] text-glitch tracking-widest">{track.title}</p>
            <p className="text-xs text-[#ff00ff] uppercase tracking-tighter truncate opacity-80">{track.artist}</p>
         </div>
      </div>

      {/* Playback Controls */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-4 md:gap-8">
          <button onClick={handlePrev} className="text-[#00ffff] hover:text-[#ff00ff] transition-all hover:scale-110 drop-shadow-[2px_2px_0_#ff00ff] hover:drop-shadow-[2px_2px_0_#00ffff]">
            <SkipBack className="w-6 h-6 md:w-8 md:h-8 fill-current" />
          </button>
          
          <button 
            onClick={handlePlayPause} 
            className="w-12 h-12 md:w-16 md:h-16 bg-black border-glitch text-[#00ffff] flex items-center justify-center hover:bg-[#00ffff] hover:text-black hover:border-[#ff00ff] transition-all hover:shadow-[4px_4px_0_#ff00ff]"
          >
            {isPlaying ? <Pause className="fill-current w-6 h-6 md:w-8 md:h-8" /> : <Play className="fill-current w-6 h-6 md:w-8 md:h-8 ml-1" />}
          </button>
          
          <button onClick={handleNext} className="text-[#00ffff] hover:text-[#ff00ff] transition-all hover:scale-110 drop-shadow-[2px_2px_0_#ff00ff] hover:drop-shadow-[2px_2px_0_#00ffff]">
            <SkipForward className="w-6 h-6 md:w-8 md:h-8 fill-current" />
          </button>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="hidden md:flex w-64 justify-end items-center gap-4 shrink-0">
        <button onClick={toggleMute} className="text-[#00ffff] hover:text-[#ff00ff] transition-colors drop-shadow-[2px_2px_0_#ff00ff]">
          {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
        <div className="w-24 h-2 bg-black border border-[#00ffff] flex items-center relative">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={isMuted ? 0 : volume} 
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="h-full bg-[#ff00ff] pointer-events-none transition-all" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}></div>
        </div>
      </div>
    </footer>
  );
}

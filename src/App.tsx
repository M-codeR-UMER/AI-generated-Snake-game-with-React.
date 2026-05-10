import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="h-screen bg-black text-[#00ffff] font-digital flex flex-col overflow-hidden select-none screen-tear">
      
      {/* Header Section */}
      <header className="h-16 flex shrink-0 items-center justify-between px-8 border-b-2 border-[#00ffff] bg-black z-10 shadow-[0_4px_0_#ff00ff]">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-[#ff00ff] animate-pulse"></div>
          <h1 className="text-3xl font-bold tracking-widest text-[#00ffff] text-glitch uppercase">SYS.SNAKE_EXE</h1>
        </div>
        <div className="text-[#00ffff] text-sm hidden md:block">
          [ ROOT_ACCESS: GRANTED ]
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar */}
        <aside className="hidden md:flex w-72 border-r-2 border-[#00ffff] bg-black p-6 flex-col gap-6 overflow-y-auto z-10 relative">
          <div className="border-glitch p-4 bg-[#0a0a0a]">
            <h2 className="text-xl text-[#00ffff] mb-2 uppercase animate-pulse">Diagnostic_Feed</h2>
            <div className="text-sm text-[#ff00ff]">
              <p>&gt; CPU_TEMP: ERROR</p>
              <p>&gt; NEURAL_LINK: STABLE</p>
              <p>&gt; MEMORY: CORRUPT</p>
            </div>
          </div>
          <div className="mt-auto border-glitch-magenta p-4 bg-black">
             <span className="text-lg uppercase text-[#00ffff] tracking-tighter">CONNECTION_PROTOCOL</span>
             <div className="mt-2 text-xs text-[#ff00ff] opacity-80 break-all">
                0xDEADC0DE 0xBAADF00D 0xFEEDBEEF
             </div>
          </div>
        </aside>

        {/* Center: Snake Game Window */}
        <section className="flex-1 bg-black flex items-center justify-center p-8 relative overflow-hidden">
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            <SnakeGame />
          </div>
        </section>
      </main>

      {/* Player Controls Footer */}
      <MusicPlayer />
    </div>
  );
}



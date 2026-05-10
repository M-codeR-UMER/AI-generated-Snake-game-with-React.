import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Make sure food is not on the snake
    const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!onSnake) break;
  }
  return newFood;
};

const getInitialSnake = (): Point[] => [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(getInitialSnake());
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef<Direction>(direction);
  const snakeRef = useRef<Point[]>(snake);
  snakeRef.current = snake;
  directionRef.current = direction;

  const resetGame = () => {
    setSnake(getInitialSnake());
    setDirection('UP');
    directionRef.current = 'UP';
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood(generateFood(getInitialSnake()));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying || isGameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          resetGame();
        }
        return;
      }

      const currentDir = directionRef.current;
      if (e.key === 'ArrowUp' && currentDir !== 'DOWN') setDirection('UP');
      if (e.key === 'ArrowDown' && currentDir !== 'UP') setDirection('DOWN');
      if (e.key === 'ArrowLeft' && currentDir !== 'RIGHT') setDirection('LEFT');
      if (e.key === 'ArrowRight' && currentDir !== 'LEFT') setDirection('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  const gameLoop = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      const currentDir = directionRef.current;

      if (currentDir === 'UP') head.y -= 1;
      if (currentDir === 'DOWN') head.y += 1;
      if (currentDir === 'LEFT') head.x -= 1;
      if (currentDir === 'RIGHT') head.x += 1;

      // Check collision with walls
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food consumption
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        // We don't pop the tail, so snake grows
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [food, isPlaying, isGameOver]);

  useEffect(() => {
    if (isPlaying) {
      // increase speed slightly based on score, maxing out at somewhat fast
      const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
      const intervalId = setInterval(gameLoop, speed);
      return () => clearInterval(intervalId);
    }
  }, [gameLoop, isPlaying, score]);

  return (
    <div className="flex flex-col items-center relative w-full h-full justify-center">
      <div className="absolute top-0 right-0 flex gap-4 items-center z-20 pointer-events-none">
        <div className="flex flex-col items-end">
           <span className="text-sm uppercase tracking-widest text-[#ff00ff] font-bold">Score</span>
           <span className="glitch-score text-7xl" data-score={score.toString().padStart(5, '0')}>
             {score.toString().padStart(5, '0')}
           </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative w-full aspect-square max-w-[500px] max-h-[500px] mt-16 bg-black border-2 border-[#00ffff] shadow-[0_0_20px_#00ffff,inset_0_0_20px_#00ffff] overflow-hidden">
        {/* Render grid */}
        <div 
          className="grid gap-[2px] absolute inset-0 z-10 p-[2px]"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full ${
                  isHead ? 'bg-[#00ffff] shadow-[0_0_10px_#00ffff] z-20' : 
                  isBody ? 'bg-[#00ffff] opacity-80 z-10' : 
                  isFood ? 'bg-[#ff00ff] shadow-[0_0_15px_#ff00ff] animate-pulse z-10' : 
                  'bg-transparent'
                }`}
              >
              </div>
            );
          })}
        </div>
        
        {/* Overlays */}
        {(!isPlaying && !isGameOver && score === 0) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30">
            <button 
              onClick={resetGame}
              className="px-8 py-4 border-glitch bg-black text-[#00ffff] text-2xl font-digital uppercase hover:bg-[#00ffff] hover:text-black transition-all shadow-[0_0_15px_#00ffff]"
            >
              &gt; EXECUTE_OVERRIDE
            </button>
            <p className="mt-6 text-sm text-[#ff00ff] uppercase tracking-widest font-digital animate-pulse">[ ARROWS ] TO_NAVIGATE</p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 border-glitch-magenta">
            <h3 className="text-4xl font-digital text-[#ff00ff] mb-2 drop-shadow-[0_0_10px_#ff00ff] uppercase screen-tear">CRITICAL_FAILURE</h3>
            <p className="text-xl text-[#00ffff] mb-8 font-digital uppercase tracking-widest">TRACE_LOG: <span className="font-bold text-[#ff00ff] ml-2">{score.toString().padStart(5, '0')}</span></p>
            <button 
              onClick={resetGame}
              className="px-8 py-4 border-glitch-magenta bg-black text-[#ff00ff] text-2xl font-digital uppercase hover:bg-[#ff00ff] hover:text-black transition-all shadow-[0_0_15px_#ff00ff]"
            >
              &gt; REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>

      {/* Controls Tooltip matched to UI concept */}
      <div className="absolute bottom-4 text-xs text-[#00ffff] flex gap-8 uppercase tracking-widest z-10 hidden sm:flex font-digital">
        <span>[ARROWS] <span className="text-[#ff00ff]">NAVIGATE</span></span>
        <span>[SPACE] <span className="text-[#ff00ff]">RESTART</span></span>
      </div>
    </div>
  );
}

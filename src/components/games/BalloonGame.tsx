import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target } from 'lucide-react';
import { ALPHABET } from '../../types';
import { audioService } from '../../services/AudioService';
import confetti from 'canvas-confetti';

interface GameProps {
  onComplete: () => void;
}

interface Balloon {
  id: number;
  letter: string;
  x: number;
  y: number;
  color: string;
  speed: number;
}

const BALLOON_COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];

export default function BalloonGame({ onComplete }: GameProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [target, setTarget] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startRound();
    const timer = setInterval(() => {
      setTimeLeft(v => {
        if (v <= 1) {
          clearInterval(timer);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  const startRound = () => {
    const newTarget = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    setTarget(newTarget);
    
    const newBalloons: Balloon[] = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const letter = i === 0 ? newTarget : ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      newBalloons.push({
        id: Math.random(),
        letter,
        x: 10 + (i % 4) * 23,
        y: 25 + Math.floor(i / 4) * 20,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        speed: 0
      });
    }
    setBalloons(newBalloons.sort(() => Math.random() - 0.5));
    audioService.speak(`Find the letter ${newTarget}`);
  };

  const handlePop = (b: Balloon) => {
    if (b.letter === target) {
      audioService.playEffect('pop');
      setScore(s => s + 10);
      setBalloons(prev => prev.filter(balloon => balloon.id !== b.id));
      confetti({ particleCount: 30, origin: { x: b.x/100, y: b.y/100 } });
      setTimeout(startRound, 400);
    } else {
      audioService.playEffect('wrong');
    }
  };

  return (
    <div ref={gameRef} className="relative w-full h-[60vh] md:h-[70vh] rounded-[3rem] overflow-hidden bg-sky-200 cursor-crosshair border-[8px] border-white shadow-xl touch-none">
       {/* Info Panel */}
       <div className="absolute top-4 left-0 right-0 z-20 flex flex-col items-center pointer-events-none">
          <div className="bg-white/80 backdrop-blur px-6 py-2 rounded-full border-2 border-amber-500 shadow-md flex items-center gap-6">
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black uppercase text-slate-500">Find</span>
                <span className="text-3xl font-black text-amber-500 italic">{target}</span>
             </div>
             <div className="w-px h-6 bg-slate-300"></div>
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black uppercase text-slate-500">Score</span>
                <span className="text-xl font-black">{score}</span>
             </div>
             <div className="w-px h-6 bg-slate-300"></div>
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black uppercase text-slate-500">Time</span>
                <span className="text-xl font-black">{timeLeft}s</span>
             </div>
          </div>
       </div>

       <div className="absolute inset-0 flex items-center justify-center p-4 pt-16">
          <div className="grid grid-cols-4 gap-3 md:gap-8 max-w-2xl w-full h-[80%]">
             <AnimatePresence>
                {balloons.map(b => (
                  <motion.button
                    key={b.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, rotate: [0, 2, -2, 0] }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ rotate: { repeat: Infinity, duration: 2 + Math.random() } }}
                    onClick={() => handlePop(b)}
                    className="relative aspect-square flex items-center justify-center group"
                  >
                    <div 
                      className="absolute inset-0 rounded-full shadow-lg border-2 border-white/30"
                      style={{ backgroundColor: b.color }}
                    />
                    <div className="absolute top-[85%] left-1/2 w-0.5 h-10 bg-white/40 -translate-x-1/2" />
                    <span className="relative z-10 text-3xl md:text-5xl font-black text-white drop-shadow-md select-none italic">
                      {b.letter}
                    </span>
                  </motion.button>
                ))}
             </AnimatePresence>
          </div>
       </div>

       {/* Water splash animation could be added here */}
    </div>
  );
}

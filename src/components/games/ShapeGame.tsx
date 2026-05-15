import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { audioService } from '../../services/AudioService';
import confetti from 'canvas-confetti';

const SHAPES = [
  { id: 'circle', label: 'Circle', icon: '⭕', color: 'bg-rose-400' },
  { id: 'square', label: 'Square', icon: '⬜', color: 'bg-sky-400' },
  { id: 'triangle', label: 'Triangle', icon: '📐', color: 'bg-emerald-400' },
  { id: 'star', label: 'Star', icon: '⭐', color: 'bg-amber-400' },
  { id: 'heart', label: 'Heart', icon: '❤️', color: 'bg-pink-400' },
];

export default function ShapeGame({ onComplete }: { onComplete: () => void }) {
  const [target, setTarget] = useState(SHAPES[0]);
  const [options, setOptions] = useState<typeof SHAPES>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateNewRound();
  }, []);

  const generateNewRound = () => {
    const newTarget = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setTarget(newTarget);
    setOptions([...SHAPES].sort(() => 0.5 - Math.random()));
  };

  const handleSelect = (shape: typeof SHAPES[0]) => {
    if (shape.id === target.id) {
      audioService.playEffect('pop');
      audioService.speak(`Correct! That is a ${shape.label}`);
      setScore(s => s + 1);
      if (score + 1 >= 5) {
        confetti();
        onComplete();
      } else {
        generateNewRound();
      }
    } else {
      audioService.playEffect('wrong');
      audioService.speak(`Not quite! Try to find the ${target.label}`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 md:p-8 rounded-3xl md:rounded-[3.5rem] shadow-xl border-4 border-indigo-100 flex flex-col items-center mb-6 md:mb-10 w-full max-w-sm">
        <span className="text-slate-400 font-black uppercase text-[10px] md:text-xs mb-2 md:mb-6 italic tracking-widest">Match this shape:</span>
        <motion.div 
          key={target.id}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl md:text-9xl grayscale opacity-20"
        >
          {target.icon}
        </motion.div>
        <h3 className="text-xl md:text-3xl font-black text-indigo-600 mt-2 md:mt-6 uppercase italic tracking-tighter">{target.label}</h3>
      </div>

      <div className="grid grid-cols-5 gap-2 md:gap-8 w-full max-w-2xl px-2">
        {options.map((shape) => (
          <motion.button
            key={shape.id}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(shape)}
            className={`${shape.color} aspect-square rounded-xl md:rounded-[2rem] flex items-center justify-center text-3xl md:text-6xl shadow-lg border-b-4 md:border-b-8 border-black/20`}
          >
            {shape.icon}
          </motion.button>
        ))}
      </div>
      <div className="mt-8 bg-indigo-50 px-6 py-2 rounded-full border border-indigo-100">
         <p className="text-indigo-400 font-black text-xs uppercase italic">Find 5 shapes to win!</p>
      </div>
    </div>
  );
}

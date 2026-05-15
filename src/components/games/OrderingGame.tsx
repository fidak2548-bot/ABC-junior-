import { useState, useEffect } from 'react';
import { motion, Reorder } from 'motion/react';
import { ALPHABET } from '../../types';
import { audioService } from '../../services/AudioService';
import confetti from 'canvas-confetti';

interface GameProps {
  onComplete: () => void;
}

export default function OrderingGame({ onComplete }: GameProps) {
  const [letters, setLetters] = useState<string[]>([]);
  const [target, setTarget] = useState<string[]>([]);

  useEffect(() => {
    generateRound();
  }, []);

  const generateRound = () => {
    const startIdx = Math.floor(Math.random() * (ALPHABET.length - 4));
    const slice = ALPHABET.slice(startIdx, startIdx + 4);
    setTarget(slice);
    setLetters([...slice].sort(() => 0.5 - Math.random()));
  };

  const handleReorder = (newOrder: string[]) => {
    setLetters(newOrder);
    if (newOrder.every((l, i) => l === target[i])) {
      audioService.playEffect('correct');
      audioService.speak("Perfect! You matches the alphabet order!");
      confetti({ particleCount: 150 });
      setTimeout(() => {
         onComplete();
         generateRound();
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-h-[70vh] py-4">
      <h4 className="text-xl md:text-3xl font-black mb-2 uppercase text-emerald-600">Alphabet Order</h4>
      <p className="text-sm md:text-xl font-bold text-slate-500 mb-8 md:mb-12">Drag to arrange in order!</p>

      <Reorder.Group axis="x" values={letters} onReorder={handleReorder} className="flex gap-2 md:gap-4">
        {letters.map(letter => (
          <Reorder.Item 
            key={letter} 
            value={letter}
            className="w-16 h-24 md:w-24 md:h-32 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl md:rounded-2xl border-4 border-emerald-500 shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
             <span className="text-3xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400">{letter}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="mt-8 md:mt-20 flex gap-2 md:gap-4 opacity-30">
         {target.map(l => (
            <div key={l} className="w-16 h-4 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
         ))}
      </div>
    </div>
  );
}

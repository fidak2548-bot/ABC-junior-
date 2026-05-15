import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { ALPHABET, VOCABULARY } from '../../types';
import { audioService } from '../../services/AudioService';
import confetti from 'canvas-confetti';

interface GameProps {
  onComplete: () => void;
}

export default function QuizGame({ onComplete }: GameProps) {
  const [current, setCurrent] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    generateRound();
  }, []);

  const generateRound = () => {
    const correct = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    const distractors = [...ALPHABET].filter(l => l !== correct).sort(() => 0.5 - Math.random()).slice(0, 3);
    setCurrent(correct);
    setOptions([...distractors, correct].sort(() => 0.5 - Math.random()));
    audioService.speak(`Find the letter that makes the sound... ${correct}`);
  };

  const handleOption = (letter: string) => {
    // Speak whatever is clicked
    audioService.speak(`${letter} for ${VOCABULARY[letter].word}`);

    if (letter === current) {
      audioService.playEffect('correct');
      // audioService.speak(`That's right! ${letter} as in ${VOCABULARY[letter].word}`);
      confetti({ particleCount: 50 });
      setCount(c => c + 1);
      setTimeout(() => {
        if (count + 1 >= 5) {
           audioService.playEffect('fanfare');
           onComplete();
           setCount(0);
        }
        generateRound();
      }, 2000);
    } else {
      audioService.playEffect('wrong');
    }
  };

  if (!current) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full max-h-[70vh] max-w-2xl mx-auto px-4 py-2">
      <div className="mb-4 md:mb-10 flex flex-col items-center gap-2 md:gap-4">
         <motion.button
            whileHover={{ scale: 1.1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => audioService.speak(current)}
            className="w-20 h-20 md:w-32 md:h-32 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white transition-all"
         >
            <Volume2 className="w-10 h-10 md:w-16 md:h-16" />
         </motion.button>
         <p className="text-lg md:text-2xl font-black text-rose-600 uppercase italic">Listen Carefully!</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6 w-full">
         {options.map(opt => (
           <motion.button
             key={opt}
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => handleOption(opt)}
             className="bg-white dark:bg-slate-800 p-3 md:p-6 rounded-2xl md:rounded-[2.5rem] shadow-lg border-b-[6px] md:border-b-[8px] border-slate-100 dark:border-slate-700 flex flex-col items-center gap-1 md:gap-2 group transition-all"
           >
              <span className="text-4xl md:text-6xl group-hover:scale-110 transition-transform">{VOCABULARY[opt].image}</span>
              <span className="text-xs md:text-xl font-black uppercase text-slate-700 dark:text-slate-200 tracking-wider font-mono bg-slate-50 dark:bg-slate-700/50 px-3 md:px-4 py-0.5 md:py-1 rounded-full">{VOCABULARY[opt].word}</span>
           </motion.button>
         ))}
      </div>
    </div>
  );
}

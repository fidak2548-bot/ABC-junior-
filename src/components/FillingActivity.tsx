import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { ALPHABET, VOCABULARY } from '../types';
import { audioService } from '../services/AudioService';
import confetti from 'canvas-confetti';

interface FillingActivityProps {
  onComplete: () => void;
}

export default function FillingActivity({ onComplete }: FillingActivityProps) {
  const [isMuted, setIsMuted] = useState(!audioService.isMusicOn());
  const [currentWord, setCurrentWord] = useState<{ word: string; letter: string; image: string } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  useEffect(() => {
    audioService.startMusic();
    generateWord();
    return () => {
      audioService.stopMusic();
    };
  }, [difficulty]);

  const toggleMute = () => {
    audioService.toggleMusic();
    setIsMuted(!audioService.isMusicOn());
  };

  const generateWord = () => {
    const letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    const vocab = VOCABULARY[letter];
    setCurrentWord({ word: vocab.word, letter: letter, image: vocab.image });

    // Difficulty logic: 
    // Easy: 3 options, Medium: 4 options, Hard: 6 options
    const optionCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6;
    const distractors = [...ALPHABET].filter(l => l !== letter).sort(() => 0.5 - Math.random()).slice(0, optionCount - 1);
    setOptions([...distractors, letter].sort(() => 0.5 - Math.random()));
  };


  const handleOptionClick = (selected: string) => {
    if (!currentWord) return;

    // Speak the letter and word connection
    audioService.speak(`${selected} as in ${VOCABULARY[selected].word}`);

    if (selected === currentWord.letter) {
      audioService.playEffect('correct');
      // audioService.speak(`Correct! ${selected} is for ${currentWord.word}`); // Redundant now
      setScore(s => s + 1);
      setTotal(t => t + 1);
      confetti({ particleCount: 50, origin: { x: 0.5, y: 0.8 } });
      
      setTimeout(() => {
        if (total + 1 >= 5) {
          audioService.playEffect('fanfare');
          audioService.speak(`Amazing! You got ${score + 1} out of 5 correct!`);
          onComplete();
          setScore(0);
          setTotal(0);
        }
        generateWord();
      }, 1500);
    } else {
      audioService.playEffect('wrong');
      audioService.speak("Oops! Try again!");
      setTotal(t => t + 1);
    }
  };

  if (!currentWord) return null;

  return (
    <div className="pb-24 px-4 flex flex-col items-center max-w-4xl mx-auto min-h-[calc(100vh-12rem)] overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 p-4 md:p-12 rounded-[2rem] md:rounded-[3rem] border-[4px] md:border-[8px] border-[#4D96FF] shadow-xl w-full flex flex-col items-center gap-3 md:gap-8 relative overflow-hidden"
      >
        {/* Title & Score badge */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col items-start gap-1">
          <button 
            onClick={toggleMute}
            className={`p-2 rounded-full transition-all ${isMuted ? 'bg-rose-100 text-rose-500' : 'bg-blue-100 text-blue-600'}`}
          >
            {isMuted ? <VolumeX className="w-4 h-4 md:w-6 md:h-6" /> : <Volume2 className="w-4 h-4 md:w-6 md:h-6" />}
          </button>
        </div>

        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col items-end gap-1 md:gap-2">
           <div className="bg-blue-50 dark:bg-blue-900/40 px-4 md:px-6 py-1 md:py-2 rounded-full font-black text-[#4D96FF] text-[10px] md:text-base">
              LEVEL {total + 1}/5
           </div>
           <div className="flex gap-1 bg-white/50 backdrop-blur-md p-0.5 md:p-1 rounded-full text-[8px] md:text-[10px] font-bold border border-white">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button 
                  key={d} 
                  onClick={() => setDifficulty(d)}
                  className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full transition-colors ${difficulty === d ? 'bg-[#4D96FF] text-white shadow-sm' : 'text-slate-400'}`}
                >
                  {d.toUpperCase()}
                </button>
              ))}
           </div>
        </div>

        <div className="text-6xl md:text-[120px] mb-2 md:mb-4 bg-blue-50 dark:bg-blue-900/20 w-24 h-24 md:w-48 md:h-48 flex items-center justify-center rounded-full border-2 md:border-4 border-blue-100 mt-8 md:mt-0">
          {currentWord.image}
        </div>

        <div className="flex gap-2 md:gap-4 items-center mb-4 md:mb-8">
           <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-100 dark:bg-slate-700 border-2 md:border-4 border-dashed border-purple-400 rounded-xl md:rounded-2xl flex items-center justify-center text-3xl md:text-5xl font-black text-purple-600 italic">
              ?
           </div>
           <div className="text-4xl md:text-7xl font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 italic">
             {currentWord.word.substring(1)}
           </div>
        </div>

        <p className="text-sm md:text-2xl font-bold text-slate-500 mb-2 md:mb-4 animate-bounce">Select the correct letter!</p>

        <div className="grid grid-cols-3 gap-3 md:gap-6 w-full max-w-lg">
           {options.map((opt, i) => (
             <motion.button
               key={opt + i}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => handleOptionClick(opt)}
               className="bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-500 hover:text-white p-4 md:p-8 rounded-2xl md:rounded-3xl text-3xl md:text-5xl font-black text-purple-600 transition-colors border-b-4 md:border-b-8 border-purple-300 dark:border-purple-800 italic"
             >
               {opt}
             </motion.button>
           ))}
        </div>
      </motion.div>
    </div>
  );
}

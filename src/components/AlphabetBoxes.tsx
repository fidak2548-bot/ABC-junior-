import { motion } from 'motion/react';
import { Volume2, VolumeX, ChevronLeft } from 'lucide-react';
import { ALPHABET, VOCABULARY } from '../types';
import { audioService } from '../services/AudioService';
import { useState, useEffect } from 'react';

const BOX_COLORS = [
  'bg-red-400 border-red-500 shadow-red-200',
  'bg-blue-400 border-blue-500 shadow-blue-200',
  'bg-yellow-400 border-yellow-500 shadow-yellow-200',
  'bg-green-400 border-green-500 shadow-green-200',
  'bg-orange-400 border-orange-500 shadow-orange-200',
  'bg-purple-400 border-purple-500 shadow-purple-200',
  'bg-pink-400 border-pink-500 shadow-pink-200',
  'bg-cyan-400 border-cyan-500 shadow-cyan-200',
  'bg-lime-400 border-lime-500 shadow-lime-200',
  'bg-indigo-400 border-indigo-500 shadow-indigo-200',
  'bg-rose-400 border-rose-500 shadow-rose-200',
  'bg-teal-400 border-teal-500 shadow-teal-200',
  'bg-amber-400 border-amber-500 shadow-amber-200',
  'bg-emerald-400 border-emerald-500 shadow-emerald-200',
  'bg-violet-400 border-violet-500 shadow-violet-200',
  'bg-fuchsia-400 border-fuchsia-500 shadow-fuchsia-200'
];

interface AlphabetBoxesProps {
  onBack: () => void;
}

const PHONICS_SOUNDS: Record<string, string> = {
  A: "Ah", B: "Buh", C: "Kuh", D: "Duh", E: "Eh", F: "Fuh", G: "Guh", H: "Huh", I: "Ih", J: "Juh",
  K: "Kuh", L: "Luh", M: "Muh", N: "Nuh", O: "Oh", P: "Puh", Q: "Kwuh", R: "Ruh", S: "Suh", T: "Tuh",
  U: "Uh", V: "Vuh", W: "Wuh", X: "Ksuh", Y: "Yuh", Z: "Zuh"
};

export default function AlphabetBoxes({ onBack }: AlphabetBoxesProps) {
  const [isMuted, setIsMuted] = useState(!audioService.isMusicOn());
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    audioService.startMusic();
    return () => {
      audioService.stopMusic();
    };
  }, []);

  const toggleMute = () => {
    audioService.toggleMusic();
    setIsMuted(!audioService.isMusicOn());
  };

  const handleLetterTap = (letter: string) => {
    audioService.playEffect('pop');
    // Speak letter name only
    audioService.speak(letter);
    setActiveLetter(letter);
    setTimeout(() => setActiveLetter(null), 500);
  };

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 md:mb-10">
        <button 
          onClick={onBack}
          className="bg-white p-3 rounded-2xl shadow-md text-sky-600 hover:scale-110 transition-transform active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-black text-sky-600 italic tracking-tight drop-shadow-sm leading-none">
            LETTER BOXES
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-widest mt-1">Touch & Learn</p>
        </div>

        <button 
          onClick={toggleMute}
          className={`p-3 rounded-2xl shadow-md transition-all active:scale-90 ${isMuted ? 'bg-rose-100 text-rose-500' : 'bg-white text-emerald-500'}`}
        >
          {isMuted ? <VolumeX className="w-6 h-6 md:w-8 md:h-8" /> : <Volume2 className="w-6 h-6 md:w-8 md:h-8" />}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 md:gap-5 max-w-5xl w-full">
        {ALPHABET.map((letter, index) => {
          const colorClass = BOX_COLORS[index % BOX_COLORS.length];
          const vocab = VOCABULARY[letter];
          const isActive = activeLetter === letter;

          return (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.9 }}
              animate={isActive ? { scale: 1.15, boxShadow: "0 0 25px rgba(255,255,255,0.8)" } : { scale: 1 }}
              onClick={() => handleLetterTap(letter)}
              className={`${colorClass} rounded-2xl md:rounded-3xl p-3 md:p-6 border-b-4 md:border-b-8 flex flex-col items-center justify-center relative transition-all active:shadow-none active:translate-y-1 shadow-lg`}
            >
              <span className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                {letter}
              </span>
              <div className="text-xl md:text-3xl mt-1 md:mt-2">
                {vocab.image}
              </div>
              
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/20 rounded-full blur-xl pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sky-400 font-black uppercase tracking-widest text-xs md:text-sm animate-pulse italic">
          Tap any box to hear the teacher!
        </p>
      </div>
    </div>
  );
}

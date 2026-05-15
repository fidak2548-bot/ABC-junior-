import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Volume2, VolumeX } from 'lucide-react';
import { ALPHABET, VOCABULARY } from '../types';
import { audioService } from '../services/AudioService';
import confetti from 'canvas-confetti';

interface MatchingActivityProps {
  onComplete: () => void;
}

export default function MatchingActivity({ onComplete }: MatchingActivityProps) {
  const [isMuted, setIsMuted] = useState(!audioService.isMusicOn());
  const [pairs, setPairs] = useState<{ letter: string; image: string; word: string }[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matchedLetters, setMatchedLetters] = useState<string[]>([]);
  const [shuffledImages, setShuffledImages] = useState<{ letter: string; image: string }[]>([]);

  useEffect(() => {
    audioService.startMusic();
    generateRound();
    return () => {
      audioService.stopMusic();
    };
  }, []);

  const toggleMute = () => {
    audioService.toggleMusic();
    setIsMuted(!audioService.isMusicOn());
  };

  const generateRound = () => {
    // Pick 4 random letters
    const pool = [...ALPHABET].sort(() => 0.5 - Math.random()).slice(0, 4);
    const newPairs = pool.map(l => ({ letter: l, image: VOCABULARY[l].image, word: VOCABULARY[l].word }));
    setPairs(newPairs);
    setShuffledImages([...newPairs].sort(() => 0.5 - Math.random()));
    setMatchedLetters([]);
    setSelectedLetter(null);
    setSelectedImage(null);
  };

  const handleLetterClick = (letter: string) => {
    if (matchedLetters.includes(letter)) return;
    audioService.playEffect('click');
    audioService.speak(`${letter} for ${VOCABULARY[letter].word}`);
    if (selectedImage) {
      if (selectedImage === letter) {
        handleMatch(letter);
      } else {
        handleWrong();
      }
    } else {
      setSelectedLetter(letter);
    }
  };

  const handleImageClick = (letter: string) => {
    if (matchedLetters.includes(letter)) return;
    audioService.playEffect('click');
    audioService.speak(`${letter} for ${VOCABULARY[letter].word}`);
    if (selectedLetter) {
      if (selectedLetter === letter) {
        handleMatch(letter);
      } else {
        handleWrong();
      }
    } else {
      setSelectedImage(letter);
    }
  };

  const handleMatch = (letter: string) => {
    audioService.playEffect('correct');
    // audioService.speak(`Correct! ${letter} is for ${VOCABULARY[letter].word}`);
    setMatchedLetters(prev => [...prev, letter]);
    setSelectedLetter(null);
    setSelectedImage(null);

    if (matchedLetters.length + 1 === pairs.length) {
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 70 });
        audioService.playEffect('fanfare');
        onComplete();
        generateRound();
      }, 1000);
    }
  };

  const handleWrong = () => {
    audioService.playEffect('wrong');
    setSelectedLetter(null);
    setSelectedImage(null);
  };

  return (
    <div className="pb-24 px-4 flex flex-col items-center max-w-5xl mx-auto min-h-[calc(100vh-12rem)] overflow-hidden">
      <div className="flex justify-center items-center gap-4 mb-4 md:mb-12">
        <motion.h3 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-xl md:text-4xl font-black text-sky-600 dark:text-sky-400 text-center uppercase tracking-tight italic"
        >
          Match it! 🧩
        </motion.h3>
        <button 
          onClick={toggleMute}
          className={`p-2 rounded-full transition-all ${isMuted ? 'text-rose-500' : 'text-slate-600'}`}
        >
          {isMuted ? <VolumeX className="w-5 h-5 md:w-8 md:h-8" /> : <Volume2 className="w-5 h-5 md:w-8 md:h-8" />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-12 w-full flex-1 max-w-lg mb-4">
        {/* Letters Column */}
        <div className="flex flex-col gap-3 md:gap-6 justify-center">
          {pairs.map((p) => (
            <motion.button
              key={p.letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLetterClick(p.letter)}
              className={`relative p-4 md:p-8 rounded-2xl md:rounded-3xl text-4xl md:text-6xl font-black shadow-xl border-b-4 md:border-b-8 transition-all h-20 md:h-auto ${
                matchedLetters.includes(p.letter) 
                  ? 'bg-green-500 border-green-700 text-white opacity-50 grayscale cursor-default' 
                  : selectedLetter === p.letter 
                    ? 'bg-sky-500 border-sky-700 text-white scale-110 ring-4 ring-sky-300' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sky-500'
              }`}
            >
              <span className="italic">{p.letter}</span>
              {matchedLetters.includes(p.letter) && (
                <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-yellow-400 p-1 md:p-2 rounded-full border-2 md:border-4 border-white">
                  <Star className="w-3 h-3 md:w-6 md:h-6 fill-white text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Images Column */}
        <div className="flex flex-col gap-3 md:gap-6 justify-center">
          {shuffledImages.map((p) => (
            <motion.button
              key={p.letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleImageClick(p.letter)}
              className={`relative p-4 md:p-8 rounded-2xl md:rounded-3xl text-5xl md:text-7xl shadow-xl border-b-4 md:border-b-8 transition-all h-20 md:h-auto flex items-center justify-center ${
                matchedLetters.includes(p.letter) 
                  ? 'bg-green-100 dark:bg-green-900 border-green-700 opacity-50 grayscale cursor-default' 
                  : selectedImage === p.letter 
                    ? 'bg-sky-500 border-sky-700 scale-110 ring-4 ring-sky-300' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              {p.image}
               {matchedLetters.includes(p.letter) && (
                  <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 bg-yellow-400 p-1 md:p-2 rounded-full border-2 md:border-4 border-white">
                    <Star className="w-3 h-3 md:w-6 md:h-6 fill-white text-white" />
                  </div>
                )}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-8 md:mt-12 flex justify-center w-full max-w-md">
         <div className="w-full h-3 md:h-4 bg-slate-100 dark:bg-slate-800 rounded-full shadow-inner overflow-hidden">
            <motion.div 
               className="h-full bg-green-500"
               animate={{ width: `${(matchedLetters.length / pairs.length) * 100}%` }}
            />
         </div>
      </div>
    </div>
  );
}

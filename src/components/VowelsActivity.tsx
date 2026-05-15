import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Star, Trophy, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { audioService } from '../services/AudioService';
import confetti from 'canvas-confetti';

interface VowelsActivityProps {
  onBack: () => void;
  onUpdateStars: (stars: number) => void;
}

const VOWELS_INFO = [
  { char: 'A', name: 'Apple', image: '🍎', phonics: 'ah', description: 'A is a vowel. A says ah for Apple' },
  { char: 'E', name: 'Elephant', image: '🐘', phonics: 'eh', description: 'E is a vowel. E says eh for Elephant' },
  { char: 'I', name: 'Igloo', image: '🏠', phonics: 'ih', description: 'I is a vowel. I says ih for Igloo' },
  { char: 'O', name: 'Octopus', image: '🐙', phonics: 'oh', description: 'O is a vowel. O says oh for Octopus' },
  { char: 'U', name: 'Umbrella', image: '☔', phonics: 'uh', description: 'U is a vowel. U says uh for Umbrella' },
];

const GAME_WORDS = [
  { word: 'CAT', vowel: 'A' },
  { word: 'DOG', vowel: 'O' },
  { word: 'SUN', vowel: 'U' },
  { word: 'BED', vowel: 'E' },
  { word: 'PIN', vowel: 'I' },
  { word: 'HAT', vowel: 'A' },
  { word: 'POT', vowel: 'O' },
  { word: 'BUS', vowel: 'U' },
  { word: 'NET', vowel: 'E' },
  { word: 'PIG', vowel: 'I' },
];

type Step = 'learn' | 'game' | 'result';

export default function VowelsActivity({ onBack, onUpdateStars }: VowelsActivityProps) {
  const [isMuted, setIsMuted] = useState(!audioService.isMusicOn());
  const [step, setStep] = useState<Step>('learn');
  const [activeVowel, setActiveVowel] = useState<string | null>(null);
  const [gameQuestions, setGameQuestions] = useState<typeof GAME_WORDS>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; char: string } | null>(null);

  useEffect(() => {
    audioService.startMusic();
    return () => {
      audioService.stopMusic();
    };
  }, []);

  useEffect(() => {
    if (step === 'game') {
      const shuffled = [...GAME_WORDS].sort(() => Math.random() - 0.5).slice(0, 5);
      setGameQuestions(shuffled);
      setCurrentQuestionIdx(0);
      setScore(0);
    }
  }, [step]);

  const toggleMute = () => {
    audioService.toggleMusic();
    setIsMuted(!audioService.isMusicOn());
  };

  const handleVowelTap = (info: typeof VOWELS_INFO[0]) => {
    audioService.playEffect('pop');
    setActiveVowel(info.char);
    audioService.speak(info.description);
    setTimeout(() => setActiveVowel(null), 3500);
  };

  const handleGameTap = (char: string) => {
    if (feedback) return;
    
    const current = gameQuestions[currentQuestionIdx];
    const isCorrect = char === current.vowel;
    
    setFeedback({ isCorrect, char });
    
    if (isCorrect) {
      audioService.playEffect('pop');
      audioService.speak(`Correct! ${char} is the vowel in ${current.word}!`);
      setScore(s => s + 1);
    } else {
      audioService.playEffect('wrong');
      audioService.speak(`Not quite. Try finding the vowel!`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIdx < gameQuestions.length - 1) {
        setCurrentQuestionIdx(idx => idx + 1);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        setStep('result');
        if (finalScore >= 4) {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
          audioService.speak(`Great job! You found all the vowels!`);
          onUpdateStars(5);
        } else {
          audioService.speak(`Good try! You got ${finalScore} out of 5.`);
        }
      }
    }, 2500);
  };

  return (
    <div className="h-screen bg-amber-50 p-2 md:p-6 flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-2 md:mb-6">
        <button 
          onClick={onBack}
          className="bg-white p-2 md:p-3 rounded-2xl shadow-md text-amber-600 hover:scale-110 transition-transform active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
        </button>

        <button 
          onClick={toggleMute}
          className="bg-white p-2 md:p-3 rounded-2xl shadow-md text-amber-600 hover:scale-110 transition-transform active:scale-95"
        >
          {isMuted ? <VolumeX className="w-5 h-5 md:w-8 md:h-8" /> : <Volume2 className="w-5 h-5 md:w-8 md:h-8" />}
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-2xl md:text-5xl font-black text-amber-600 italic tracking-tight drop-shadow-sm leading-none uppercase">
            {step === 'learn' ? 'Vowel Letters' : step === 'game' ? 'Find the Vowel' : 'Result'}
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[8px] md:text-xs tracking-widest mt-0.5">
            {step === 'learn' ? 'Learn the special letters' : step === 'game' ? 'Question ' + (currentQuestionIdx + 1) + '/5' : 'Test Complete'}
          </p>
        </div>

        <div className="bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-2xl shadow-md flex items-center gap-1 md:gap-2">
          <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-yellow-500" />
          <span className="text-sm md:text-base font-black text-amber-600">{score}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'learn' && (
          <motion.div 
            key="learn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl"
          >
            <div className="bg-white/50 p-3 md:p-4 rounded-2xl md:rounded-3xl mb-4 md:mb-8 text-center border-2 border-amber-100 max-w-2xl">
              <p className="text-amber-700 font-bold text-sm md:text-xl italic">
                "Vowels are special letters! A, E, I, O, and U. Every word has at least one vowel!"
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 md:gap-8 mb-6 md:mb-12 w-full justify-items-center">
              {VOWELS_INFO.map((info) => (
                <motion.button
                  key={info.char}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleVowelTap(info)}
                  className={`relative w-14 h-14 sm:w-20 sm:h-20 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center shadow-xl border-b-4 md:border-b-8 transition-all
                    ${info.char === 'A' ? 'bg-rose-400 border-rose-500' : 
                      info.char === 'E' ? 'bg-sky-400 border-sky-500' :
                      info.char === 'I' ? 'bg-amber-400 border-amber-500' :
                      info.char === 'O' ? 'bg-emerald-400 border-emerald-500' :
                      'bg-purple-400 border-purple-500'}
                  `}
                >
                  <span className="text-2xl sm:text-3xl md:text-7xl font-black text-white drop-shadow-md">
                    {info.char}
                  </span>
                  {activeVowel === info.char && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-14 md:-top-24 bg-white p-2 md:p-5 rounded-2xl md:rounded-3xl shadow-2xl border-2 md:border-4 border-amber-400 z-50 flex flex-col items-center min-w-[60px] md:min-w-[120px]"
                    >
                      <span className="text-2xl md:text-6xl">{info.image}</span>
                      <span className="font-black text-amber-600 text-[8px] md:text-lg uppercase mt-0.5">{info.name}</span>
                      <div className="absolute w-3 h-3 md:w-4 md:h-4 bg-white border-r-2 md:border-r-4 border-b-2 md:border-b-4 border-amber-400 rotate-45 -bottom-1.5 md:-bottom-2"></div>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep('game')}
              className="bg-amber-500 text-white font-black px-6 py-3 md:px-10 md:py-5 rounded-2xl md:rounded-3xl shadow-[0_4px_0_0_#92400E] md:shadow-[0_8px_0_0_#92400E] uppercase tracking-widest text-sm md:text-xl flex items-center gap-2 md:gap-3"
            >
              <Sparkles className="w-4 h-4 md:w-6 md:h-6" />
              Play Vowel Game
            </motion.button>
          </motion.div>
        )}

        {step === 'game' && gameQuestions.length > 0 && (
          <motion.div 
            key="game"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl"
          >
            <div className="bg-white p-4 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl mb-4 md:mb-12 border-4 md:border-8 border-indigo-100 flex flex-col items-center">
              <span className="text-slate-400 font-black uppercase tracking-widest mb-2 md:mb-4 text-[10px] md:text-base">Find the Vowel in:</span>
              <div className="flex gap-2 md:gap-8">
                {gameQuestions[currentQuestionIdx].word.split('').map((char, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleGameTap(char)}
                    disabled={!!feedback}
                    className={`w-14 h-18 md:w-32 md:h-40 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-7xl font-black shadow-lg border-b-4 md:border-b-8 transition-all
                      ${feedback?.char === char 
                        ? feedback.isCorrect ? 'bg-emerald-400 border-emerald-600 text-white' : 'bg-rose-400 border-rose-600 text-white'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-white'}
                    `}
                  >
                    {char}
                  </motion.button>
                ))}
              </div>
            </div>

            <p className="text-amber-600 font-black italic text-sm md:text-lg text-center animate-bounce">
              Tap the correct vowel letter!
            </p>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div 
            key="result"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center w-full"
          >
            <div className="bg-white p-6 md:p-12 rounded-[3.5rem] md:rounded-[4rem] shadow-2xl border-4 md:border-8 border-yellow-400 max-w-lg w-full text-center mx-auto">
              <Trophy className="w-12 h-12 md:w-24 md:h-24 text-yellow-500 mx-auto mb-4 drop-shadow-lg" />
              <h2 className="text-2xl md:text-5xl font-black text-slate-800 mb-1 uppercase italic leading-none">
                {score >= 4 ? 'Amazing!' : 'Great Try!'}
              </h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest mb-4 md:mb-6 text-[10px] md:text-xs">Test Summary</p>

              <div className="bg-amber-50 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6 md:mb-8 border-2 md:border-4 border-amber-100 w-full">
                <span className="text-[10px] md:text-xs font-black text-amber-400 uppercase tracking-widest block mb-1">Final Score</span>
                <div className="text-4xl md:text-7xl font-black text-amber-600 tabular-nums">
                  {score} <span className="text-xl md:text-3xl text-amber-200">/ 5</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:gap-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('game')}
                  className="w-full bg-indigo-600 text-white font-black py-3 md:py-4 rounded-2xl md:rounded-3xl shadow-[0_4px_0_0_#3730A3] uppercase tracking-widest text-xs md:text-base"
                >
                  Play Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('learn')}
                  className="w-full bg-amber-500 text-white font-black py-3 md:py-4 rounded-2xl md:rounded-3xl shadow-[0_4px_0_0_#92400E] uppercase tracking-widest text-xs md:text-base"
                >
                  Back to Learning
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

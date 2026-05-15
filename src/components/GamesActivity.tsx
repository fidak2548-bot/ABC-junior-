import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, SortAsc, Music, Box, Shapes, ArrowRight } from 'lucide-react';
import MemoryGame from './games/MemoryGame';
import OrderingGame from './games/OrderingGame';
import QuizGame from './games/QuizGame';
import BalloonGame from './games/BalloonGame';
import ShapeGame from './games/ShapeGame';
import { audioService } from '../services/AudioService';

interface GamesActivityProps {
  onComplete: () => void;
}

type GameType = 'memory' | 'order' | 'quiz' | 'balloon' | 'shape';

const GAMES = [
  { id: 'memory', label: 'Tile Matching', icon: Brain, color: 'bg-indigo-500', desc: 'Find the pairs' },
  { id: 'order', label: 'Alphabet Order', icon: SortAsc, color: 'bg-emerald-500', desc: 'Arrange A to Z' },
  { id: 'quiz', label: 'Sound Quiz', icon: Music, color: 'bg-rose-500', desc: 'What sound is this?' },
  { id: 'balloon', label: 'Balloon Pop', icon: Box, color: 'bg-amber-500', desc: 'Pop the letters' },
  { id: 'shape', label: 'Shape Match', icon: Shapes, color: 'bg-orange-500', desc: 'Find the match' },
];

export default function GamesActivity({ onComplete }: GamesActivityProps) {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [showNext, setShowNext] = useState(false);

  const handleGameComplete = useCallback(() => {
    setShowNext(true);
  }, []);

  const goToNextGame = () => {
    if (!activeGame) return;
    const currentIndex = GAMES.findIndex(g => g.id === activeGame);
    const nextIndex = (currentIndex + 1) % GAMES.length;
    setActiveGame(GAMES[nextIndex].id as GameType);
    setShowNext(false);
    audioService.playEffect('click');
  };

  if (activeGame) {
    return (
      <div className="flex flex-col items-center pb-20 pt-4 min-h-[calc(100vh-12rem)]">
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => {
              audioService.playEffect('click');
              setActiveGame(null);
              setShowNext(false);
            }}
            className="px-6 py-2 bg-white rounded-full shadow-sm text-slate-500 font-black text-xs uppercase tracking-widest border border-slate-100 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center gap-2"
          >
            <Box className="w-4 h-4 rotate-180" />
            Back
          </button>
          
          <AnimatePresence>
            {showNext && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={goToNextGame}
                className="px-6 py-2 bg-emerald-500 text-white rounded-full shadow-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-colors"
              >
                Next Game <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full flex-1 flex flex-col items-center justify-center">
          {activeGame === 'memory' && <MemoryGame onComplete={handleGameComplete} />}
          {activeGame === 'order' && <OrderingGame onComplete={handleGameComplete} />}
          {activeGame === 'quiz' && <QuizGame onComplete={handleGameComplete} />}
          {activeGame === 'balloon' && <BalloonGame onComplete={handleGameComplete} />}
          {activeGame === 'shape' && <ShapeGame onComplete={handleGameComplete} />}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 flex flex-col items-center max-w-5xl mx-auto min-h-[calc(100vh-16rem)] justify-center overflow-hidden">
      <motion.h3 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-2xl md:text-3xl font-black mb-4 md:mb-10 text-center text-slate-800 uppercase italic tracking-tighter"
      >
        Mini Games! 🎮
      </motion.h3>
 
      <div className="grid grid-cols-2 gap-3 md:gap-8 w-full max-w-3xl">
         {GAMES.map((game, i) => (
           <motion.button
              key={game.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, type: 'spring' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                audioService.playEffect('click');
                setActiveGame(game.id as GameType);
              }}
              className={`${game.color} p-2 md:p-6 rounded-2xl md:rounded-[3rem] border-b-4 md:border-b-[10px] border-black/20 shadow-lg flex flex-col md:flex-row items-center gap-1 md:gap-6 text-white text-center md:text-left transition-all`}
           >
              <div className="p-2 md:p-5 bg-white/20 rounded-xl md:rounded-[2rem]">
                 <game.icon className="w-8 h-8 md:w-12 md:h-12 drop-shadow-sm" />
              </div>
              <div className="flex-1 w-full overflow-hidden">
                 <h4 className="text-xs md:text-2xl font-black italic uppercase leading-none truncate">{game.label}</h4>
                 <p className="text-white/80 font-bold tracking-tight text-[10px] md:text-base mt-2 hidden sm:block truncate">{game.desc}</p>
                 
                 <div className="mt-1 md:mt-4 inline-block bg-black/10 px-2 md:px-4 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                    {game.id === 'balloon' ? 'NEW!' : 'ARCADE'}
                 </div>
              </div>
           </motion.button>
         ))}
      </div>
    </div>
  );
}

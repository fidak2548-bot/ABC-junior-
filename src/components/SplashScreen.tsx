import { motion } from 'motion/react';
import { Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { audioService } from '../services/AudioService';
import KidsLearningScene from './KidsLearningScene';

interface SplashScreenProps {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  const [isMuted, setIsMuted] = useState(!audioService.isMusicOn());

  useEffect(() => {
    audioService.startMusic();
    // Welcome message
    audioService.speak("Welcome to ABC Junior! Where Learning is Fun!");
    
    // Play a sparkle sound when characters enter
    const timer = setTimeout(() => {
      audioService.playEffect('sparkle');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const rainbowColors = [
    'from-red-500 to-orange-500',
    'from-orange-500 to-yellow-500',
    'from-yellow-500 to-green-500',
    'from-green-500 to-blue-500',
    'from-blue-500 to-indigo-500',
    'from-indigo-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-pink-500 to-red-500',
    'from-red-500 to-orange-500',
  ];

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gradient-to-b from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] flex flex-col items-center justify-between py-6 md:py-12">
      {/* Playroom Elements in Background - Subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
         <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] bg-white/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Title Section - Focused ONLY on Name */}
      <div className="z-20 text-center px-4">
        <motion.div
           initial={{ y: -50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ type: 'spring', damping: 12 }}
           className="flex flex-col items-center"
        >
          <motion.h1 
            className="text-6xl md:text-[11rem] font-black tracking-tighter leading-none select-none flex drop-shadow-xl"
          >
            <span className="text-red-500 italic">A</span>
            <span className="text-yellow-400 italic">B</span>
            <span className="text-blue-500 italic">C</span>
            <span className="text-green-500 italic -ml-2 md:-ml-8">JUNIOR</span>
          </motion.h1>
          
          <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="mt-2 md:-mt-4 bg-white/40 backdrop-blur-sm px-6 py-1.5 md:px-10 md:py-3 rounded-full border border-white/50"
          >
            <p className="text-amber-950 font-black text-[10px] md:text-2xl uppercase tracking-[0.3em]">
              Learning is Fun!
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Kids Scene */}
      <div className="w-full h-fit flex-1 flex items-center justify-center px-4 max-h-[35vh] md:max-h-[50vh] relative z-10 overflow-visible">
        <KidsLearningScene />
        
        {/* Cute Bird */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-[10%] md:right-[20%] text-4xl md:text-7xl drop-shadow-lg z-30 pointer-events-none"
        >
          🐦
        </motion.div>

        {/* Teddy Bear */}
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-[5%] md:left-[10%] flex flex-col items-center z-30 pointer-events-none"
        >
          <div className="text-6xl md:text-9xl relative drop-shadow-xl">
             🧸
             {/* Small Red Bow/Heart - using a pseudo element or another emoji */}
             <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-xl md:text-3xl">❤️</span>
          </div>
          {/* ABC Sign */}
          <div className="bg-amber-100 border-2 border-amber-800 px-3 py-1 rounded shadow-md mt-[-10px] md:mt-[-20px] rotate-[-5deg]">
             <span className="font-black text-amber-900 text-xs md:text-lg tracking-tight">ABC</span>
          </div>
        </motion.div>

        {/* Ball and Blocks */}
        <div className="absolute bottom-[5%] left-[20%] md:left-[25%] flex items-end gap-2 md:gap-4 pointer-events-none z-20 overflow-visible">
           {/* Red Ball */}
           <motion.div 
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ duration: 1.5, repeat: Infinity }}
             className="w-10 h-10 md:w-20 md:h-20 bg-red-500 rounded-full shadow-lg border-b-4 md:border-b-8 border-red-700 flex items-center justify-center"
           >
             <div className="w-full h-full rounded-full bg-gradient-to-tr from-transparent via-white/20 to-white/40" />
           </motion.div>

           {/* Blocks */}
           <div className="flex gap-1 md:gap-2 mb-1">
             {['A', 'B', 'C'].map((char, i) => (
                <motion.div
                  key={char}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 + i * 0.2 }}
                  className={`${i === 0 ? 'bg-orange-400' : i === 1 ? 'bg-blue-400' : 'bg-green-400'} w-8 h-8 md:w-16 md:h-16 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-lg md:text-3xl shadow-md border-b-2 md:border-b-4 border-black/20`}
                >
                  {char}
                </motion.div>
             ))}
           </div>
        </div>
      </div>

      {/* Start Button & Controls */}
      <div className="z-20 flex flex-col items-center gap-4 md:gap-8 px-4 pb-12 overflow-visible">
        <div className="relative inline-block group">
          {/* Pulsing Button Glow */}
          <motion.div 
             animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.35, 0.15] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-[-30px] bg-green-400 blur-3xl rounded-full"
          />
          
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 25px 50px rgba(34, 197, 94, 0.4)",
              translateY: -5
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              audioService.playEffect('click');
              onStart();
            }}
            className="relative bg-gradient-to-b from-[#4ADE80] to-[#16A34A] text-white px-14 md:px-40 py-4 md:py-12 rounded-full text-2xl md:text-7xl font-black shadow-[0_12px_0_0_#15803D] hover:shadow-[0_18px_0_0_#15803D] border-t-2 md:border-t-8 border-white/40 transition-all uppercase tracking-[0.1em] flex items-center gap-4 md:gap-10"
          >
            <span className="drop-shadow-2xl">LET'S PLAY!</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="hidden md:block"
            >
              ☀️
            </motion.div>
          </motion.button>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              audioService.toggleMusic();
              setIsMuted(!audioService.isMusicOn());
            }}
            className={`px-8 py-3 md:px-10 md:py-4 rounded-full text-xs md:text-xl font-black flex items-center gap-2 md:gap-4 transition-all ${isMuted ? 'bg-rose-100/80 text-rose-500 shadow-inner' : 'bg-white/80 backdrop-blur-sm text-slate-700 shadow-xl hover:bg-white'}`}
          >
            <span className="text-xl md:text-3xl">{isMuted ? '🔇' : '🔊'}</span>
            <span>MUSIC: {isMuted ? 'OFF' : 'ON'}</span>
          </button>
        </div>
      </div>

      {/* Ground Details */}
      <div className="absolute bottom-0 w-full h-[20vh] overflow-hidden pointer-events-none z-0 opacity-80">
          <div className="absolute bottom-0 w-full h-1/2 bg-amber-200/20 rounded-t-[100%] scale-x-150 translate-y-10 blur-xl" />
          <div className="absolute bottom-0 w-3/4 h-3/4 bg-amber-100/10 left-1/2 -translate-x-1/2 rounded-t-[100%] scale-x-125 translate-y-20 blur-xl" />
      </div>
    </div>
  );
}


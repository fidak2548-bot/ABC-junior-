import React from 'react';
import { motion } from 'motion/react';
import { audioService } from '../services/AudioService';

interface CharacterProps {
  type: 'A' | 'E' | 'F' | 'M';
  className?: string;
}

const Character = ({ type, className = "" }: CharacterProps) => {
  // Styles and colors for each character
  const config = {
    A: { // Boy 4y
      skin: '#FFDBAC',
      skinShadow: '#E5C19A',
      hair: '#4B3621',
      shirt: '#EF4444',
      shirtShadow: '#DC2626',
      letter: 'A',
      hairType: 'neat',
      eyes: 'normal',
      activity: 'reading',
      sound: 'pageTurn' as const
    },
    E: { // Girl 2y
      skin: '#F1C27D',
      skinShadow: '#D4A76A',
      hair: '#8B4513',
      shirt: '#EC4899',
      shirtShadow: '#DB2777',
      letter: 'E',
      hairType: 'ponytails',
      eyes: 'wide',
      activity: 'writing',
      sound: 'pencil' as const
    },
    F: { // Girl 1.5y
      skin: '#E0AC69',
      skinShadow: '#C4965B',
      hair: '#D2691E',
      shirt: '#F59E0B',
      shirtShadow: '#D97706',
      letter: 'F',
      hairType: 'pigtails',
      eyes: 'happy',
      activity: 'playing',
      sound: 'blocks' as const
    },
    M: { // Baby Boy 1y
      skin: '#FFDBAC',
      skinShadow: '#E5C19A',
      hair: '#A0522D',
      shirt: '#10B981',
      shirtShadow: '#059669',
      letter: 'M',
      hairType: 'baby',
      eyes: 'cute',
      activity: 'drawing',
      sound: 'pencil' as const
    }
  }[type];

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playEffect(config.sound);
  };

  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => audioService.playEffect('boing')}
      className={`relative flex flex-col items-center cursor-pointer scale-[0.65] md:scale-95 lg:scale-100 ${className} group`}
    >
      {/* Character Shadow on Rug */}
      <div className="absolute bottom-0 w-24 h-6 bg-black/10 rounded-[100%] blur-md -z-10 group-hover:bg-black/20 transition-colors" />

      {/* Animation Container - Dancing/Bouncing motion */}
      <motion.div
        animate={{ 
          y: [0, -8, 0, -4, 0],
          rotate: [-1, 1, -1, 0.5, 0],
          scale: [1, 1.02, 1, 1.01, 1]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex flex-col items-center"
      >
        {/* Head and Hair */}
        <motion.div 
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-20"
        >
          {/* Hair Decoration (Ponytails/Pigtails) */}
          {config.hairType === 'ponytails' && (
            <>
              <motion.div 
                animate={{ rotate: [-8, 8, -8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -left-5 top-2 w-12 h-12 rounded-full shadow-lg"
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, #A0522D, ${config.hair})`,
                  border: '3px solid white'
                }}
              >
                <div className="absolute top-2 left-2 w-4 h-4 bg-pink-300 rounded-sm rotate-45 shadow-sm" />
              </motion.div>
              <motion.div 
                animate={{ rotate: [8, -8, 8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -right-5 top-2 w-12 h-12 rounded-full shadow-lg"
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, #A0522D, ${config.hair})`,
                  border: '3px solid white'
                }}
              >
                <div className="absolute top-2 right-2 w-4 h-4 bg-pink-300 rounded-sm -rotate-45 shadow-sm" />
              </motion.div>
            </>
          )}

          {config.hairType === 'pigtails' && (
            <>
              <motion.div 
                animate={{ rotate: [-15, 15, -15] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -left-4 top-4 w-10 h-10 rounded-full"
                style={{ background: `linear-gradient(135deg, #D2691E, ${config.hair})`, border: '2px solid white' }}
              />
              <motion.div 
                animate={{ rotate: [15, -15, 15] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -right-4 top-4 w-10 h-10 rounded-full"
                style={{ background: `linear-gradient(135deg, #D2691E, ${config.hair})`, border: '2px solid white' }}
              />
            </>
          )}

          {/* The Face Shape with 3D depth */}
          <div 
            className="w-24 h-30 lg:w-28 lg:h-34 rounded-[3rem] relative overflow-hidden border-2 border-white/40 shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            style={{ 
              background: `linear-gradient(135deg, ${config.skin} 0%, ${config.skinShadow} 100%)`
            }}
          >
            {/* Hair Top with shine */}
            <div 
              className="absolute top-0 left-0 right-0 h-14 rounded-b-[2rem]"
              style={{ backgroundColor: config.hair }}
            >
               <div className="absolute top-2 left-4 w-1/2 h-2 bg-white/20 rounded-full blur-sm" />
            </div>
            
            {/* Eyes - Clearer with blinking effect and group-directed gaze */}
            <div className="absolute top-16 lg:top-18 left-0 right-0 flex justify-around px-5 lg:px-7">
              <div className="w-6 h-6 bg-white rounded-full relative flex items-center justify-center shadow-sm">
                 <motion.div 
                   animate={{ scaleY: [1, 1, 0.1, 1, 1], x: type === 'A' ? 2 : (type === 'M' ? -1 : 0) }} 
                   transition={{ 
                     scaleY: { duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] },
                     x: { duration: 0 }
                   }}
                   className="w-4 h-4 bg-slate-900 rounded-full relative" 
                 >
                   <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
                 </motion.div>
              </div>
              <div className="w-6 h-6 bg-white rounded-full relative flex items-center justify-center shadow-sm">
                 <motion.div 
                   animate={{ scaleY: [1, 1, 0.1, 1, 1], x: type === 'A' ? 2 : (type === 'M' ? -1 : 0) }} 
                   transition={{ 
                     scaleY: { duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] },
                     x: { duration: 0 }
                   }}
                   className="w-4 h-4 bg-slate-900 rounded-full relative" 
                 >
                   <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
                 </motion.div>
              </div>
            </div>

            {/* Rosy Cheeks */}
            <div className="absolute top-[4.8rem] left-3 w-6 h-3 bg-rose-400/30 rounded-full blur-[2px]" />
            <div className="absolute top-[4.8rem] right-3 w-6 h-3 bg-rose-400/30 rounded-full blur-[2px]" />

            {/* Nose and Smile */}
            <div className="absolute top-[5rem] left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-rose-900/10 rounded-full" />
            <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-12 h-6 border-b-[4px] border-rose-500 rounded-full bg-rose-500/5" />
          </div>
        </motion.div>

        {/* Body / Shirt with shading */}
        <div className="relative -mt-6 z-10">
          <div 
            className="w-32 h-36 lg:w-40 lg:h-44 rounded-t-[3rem] rounded-b-[2rem] relative flex items-start justify-center shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-2 border-white/40 pt-4"
            style={{ 
              background: `linear-gradient(to bottom, ${config.shirt} 0%, ${config.shirtShadow} 100%)`
            }}
          >
            {/* Letter on Shirt - Extra BIG and Bold */}
            <span className="text-white font-black text-6xl lg:text-8xl drop-shadow-[0_6px_0_rgba(0,0,0,0.3)] select-none italic tracking-tighter">{config.letter}</span>
            
            {/* Arms - Holding hands position */}
            <motion.div 
              animate={{ rotate: type === 'A' ? [-40, -35, -40] : [-15, -10, -15] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-7 top-8 w-10 h-16 lg:w-12 lg:h-20 rounded-full border-2 border-white/20 origin-top shadow-md"
              style={{ background: `linear-gradient(to bottom, ${config.skin}, ${config.skinShadow})` }} 
            />
            <motion.div 
              animate={{ rotate: type === 'M' ? [40, 35, 40] : [15, 10, 15] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-7 top-8 w-10 h-16 lg:w-12 lg:h-20 rounded-full border-2 border-white/20 origin-top shadow-md"
              style={{ background: `linear-gradient(to bottom, ${config.skin}, ${config.skinShadow})` }} 
            />
          </div>
        </div>

        {/* Feet / Standing Pose */}
        <div className="flex gap-6 -mt-3">
           <motion.div 
             animate={{ rotate: [-5, 5, -5] }}
             className="w-10 h-5 bg-slate-800 rounded-full border-t-2 border-white/20 shadow-sm" 
           />
           <motion.div 
             animate={{ rotate: [5, -5, 5] }}
             className="w-10 h-5 bg-slate-800 rounded-full border-t-2 border-white/20 shadow-sm" 
           />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function KidsLearningScene() {
  const [isTogether, setIsTogether] = React.useState(false);

  React.useEffect(() => {
    // Initial delay before they stand together
    const timer = setTimeout(() => setIsTogether(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants for the kids
  const variants = {
    A: {
      initial: { x: -250, y: 200, rotate: -45, opacity: 0 },
      together: { x: -110, y: 0, rotate: 8, opacity: 1 }
    },
    E: {
      initial: { x: -150, y: 150, rotate: -20, opacity: 0 },
      together: { x: -40, y: 0, rotate: 3, opacity: 1 }
    },
    F: {
      initial: { x: 150, y: 150, rotate: 20, opacity: 0 },
      together: { x: 40, y: 0, rotate: -3, opacity: 1 }
    },
    M: {
      initial: { x: 250, y: 200, rotate: 45, opacity: 0 },
      together: { x: 110, y: 0, rotate: -8, opacity: 1 }
    }
  };

  return (
    <div className="relative w-full max-w-5xl h-full mx-auto flex items-end justify-center pb-8 overflow-visible">
      {/* Soft Rug */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[40%] bg-white/20 rounded-[100%] blur-3xl z-0" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-[30%] bg-amber-200/20 rounded-[100%] z-0" />

      {/* Interactive Toys */}
      <div className="absolute bottom-4 left-10 md:left-20 z-10">
        <motion.div
           whileHover={{ scale: 1.2, rotate: 360, y: -10 }}
           transition={{ type: 'spring' }}
           onClick={() => audioService.playEffect('boing')}
           className="text-4xl md:text-6xl cursor-pointer"
        >
          ⚽
        </motion.div>
      </div>

      <div className="absolute bottom-10 right-10 md:right-32 z-10">
        <motion.div
           whileHover={{ scale: 1.2, x: 20 }}
           transition={{ type: 'spring' }}
           onClick={() => audioService.playEffect('click')}
           className="text-4xl md:text-6xl cursor-pointer"
        >
          🚗
        </motion.div>
      </div>

      <div className="absolute bottom-16 left-[25%] z-10">
        <motion.div
           whileHover={{ scale: 1.1, rotate: -5 }}
           transition={{ type: 'spring' }}
           onClick={() => audioService.playEffect('pageTurn')}
           className="text-3xl md:text-5xl cursor-pointer"
        >
          📚
        </motion.div>
      </div>

      {/* The Kids Standing in a Line Holding Hands */}
      <div className="relative w-full h-full flex items-end justify-center z-20 scale-[0.65] md:scale-100 origin-bottom">
        {/* CHARACTER A */}
        <motion.div
          animate={isTogether ? variants.A.together : variants.A.initial}
          transition={{ type: 'spring', damping: 12, stiffness: 60, delay: 0.1 }}
          className="absolute bottom-0"
        >
          <Character type="A" className="z-10" />
        </motion.div>
        
        {/* CHARACTER E */}
        <motion.div
          animate={isTogether ? variants.E.together : variants.E.initial}
          transition={{ type: 'spring', damping: 12, stiffness: 60, delay: 0.2 }}
          className="absolute bottom-0"
        >
          <Character type="E" className="z-20" />
        </motion.div>
        
        {/* CHARACTER F */}
        <motion.div
           animate={isTogether ? variants.F.together : variants.F.initial}
           transition={{ type: 'spring', damping: 12, stiffness: 60, delay: 0.3 }}
           className="absolute bottom-0"
        >
          <Character type="F" className="z-30" />
        </motion.div>
        
        {/* CHARACTER M */}
        <motion.div
           animate={isTogether ? variants.M.together : variants.M.initial}
           transition={{ type: 'spring', damping: 12, stiffness: 60, delay: 0.4 }}
           className="absolute bottom-0"
        >
          <Character type="M" className="z-40" />
        </motion.div>

        {/* Speech Bubble "WELCOME!" */}
        <motion.div 
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={isTogether ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0 }}
          transition={{ delay: 2.2, type: "spring" }}
          className="absolute -top-32 md:-top-44 left-1/2 -translate-x-1/2 bg-white px-8 md:px-12 py-3 md:py-6 rounded-[3rem] shadow-2xl border-4 border-amber-200 italic z-50 whitespace-nowrap"
        >
          <span className="text-2xl md:text-6xl font-black text-amber-600 tracking-tighter drop-shadow-sm">WELCOME!</span>
          {/* Bubble Tail */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-r-4 border-b-4 border-amber-200 rotate-45" />
        </motion.div>
      </div>
    </div>
  );
}

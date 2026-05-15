import { motion } from 'motion/react';
import { ViewState } from '../types';
import { ChevronRight, Trophy } from 'lucide-react';
import { audioService } from '../services/AudioService';

interface HomeProps {
  onSelect: (view: ViewState) => void;
}

const ACTIVITIES = [
  { id: 'alphabet-boxes', label: 'Touch & Learn', icon: '📦', color: 'bg-[#FF9F1C]', border: 'border-[#CC7E00]', textColor: 'text-white', description: 'Letter Boxes' },
  { id: 'vowels', label: 'Learn Vowels', icon: '☁️', color: 'bg-[#FF7E67]', border: 'border-[#E05A42]', textColor: 'text-white', description: 'Special Letters' },
  { id: 'tracing', label: 'Tracing', icon: '✏️', color: 'bg-[#FFD93D]', border: 'border-[#EAB308]', textColor: 'text-slate-800', description: 'Draw Letters' },
  { id: 'colouring', label: 'Colouring', icon: '🎨', color: 'bg-[#6BCB77]', border: 'border-[#4DA057]', textColor: 'text-white', description: 'Magic Colors' },
  { id: 'matching', label: 'Matching', icon: '🧩', color: 'bg-[#4D96FF]', border: 'border-[#2563EB]', textColor: 'text-white', description: 'Pair Pictures' },
  { id: 'filling', label: 'Spelling', icon: '🔠', color: 'bg-[#FF9F1C]', border: 'border-[#CC7E00]', textColor: 'text-white', description: 'Word Fun' },
  { id: 'games', label: 'Fun Zone', icon: '🎮', color: 'bg-[#B166CC]', border: 'border-[#8B31A8]', textColor: 'text-white', description: 'Mini Games' },
  { id: 'quiz', label: 'Test / Quiz', icon: '🎓', color: 'bg-[#6366F1]', border: 'border-[#4338CA]', textColor: 'text-white', description: 'Show Mastery' },
];

export default function Home({ onSelect }: HomeProps) {
  return (
    <div className="flex flex-col items-center pt-2 md:pt-6 px-4 pb-8 overflow-hidden h-[100dvh] bg-gradient-to-b from-sky-50 to-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-3 md:mb-6 z-10"
      >
        <h2 className="text-2xl md:text-5xl font-black text-slate-800 italic uppercase tracking-tighter drop-shadow-lg leading-none mb-2">
          Junior Explorer!
        </h2>
        <div className="inline-flex flex-col items-center">
            <p className="text-[10px] md:text-sm text-slate-600 font-bold uppercase tracking-[0.1em] bg-white px-6 py-1.5 rounded-full border border-slate-100 shadow-sm">Choose your mission</p>
        </div>
      </motion.div>

      {/* Main Grid - Activity Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl w-full z-10 mb-4 px-2 flex-1 overflow-y-auto scrollbar-hide">
        {ACTIVITIES.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              audioService.playEffect('click');
              onSelect(item.id as ViewState);
            }}
            className={`group relative ${item.color} border-b-[6px] md:border-b-[10px] ${item.border} rounded-2xl md:rounded-[3rem] p-4 md:p-8 flex flex-col items-center justify-center text-center ${item.textColor} shadow-lg transition-all`}
          >
            <div className="bg-white/20 rounded-2xl p-3 md:p-5 mb-2 md:mb-5 group-hover:bg-white/30 transition-colors">
               <div className="text-3xl md:text-6xl drop-shadow-md">
                {item.icon}
              </div>
            </div>
            
            <h3 className="text-sm md:text-2xl font-black uppercase italic tracking-tighter leading-tight">
               {item.label}
            </h3>
            
            <p className="hidden md:block text-xs font-bold opacity-80 mt-1 uppercase tracking-widest">
              {item.description}
            </p>
          </motion.button>
        ))}

        {/* Dedicated Progress Card for "Easy and Simple" access */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('report')}
          className="group relative bg-white border-b-[6px] md:border-b-[10px] border-slate-200 rounded-2xl md:rounded-[3rem] p-4 md:p-8 flex flex-col items-center justify-center text-center text-slate-800 shadow-lg transition-all"
        >
          <div className="bg-indigo-50 rounded-2xl p-3 md:p-5 mb-2 md:mb-5 group-hover:bg-indigo-100 transition-colors">
             <Trophy className="w-8 h-8 md:w-16 md:h-16 text-indigo-600" />
          </div>
          <h3 className="text-sm md:text-2xl font-black uppercase italic tracking-tighter leading-tight">
             My Progress
          </h3>
          <p className="hidden md:block text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
            See your stars
          </p>
        </motion.button>
      </div>

      {/* Central Rank Feature - Smaller foot print for no-scroll */}
      <div className="z-10 mt-auto w-full max-w-lg px-4 mb-2 md:mb-4">
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="relative"
         >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative px-6 md:px-8 py-3 md:py-4 bg-white rounded-xl md:rounded-[2rem] shadow-lg border-[2px] md:border-[5px] border-slate-800 flex flex-row items-center gap-4 md:gap-8 group"
            >
                <div className="relative">
                   <div className="absolute inset-0 bg-amber-400/5 blur-lg rounded-full group-hover:scale-150 transition-transform" />
                   <span className="text-2xl md:text-4xl drop-shadow-lg relative block">⭐</span>
                </div>
                <div className="text-left flex-1">
                   <p className="text-[7px] md:text-xs font-black text-slate-400 uppercase leading-none tracking-[0.2em] mb-0.5">Explorer Level</p>
                   <h4 className="text-sm md:text-2xl font-black text-slate-800 italic leading-none uppercase tracking-tighter">
                      Bronze <span className="text-amber-500">Master</span>
                   </h4>
                   <div className="mt-1.5 md:mt-2.5 h-1 md:h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        transition={{ duration: 1.2, delay: 0.8 }}
                        className="h-full bg-amber-500"
                      />
                   </div>
                </div>
            </motion.div>
         </motion.div>
      </div>
    </div>
  );
}

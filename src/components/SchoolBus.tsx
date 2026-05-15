import React from 'react';
import { motion } from 'motion/react';

export default function SchoolBus() {
  return (
    <motion.div 
      initial={{ x: '-110%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 40, duration: 2.5 }}
      className="w-full max-w-[340px] md:max-w-[700px] lg:max-w-[850px] relative mt-16 mb-24 md:mt-24 md:mb-32 mx-auto"
    >
      {/* Shadow/Road */}
      <div className="absolute -bottom-4 md:-bottom-10 left-[10%] right-[10%] h-4 md:h-12 bg-slate-900/10 rounded-full blur-xl -z-10" />

      {/* The Bus Body Wrapper - This handles the bounce */}
      <motion.div 
        animate={{ 
          y: [0, -4, 0],
          rotate: [-0.5, 0.5, -0.5]
        }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Exhaust Puffs */}
        <div className="absolute -right-4 md:-right-8 bottom-6 md:bottom-12 flex flex-col gap-2">
          {[1,2,3].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0, x: 0 }}
              animate={{ 
                scale: [0, 1.5, 2], 
                opacity: [0, 0.4, 0],
                x: [0, 20, 40],
                y: [0, -10, -20]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.5,
                ease: "easeOut"
              }}
              className="w-4 h-4 md:w-8 md:h-8 bg-gray-400 rounded-full blur-[2px] md:blur-[4px]"
            />
          ))}
        </div>

        {/* The Bus Main Frame */}
        <div className="bg-[#FFD500] rounded-[2rem] md:rounded-[4rem] border-[3px] md:border-[10px] border-[#1A1A1A] shadow-[0_12px_0_0_#CCAA00] relative p-3 md:p-8 flex items-center min-h-[140px] md:min-h-[280px] overflow-hidden">
          
          {/* Animated Shine/Glint */}
          <motion.div 
            animate={{ 
              x: ['-500%', '500%'],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatDelay: 4,
              ease: "linear"
            }}
            className="absolute top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] z-10 pointer-events-none"
          />

          {/* Black Side Stripe */}
          <div className="absolute top-[62%] left-0 right-0 h-2 md:h-6 bg-[#1A1A1A] z-10 flex items-center px-4" />

          {/* Front section (Nose) - Integrated to be within bounds */}
          <div className="absolute -left-6 md:-left-16 bottom-0 w-[60px] md:w-[160px] h-[75%] bg-[#FFD500] border-[3px] md:border-[10px] border-[#1A1A1A] rounded-l-[2rem] md:rounded-l-[5rem] border-r-0 flex flex-col items-center justify-end pb-3 md:pb-10 shadow-inner z-20">
              {/* Grill */}
              <div className="w-4/5 flex flex-col gap-1 md:gap-2.5 mb-2 md:mb-6">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-0.5 md:h-2 bg-[#1A1A1A] rounded-full opacity-40" />)}
              </div>
              {/* Headlights */}
              <div className="flex gap-1.5 md:gap-4 items-end mb-1 md:mb-2">
                <div className="w-5 h-5 md:w-14 md:h-14 bg-white rounded-full border-2 md:border-6 border-[#1A1A1A] shadow-[0_0_15px_white] animate-pulse" />
                <div className="w-3 h-3 md:w-8 md:h-8 bg-orange-400 rounded-full border-2 md:border-4 border-[#1A1A1A]" />
              </div>
          </div>

          {/* Windows Cluster */}
          <div className="flex-1 flex justify-around gap-1.5 md:gap-5 ml-6 md:ml-12 mr-2 md:mr-4 z-20">
              {[
                { emoji: '👦', letter: 'A', color: 'bg-red-500' },
                { emoji: '👧', letter: 'E', color: 'bg-pink-500' },
                { emoji: '👱‍♀️', letter: 'F', color: 'bg-blue-500' },
                { emoji: '🧒', letter: 'M', color: 'bg-orange-500' }
              ].map((char, i) => (
                   <div key={i} className="flex-1 aspect-[3/4] bg-[#AEE2FF] border-[2px] md:border-[6px] border-[#1A1A1A] rounded-lg md:rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-start shadow-inner h-full">
                      {/* Character - Sized and positioned to stay in upper half */}
                      <motion.div
                          animate={{ 
                            y: [0, -4, 0],
                            rotate: i % 2 === 0 ? [-1, 1, -1] : [1, -1, 1]
                          }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                          className="text-3xl md:text-[6rem] z-10 mt-2 md:mt-6 relative"
                      >
                          {char.emoji}
                          <motion.span
                            animate={{ rotate: [-20, 30, -20] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                            className="absolute -top-1 -right-1 md:-top-10 md:-right-10 text-xl md:text-5xl"
                          >
                            👋
                          </motion.span>
                      </motion.div>
                      
                      {/* Shirt Letter Barge - Lower area away from face */}
                      <div className={`absolute bottom-0 left-0 right-0 ${char.color} h-[38%] flex items-center justify-center border-t-[2px] md:border-t-[8px] border-white/30 z-20 shadow-inner`}>
                        <span className="text-[14px] md:text-5xl font-black text-white italic drop-shadow-md mb-1">{char.letter}</span>
                      </div>

                      {/* Glass Glare */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none" />
                   </div>
              ))}
          </div>

          {/* STOP Sign - Adjusted to play nice with bounds */}
          <motion.div 
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -right-4 md:-right-10 top-[20%] w-10 h-10 md:w-24 md:h-24 bg-red-600 border-[2px] md:border-8 border-white flex items-center justify-center font-black text-white text-[6px] md:text-xl shadow-xl z-30"
            style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
          >
            STOP
          </motion.div>

          {/* Roof Lights */}
          <div className="absolute -top-3 md:-top-8 left-1/3 right-1/3 flex justify-between px-4 md:px-12">
              <div className="w-3 h-3 md:w-10 md:h-10 bg-red-600 rounded-t-full border md:border-4 border-[#1A1A1A] animate-pulse" />
              <div className="w-3 h-3 md:w-10 md:h-10 bg-[#FFB000] rounded-t-full border md:border-4 border-[#1A1A1A]" />
              <div className="w-3 h-3 md:w-10 md:h-10 bg-red-600 rounded-t-full border md:border-4 border-[#1A1A1A] animate-pulse" />
          </div>

          {/* Mirror */}
          <div className="absolute -left-10 md:-left-24 top-[20%] w-5 h-10 md:w-12 md:h-28 bg-[#1A1A1A] rounded-full flex flex-col items-center justify-center z-10">
              <div className="w-3/4 h-3/4 bg-slate-300 rounded-full border border-slate-400 opacity-60" />
          </div>

          {/* School Bus Plate */}
          <div className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 bg-white px-6 md:px-16 py-1.5 md:py-4 rounded-xl md:rounded-[2.5rem] border-[3px] md:border-[8px] border-[#1A1A1A] shadow-xl z-40">
             <h4 className="text-sm md:text-5xl font-black text-slate-900 italic uppercase tracking-tighter leading-none whitespace-nowrap">SCHOOL BUS</h4>
          </div>
        </div>

        {/* Wheels - Positioned carefully */}
        <div className="absolute -bottom-8 md:-bottom-16 left-[18%] z-10 w-12 h-12 md:w-32 md:h-32">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-[#1A1A1A] rounded-full border-[4px] md:border-[12px] border-slate-700 flex items-center justify-center shadow-lg"
          >
            <div className="w-2/3 h-2/3 bg-slate-400 rounded-full border-2 md:border-6 border-slate-600 flex items-center justify-center">
              <div className="w-1/3 h-1/3 bg-white/20 rounded-full" />
            </div>
          </motion.div>
        </div>
        <div className="absolute -bottom-8 md:-bottom-16 right-[18%] z-10 w-12 h-12 md:w-32 md:h-32">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-[#1A1A1A] rounded-full border-[4px] md:border-[12px] border-slate-700 flex items-center justify-center shadow-lg"
          >
            <div className="w-2/3 h-2/3 bg-slate-400 rounded-full border-2 md:border-6 border-slate-600 flex items-center justify-center">
              <div className="w-1/3 h-1/3 bg-white/20 rounded-full" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

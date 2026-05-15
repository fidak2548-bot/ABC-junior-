import { motion } from 'motion/react';
import { Trophy, Star, Award, ListChecks, History } from 'lucide-react';
import { Progress, ALPHABET, VOCABULARY } from '../types';

interface ReportCardProps {
  progress: Progress;
}

export default function ReportCard({ progress }: ReportCardProps) {
  const completionRate = Math.round((progress.tracedLetters.length / ALPHABET.length) * 100);
  const totalQuizzes = progress.quizResults?.length || 0;
  
  // Get latest results instead of all history to keep it simple
  const recentTests = (progress.quizResults || []).slice(-3).reverse();

  return (
    <div className="pt-2 md:pt-16 pb-20 md:pb-32 px-4 md:px-6 flex flex-col items-center max-w-4xl mx-auto h-full overflow-y-auto scrollbar-hide">
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] shadow-xl overflow-hidden border-4 md:border-8 border-indigo-100 dark:border-indigo-900/30"
      >
        {/* Header - Simpler & Cleaner */}
        <div className="bg-indigo-600 p-6 md:p-10 text-white text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-2">
            My Report Card
          </h2>
          <p className="text-indigo-100 font-bold opacity-80 text-sm md:text-lg">Great learning journey!</p>
        </div>

        <div className="p-4 md:p-8 space-y-6 md:space-y-10">
           {/* Top Stats - More Focused */}
           <div className="grid grid-cols-3 gap-3 md:gap-6">
              <div className="flex flex-col items-center p-3 md:p-6 bg-amber-50 dark:bg-amber-950/20 rounded-2xl md:rounded-3xl border border-amber-100 dark:border-amber-900/30">
                 <Star className="w-6 h-6 md:w-10 md:h-10 text-amber-500 fill-amber-500 mb-1 md:mb-2" />
                 <span className="text-xl md:text-3xl font-black text-amber-700 dark:text-amber-400">{progress.stars}</span>
                 <p className="text-amber-600/60 dark:text-amber-500/60 font-black uppercase text-[8px] md:text-xs">Stars</p>
              </div>

              <div className="flex flex-col items-center p-3 md:p-6 bg-sky-50 dark:bg-sky-950/20 rounded-2xl md:rounded-3xl border border-sky-100 dark:border-sky-900/30">
                 <Award className="w-6 h-6 md:w-10 md:h-10 text-sky-500 mb-1 md:mb-2" />
                 <span className="text-xl md:text-3xl font-black text-sky-700 dark:text-sky-400">{progress.tracedLetters.length}</span>
                 <p className="text-sky-600/60 dark:text-sky-500/60 font-black uppercase text-[8px] md:text-xs">Levels</p>
              </div>

              <div className="flex flex-col items-center p-3 md:p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl md:rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                 <ListChecks className="w-6 h-6 md:w-10 md:h-10 text-indigo-500 mb-1 md:mb-2" />
                 <span className="text-xl md:text-3xl font-black text-indigo-700 dark:text-indigo-400">{totalQuizzes}</span>
                 <p className="text-indigo-600/60 dark:text-indigo-500/60 font-black uppercase text-[8px] md:text-xs">Tests</p>
              </div>
           </div>

           {/* Progress Section - Simpler Bar */}
           <div className="space-y-3">
              <div className="flex justify-between items-end">
                 <span className="font-black uppercase text-slate-400 text-[10px] md:text-sm tracking-widest">Alphabet Mastery</span>
                 <span className="font-black text-indigo-600 text-lg md:text-2xl">{completionRate}%</span>
              </div>
              <div className="w-full h-4 md:h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    className="h-full bg-indigo-500 rounded-full"
                 />
              </div>
           </div>

           {/* Recent Tests - Simplified view */}
           {totalQuizzes > 0 && (
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 md:p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h3 className="font-black text-sm md:text-lg mb-4 text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4 md:w-5 md:h-5" /> Recent Tests
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {recentTests.map((res, i) => (
                    <div key={i} className="flex-shrink-0 bg-white dark:bg-slate-800 p-3 md:p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                      <div className="text-2xl md:text-3xl font-black text-indigo-600">{res.score}/{res.total}</div>
                      <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">
                        <div>{res.difficulty}</div>
                        <div>{new Date(res.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* Stickers - Made more efficient for space */}
           <div className="pt-2">
              <h3 className="font-black text-sm md:text-lg mb-4 text-slate-400 uppercase tracking-widest">Your Sticker Wall</h3>
              <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2">
                 {ALPHABET.map(l => (
                   <div 
                    key={l}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm md:text-xl border transition-all ${
                      progress.tracedLetters.includes(l) 
                        ? 'bg-white dark:bg-slate-800 border-indigo-200 shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-20'
                    }`}
                   >
                     {progress.tracedLetters.includes(l) ? VOCABULARY[l].image : ' '}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}



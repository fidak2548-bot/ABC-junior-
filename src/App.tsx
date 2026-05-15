/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pencil, 
  Palette, 
  Link as LinkIcon, 
  Type, 
  Gamepad2, 
  Moon, 
  Sun as SunIcon, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Trophy 
} from 'lucide-react';
import { 
  ViewState, 
  GameState, 
  INITIAL_PROGRESS, 
  STORAGE_KEY, 
  COLORS 
} from './types';
import { audioService } from './services/AudioService';
import SplashScreen from './components/SplashScreen';
import Home from './components/Home';
import TracingActivity from './components/TracingActivity';
import ColouringActivity from './components/ColouringActivity';
import MatchingActivity from './components/MatchingActivity';
import FillingActivity from './components/FillingActivity';
import GamesActivity from './components/GamesActivity';
import QuizActivity from './components/QuizActivity';
import ReportCard from './components/ReportCard';
import AlphabetBoxes from './components/AlphabetBoxes';
import VowelsActivity from './components/VowelsActivity';

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialProgress = saved ? JSON.parse(saved) : INITIAL_PROGRESS;
    return {
      view: 'splash',
      isNightMode: false,
      isSoundOn: true,
      difficulty: 'easy',
      progress: initialProgress,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  }, [state.progress]);

  useEffect(() => {
    audioService.setEnabled(state.isSoundOn);
  }, [state.isSoundOn]);

  const setView = (view: ViewState) => {
    audioService.playEffect('click');
    audioService.startMusic();
    setState(prev => ({ ...prev, view }));
  };

  const handleProgress = useCallback(() => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        stars: prev.progress.stars + 1
      }
    }));
  }, []);

  const toggleNightMode = () => setState(prev => ({ ...prev, isNightMode: !prev.isNightMode }));
  const toggleSound = () => setState(prev => ({ ...prev, isSoundOn: !prev.isSoundOn }));

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden font-sans ${state.isNightMode ? 'bg-slate-900 text-white' : 'bg-sky-50 text-slate-900'}`}>
      {/* Global Header */}
      {state.view !== 'splash' && (
        <header className="h-16 md:h-24 bg-white/80 backdrop-blur-md border-b-2 border-white flex items-center justify-between px-4 md:px-10 shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-yellow-400 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 border-2 md:border-4 border-white">
              <span className="text-xl md:text-4xl font-black text-white italic">B</span>
            </div>
            <h1 className="text-xl md:text-4xl font-black tracking-tight uppercase italic flex gap-1">
              <span className="text-[#FF6B6B]">A</span>
              <span className="text-[#4D96FF]">B</span>
              <span className="text-[#6BCB77]">C</span>
              <span className="text-slate-800 ml-1 md:ml-2">Junior</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-1.5 md:gap-3 bg-white px-3 md:px-5 py-1 md:py-2.5 rounded-full border-2 border-amber-100 shadow-sm">
              <span className="text-lg md:text-2xl">⭐</span>
              <span className="text-sm md:text-xl font-bold text-amber-600">{state.progress.stars}</span>
            </div>
            <div className="hidden xs:flex items-center gap-1.5 md:gap-3 bg-white px-3 md:px-5 py-1 md:py-2.5 rounded-full border-2 border-rose-100 shadow-sm">
              <span className="text-lg md:text-2xl">🏆</span>
              <span className="text-sm md:text-xl font-bold text-rose-600">{state.progress.tracedLetters.length}</span>
            </div>
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-indigo-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
              <span className="text-lg md:text-2xl">👦</span>
            </div>
          </div>
        </header>
      )}

      {/* Global Toolbar (Bottom for Mobile/UX) */}
      {state.view !== 'splash' && (
        <div className="fixed bottom-0 left-0 right-0 h-16 md:h-24 bg-white/80 backdrop-blur-md border-t border-white rounded-t-2xl md:rounded-t-[3rem] px-4 md:px-12 flex items-center justify-between z-50">
          <div className="flex items-center gap-2 md:gap-6">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                audioService.playEffect('click');
                toggleNightMode();
              }}
              className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-md text-xl md:text-2xl border border-slate-100 transition-all hover:bg-slate-50"
            >
              {state.isNightMode ? '☀️' : '🌙'}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                audioService.playEffect('click');
                toggleSound();
              }}
              className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-md text-xl md:text-2xl border border-slate-100 transition-all hover:bg-slate-50"
            >
              {state.isSoundOn ? '🔊' : '🔇'}
            </motion.button>
          </div>

          {state.view !== 'home' && (
            <motion.button 
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('home')}
              className="bg-white/80 px-4 md:px-8 py-2 md:py-3 rounded-full shadow-sm text-indigo-600 font-bold border border-white hover:bg-white transition-colors text-xs md:text-base flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Back
            </motion.button>
          )}

          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('report')}
            className="bg-orange-500 text-white font-black px-6 md:px-10 py-2.5 md:py-4 rounded-xl md:rounded-2xl shadow-[0_4px_0_0_#C2410C] md:shadow-[0_6px_0_0_#C2410C] uppercase tracking-widest text-xs md:text-lg transition-all flex items-center gap-2"
          >
            <Trophy className="w-4 h-4 md:w-6 md:h-6" />
            Progress
          </motion.button>
        </div>
      )}

      <main className={`flex-1 ${state.view === 'home' ? 'overflow-y-auto' : 'overflow-hidden'} pb-20 md:pb-32 pt-2 md:pt-10 scrollbar-hide flex flex-col`}>
        <AnimatePresence mode="wait">
          {state.view === 'splash' && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100]"
            >
              <SplashScreen onStart={() => setView('home')} />
            </motion.div>
          )}
          {state.view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Home onSelect={setView} />
            </motion.div>
          )}
          {state.view === 'alphabet-boxes' && (
            <motion.div key="alphabet-boxes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AlphabetBoxes onBack={() => setView('home')} />
            </motion.div>
          )}
          {state.view === 'vowels' && (
            <motion.div key="vowels" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <VowelsActivity 
                onBack={() => setView('home')} 
                onUpdateStars={(stars) => setState(prev => ({
                  ...prev,
                  progress: { ...prev.progress, stars: prev.progress.stars + stars }
                }))}
              />
            </motion.div>
          )}
          {state.view === 'tracing' && (
            <motion.div
              key="tracing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <TracingActivity onComplete={(letter) => {
                setState(prev => ({
                  ...prev,
                  progress: {
                    ...prev.progress,
                    tracedLetters: [...new Set([...prev.progress.tracedLetters, letter])],
                    stars: prev.progress.stars + 1
                  }
                }));
              }} />
            </motion.div>
          )}
          {state.view === 'colouring' && (
            <motion.div key="colouring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ColouringActivity onComplete={handleProgress} />
            </motion.div>
          )}
          {state.view === 'matching' && (
            <motion.div key="matching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MatchingActivity onComplete={handleProgress} />
            </motion.div>
          )}
          {state.view === 'filling' && (
            <motion.div key="filling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FillingActivity onComplete={handleProgress} />
            </motion.div>
          )}
          {state.view === 'games' && (
            <motion.div key="games" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GamesActivity onComplete={handleProgress} />
            </motion.div>
          )}
          {state.view === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizActivity onComplete={(result) => {
                setState(prev => ({
                  ...prev,
                  view: 'home',
                  progress: {
                    ...prev.progress,
                    stars: prev.progress.stars + result.score,
                    quizResults: [...(prev.progress.quizResults || []), result]
                  }
                }));
              }} />
            </motion.div>
          )}
          {state.view === 'report' && (
            <motion.div key="report" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ReportCard progress={state.progress} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>


    </div>
  );
}



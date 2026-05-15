import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, VolumeX, Sparkles, PencilLine, PenTool, Stamp, Mountain, Pointer } from 'lucide-react';
import { ALPHABET, VOCABULARY } from '../types';
import { audioService } from '../services/AudioService';
import confetti from 'canvas-confetti';

interface TracingActivityProps {
  onComplete: (letter: string) => void;
}

type TracingMode = 'TRACE' | 'WRITE';

// Stroke paths for Uppercase Letters (Normalized to 800x600 canvas)
const LETTER_STROKES: Record<string, string[]> = {
  A: ["M 200,500 L 400,100 L 600,500", "M 300,350 L 500,350"],
  B: ["M 300,100 L 300,500", "M 300,100 C 550,100 550,300 300,300", "M 300,300 C 550,300 550,500 300,500"],
  C: ["M 550,150 C 450,80 300,100 300,300 C 300,500 450,520 550,450"],
  D: ["M 300,100 L 300,500", "M 300,100 C 600,100 600,500 300,500"],
  E: ["M 300,100 L 300,500", "M 300,100 L 550,100", "M 300,300 L 500,300", "M 300,500 L 550,500"],
  F: ["M 300,100 L 300,500", "M 300,100 L 550,100", "M 300,300 L 500,300"],
  G: ["M 550,150 C 450,80 300,100 300,300 C 300,500 450,520 550,450", "M 550,450 L 550,300 L 450,300"],
  H: ["M 250,100 L 250,500", "M 550,100 L 550,500", "M 250,300 L 550,300"],
  I: ["M 400,100 L 400,500", "M 300,100 L 500,100", "M 300,500 L 500,500"],
  J: ["M 300,100 L 550,100", "M 425,100 L 425,450 C 425,550 300,550 300,450"],
  K: ["M 300,100 L 300,500", "M 500,100 L 300,300 L 550,500"],
  L: ["M 300,100 L 300,500", "M 300,500 L 550,500"],
  M: ["M 200,500 L 200,100 L 400,350 L 600,100 L 600,500"],
  N: ["M 200,500 L 200,100 L 600,500 L 600,100"],
  O: ["M 400,100 C 200,100 200,500 400,500 C 600,500 600,100 400,100"],
  P: ["M 300,100 L 300,500", "M 300,100 C 550,100 550,300 300,300"],
  Q: ["M 400,100 C 200,100 200,500 400,500 C 600,500 600,100 400,100", "M 500,400 L 650,550"],
  R: ["M 300,100 L 300,500", "M 300,100 C 550,100 550,300 300,300", "M 300,300 L 550,500"],
  S: ["M 550,150 C 450,50 250,150 400,300 C 550,450 350,550 250,450"],
  T: ["M 400,100 L 400,500", "M 250,100 L 550,100"],
  U: ["M 250,100 L 250,400 C 250,550 550,550 550,400 L 550,100"],
  V: ["M 200,100 L 400,500 L 600,100"],
  W: ["M 150,100 L 250,500 L 400,300 L 550,500 L 650,100"],
  X: ["M 250,100 L 550,500", "M 550,100 L 250,500"],
  Y: ["M 250,100 L 400,300 L 550,100", "M 400,300 L 400,500"],
  Z: ["M 250,150 L 550,150 L 250,450 L 550,450"],
};

export default function TracingActivity({ onComplete }: TracingActivityProps) {
  const [isMuted, setIsMuted] = useState(!audioService.isMusicOn());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<TracingMode>('TRACE');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showGuide, setShowGuide] = useState(true);

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

  const letter = ALPHABET[currentIndex];
  const vocab = VOCABULARY[letter];

  useEffect(() => {
    setShowGuide(true);
    const timer = setTimeout(() => setShowGuide(false), 4000);
    return () => clearTimeout(timer);
  }, [currentIndex, mode]);

  useEffect(() => {
    const handleGlobalUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, []);

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setProgress(0);
  };

  useEffect(() => {
    clearCanvas();
  }, [currentIndex, mode]);

  const startDrawing = (ex: any) => {
    if (ex.cancelable) ex.preventDefault();
    setIsDrawing(true);
    setShowGuide(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = ex.clientX ?? (ex.touches && ex.touches[0] ? ex.touches[0].clientX : undefined);
    const clientY = ex.clientY ?? (ex.touches && ex.touches[0] ? ex.touches[0].clientY : undefined);

    if (clientX === undefined || clientY === undefined) return;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 40;
    ctx.strokeStyle = `hsl(${(progress * 3.6) % 360}, 100%, 50%)`;
  };

  const draw = (ex: any) => {
    if (!isDrawing) return;
    if (ex.cancelable) ex.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = ex.clientX ?? (ex.touches && ex.touches[0] ? ex.touches[0].clientX : undefined);
    const clientY = ex.clientY ?? (ex.touches && ex.touches[0] ? ex.touches[0].clientY : undefined);

    if (clientX === undefined || clientY === undefined) return;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Play tracing sound every few steps
    if (Math.random() > 0.8) {
      audioService.playEffect('trace');
    }
    
    // Smooth progress update
    setProgress(v => Math.min(v + 0.3, 100));
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (progress >= 100) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    audioService.playEffect('fanfare');
    audioService.playEffect('sparkle');
    audioService.speak(`Great job! You traced the letter ${letter}`);
    onComplete(letter);
    setProgress(0);
  };

  const next = () => {
    audioService.playEffect('click');
    setCurrentIndex(v => (v + 1) % ALPHABET.length);
    setProgress(0);
    setIsDrawing(false);
  };
  const prev = () => {
    audioService.playEffect('click');
    setCurrentIndex(v => (v - 1 + ALPHABET.length) % ALPHABET.length);
    setProgress(0);
    setIsDrawing(false);
  };

  useEffect(() => {
    clearCanvas();
  }, [currentIndex, mode]);

  return (
    <div className="pb-24 px-4 flex flex-col items-center max-w-4xl mx-auto min-h-[calc(100vh-12rem)]">
      {/* Modes */}
      <div className="flex items-center justify-center bg-white/40 p-1.5 rounded-full border border-white/60 backdrop-blur-sm mb-4 gap-4 shadow-sm">
        <div className="flex gap-2">
          {(['TRACE', 'WRITE'] as TracingMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-6 py-2 rounded-full font-black text-xs md:text-sm transition-all ${mode === m ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {m}
            </button>
          ))}
        </div>
        
        <div className="w-px h-6 bg-white/40" />

        <button 
          onClick={toggleMute}
          className={`p-2 rounded-full transition-all ${isMuted ? 'text-rose-500' : 'text-slate-600'}`}
        >
          {isMuted ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
        </button>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full aspect-square md:aspect-video max-h-[45vh] md:max-h-none bg-white dark:bg-slate-800 rounded-3xl md:rounded-[3rem] border-[4px] md:border-[8px] border-[#FF7E67] shadow-xl overflow-hidden flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={letter}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full flex flex-col items-center"
          >
            <div className="absolute top-4 left-4 right-4 h-3 md:h-6 bg-slate-100 dark:bg-slate-700 rounded-full shadow-inner overflow-hidden z-10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-400 to-yellow-400"
                  animate={{ width: `${progress}%` }}
                />
            </div>

            <div className="relative flex-1 w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl touch-none mt-10 md:mt-14 overflow-hidden">
                {/* Visual Guide Letter - ALWAYS VISIBLE */}
                {mode === 'TRACE' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span 
                      className="text-[300px] md:text-[500px] font-black text-slate-200/50 dark:text-slate-700/50 animate-pulse"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {letter}
                    </span>
                  </div>
                )}

                {/* Animated Guide Overlay */}
                {showGuide && mode === 'TRACE' && (
                  <svg 
                    viewBox="0 0 800 600" 
                    className="absolute inset-0 w-full h-full pointer-events-none z-30"
                  >
                    <defs>
                      <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="15" />
                        <feOffset dx="5" dy="5" result="offsetblur" />
                        <feMerge>
                          <feMergeNode />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {LETTER_STROKES[letter]?.map((stroke, i) => (
                      <g key={i}>
                        <motion.path
                          d={stroke}
                          fill="transparent"
                          stroke="rgba(99, 102, 241, 0.3)"
                          strokeWidth="40"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ 
                            duration: 1.5, 
                            delay: i * 1.6,
                            ease: "easeInOut" 
                          }}
                        />
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: [0, 1, 1, 0],
                            offsetDistance: ["0%", "100%"]
                          }}
                          transition={{ 
                            duration: 1.5, 
                            delay: i * 1.6,
                            times: [0, 0.1, 0.9, 1],
                            ease: "easeInOut" 
                          }}
                          style={{ 
                            offsetPath: `path("${stroke}")`,
                            offsetRotate: "auto",
                            filter: "url(#handShadow)"
                          }}
                        >
                          <g transform="rotate(45) translate(-20, -20)">
                            <Pointer className="w-16 h-16 text-indigo-500 fill-indigo-100" strokeWidth={3} />
                          </g>
                        </motion.g>
                      </g>
                    ))}
                  </svg>
                )}
                
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-full cursor-crosshair relative z-10"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={endDrawing}
                />
                
                <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-20">
                  <button 
                    onClick={clearCanvas}
                    className="p-3 md:p-4 bg-red-500 text-white rounded-full shadow-lg hover:rotate-12 transition-transform"
                  >
                    <RotateCcw className="w-6 h-6 md:w-8 md:h-8" />
                  </button>
                </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-4 md:mt-8 w-full flex justify-center items-center gap-3 md:gap-8 pb-4">
        <button 
          onClick={prev}
          className="p-3 md:p-6 bg-orange-500 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform border-b-4 border-orange-700"
        >
          <ChevronLeft className="w-5 h-5 md:w-10 md:h-10" />
        </button>
        <div className="bg-white dark:bg-slate-800 px-6 md:px-10 py-3 md:py-5 rounded-2xl md:rounded-3xl shadow-xl border-4 border-orange-500 flex items-center justify-center min-w-[200px] md:min-w-[400px] h-14 md:h-24 relative overflow-hidden group">
           <AnimatePresence mode="wait">
             <motion.div 
               key={letter}
               initial={{ x: 20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -20, opacity: 0 }}
               transition={{ duration: 0.2 }}
               className="absolute inset-0 flex items-center gap-4 md:gap-8 w-full justify-center px-4"
             >
                <div className="flex items-center gap-3">
                  <span className="text-4xl md:text-6xl font-black text-orange-500 italic drop-shadow-sm leading-none shrink-0">
                    {letter}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => audioService.speak(`${letter} for ${vocab.word}`)}
                    className="p-2 md:p-4 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all hover:rotate-3"
                    title="Listen"
                  >
                    <Volume2 className="w-5 h-5 md:w-10 md:h-10" />
                  </motion.button>
                </div>
                <span className="w-px h-8 md:h-12 bg-slate-200 shrink-0"></span>
                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                  <span className="text-3xl md:text-5xl shrink-0">{vocab.image}</span>
                  <span className="text-sm md:text-3xl font-black uppercase tracking-tight text-slate-700 truncate">
                    {vocab.word}
                  </span>
                </div>
             </motion.div>
           </AnimatePresence>
        </div>
        <button 
          onClick={next}
          className="p-4 md:p-6 bg-orange-500 text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-transform border-b-4 border-orange-700"
        >
          <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
        </button>
      </div>
    </div>
  );
}

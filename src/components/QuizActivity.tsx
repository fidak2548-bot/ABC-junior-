import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Star, 
  CheckCircle2, 
  ArrowRight,
  Trophy,
  GraduationCap,
  Timer,
  Hash
} from 'lucide-react';
import { audioService } from '../services/AudioService';
import confetti from 'canvas-confetti';
import { QuizResult } from '../types';

interface QuizActivityProps {
  onComplete: (result: QuizResult) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const QUIZ_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Mapping for letter sounds/hints
const SOUND_HINTS: Record<string, string> = {
  A: "Ah", B: "Buh", C: "Kuh", D: "Duh", E: "Eh", F: "Fuh", G: "Guh", H: "Huh", I: "Ih", J: "Juh",
  K: "Kuh", L: "Luh", M: "Muh", N: "Nuh", O: "Oh", P: "Puh", Q: "Kwuh", R: "Ruh", S: "Suh", T: "Tuh",
  U: "Uh", V: "Vuh", W: "Wuh", X: "Ksuh", Y: "Yuh", Z: "Zuh"
};

const TIMER_LIMITS: Record<Difficulty, number> = {
  easy: 30,
  medium: 20,
  hard: 10
};

export default function QuizActivity({ onComplete }: QuizActivityProps) {
  const [isMuted, setIsMuted] = useState(!audioService.isMusicOn());
  const [step, setStep] = useState<'start' | 'quiz' | 'result'>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const timerRef = useRef<any>(null);

  // Initialize quiz
  const startQuiz = (diff: Difficulty, count: number) => {
    const shuffled = [...QUIZ_LETTERS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, count));
    setDifficulty(diff);
    setTotalQuestions(count);
    setCurrentQuestion(0);
    setScore(0);
    setMistakes([]);
    setStep('quiz');
    setHasChecked(false);
    setIsCorrect(null);
    startTimer(diff);
  };

  const startTimer = (diff: Difficulty) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const limit = TIMER_LIMITS[diff];
    setTimeLeft(limit);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (!hasChecked) {
      setHasChecked(true);
      setIsCorrect(false);
      audioService.playEffect('wrong');
      // Gentle encouragement
      audioService.speak(`Time is up! Write letter ${currentLetter}`);
    }
  };

  useEffect(() => {
    audioService.startMusic();
    return () => {
      audioService.stopMusic();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const toggleMute = () => {
    audioService.toggleMusic();
    setIsMuted(!audioService.isMusicOn());
  };

  const currentLetter = questions[currentQuestion];

  useEffect(() => {
    if (step === 'quiz' && currentLetter) {
      askQuestion();
      startTimer(difficulty);
    }
  }, [step, currentQuestion, currentLetter]);

  const askQuestion = () => {
    const prompt = difficulty === 'hard' 
      ? `Write the letter that makes the sound ${SOUND_HINTS[currentLetter]}`
      : `Write the letter ${currentLetter}`;
    
    // Use improved polite and realistic defaults from AudioService
    audioService.speak(difficulty === 'hard' ? prompt : `Write the letter ${currentLetter}`);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasDrawn(false);
  };

  const startDrawing = (ex: any) => {
    if (hasChecked) return;
    if (ex.cancelable) ex.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    
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
    ctx.lineWidth = 35; // Thicker for easier detection
    ctx.strokeStyle = '#4F46E5';
  };

  const draw = (ex: any) => {
    if (!isDrawing || hasChecked) return;
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
    
    if (Math.random() > 0.9) {
      audioService.playEffect('pencil');
    }
  };

  const endDrawing = () => setIsDrawing(false);

  const checkAnswer = async () => {
    if (!hasDrawn) {
      audioService.speak("Please write the letter first!");
      return;
    }
    
    setHasChecked(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let filledPixels = 0;
    
    let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4 + 3;
        if (pixels[i] > 50) {
          filledPixels++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    // 1. Basic Size & Density Check
    const isReasonableSize = width > 120 && height > 120; // Slightly more forgiving size
    const boundingBoxArea = width * height;
    const density = filledPixels / boundingBoxArea;
    
    // Scribble Detection: If more than 60% of the bounding box is filled with ink, it's likely a scribble
    const isScribble = density > 0.65;
    
    // 2. Grid-based Relative Occupancy
    // We analyze the relative structure of the drawing within its own bounding box
    const subGridRows = 3;
    const subGridCols = 3;
    const subGrid = Array(3).fill(0).map(() => Array(3).fill(0));
    
    const subCellWidth = width / 3;
    const subCellHeight = height / 3;
    
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const i = (y * canvas.width + x) * 4 + 3;
        if (pixels[i] > 50) {
          const row = Math.min(2, Math.floor((y - minY) / subCellHeight));
          const col = Math.min(2, Math.floor((x - minX) / subCellWidth));
          subGrid[row][col]++;
        }
      }
    }
    
    // Total ink for relative calculations
    const t = filledPixels;
    
    // Advanced Letter Heuristics
    const LETTER_RULES: Record<string, () => boolean> = {
      'A': () => subGrid[0][1] > t * 0.05 && (subGrid[2][0] + subGrid[2][2]) > t * 0.15 && subGrid[0][0] < t * 0.12,
      'B': () => (subGrid[0][0] + subGrid[1][0] + subGrid[2][0]) > t * 0.25 && subGrid[0][2] > t * 0.05 && subGrid[2][2] > t * 0.05 && subGrid[1][1] > t * 0.03,
      'C': () => subGrid[1][2] < t * 0.08 && subGrid[0][1] > t * 0.08 && subGrid[2][1] > t * 0.08 && subGrid[1][0] > t * 0.1,
      'D': () => (subGrid[0][0] + subGrid[1][0] + subGrid[2][0]) > t * 0.25 && (subGrid[0][2] + subGrid[1][2] + subGrid[2][2]) > t * 0.15,
      'E': () => (subGrid[0][0] + subGrid[1][0] + subGrid[2][0]) > t * 0.3 && subGrid[0][2] > t * 0.05 && subGrid[2][2] > t * 0.05,
      'F': () => (subGrid[0][0] + subGrid[1][0] + subGrid[2][0]) > t * 0.3 && subGrid[0][2] > t * 0.05 && subGrid[2][2] < t * 0.05,
      'G': () => subGrid[0][1] > t * 0.08 && subGrid[1][0] > t * 0.1 && subGrid[1][2] > t * 0.05 && subGrid[2][1] > t * 0.08,
      'H': () => (subGrid[0][0] + subGrid[2][0]) > t * 0.2 && (subGrid[0][2] + subGrid[2][2]) > t * 0.2 && subGrid[1][1] > t * 0.05,
      'I': () => (subGrid[1][1]) > t * 0.3 && height / width > 1.2,
      'J': () => subGrid[0][2] > t * 0.08 && subGrid[2][1] > t * 0.08 && subGrid[2][0] > t * 0.05,
      'K': () => (subGrid[0][0] + subGrid[1][0] + subGrid[2][0]) > t * 0.25 && subGrid[0][2] > t * 0.08 && subGrid[2][2] > t * 0.08,
      'L': () => (subGrid[0][0] + subGrid[1][0] + subGrid[2][0]) > t * 0.3 && subGrid[2][2] > t * 0.15 && subGrid[0][2] < t * 0.1,
      'M': () => (subGrid[0][0] + subGrid[0][2]) > t * 0.2 && subGrid[0][1] > t * 0.05 && subGrid[2][1] < t * 0.2,
      'N': () => (subGrid[0][0] + subGrid[2][2]) > t * 0.2 && subGrid[1][1] > t * 0.05,
      'O': () => subGrid[1][1] < t * 0.5 && subGrid[1][0] > t * 0.1 && subGrid[1][2] > t * 0.1 && subGrid[0][1] > t * 0.1 && subGrid[2][1] > t * 0.1,
      'P': () => (subGrid[0][0] + subGrid[1][0]) > t * 0.2 && subGrid[0][2] > t * 0.08 && subGrid[2][2] < t * 0.05,
      'Q': () => subGrid[1][1] < t * 0.5 && subGrid[2][2] > t * 0.05,
      'R': () => (subGrid[0][0] + subGrid[1][0] + subGrid[2][0]) > t * 0.25 && subGrid[0][2] > t * 0.05 && subGrid[1][2] > t * 0.03 && subGrid[2][2] > t * 0.08,
      'S': () => subGrid[0][2] > t * 0.03 && subGrid[2][0] > t * 0.03 && subGrid[1][1] > t * 0.08 && subGrid[0][0] > t * 0.03,
      'T': () => (subGrid[0][0] + subGrid[0][1] + subGrid[0][2]) > t * 0.3 && subGrid[2][1] > t * 0.1,
      'U': () => (subGrid[0][0] + subGrid[0][2]) > t * 0.3 && subGrid[2][1] > t * 0.1,
      'V': () => (subGrid[0][0] + subGrid[0][2]) > t * 0.3 && subGrid[2][1] > t * 0.15,
      'W': () => (subGrid[0][0] + subGrid[0][2]) > t * 0.3 && subGrid[2][1] > t * 0.05,
      'X': () => (subGrid[0][0] + subGrid[0][2] + subGrid[2][0] + subGrid[2][2]) > t * 0.4,
      'Y': () => (subGrid[0][0] + subGrid[0][2]) > t * 0.2 && subGrid[2][1] > t * 0.1 && subGrid[1][1] > t * 0.05,
      'Z': () => (subGrid[0][0] + subGrid[0][1] + subGrid[0][2]) > t * 0.2 && (subGrid[2][0] + subGrid[2][1] + subGrid[2][2]) > t * 0.2 && subGrid[1][1] > t * 0.1,
    };

    let shapeMatch = true;
    if (LETTER_RULES[currentLetter]) {
      shapeMatch = LETTER_RULES[currentLetter]();
    } else {
      // Default fallback for any letter not explicitly coded
      shapeMatch = !isScribble && isReasonableSize && filledPixels > 3000;
    }

    // Double check 'R' specifically against 'C'
    if (currentLetter === 'R' && subGrid[1][2] < t * 0.03) {
      shapeMatch = false; // R must have something on the middle-right side
    }

    // STRICTOR: If it's a scribble or too sparse, it's wrong.
    if (isScribble || filledPixels < 2800) shapeMatch = false;

    // The user wants "EXACT" detection logic. 
    // We combine size, density, and structural heuristics.
    const correct = isReasonableSize && shapeMatch;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
      audioService.playEffect('correct');
      audioService.playEffect('fanfare');
      confetti({
        particleCount: 50,
        spread: 30,
        origin: { y: 0.8 }
      });
      audioService.speak(`Correct! Great job! That is letter ${currentLetter}`);
    } else {
      setMistakes(prev => prev.includes(currentLetter) ? prev : [...prev, currentLetter]);
      audioService.playEffect('wrong');
      const failMsg = isScribble ? "It looks a bit messy! Try to write clearly." : (!isReasonableSize ? `Too small! Try again. Write the letter ${currentLetter}` : `That doesn't look like ${currentLetter}. Try again!`);
      audioService.speak(failMsg);
      
      // Allow retry instead of penalty if it's the wrong letter
      setTimeout(() => {
        setHasChecked(false);
        setIsCorrect(null);
        clearCanvas();
        startTimer(difficulty);
      }, 3000);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(q => q + 1);
      setHasChecked(false);
      setIsCorrect(null);
      clearCanvas();
    } else {
      setStep('result');
      const conclusion = score >= totalQuestions * 0.5 ? "You will do good" : "No";
      audioService.speak(`Test complete. Your marks are ${score} out of ${totalQuestions}. ${conclusion}`);
      
      if (score >= totalQuestions * 0.7) {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 }
        });
      }
    }
  };

  const handleFinish = () => {
    onComplete({
      score,
      total: totalQuestions,
      date: new Date().toISOString(),
      difficulty
    });
  };

  return (
    <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] flex flex-col items-center justify-center px-2 md:px-4 max-w-5xl mx-auto py-2 md:py-8 overflow-hidden touch-none">
      
      {step === 'start' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] md:rounded-[3rem] p-5 md:p-10 shadow-2xl text-center border-b-[8px] border-indigo-200 w-full max-h-full overflow-y-auto scrollbar-hide"
        >
          <div className="w-12 h-12 md:w-20 md:h-20 bg-indigo-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-6">
            <GraduationCap className="w-8 h-8 md:w-14 md:h-14 text-indigo-600" />
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-slate-800 mb-1 md:mb-4 italic">TEST TIME!</h2>
          <p className="text-xs md:text-xl text-slate-600 mb-4 md:mb-10 font-bold italic">Tests can have 10 or 20 questions. Pick your level!</p>
          
          <div className="space-y-4 md:space-y-8">
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <motion.button
                  key={d}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDifficulty(d)}
                  className={`flex flex-col items-center gap-1 p-2 md:p-4 rounded-xl md:rounded-2xl border-b-2 md:border-b-4 transition-all ${
                    difficulty === d ? (
                      d === 'easy' ? 'bg-green-100 border-green-400 text-green-700 ring-2 ring-green-200' :
                      d === 'medium' ? 'bg-orange-100 border-orange-400 text-orange-700 ring-2 ring-orange-200' :
                      'bg-rose-100 border-rose-400 text-rose-700 ring-2 ring-rose-200'
                    ) : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 font-black'
                  }`}
                >
                  <span className="text-xs md:text-2xl font-black uppercase">{d}</span>
                  <span className="text-[8px] md:text-xs font-bold opacity-80 hidden md:inline">
                    {d === 'easy' ? 'See & Write' : d === 'medium' ? 'Just Listen' : 'Letter Sounds'}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="font-black text-slate-500 uppercase tracking-widest text-[10px] md:text-sm">How many questions?</span>
              <div className="flex gap-4">
                {[10, 20].map(count => (
                  <motion.button
                    key={count}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTotalQuestions(count)}
                    className={`px-6 md:px-12 py-2 md:py-4 rounded-xl md:rounded-2xl font-black text-lg md:text-3xl transition-all border-b-2 md:border-b-4 ${
                      totalQuestions === count ? 'bg-indigo-600 text-white border-indigo-800' : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}
                  >
                    {count}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startQuiz(difficulty, totalQuestions)}
              className="w-full bg-indigo-600 text-white font-black py-3 md:py-6 rounded-xl md:rounded-3xl shadow-[0_4px_0_0_#3730A3] md:shadow-[0_8px_0_0_#3730A3] text-lg md:text-3xl uppercase tracking-widest flex items-center justify-center gap-2 md:gap-4"
            >
              Start Game! <ArrowRight className="w-5 h-5 md:w-8 md:h-8" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {step === 'quiz' && (
        <div className="w-full h-full flex flex-col items-center gap-2 md:gap-4 max-h-screen overflow-hidden">
          {/* Progress & Score */}
          <div className="w-full flex justify-between items-center bg-white/60 p-2 md:p-4 rounded-xl md:rounded-3xl backdrop-blur-md border border-white shadow-lg shrink-0">
            <div className="flex flex-col gap-1 flex-1 max-w-[120px] md:max-w-[200px]">
              <div className="flex justify-between items-center px-1">
                <span className="text-[8px] md:text-xs font-black text-slate-600 uppercase">Q: {currentQuestion + 1} / {totalQuestions}</span>
              </div>
              <div className="h-2 md:h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-indigo-500"
                  animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-4">
              <div className={`flex items-center gap-1 md:gap-2 px-2 md:px-5 py-1 md:py-2 rounded-full font-black text-[10px] md:text-xl tabular-nums ${timeLeft <= 5 ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-100 text-indigo-600'}`}>
                <Timer className="w-3 h-3 md:w-6 md:h-6" />
                {timeLeft}s
              </div>
              <div className="bg-yellow-400 text-white px-2 md:px-5 py-1 md:py-2 rounded-full font-black text-[10px] md:text-xl shadow-md flex items-center gap-1">
                <Star className="w-3 h-3 md:w-6 md:h-6 fill-white" />
                Marks: {score}
              </div>
            </div>
          </div>

          {/* Canvas Card */}
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex-1 bg-white rounded-[1.5rem] md:rounded-[3rem] p-3 md:p-8 shadow-xl relative overflow-hidden flex flex-col"
          >
            {/* Teacher Instructions */}
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-2 md:mb-6 shrink-0 relative w-full">
              <div className="absolute left-0 flex gap-2">
                <button 
                  onClick={toggleMute}
                  className="w-10 h-10 md:w-16 md:h-16 bg-white border-2 border-indigo-100 text-indigo-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 md:w-8 md:h-8" /> : <Volume2 className="w-5 h-5 md:w-8 md:h-8" />}
                </button>
                <button 
                  onClick={askQuestion}
                  className="w-10 h-10 md:w-16 md:h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                >
                  <Volume2 className="w-5 h-5 md:w-8 md:h-8" />
                </button>
              </div>
              <h3 className="text-xl md:text-5xl font-black text-indigo-600 text-center leading-tight uppercase tracking-tighter flex items-center gap-2">
                Write letter: <span className="text-rose-500 bg-rose-50 px-4 py-1 rounded-2xl border-2 border-rose-200">{currentLetter}</span>
              </h3>
            </div>

            {/* Handwriting Area - Dynamic sizing based on viewport */}
            <div className="relative flex-1 w-full bg-slate-50 rounded-xl md:rounded-2xl border-2 md:border-4 border-dashed border-slate-200 touch-none overflow-hidden group">
              {difficulty === 'easy' && !hasChecked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <span className="text-[200px] md:text-[400px] font-black">{currentLetter}</span>
                </div>
              )}
              
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className={`w-full h-full cursor-crosshair relative z-10 ${hasChecked ? 'pointer-events-none' : ''}`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
              />

              <div className="absolute bottom-2 right-2 z-20">
                <button 
                  onClick={clearCanvas}
                  disabled={hasChecked}
                  className="p-2 md:p-4 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 disabled:opacity-50 shadow-sm"
                  title="Clear"
                >
                  <RotateCcw className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {isCorrect !== null && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 z-30 flex flex-col items-center justify-center backdrop-blur-sm ${
                      isCorrect ? 'bg-green-500/10' : 'bg-rose-500/10'
                    }`}
                  >
                    <motion.div 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className={`p-4 md:p-8 rounded-full shadow-2xl ${isCorrect ? 'bg-green-500' : 'bg-rose-500'}`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-12 h-12 md:w-24 md:h-24 text-white" /> : <Star className="w-12 h-12 md:w-24 md:h-24 text-white rotate-45" />}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="mt-3 md:mt-8 flex gap-2 md:gap-4 shrink-0">
              <motion.button
                whileHover={!hasChecked ? { scale: 1.02 } : {}}
                whileTap={!hasChecked ? { scale: 0.98 } : {}}
                onClick={checkAnswer}
                disabled={hasChecked || !hasDrawn}
                className="flex-1 bg-indigo-600 text-white font-black py-3 md:py-6 rounded-xl md:rounded-3xl shadow-[0_4px_0_0_#3730A3] md:shadow-[0_8px_0_0_#3730A3] text-lg md:text-3xl uppercase tracking-widest disabled:opacity-50 disabled:translate-y-1 md:disabled:translate-y-2 disabled:shadow-none transition-all"
              >
                CHECK
              </motion.button>
              
              <AnimatePresence>
                {hasChecked && isCorrect && (
                  <motion.button
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextQuestion}
                    className="flex-1 bg-green-500 text-white font-black py-3 md:py-6 rounded-xl md:rounded-3xl shadow-[0_4px_0_0_#166534] md:shadow-[0_8px_0_0_#166534] text-lg md:text-3xl uppercase tracking-widest flex items-center justify-center gap-2 md:gap-4"
                  >
                    NEXT <ArrowRight className="w-5 h-5 md:w-8 md:h-8" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}

      {step === 'result' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 shadow-2xl text-center border-b-[8px] md:border-b-[12px] border-amber-100 max-w-2xl w-full max-h-full overflow-y-auto scrollbar-hide"
        >
          <div className="relative inline-block mb-3 md:mb-8">
            <Trophy className={`w-16 h-16 md:w-32 md:h-32 ${score >= totalQuestions * 0.5 ? 'text-yellow-400' : 'text-slate-300'}`} />
            {score >= totalQuestions * 0.7 && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-red-500 text-white p-2 md:p-4 rounded-full"
              >
                <Star className="w-4 h-4 md:w-8 md:h-8 fill-white" />
              </motion.div>
            )}
          </div>
          
          <h2 className="text-2xl md:text-6xl font-black text-slate-800 mb-1 md:mb-2 italic">TEST COMPLETE!</h2>
          <p className="text-sm md:text-2xl text-slate-600 mb-4 md:mb-8 font-bold italic">
            {score >= totalQuestions * 0.5 ? "You will do good" : "No"}
          </p>
          
          <div className="bg-slate-50 rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-8 mb-6 md:mb-8 border-2 border-slate-100">
            <span className="text-[8px] md:text-sm font-black text-slate-400 block mb-1 md:mb-2 uppercase tracking-widest">Final Marks</span>
            <div className="text-4xl md:text-8xl font-black text-indigo-600 tabular-nums">
              {score} <span className="text-xl md:text-4xl text-slate-300">/ {totalQuestions}</span>
            </div>
          </div>

          {mistakes.length > 0 && (
            <div className="mb-8 text-left bg-rose-50 p-4 md:p-6 rounded-2xl border-2 border-rose-100">
              <h4 className="text-rose-600 font-black text-lg mb-2 uppercase tracking-tight flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Letters to Practice
              </h4>
              <div className="flex flex-wrap gap-2">
                {mistakes.map(m => (
                  <span key={m} className="w-8 h-8 md:w-10 md:h-10 bg-white border-2 border-rose-200 text-rose-500 rounded-lg flex items-center justify-center font-black">
                    {m}
                  </span>
                ))}
              </div>
              <p className="text-rose-400 text-xs md:text-sm mt-3 font-bold italic">
                Don't worry! Every mistake is a chance to learn something new.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 md:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep('start')}
              className="w-full bg-indigo-600 text-white font-black py-3 md:py-6 rounded-xl md:rounded-3xl shadow-[0_4px_0_0_#3730A3] md:shadow-[0_8px_0_0_#3730A3] text-sm md:text-2xl uppercase tracking-widest"
            >
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              className="w-full bg-white text-indigo-600 border-2 md:border-4 border-indigo-600 font-black py-3 md:py-6 rounded-xl md:rounded-3xl text-sm md:text-2xl uppercase tracking-widest"
            >
              Finish
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

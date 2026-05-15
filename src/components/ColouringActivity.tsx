import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Check, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { COLORS } from '../types';
import { audioService } from '../services/AudioService';
import confetti from 'canvas-confetti';

interface ColouringActivityProps {
  onComplete: () => void;
}

const PAGES = [
  { id: 'apple', icon: '🍎', label: 'Apple' },
  { id: 'ball', icon: '⚽', label: 'Ball' },
  { id: 'cat', icon: '🐱', label: 'Cat' },
  { id: 'dog', icon: '🐶', label: 'Dog' },
  { id: 'sun', icon: '☀️', label: 'Sun' },
  { id: 'star', icon: '⭐', label: 'Star' },
  { id: 'car', icon: '🚗', label: 'Car' },
  { id: 'flower', icon: '🌸', label: 'Flower' },
  { id: 'bird', icon: '🐦', label: 'Bird' },
  { id: 'fish', icon: '🐟', label: 'Fish' },
  { id: 'butterfly', icon: '🦋', label: 'Butterfly' },
  { id: 'moon', icon: '🌙', label: 'Moon' },
  { id: 'house', icon: '🏠', label: 'House' },
  { id: 'tree', icon: '🌳', label: 'Tree' },
  { id: 'elephant', icon: '🐘', label: 'Elephant' },
  { id: 'rocket', icon: '🚀', label: 'Rocket' },
];

export default function ColouringActivity({ onComplete }: ColouringActivityProps) {
  const [isMuted, setIsMuted] = useState(!audioService.isMusicOn());
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [brushSize, setBrushSize] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const page = PAGES[pageIndex];

  useEffect(() => {
    audioService.startMusic();
    resetCanvas();
    return () => {
      audioService.stopMusic();
    };
  }, [pageIndex]);

  const toggleMute = () => {
    audioService.toggleMusic();
    setIsMuted(!audioService.isMusicOn());
  };

  const resetCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw initial outline or background emoji
    ctx.font = '200px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.2; // Increased visibility
    ctx.strokeText(page.icon, canvasRef.current.width/2, canvasRef.current.height/2);
    ctx.globalAlpha = 1.0;
  };

  const startDrawing = (ex: any) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = ex.clientX ?? ex.touches?.[0]?.clientX;
    const clientY = ex.clientY ?? ex.touches?.[0]?.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = selectedColor;
  };

  const draw = (ex: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = ex.clientX ?? ex.touches?.[0]?.clientX;
    const clientY = ex.clientY ?? ex.touches?.[0]?.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Play brush sound throttled
    if (Math.random() > 0.85) {
      audioService.playEffect('brush');
    }
  };

  const endDrawing = () => setIsDrawing(false);

  const handleDone = () => {
    confetti({ particleCount: 100, spread: 60 });
    audioService.playEffect('correct');
    audioService.speak(`Beautiful coloring! Your ${page.label} looks amazing!`);
    onComplete();
  };

  return (
    <div className="pb-24 px-4 flex flex-col items-center max-w-5xl mx-auto min-h-[calc(100vh-12rem)]">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full flex-1">
        
        {/* Color Palette */}
        <div className="flex md:flex-col gap-2 md:gap-3 items-center bg-white dark:bg-slate-800 p-3 md:p-6 rounded-2xl md:rounded-[3rem] shadow-lg order-2 md:order-1 overflow-x-auto min-w-[120px]">
          <div className="md:grid md:grid-cols-2 gap-3 flex">
            {COLORS.map(color => (
              <motion.button
                key={color.value}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  audioService.playEffect('click');
                  setSelectedColor(color.value);
                  audioService.speak(color.name);
                }}
                className={`w-12 h-12 md:w-16 md:h-20 rounded-2xl border-2 md:border-4 shrink-0 flex flex-col items-center justify-center gap-1 transition-all ${selectedColor === color.value ? 'border-slate-800 scale-110 shadow-lg' : 'border-slate-100'}`}
                style={{ backgroundColor: color.value }}
              >
                <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-tighter ${['#ffffff', '#facc15'].includes(color.value) ? 'text-slate-800' : 'text-white'}`}>
                  {color.name}
                </span>
              </motion.button>
            ))}
          </div>
          <div className="w-px md:w-full md:h-px bg-slate-200 dark:bg-slate-700 mx-2 md:my-4"></div>
          <div className="flex md:flex-col gap-3">
            {[15, 40, 80].map(size => (
              <button
                 key={size}
                 onClick={() => setBrushSize(size)}
                 className={`w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0 transition-all ${brushSize === size ? 'ring-4 ring-pink-500 bg-white' : 'hover:bg-slate-200'}`}
              >
                 <div className="bg-slate-800 rounded-full" style={{ width: size / 4 + 4, height: size / 4 + 4 }}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Drawing Board */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl md:rounded-[3rem] border-[4px] md:border-[10px] border-[#FFD93D] shadow-2xl relative overflow-hidden flex flex-col order-1 md:order-2 aspect-square md:aspect-auto">
            <div className="p-3 md:p-6 bg-yellow-400 flex justify-between items-center border-b-4 border-yellow-600">
               <div className="flex items-center gap-2 md:gap-4 font-black">
                  <button 
                    onClick={toggleMute}
                    className={`p-2 bg-white rounded-xl transition-all border-2 border-slate-800 shadow-sm ${isMuted ? 'text-rose-500' : 'text-slate-800'}`}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 md:w-8 md:h-8" /> : <Volume2 className="w-5 h-5 md:w-8 md:h-8" />}
                  </button>
                  <h3 className="text-xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">{page.label}</h3>
               </div>
               <div className="flex gap-2">
                  <button onClick={resetCanvas} className="p-2 md:p-3 bg-white/20 rounded-xl hover:bg-white/40 transition-colors border-2 border-slate-800 shadow-sm"><RotateCcw className="w-5 h-5 md:w-8 md:h-8 text-slate-800" /></button>
                  <button onClick={handleDone} className="px-4 md:px-8 py-2 md:py-3 bg-green-500 text-white rounded-2xl flex items-center gap-2 font-black shadow-[0_4px_0_0_#166534] hover:translate-y-0.5 active:translate-y-1 transition-all border-2 border-slate-800 text-sm md:text-xl uppercase italic"><Check className="w-5 h-5 md:w-8 md:h-8" /> DONE</button>
               </div>
            </div>
            
            <div className="flex-1 relative bg-slate-50 dark:bg-slate-900/50 touch-none">
               <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none select-none">
                  <span className="text-[200px] md:text-[400px] drop-shadow-sm">{page.icon}</span>
               </div>
               <canvas
                 ref={canvasRef}
                 width={800}
                 height={600}
                 className="w-full h-full cursor-crosshair isolate"
                 onMouseDown={startDrawing}
                 onMouseMove={draw}
                 onMouseUp={endDrawing}
                 onTouchStart={startDrawing}
                 onTouchMove={draw}
                 onTouchEnd={endDrawing}
               />
            </div>
        </div>
      </div>

      {/* Page Selector */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <button 
           onClick={() => {
             audioService.playEffect('click');
             setPageIndex(v => (v - 1 + PAGES.length) % PAGES.length);
           }}
           className="p-3 md:p-4 bg-pink-500 text-white rounded-full shadow-lg border-b-4 border-pink-700"
        >
          <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
        </button>
        <div className="flex gap-1 md:gap-2 bg-white dark:bg-slate-800 p-1 md:p-2 rounded-xl md:rounded-2xl shadow-xl border-2 md:border-4 border-pink-400 overflow-x-auto max-w-[200px] md:max-w-md scrollbar-hide">
           {PAGES.map((p, i) => (
             <button
               key={p.id}
               onClick={() => {
                 audioService.playEffect('click');
                 setPageIndex(i);
               }}
               className={`text-xl md:text-3xl p-2 md:p-3 rounded-lg md:rounded-xl transition-all shrink-0 ${pageIndex === i ? 'bg-pink-100 scale-110' : 'hover:bg-slate-50'}`}
             >
               {p.icon}
             </button>
           ))}
        </div>
        <button 
          onClick={() => {
            audioService.playEffect('click');
            setPageIndex(v => (v + 1) % PAGES.length);
          }}
          className="p-3 md:p-4 bg-pink-500 text-white rounded-full shadow-lg border-b-4 border-pink-700"
        >
          <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
        </button>
      </div>
    </div>
  );
}

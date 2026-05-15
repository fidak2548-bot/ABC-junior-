import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ALPHABET, VOCABULARY } from '../../types';
import { audioService } from '../../services/AudioService';
import confetti from 'canvas-confetti';

interface GameProps {
  onComplete: () => void;
}

export default function MemoryGame({ onComplete }: GameProps) {
  const [cards, setCards] = useState<{ id: number; letter: string; flipped: boolean; matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);

  useEffect(() => {
    generateCards();
  }, []);

  const generateCards = () => {
    const pool = [...ALPHABET].sort(() => 0.5 - Math.random()).slice(0, 4);
    const pairs = [...pool, ...pool]
      .sort(() => 0.5 - Math.random())
      .map((letter, i) => ({ id: i, letter, flipped: false, matched: false }));
    setCards(pairs);
  };

  const handleFlip = (id: number) => {
    if (flipped.length === 2 || cards[id].flipped || cards[id].matched) return;
    
    audioService.playEffect('click');
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    setFlipped([...flipped, id]);

    if (flipped.length === 1) {
      const firstId = flipped[0];
      if (cards[firstId].letter === cards[id].letter) {
        // Match!
        setTimeout(() => {
          audioService.playEffect('match');
          audioService.speak(cards[id].letter);
          const matchedCards = [...cards];
          matchedCards[firstId].matched = true;
          matchedCards[id].matched = true;
          setCards(matchedCards);
          setFlipped([]);
          
          if (matchedCards.every(c => c.matched)) {
            setTimeout(() => {
              confetti({ particleCount: 100 });
              audioService.playEffect('fanfare');
              onComplete();
              generateCards();
            }, 500);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstId].flipped = false;
          resetCards[id].flipped = false;
          setCards(resetCards);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-h-[70vh] py-2">
      <h4 className="text-2xl md:text-3xl font-black mb-4 uppercase text-indigo-600 italic tracking-tight">Tile Match! 🧩</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4 max-w-2xl px-4 w-full justify-items-center">
        {cards.map(card => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFlip(card.id)}
            className="w-20 h-28 xs:w-24 xs:h-32 sm:w-32 sm:h-44 cursor-pointer perspective-1000"
          >
             <motion.div
               animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
               className="relative w-full h-full transform-style-3d transition-transform duration-500"
             >
                {/* Back of Card */}
                <div className="absolute inset-0 bg-indigo-500 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center backface-hidden">
                   <div className="text-white text-4xl opacity-50 font-black">?</div>
                </div>
                {/* Front of Card */}
                <div className="absolute inset-0 bg-white rounded-2xl border-4 border-indigo-500 shadow-xl flex flex-col items-center justify-center rotate-y-180 backface-hidden">
                   <span className="text-6xl font-black text-indigo-600">{card.letter}</span>
                   <span className="text-4xl mt-2">{VOCABULARY[card.letter].image}</span>
                </div>
             </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export type ViewState = 'splash' | 'home' | 'tracing' | 'colouring' | 'matching' | 'filling' | 'games' | 'report' | 'quiz' | 'alphabet-boxes' | 'vowels';

export interface QuizResult {
  score: number;
  total: number;
  date: string;
  difficulty: string;
}

export interface Progress {
  tracedLetters: string[];
  stickers: string[];
  stars: number;
  completedGames: string[];
  quizResults: QuizResult[];
}

export interface GameState {
  view: ViewState;
  isNightMode: boolean;
  isSoundOn: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  progress: Progress;
}

export const STORAGE_KEY = 'abc_junior_progress';

export const INITIAL_PROGRESS: Progress = {
  tracedLetters: [],
  stickers: [],
  stars: 0,
  completedGames: [],
  quizResults: [],
};

export const COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Yellow', value: '#facc15' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Black', value: '#1e293b' },
  { name: 'Brown', value: '#78350f' },
];

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export interface WordPair {
  letter: string;
  word: string;
  image: string;
}

export const VOCABULARY: Record<string, WordPair> = {
  A: { letter: 'A', word: 'Apple', image: '🍎' },
  B: { letter: 'B', word: 'Ball', image: '⚽' },
  C: { letter: 'C', word: 'Cat', image: '🐱' },
  D: { letter: 'D', word: 'Dog', image: '🐶' },
  E: { letter: 'E', word: 'Elephant', image: '🐘' },
  F: { letter: 'F', word: 'Fish', image: '🐟' },
  G: { letter: 'G', word: 'Goat', image: '🐐' },
  H: { letter: 'H', word: 'Hat', image: '👒' },
  I: { letter: 'I', word: 'Ice Cream', image: '🍦' },
  J: { letter: 'J', word: 'Jar', image: '🫙' },
  K: { letter: 'K', word: 'Kite', image: '🪁' },
  L: { letter: 'L', word: 'Lion', image: '🦁' },
  M: { letter: 'M', word: 'Monkey', image: '🐒' },
  N: { letter: 'N', word: 'Nose', image: '👃' },
  O: { letter: 'O', word: 'Orange', image: '🍊' },
  P: { letter: 'P', word: 'Pig', image: '🐷' },
  Q: { letter: 'Q', word: 'Queen', image: '👸' },
  R: { letter: 'R', word: 'Rabbit', image: '🐰' },
  S: { letter: 'S', word: 'Sun', image: '☀️' },
  T: { letter: 'T', word: 'Tiger', image: '🐯' },
  U: { letter: 'U', word: 'Umbrella', image: '☂️' },
  V: { letter: 'V', word: 'Van', image: '🚐' },
  W: { letter: 'W', word: 'Watermelon', image: '🍉' },
  X: { letter: 'X', word: 'X-ray', image: '🩻' },
  Y: { letter: 'Y', word: 'Yo-yo', image: '🪀' },
  Z: { letter: 'Z', word: 'Zebra', image: '🦓' },
};

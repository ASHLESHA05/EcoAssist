// stores/useScoreStore.ts
import { create } from 'zustand';

type ScoreStore = {
  score: number;
  updateScore: (points: number) => void;
};

export const useScoreStore = create<ScoreStore>((set) => ({
  score: 50, // Initial score
  updateScore: (points: number) => set((state:any) => ({ score: state.score + points })),
}));
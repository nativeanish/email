import { create } from "zustand";

interface BellState {
  status: number;
  increment: () => void;
  clear: () => void;
}
const useBell = create<BellState>((set) => ({
  status: 0,
  increment: () => set((state) => ({ status: state.status + 1 })),
  clear: () => set({ status: 0 }),
}));
export default useBell;

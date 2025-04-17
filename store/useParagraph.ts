import { create } from "zustand";

interface State {
    align: "left" | "center" | "right";
    setAlign: (align: "left" | "center" | "right") => void;
}
const usePragraph = create<State>((set) => ({
    align: "left",
    setAlign: (align) => set({ align }),
}));
export default usePragraph;
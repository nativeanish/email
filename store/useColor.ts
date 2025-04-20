import { create } from "zustand";

interface State {
    bg: string;
    setBg: (bg: string) => void;
    text: string;
    setText: (text: string) => void;
    highlightColor: string;
    setHighlightColor: (color: string) => void;
}

const useColor = create<State>((set) => ({
    bg: "#ffffff",
    setBg: (bg) => set({ bg }),
    text: "#000000",
    setText: (text) => set({ text }),
    highlightColor: "#ffeb3b",
    setHighlightColor: (color) => set({ highlightColor: color }),
}));

export default useColor;
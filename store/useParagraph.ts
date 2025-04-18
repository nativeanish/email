import { create } from "zustand";
export type element = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "ol" | "ul" | "q" | "code" | "check";
interface State {
    align: "left" | "center" | "right";
    setAlign: (align: "left" | "center" | "right") => void;
    element: element;
    setElement: (element: element) => void;
}
const usePragraph = create<State>((set) => ({
    align: "left",
    setAlign: (align) => set({ align }),
    element: "p",
    setElement: (element) => set({ element }),
}));
export default usePragraph;
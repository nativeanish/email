import { create } from "zustand";

interface State {
    isOpen: boolean;
    change: (e: boolean) => void;
}
const useSideBar = create<State>((set) => ({
    isOpen: true,
    change: (e) => set(() => ({ isOpen: e })),
}));
export default useSideBar;
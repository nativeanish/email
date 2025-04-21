import { create } from "zustand";

interface State {
    show: boolean;
    setShow: (show: boolean) => void;
}
const useMessage = create<State>((set) => ({
    show: false,
    setShow: (show) => set({ show }),
}));
export default useMessage;
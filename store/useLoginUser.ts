import { create } from "zustand";
import { User } from "../types/user";

interface State{
    user: null | User;
    setUser: (user: User | null) => void;
}
const useLoginUser = create<State>((set) => ({
    user: null, 
    setUser: (user) => set({ user }),
}));
export default useLoginUser;
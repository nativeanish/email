import { create } from "zustand";
export interface EmailChip {
  email: string;
  id: string;
}
interface State {
  subject: string;
  body: string;
  to: Array<EmailChip>;
  setSubject: (subject: string) => void;
  setBody: (body: string) => void;
  addTo: (email: EmailChip) => void;
  removeTo: (id: string) => void;
  clearFields: () => void;
}

const useMail = create<State>((set) => ({
  subject: "",
  body: "",
  to: [],
  setSubject: (subject: string) => set({ subject }),
  setBody: (body: string) => set({ body }),
  addTo: (email: EmailChip) => set((state) => ({ to: [...state.to, email] })),
  removeTo: (id: string) =>
    set((state) => ({
      to: state.to.filter((email) => email.id !== id),
    })),
  clearFields: () => set({ subject: "", body: "", to: [] }),
}));
export default useMail;

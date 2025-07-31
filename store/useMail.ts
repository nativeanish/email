import { create } from "zustand";
export interface EmailChip {
  email: string;
  id: string;
}
interface State {
  subject: string;
  body: string;
  to: Array<EmailChip>;
  cc: Array<EmailChip>;
  bcc: Array<EmailChip>;
  setSubject: (subject: string) => void;
  setBody: (body: string) => void;
  addTo: (email: EmailChip) => void;
  addCc: (email: EmailChip) => void;
  addBcc: (email: EmailChip) => void;
  showCC: boolean;
  showBCC: boolean;
  setShowCC: (show: boolean) => void;
  setShowBCC: (show: boolean) => void;
  removeTo: (id: string) => void;
  removeCc: (id: string) => void;
  removeBcc: (id: string) => void;
  clearFields: () => void;
}

const useMail = create<State>((set) => ({
  subject: "",
  body: "",
  to: [],
  cc: [],
  bcc: [],
  showCC: false,
  showBCC: false,
  setShowCC: (show: boolean) => set({ showCC: show }),
  setShowBCC: (show: boolean) => set({ showBCC: show }),
  setSubject: (subject: string) => set({ subject }),
  setBody: (body: string) => set({ body }),
  addTo: (email: EmailChip) => set((state) => ({ to: [...state.to, email] })),
  addCc: (email: EmailChip) => set((state) => ({ cc: [...state.cc, email] })),
  addBcc: (email: EmailChip) =>
    set((state) => ({ bcc: [...state.bcc, email] })),
  removeTo: (id: string) =>
    set((state) => ({
      to: state.to.filter((email) => email.id !== id),
    })),
  removeCc: (id: string) =>
    set((state) => ({
      cc: state.cc.filter((email) => email.id !== id),
    })),
  removeBcc: (id: string) =>
    set((state) => ({
      bcc: state.bcc.filter((email) => email.id !== id),
    })),
  clearFields: () =>
    set({
      subject: "",
      body: "",
      to: [],
      cc: [],
      bcc: [],
      showCC: false,
      showBCC: false,
    }),
}));
export default useMail;

import { create } from "zustand";
import { Box } from "../types/user";
export type mail = Box & {
  body: string;
  subject: string;
};
interface State {
  User:
    | Array<{
        image: string;
        image_type: "url" | "base64";
        name: string;
        isArweave: boolean;
        address: string;
      }>
    | [];
  mail: mail[];
  setUser: (User: {
    address: string;
    image: string;
    image_type: "url" | "base64";
    name: string;
    isArweave: boolean;
  }) => void;
  ifUserExits: (address: string) => {
    address: string;
    image: string;
    image_type: "url" | "base64";
    name: string;
    isArweave: boolean;
  } | null;
  ifmailExits: (id: string) => Box | null;
  setMail: (mail: mail) => void;
}

const useMailStore = create<State>((set, get) => ({
  User: [],
  mail: [],
  setUser: (User) => {
    const _User = get().User;
    const userExists = _User.some(
      (u) =>
        u.address === User.address &&
        u.image === User.image &&
        u.image_type === User.image_type &&
        u.name === User.name &&
        u.isArweave === User.isArweave
    );
    if (!userExists) {
      set({ User: [..._User, User] });
    }
  },
  ifUserExits: (address) => {
    const _User = get().User;
    const user = _User.find((u) => u.address === address);
    if (user) {
      return {
        address: user.address,
        image: user.image,
        image_type: user.image_type,
        name: user.name,
        isArweave: user.isArweave,
      };
    }
    return null;
  },
  ifmailExits(id) {
    const _mail = get().mail;
    const mail = _mail.find((m) => m.id === id);
    if (mail) {
      return mail;
    }
    return null;
  },
  setMail: (mail) => {
    const _mail = get().mail;
    const mailExists = _mail.some(
      (m) =>
        m.id === mail.id &&
        m.from === mail.from &&
        m.to === mail.to &&
        m.received === mail.received &&
        m.data.iv === mail.data.iv &&
        m.data.data === mail.data.data &&
        m.data.key === mail.data.key &&
        m.delivered_time === mail.delivered_time &&
        m.seen === mail.seen &&
        m.tags.length === mail.tags.length &&
        m.tags.every((tag, index) => tag === mail.tags[index])
    );
    if (!mailExists) {
      set({ mail: [..._mail, mail] });
    }
  },
}));
export default useMailStore;

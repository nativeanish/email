import { create } from "zustand";
import { Box } from "../types/user";
export type mail = Box & {
  body: string;
  subject: string;
};
interface State {
  user:
    | Array<{ username: string; address: string; image: string; name: string }>
    | [];
  setUser: (user: {
    username: string;
    address: string;
    image: string;
    name: string;
  }) => void;
  ifUserExists: (username: string, address: string) => boolean;
  mail: Array<mail> | [];
  setMail: (mail: mail) => void;
  ifMailExists: (
    data: {
      iv: string;
      data: string;
      key: string;
    },
    id: string,
    tags: Array<string>
  ) => boolean;
  getMail: (id: string) => mail | null;
  getUser: (
    username: string,
    address: string
  ) => {
    username: string;
    address: string;
    image: string;
    name: string;
  } | null;
  getUserFrom: (address: string) => {
    username: string;
    address: string;
    image: string;
    name: string;
  } | null;
  changeOneMail: (id: string, data: Partial<mail>) => void;
}
const useMailStorage = create<State>((set, get) => ({
  user: [],
  setUser: (user) => {
    const _user = get().user;
    const userExists = _user.some(
      (u) =>
        u.address === user.address &&
        u.username === user.username &&
        u.image === user.image
    );
    if (!userExists) {
      set({ user: [..._user, user] });
    }
  },
  ifUserExists(username, address) {
    const _user = get().user;
    return _user.some((u) => u.address === address && u.username === username);
  },
  mail: [],
  setMail: (mail) => {
    const _mail = get().mail;
    const mailExists = _mail.some(
      (m) =>
        m.subject === mail.subject &&
        m.body === mail.body &&
        m.from === mail.from &&
        m.to === mail.to &&
        m.id === mail.id &&
        m.tags === mail.tags
    );
    if (!mailExists) {
      set({ mail: [..._mail, mail] });
    }
  },
  ifMailExists(data, id, tags) {
    const _mail = get().mail;
    return _mail.some(
      (m) =>
        m.data.iv === data.iv &&
        m.data.data === data.data &&
        m.data.key === data.key &&
        m.id === id &&
        tags.every((tag) => m.tags.includes(tag))
    );
  },
  getMail(id) {
    const _mail = get().mail;
    return _mail.find((m) => m.id === id) || null;
  },
  getUser(username, address) {
    const _user = get().user;
    return (
      _user.find((u) => u.username === username && u.address === address) ||
      null
    );
  },
  getUserFrom(address) {
    const _user = get().user;
    return _user.find((u) => u.address === address) || null;
  },
  changeOneMail: (id, data) => {
    const _mail = get().mail;
    const mailIndex = _mail.findIndex((m) => m.id === id);
    if (mailIndex !== -1) {
      const updatedMail = { ..._mail[mailIndex], ...data };
      const newMailList = [..._mail];
      newMailList[mailIndex] = updatedMail;
      set({ mail: newMailList });
    }
  },
}));
export default useMailStorage;

import { create } from "zustand";

interface State {
  arns: boolean;
  type: "arns" | "wallet";
  arns_name: string;
  process_id: string;
  set_type: (e: "arns" | "wallet") => void;
  name: string;
  bio: string;
  image: string;
  image_type: null | "url" | "file";
  display_name:string;
  set_display_name: (e: string) => void;
  set_name: (e: string) => void;
  set_bio: (e: string) => void;
  set_image: (e: string) => void;
  set_image_type: (e: "url" | "file") => void;
  keys: { publicKey: string; privateKey: string } | null;
  set_keys: (e: { publicKey: string; privateKey: string }) => void;
}
const useOnboard = create<State>((set) => ({
  arns: false,
  type: "wallet",
  arns_name: "",
  set_type: (e) => set(() => ({ type: e })),
  process_id: "",
  name: "",
  bio: "",
  image: "",
  set_name: (e) => set(() => ({ name: e })),
  set_bio: (e) => set(() => ({ bio: e })),
  set_image: (e) => set(() => ({ image: e })),
  image_type: null,
  set_image_type: (e) => set(() => ({ image_type: e })),
  keys: null,
  set_keys: (e) => set(() => ({ keys: e })),
  display_name: "",
  set_display_name: (e) => set(() => ({ display_name: e }))
}))
export default useOnboard

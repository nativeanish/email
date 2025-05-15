import { create } from "zustand"

interface State {
  walletType: "Metamask" | "Wander" | "Arweave.app" | null
  setType(e: "Metamask" | "Wander" | "Arweave.app" | null): void
  address: string | null
  setAddress(e: string | null): void
}
const useAddress = create<State>((set) => ({
  walletType: null,
  setType: (e) => set({ walletType: e }),
  address: null,
  setAddress: (e) => set({ address: e }),
}))
export default useAddress;

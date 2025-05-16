import { create } from "zustand"

export type WalletType = "Metamask" | "Wander" | "Arweave.app"
interface State {
  walletType: WalletType | null
  setType(e: WalletType | null): void
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

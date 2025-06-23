import type { ReactNode } from "react"

export type WalletType = "ethereum" | "wander"

export interface WalletOption {
  id: WalletType
  name: string
  icon: ReactNode
  description: string
  installUrl?: string
}

export interface WalletConnectionState {
  isConnected: boolean
  connectedWallet: WalletType | null
  address: string | null
  isConnecting: boolean
  error: string | null
}

export interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect?: (wallet: WalletType, address: string) => void
  onDisconnect?: () => void
  title?: string
  description?: string
  walletOptions?: WalletOption[]
  showTerms?: boolean
  termsText?: string
  className?: string
  size?: "sm" | "md" | "lg"
  theme?: "light" | "dark" | "system"
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closable?: boolean
}

export interface UseWalletConnectionReturn extends WalletConnectionState {
  connectWallet: (walletType: WalletType) => Promise<void>
  disconnectWallet: () => void
  checkConnection: () => Promise<void>
}

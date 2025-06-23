import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Wallet, Check, AlertCircle, ExternalLink } from "lucide-react"
import type { WalletModalProps, WalletOption } from "../../types/wallet"
import { cn } from "../../utils/cn"
import Metamask from "../../Image/Metamask"
import Wander from "../../Image/Wander"
import { useWalletStore } from "../../store/useWallet"

const defaultWalletOptions: WalletOption[] = [
  {
    id: "ethereum",
    name: "MetaMask",
    icon: <Metamask />,
    description: "Connect using MetaMask wallet",
    installUrl: "https://metamask.io/download/",
  },
  {
    id: "wander",
    name: "Wander",
    icon: <Wander />,
    description: "Connect using Wander wallet",
    installUrl: "https://www.wander.io/",
  },
]

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
}

export default function WalletModal({
  isOpen,
  onClose,
  onConnect,
  onDisconnect,
  title,
  description = "Choose your preferred wallet to connect",
  walletOptions = defaultWalletOptions,
  showTerms = true,
  termsText =  "You’re agreeing to our Terms. Good news: we can’t read your emails even if we wanted to.",
  className,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closable = true,
}: WalletModalProps) {
  const {
    isConnected,
    connectedWallet,
    address,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    checkConnection,
    clearError,
  } = useWalletStore()

  // Check wallet connection when modal opens
  useEffect(() => {
    if (isOpen) {
      checkConnection()
    }
  }, [isOpen, checkConnection])

  // Call onConnect callback when wallet connects
  useEffect(() => {
    if (isConnected && connectedWallet && address && onConnect) {
      onConnect(connectedWallet, address)
    }
  }, [isConnected, connectedWallet, address, onConnect])

  const handleDisconnect = () => {
    disconnectWallet()
    onDisconnect?.()
  }

  const handleClose = () => {
    if (closable) {
      clearError()
      onClose()
    }
  }

  const handleBackdropClick = () => {
    if (closeOnBackdropClick && closable) {
      handleClose()
    }
  }

  const handleWalletConnect = async (walletType: string) => {
    await connectWallet(walletType as any)
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getConnectedWalletName = () => {
    const wallet = walletOptions.find((w) => w.id === connectedWallet)
    return wallet?.name || "Wallet"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className={cn(
                "bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full mx-auto border border-gray-200 dark:border-gray-700",
                sizeClasses[size],
                className,
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title || (isConnected ? "Wallet Connected" : "Connect Wallet")}
                  </h2>
                </div>
                {showCloseButton && closable && (
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {isConnected ? (
                  /* Connected State */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto">
                      <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Successfully Connected!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Your {getConnectedWalletName()} wallet is now connected.
                      </p>
                      {address && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-mono text-gray-700 dark:text-gray-300">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {formatAddress(address)}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleDisconnect}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                      >
                        Disconnect
                      </button>
                      <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Connection Options */
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{description}</p>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                          {error.includes("not installed") && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Click on a wallet option below to install it.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-3">
                      {walletOptions.map((wallet) => (
                        <motion.button
                          key={wallet.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleWalletConnect(wallet.id)}
                          disabled={isConnecting}
                          className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">{wallet.icon}</div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                  {wallet.name}
                                </h3>
                                {wallet.installUrl && (
                                  <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{wallet.description}</p>
                            </div>
                            {isConnecting && (
                              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {showTerms && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{termsText}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

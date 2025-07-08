"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Wallet, Check, AlertCircle, ExternalLink, User, Copy, AtSign, Hash } from "lucide-react"
import type { WalletModalProps, WalletOption } from "../../types/wallet"
import { cn } from "../../utils/cn"
import Metamask from "../../Image/Metamask"
import Wander from "../../Image/Wander"
import { useWalletStore } from "../../store/useWallet"
import { showSuccess } from "../UI/Toast/Toast-Context"

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

interface ProfileDetails {
  username?: string
  email?: string
  photo?: string
  bio?: string
  name: string
}

interface ExtendedWalletModalProps extends WalletModalProps {
  darkMode?: boolean
  profileDetails?: ProfileDetails
  showProfile?: boolean
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
  termsText = "You're agreeing to our Terms. Good news: we can't read your emails even if we wanted to.",
  className,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closable = true,
  darkMode = true,
  profileDetails,
  showProfile = false,
}: ExtendedWalletModalProps) {
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

  // Check if profile is complete enough to show email integration options
  const canShowEmailIntegration = profileDetails?.username && profileDetails?.photo && profileDetails?.bio

  const renderProfileSection = () => {
    if (!showProfile || !profileDetails) return null

    return (
      <div
        className={cn(
          "mb-6 p-6 rounded-2xl border backdrop-blur-sm",
          darkMode ? "bg-gray-800/50 border-gray-700/50 shadow-xl" : "bg-white/80 border-gray-200/50 shadow-lg",
        )}
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            {profileDetails.photo ? (
              <div className="relative">
                <img
                  src={profileDetails.photo || "/placeholder.svg"}
                  alt={profileDetails.username || "Profile"}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
            ) : (
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center",
                  darkMode ? "bg-gray-700/50" : "bg-gray-100",
                )}
              >
                <User className={cn("w-8 h-8", darkMode ? "text-gray-400" : "text-gray-500")} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              {/* Primary Display - Name or Username */}
              <div className="ml-0.5">
                <h3 className={cn("text-xl font-bold tracking-tight", darkMode ? "text-white" : "text-gray-900")}>
                  {profileDetails.name && profileDetails.name.trim()
                    ? profileDetails.name.length > 20
                      ? `${profileDetails.name.slice(0, 20)}...`
                      : profileDetails.name
                    : profileDetails.username && profileDetails.username.length > 0
                      ? profileDetails.username.length > 20
                        ? `${profileDetails.username.slice(0, 20)}...`
                        : profileDetails.username
                      : "Anonymous User"}
                </h3>
              </div>

              {/* Secondary Info */}
              <div className="space-y-1.5">
                {/* Username with icon */}
                {profileDetails.username && profileDetails.name && profileDetails.name.trim() && (
                  <div className="flex items-center gap-2">
                    <Hash className={cn("w-3.5 h-3.5", darkMode ? "text-gray-500" : "text-gray-400")} />
                    <span
                      className={cn("text-sm font-medium", darkMode ? "text-gray-400" : "text-gray-600")}
                      title={profileDetails.username}
                    >
                      {profileDetails.username.length > 25
                        ? `${profileDetails.username.slice(0, 25)}...`
                        : profileDetails.username}
                    </span>
                  </div>
                )}

                {/* Email with icon */}
                {profileDetails.email && (
                  <div className="flex items-center gap-2">
                    <AtSign className={cn("w-3.5 h-3.5", darkMode ? "text-gray-500" : "text-gray-400")} />
                    <span
                      className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-600")}
                      title={profileDetails.email}
                    >
                      {profileDetails.email.length > 30
                        ? `${profileDetails.email.slice(0, 18)}...@${profileDetails.email.split("@")[1]}`
                        : profileDetails.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profileDetails.bio && (
          <div className="mt-4 pt-4 border-t border-gray-700/30">
            <p className={cn("text-sm leading-relaxed", darkMode ? "text-gray-300" : "text-gray-700")}>
              {profileDetails.bio}
            </p>
          </div>
        )}

        {/* Email Integration Options */}
        {canShowEmailIntegration && (
          <div className="mt-6 pt-6 border-t border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className={cn("text-sm font-semibold", darkMode ? "text-white" : "text-gray-900")}>Email Accounts</h4>
              <span className={cn("text-xs", darkMode ? "text-gray-500" : "text-gray-400")}>Connect your accounts</span>
            </div>

            <div className="grid gap-3">
              <button
                disabled
                className={cn(
                  "group relative p-4 rounded-xl border transition-all duration-200 overflow-hidden",
                  "opacity-60 cursor-not-allowed",
                  darkMode
                    ? "border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50"
                    : "border-gray-200/50 bg-gray-50/50 hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <img
                      src="https://arweave.net/z_DYh_N1jB9phWIS6hRmSnR1cpsqOv5Xn4fROVIqThY"
                      alt="Gmail"
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className={cn("font-medium text-sm", darkMode ? "text-gray-200" : "text-gray-800")}>
                        Gmail
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                        Soon
                      </span>
                    </div>
                    <p className={cn("text-xs mt-0.5", darkMode ? "text-gray-500" : "text-gray-500")}>
                      Connect your Gmail account
                    </p>
                  </div>
                </div>
              </button>

              <button
                disabled
                className={cn(
                  "group relative p-4 rounded-xl border transition-all duration-200 overflow-hidden",
                  "opacity-60 cursor-not-allowed",
                  darkMode
                    ? "border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50"
                    : "border-gray-200/50 bg-gray-50/50 hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <img
                      src="https://arweave.net/_KNuBg_gmO3JscGBvkjATbTRun1fAo6QqB97fSmNm5k"
                      alt="Outlook"
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className={cn("font-medium text-sm", darkMode ? "text-gray-200" : "text-gray-800")}>
                        Outlook
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                        Soon
                      </span>
                    </div>
                    <p className={cn("text-xs mt-0.5", darkMode ? "text-gray-500" : "text-gray-500")}>
                      Connect your Outlook account
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    )
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
                "rounded-2xl shadow-2xl w-full mx-auto border max-h-[90vh] overflow-y-auto",
                darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200",
                sizeClasses[size],
                className,
              )}
            >
              {/* Header */}
              <div
                className={cn(
                  "flex items-center justify-between p-6 border-b sticky top-0 z-10",
                  darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", darkMode ? "bg-blue-900/30" : "bg-blue-100")}>
                    <Wallet className={cn("w-5 h-5", darkMode ? "text-blue-400" : "text-blue-600")} />
                  </div>
                  <h2 className={cn("text-xl font-semibold", darkMode ? "text-white" : "text-gray-900")}>
                    {title || (isConnected ? "Wallet Connected" : "Connect Wallet")}
                  </h2>
                </div>
                {showCloseButton && closable && (
                  <button
                    onClick={handleClose}
                    className={cn(
                      "p-2 rounded-full transition-colors duration-200",
                      darkMode
                        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Profile Section */}
                {renderProfileSection()}

                {isConnected ? (
                  /* Connected State */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-16 h-16 rounded-full mx-auto",
                        darkMode ? "bg-green-900/30" : "bg-green-100",
                      )}
                    >
                      <Check className={cn("w-8 h-8", darkMode ? "text-green-400" : "text-green-600")} />
                    </div>

                    <div>
                      <h3 className={cn("text-lg font-medium mb-2", darkMode ? "text-white" : "text-gray-900")}>
                        Successfully Connected!
                      </h3>
                      <p className={cn("mb-3", darkMode ? "text-gray-400" : "text-gray-600")}>
                        Your {getConnectedWalletName()} wallet is now connected.
                      </p>
                      {address && (
                        <div
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-mono",
                            darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700",
                          )}
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {formatAddress(address)}
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(address)
                              showSuccess("Address copied to clipboard!")
                            }}
                            className={cn(
                              "ml-1 p-1 rounded hover:bg-gray-700/30 transition-colors",
                              darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700",
                            )}
                            title="Copy address"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleDisconnect}
                        className={cn(
                          "flex-1 px-4 py-2 border rounded-lg transition-colors duration-200 font-medium",
                          darkMode
                            ? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
                            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
                        )}
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
                    <p className={cn("text-center mb-6", darkMode ? "text-gray-400" : "text-gray-600")}>
                      {description}
                    </p>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex items-start gap-2 p-3 border rounded-lg",
                          darkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200",
                        )}
                      >
                        <AlertCircle
                          className={cn("w-4 h-4 flex-shrink-0 mt-0.5", darkMode ? "text-red-400" : "text-red-600")}
                        />
                        <div className="flex-1">
                          <p className={cn("text-sm", darkMode ? "text-red-300" : "text-red-700")}>{error}</p>
                          {error.includes("not installed") && (
                            <p className={cn("text-xs mt-1", darkMode ? "text-red-400" : "text-red-600")}>
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
                          className={cn(
                            "w-full p-4 border rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group",
                            darkMode
                              ? "border-gray-700 hover:border-blue-600 hover:bg-blue-900/10"
                              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50",
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">{wallet.icon}</div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <h3
                                  className={cn(
                                    "font-medium",
                                    darkMode
                                      ? "text-white group-hover:text-blue-400"
                                      : "text-gray-900 group-hover:text-blue-600",
                                  )}
                                >
                                  {wallet.name}
                                </h3>
                                {wallet.installUrl && (
                                  <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                              <p className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-500")}>
                                {wallet.description}
                              </p>
                            </div>
                            {isConnecting && (
                              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {showTerms && (
                      <div className={cn("pt-4 border-t", darkMode ? "border-gray-700" : "border-gray-200")}>
                        <p className={cn("text-xs text-center", darkMode ? "text-gray-400" : "text-gray-500")}>
                          {termsText}
                        </p>
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

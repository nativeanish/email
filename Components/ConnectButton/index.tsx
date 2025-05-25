import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Unplug, User } from 'lucide-react'
import Metamask from "../../Image/Metamask"
import Wander from "../../Image/Wander"
import Arweave from "../../Image/Arweave"
import useTheme from "../../store/useTheme"
import { disconnect, wander, metamask, arweave, autoconnect } from "../../utils/wallet"
import useAddress, { WalletType } from "../../store/useAddress"
import useBreakpoint from "../../hooks/useBreakpoint"
export default function ConnectButton() {
  const size = useBreakpoint()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletType>()
  const { theme: _theme } = useTheme()
  const { address, walletType } = useAddress()
  const theme = _theme === "dark" ? "light" : "dark"

  useEffect(() => {
    if (walletType === null) {
      setSelectedWallet("Wander")
    } else {
      setSelectedWallet(walletType as WalletType)
    }
  }, [walletType])

  // Size-based styling
  const buttonPadding = {
    sm: "px-3 py-1.5",
    md: "px-4 py-2",
    lg: "px-5 py-2.5"
  }

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  const handleConnect = () => {
    if (selectedWallet === "Wander") {
      wander().then((e) => {
        alert(e)
      })
    }
    if (selectedWallet === "Metamask") {
      metamask().then(console.log).catch(console.log)
    }

    if (selectedWallet === "Arweave.app") {
      arweave().then(console.log).catch(console.log)
    }
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const selectWallet = (wallet: WalletType) => {
    setSelectedWallet(wallet)
    setIsOpen(false)
  }

  const _disconnect = () => {
    disconnect().then(console.log).catch(console.log)
  }

  useEffect(() => {
    autoconnect()
  }, [])

  return (
    <div className="relative inline-block">
      <div
        className={`flex items-center rounded-md border ${theme === "dark"
          ? "border-gray-700 text-gray-200 bg-gray-950"
          : theme === "light"
            ? "border-gray-300 text-gray-800 bg-white"
            : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
          } overflow-hidden focus:outline-none transition-colors`}
      >
        <button
          className={`${buttonPadding[size]} font-bold ${textSize[size]} ${theme === "dark"
            ? "text-gray-200"
            : theme === "light"
              ? "text-gray-800"
              : "text-gray-800 dark:text-gray-200"
            } focus:outline-none`}
          onClick={handleConnect}
        >
          {address && address.length > 0 && walletType && walletType.length > 0 ? (
            <div className="flex items-center gap-x-2">
              <User className={iconSize[size]} /> {address.slice(0, 5) + "..." + address.slice(-4)}
            </div>
          ) : (
            "CONNECT WALLET"
          )}
        </button>
        <div
          className={`${theme === "dark" ? "bg-gray-800" : theme === "light" ? "bg-gray-900" : "bg-gray-900 dark:bg-gray-800"
            } ${buttonPadding[size]} flex items-center cursor-pointer focus:outline-none`}
          onClick={toggleDropdown}
        >
          {/* Selected wallet logo */}
          {selectedWallet === "Metamask" && (
            <div className={`${iconSize[size]} rounded-full bg-transparent flex items-center justify-center`}>
              <Metamask />
            </div>
          )}
          {selectedWallet === "Wander" && (
            <div className={`${iconSize[size]} rounded-full bg-transparent flex items-center justify-center`}>
              <Wander />
            </div>
          )}
          {selectedWallet === "Arweave.app" && (
            <div className={`${iconSize[size]} rounded-full bg-transparent flex items-center justify-center`}>
              <Arweave theme="dark" />
            </div>
          )}
          <motion.div initial={{ rotate: 0 }} animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="h-3 w-3 ml-1 text-white" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-1 w-40 rounded-md shadow-lg ${theme === "dark"
              ? "bg-gray-800 ring-gray-700"
              : theme === "light"
                ? "bg-white ring-black ring-opacity-5"
                : "bg-white dark:bg-gray-800 ring-black ring-opacity-5 dark:ring-gray-700"
              } z-10`}
          >
            {address && address.length > 0 && walletType && walletType.length > 0 ? (
              <div className="py-1">
                <button
                  onClick={() => _disconnect()}
                  className="flex items-center px-3 py-2 text-xs text-white bg-red-600 hover:bg-red-700 w-full text-left focus:outline-none focus:ring-0 focus:ring-offset-0"
                >
                  <div className="h-5 w-5 rounded-full bg-transparent flex items-center justify-center mr-2">
                    <Unplug className="text-white" />
                  </div>
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="py-1">
                <button
                  onClick={() => selectWallet("Metamask")}
                  className={`flex items-center px-3 py-2 text-xs ${theme === "dark"
                    ? "text-gray-200 hover:bg-gray-700"
                    : theme === "light"
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    } w-full text-left focus:outline-none`}
                >
                  <div className="h-5 w-5 rounded-full bg-transparent flex items-center justify-center mr-2">
                    <Metamask />
                  </div>
                  Metamask
                </button>
                <button
                  onClick={() => selectWallet("Wander")}
                  className={`flex items-center px-3 py-2 text-xs ${theme === "dark"
                    ? "text-gray-200 hover:bg-gray-700"
                    : theme === "light"
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    } w-full text-left focus:outline-none`}
                >
                  <div className="h-5 w-5 rounded-full bg-transparent flex items-center justify-center mr-2">
                    <Wander />
                  </div>
                  Wander
                </button>
                <button
                  onClick={() => selectWallet("Arweave.app")}
                  className={`flex items-center px-3 py-2 text-xs ${theme === "dark"
                    ? "text-gray-200 hover:bg-gray-700"
                    : theme === "light"
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    } w-full text-left focus:outline-none`}
                >
                  <div className="h-5 w-5 rounded-full bg-transparent flex items-center justify-center mr-2">
                    <Arweave theme={theme} />
                  </div>
                  Arweave.app
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

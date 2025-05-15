import React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Unplug, User } from "lucide-react"
import Metamask from "../../Image/Metamask"
import Wander from "../../Image/Wander"
import Arweave from "../../Image/Arweave"
import useTheme from "../../store/useTheme"
import { disconnect, wander, metamask } from "../../utils/wallet"
import useAddress from "../../store/useAddress"

type WalletType = "Metamask" | "Wander" | "Arweave.app"

interface WalletButtonProps {
  defaultWallet?: WalletType
}

export default function ConnectButton({ defaultWallet = "Wander", }: WalletButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletType>(defaultWallet)
  const { theme: _theme } = useTheme()
  const { address, walletType } = useAddress()
  const theme = _theme === "dark" ? "light" : "dark"
  const handleConnect = () => {
    if (selectedWallet === "Wander") {
      wander().then((e) => {
        alert(e)
      })
    }
    if (selectedWallet === "Metamask") {
      metamask().then(console.log).catch(console.log)
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

  return (
    <div className="relative inline-block">
      <div
        className={`flex items-center rounded-full border ${theme === "dark"
          ? "border-gray-700 text-gray-200 bg-gray-950"
          : theme === "light"
            ? "border-gray-300 text-gray-800 bg-white"
            : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
          } overflow-hidden focus:outline-none transition-colors`}
      >
        <button
          className={`px-4 py-2 font-bold text-sm ${theme === "dark"
            ? "text-gray-200"
            : theme === "light"
              ? "text-gray-800"
              : "text-gray-800 dark:text-gray-200"
            }`}
          onClick={handleConnect}
        >
          {address && address.length > 0 && walletType && walletType.length > 0 ? <div className="flex items-center gap-x-2">
            <User /> {" "} {address.slice(0, 5) + "..." + address.slice(-4)}
          </div> : "CONNECT WALLET"}
        </button>
        <div
          className={`${theme === "dark" ? "bg-gray-800" : theme === "light" ? "bg-gray-900" : "bg-gray-900 dark:bg-gray-800"
            } px-2 py-2 flex items-center cursor-pointer`}
          onClick={toggleDropdown}
        >
          {/* Selected wallet logo */}
          {selectedWallet === "Metamask" && (
            <div className="h-5 w-5 rounded-full bg-transparent flex items-center justify-center">
              <Metamask />
            </div>
          )}
          {selectedWallet === "Wander" && (
            <div className="h-5 w-5 rounded-full bg-transparent flex items-center justify-center">
              <Wander />
            </div>
          )}
          {selectedWallet === "Arweave.app" && (
            <div className="h-5 w-5 rounded-full bg-transparent flex items-center justify-center">
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
            {address && address.length > 0 && walletType && walletType.length > 0 ?
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
                <div className="py-1">
                  <button
                    onClick={() => _disconnect()}
                    className={`flex items-center px-3 py-2 text-xs ${theme === "dark"
                      ? "text-gray-200 hover:bg-gray-700"
                      : theme === "light"
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      } w-full text-left`}
                  >
                    <div className="h-5 w-5 rounded-full bg-transparent flex items-center justify-center mr-2">
                      <Unplug />
                    </div>
                    Disconnect
                  </button>
                </div>
              </motion.div>
              :
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
                <div className="py-1">
                  <button
                    onClick={() => selectWallet("Metamask")}
                    className={`flex items-center px-3 py-2 text-xs ${theme === "dark"
                      ? "text-gray-200 hover:bg-gray-700"
                      : theme === "light"
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      } w-full text-left`}
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
                      } w-full text-left`}
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
                      } w-full text-left`}
                  >
                    <div className="h-5 w-5 rounded-full bg-transparent flex items-center justify-center mr-2">
                      <Arweave theme={theme} />
                    </div>
                    Arweave.app
                  </button>
                </div>
              </motion.div>
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WalletType } from "../types/wallet";
import { showDanger } from "../Components/UI/Toast/Toast-Context";

interface WalletState {
  isConnected: boolean;
  connectedWallet: WalletType | null;
  address: string | null;
  isConnecting: boolean;
  error: string | null;

  setConnecting: (isConnecting: boolean) => void;
  setError: (error: string | null) => void;
  setConnected: (wallet: WalletType, address: string) => void;
  setDisconnected: () => void;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  checkConnection: () => Promise<void>;
  clearError: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      connectedWallet: null,
      address: null,
      isConnecting: false,
      error: null,
      setConnecting: (isConnecting: boolean) => {
        set({ isConnecting });
      },

      setError: (error: string | null) => {
        set({ error, isConnecting: false });
      },

      setConnected: (wallet: WalletType, address: string) => {
        set({
          isConnected: true,
          connectedWallet: wallet,
          address,
          isConnecting: false,
          error: null,
        });
      },

      setDisconnected: () => {
        set({
          isConnected: false,
          connectedWallet: null,
          address: null,
          isConnecting: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      connectWallet: async (walletType: WalletType) => {
        const { setConnecting, setError, setConnected } = get();

        setConnecting(true);
        setError(null);

        try {
          let address: string | null = null;

          if (walletType === "ethereum") {
            if (!window.ethereum) {
              showDanger(
                "MetaMask issue",
                " MetaMask is not installed or not detected. Please install MetaMask to continue.",
                6000
              );
              throw new Error(
                "MetaMask is not installed. Please install MetaMask to continue."
              );
            }

            const accounts = (await window.ethereum.request({
              method: "eth_requestAccounts",
            })) as string[] | undefined | null;

            if (Array.isArray(accounts) && accounts.length > 0) {
              address = accounts[0];
            }
            localStorage.setItem("metamask", "true");
          } else if (walletType === "wander") {
            if (!window.arweaveWallet) {
              showDanger(
                "wander issue",
                "wander is not installed or not detected. Please install wander to continue.",
                6000
              );
              throw new Error(
                "wander is not installed. Please install wander to continue."
              );
            }

            await window.arweaveWallet.connect([
              "ACCESS_ADDRESS",
              "ACCESS_ALL_ADDRESSES",
              "ACCESS_ARWEAVE_CONFIG",
              "ACCESS_PUBLIC_KEY",
              "DECRYPT",
              "ENCRYPT",
              "DISPATCH",
              "SIGNATURE",
              "SIGN_TRANSACTION",
            ]);
            address = await window.arweaveWallet.getActiveAddress();
          }

          if (address) {
            setConnected(walletType, address);
          } else {
            showDanger(
              "Connection Error",
              "Failed to retrieve wallet address. Please try again.",
              6000
            );
            throw new Error("Failed to get wallet address");
          }
        } catch (err: any) {
          showDanger(
            "Connection Error",
            err.message || "Failed to connect wallet",
            6000
          );
          setError(err.message || "Failed to connect wallet");
        }
      },

      disconnectWallet: () => {
        if (get().connectedWallet !== "wander") {
          // Not a wander wallet, so skip wander-specific disconnect logic
          const { setDisconnected } = get();
          setDisconnected();
          localStorage.setItem("metamask", "false");
          return;
        } else {
          try {
            if (typeof window !== "undefined" && window.arweaveWallet) {
              window.arweaveWallet
                .disconnect()
                .then(() => {
                  const { setDisconnected } = get();
                  setDisconnected();
                })
                .catch((err) => {
                  console.error("Error disconnecting from wander wallet:", err);
                  showDanger(
                    "Disconnect Error",
                    "Failed to disconnect from wander wallet. Please try again.",
                    6000
                  );
                });
            } else {
              showDanger(
                "Disconnect Error",
                "Wander wallet is not detected. Please ensure it is installed and try again.",
                6000
              );
              console.warn("Wander wallet not detected, skipping disconnect.");
              const { setDisconnected } = get();
              setDisconnected();
            }
          } catch (err) {
            console.error("Error disconnecting from wander wallet:", err);
            showDanger(
              "Disconnect Error",
              "Failed to disconnect from wander wallet. Please try again.",
              6000
            );
          }
        }
      },

      checkConnection: async () => {
        const { setConnected, setDisconnected, setError } = get();

        try {
          if (typeof window !== "undefined" && window.arweaveWallet) {
            try {
              const permissions = await window.arweaveWallet.getPermissions();
              if (permissions.length > 0) {
                const address = await window.arweaveWallet.getActiveAddress();
                if (address) {
                  setConnected("wander", address);
                  return;
                }
              }
            } catch (err) {
              showDanger(
                "wander Error",
                "Failed to check wander permissions. Please ensure wander is installed and try again.",
                6000
              );
              console.error("Error checking wander permissions:", err);
              setDisconnected();
              return;
            }
          }
          const metamaskConnected = localStorage.getItem("metamask");
          if (
            typeof window !== "undefined" &&
            window.ethereum &&
            metamaskConnected === "true"
          ) {
            const accounts = (await window.ethereum.request({
              method: "eth_accounts",
            })) as string[] | undefined | null;
            if (Array.isArray(accounts) && accounts.length > 0) {
              setConnected("ethereum", accounts[0]);
              return;
            }
          }
          setDisconnected();
        } catch (err) {
          showDanger(
            "Connection Error",
            "Failed to check wallet connection. Please try again.",
            6000
          );
          console.error("Error checking wallet connection:", err);
          setError("Failed to check wallet connection");
        }
      },
    }),
    {
      name: "wallet-storage",
      partialize: (state) => ({
        isConnected: state.isConnected,
        connectedWallet: state.connectedWallet,
        address: state.address,
      }),
    }
  )
);

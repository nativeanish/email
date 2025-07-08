import { ArconnectSigner } from "@ar.io/arbundles";
import { showDanger } from "../../Components/UI/Toast/Toast-Context";

export const get_wander_signer = () => {
  if (!window.arweaveWallet) {
    showDanger(
      "Arweave Wallet Not Found",
      "Please install the Arweave wallet extension to sign messages.",
      6000
    );
    console.error("Arweave wallet not found");
    return undefined;
  }
  return new ArconnectSigner(window.arweaveWallet);
};
export const get_metamask_signer = () => {
  if (!window.ethereum) {
    showDanger(
      "Ethereum Provider Not Found",
      "Please install MetaMask or another Ethereum provider to sign messages.",
      6000
    );
    console.error("Ethereum provider not found");
    return undefined;
  }
  const _signer = {
    signMessage: async (message: string | Uint8Array) => {
      if (!window.ethereum) {
        showDanger(
          "Ethereum Provider Not Found",
          "Please install MetaMask or another Ethereum provider to sign messages.",
          6000
        );
        throw new Error("Ethereum provider not found");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
        showDanger(
          "No Ethereum Accounts Found",
          "Please connect your Ethereum wallet to sign messages.",
          6000
        );
        throw new Error("No Ethereum accounts found");
      }
      const account = (accounts as string[])[0];

      const messageToSign =
        typeof message === "string"
          ? message
          : "0x" + Buffer.from(message).toString("hex");
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [messageToSign, account],
      });

      if (typeof signature !== "string") {
        showDanger(
          "Signing Failed",
          "Failed to obtain signature from Ethereum provider.",
          6000
        );
        throw new Error("Failed to obtain signature");
      }
      return signature;
    },
  };
  const provider = {
    getSigner: () => _signer,
  };
  return provider;
};

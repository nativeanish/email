import {
  ArconnectSigner,
  createData,
  InjectedEthereumSigner,
} from "@ar.io/arbundles";
import useAddress from "../../store/useAddress";
import { showDanger } from "../../Components/UI/Toast/Toast-Context";
export async function sign_wander(
  message: string | Uint8Array,
  mime: string = "application/json"
) {
  try {
    const signer = new ArconnectSigner(window.arweaveWallet);
    await signer.setPublicKey();
    const dataitems = await createData(message, signer, {
      tags: [
        { name: "App-Name", value: "Permaemail" },
        { name: "App-Version", value: "1.0.0" },
        { name: "Content-Type", value: mime },
      ],
    });
    await dataitems.sign(signer);
    return dataitems;
  } catch (error) {
    showDanger(
      "Signing Failed",
      "Signing failed. Please check your Wander wallet connection.",
      6000
    );
    console.error("Signing failed:", error);
    return null;
  }
}
export async function sign_ethereum(
  message: Uint8Array | string,
  mime: string = "application/json"
) {
  try {
    if (!window.ethereum) {
      showDanger(
        "Ethereum Provider Not Found",
        "Please install MetaMask or another Ethereum provider to sign messages.",
        6000
      );
      console.log("Ethereum provider not found");
      return null;
    }
    const signer = {
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
      getSigner: () => signer,
    };
    const sign = new InjectedEthereumSigner(provider);
    await sign.setPublicKey();
    const data = await createData(message, sign, {
      tags: [
        { name: "App-Name", value: "Permaemail" },
        { name: "App-Version", value: "1.0.0" },
        { name: "Content-Type", value: mime },
      ],
    });
    await data.sign(sign);
    return data;
  } catch (error) {
    showDanger(
      "Signing Failed",
      "Signing failed. Please check your Ethereum wallet connection.",
      6000
    );
    console.error("Signing failed:", error);
    return null;
  }
}
export default async function sign(
  message: Uint8Array | string,
  mime: string = "application/json"
) {
  const wallet = useAddress.getState().walletType;
  if (wallet === "Wander") {
    return await sign_wander(message, mime);
  }
  if (wallet === "Metamask") {
    return await sign_ethereum(message, mime);
  }
}

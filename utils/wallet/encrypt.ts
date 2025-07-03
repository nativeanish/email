import { encrypt as metamask_encrypt } from "@metamask/eth-sig-util";
// import wallet from "../arweave";
import { sign_wander, sign_ethereum } from "./sign";
import upload from "./upload";
import { showDanger } from "../../Components/UI/Toast/Toast-Context";
import { useWalletStore } from "../../store/useWallet";
export async function getPublicKey() {
  const address = useWalletStore.getState().address;
  if (window.ethereum === undefined || !address) {
    showDanger(
      "Public Key Not Found",
      "Please connect your Metamask wallet to retrieve the public key.",
      6000
    );
    return null;
  }
  const publicKey = await window.ethereum.request({
    method: "eth_getEncryptionPublicKey",
    params: [address],
  });
  return publicKey as string;
}

async function encrypt_metamask(text: string) {
  try {
    const publicKey = await getPublicKey();
    if (publicKey) {
      const encypted = metamask_encrypt({
        publicKey: publicKey,
        data: text,
        version: "x25519-xsalsa20-poly1305",
      });
      return { encryptedData: encypted, walletType: "Metamask" };
    } else {
      showDanger(
        "Encryption Failed",
        "Public key not found. Please check your Metamask connection.",
        6000
      );
      console.error("Public key not found");
      return null;
    }
  } catch (error) {
    showDanger(
      "Encryption Failed",
      "Encryption failed. Please check your Metamask connection.",
      6000
    );
    console.error("Encryption failed:", error);
  }
  showDanger(
    "Encryption Failed",
    "An unexpected error occurred during encryption.",
    6000
  );
  console.error("An unexpected error occurred during encryption.");
  return null;
}

async function encrypt_wander(text: string) {
  if (window.arweaveWallet) {
    try {
      await window.arweaveWallet.connect(["ENCRYPT"]);
      const encryptedData = await window.arweaveWallet.encrypt(text, {
        algorithm: "RSA-OAEP",
        hash: "SHA-256",
      });
      function uint8ArrayToString(data: Uint8Array | ArrayBufferLike): string {
        const uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);
        return btoa(String.fromCharCode(...uint8Array));
      }
      const encryptedDataString = uint8ArrayToString(encryptedData);
      return { encryptedData: encryptedDataString, walletType: "Wander" };
    } catch (error) {
      showDanger(
        "Encryption Failed",
        "Encryption failed. Please check your Wander wallet connection.",
        6000
      );
      console.error("Encryption failed:", error);
      return null;
    }
  } else {
    showDanger(
      "Encryption Failed",
      "Wander wallet not found. Please check your connection.",
      6000
    );
    console.error("Wander wallet not found");
    return null;
  }
}

// async function encrypt_arweave(text: string) {
//   const publicKey = await wallet.getPublicKey();
//   if (!publicKey) {
//     console.error("Public key not found");
//     return null;
//   }
//   console.log("Public Key:", publicKey);
//   const encryptedData = await wallet.encrypt(
//     new TextEncoder().encode(text),
//     publicKey,
//     { name: "RSA-OAEP" }
//   );
//   return encryptedData;
// }
export default async function encrypt(text: string) {
  try {
    const walletType = useWalletStore.getState().connectedWallet;
    if (walletType && walletType === "ethereum") {
      const encrypted_data = await encrypt_metamask(text);
      if (!encrypted_data) {
        showDanger(
          "Encryption Failed",
          "Encryption failed. Please check your Metamask connection.",
          6000
        );
        console.error("Encryption failed for Metamask");
        return false;
      }
      const data = await sign_ethereum(
        JSON.stringify(encrypted_data),
        "application/json"
      );
      if (!data) {
        showDanger(
          "Signing Failed",
          "Signing failed. Please check your Metamask connection.",
          6000
        );
        console.error("Signing failed for Metamask");
        return false;
      }
      const uploadResult = await upload(data);
      if (!uploadResult) {
        showDanger(
          "Upload Failed",
          "Upload failed. Please check your Metamask connection.",
          6000
        );
        console.error("Upload failed for Metamask");
        return false;
      }
      return uploadResult;
    }
    if (walletType && walletType === "wander") {
      const encrypted_data = await encrypt_wander(text);
      if (!encrypted_data) {
        console.error("Encryption failed for Wander");
        return false;
      }
      const data = await sign_wander(
        JSON.stringify(encrypted_data),
        "application/json"
      );
      if (!data) {
        showDanger(
          "Signing Failed",
          "Signing failed. Please check your Wander connection.",
          6000
        );
        console.error("Signing failed for Wander");
        return false;
      }
      const uploadResult = await upload(data);
      if (!uploadResult) {
        showDanger(
          "Upload Failed",
          "Upload failed. Please check your Wander connection.",
          6000
        )
        console.error("Upload failed for Wander");
        return false;
      }
      return uploadResult;
    }
    return false;
  } catch (error) {
    showDanger(
      "Encryption Failed",
      "An unexpected error occurred during encryption.",
      6000
    );
    console.error("An unexpected error occurred during encryption:", error);
    return false;
  }
}

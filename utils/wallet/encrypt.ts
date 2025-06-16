import useAddress from "../../store/useAddress";
import { encrypt as metamask_encrypt } from "@metamask/eth-sig-util";
import wallet from "../arweave";
import { sign_wander, sign_ethereum } from "./sign";
import upload from "./upload";
export async function getPublicKey() {
  const address = useAddress.getState().address;
  if (window.ethereum === undefined || !address) {
    return null;
  }
  const publicKey = await window.ethereum.request({
    method: "eth_getEncryptionPublicKey",
    params: [address],
  });
  return publicKey as string;
}

async function encrypt_metamask(text: string) {
  const publicKey = await getPublicKey();
  if (publicKey) {
    const encypted = metamask_encrypt({
      publicKey: publicKey,
      data: text,
      version: "x25519-xsalsa20-poly1305",
    });
    return { encryptedData: encypted, walletType: "Metamask" };
  }
  return null;
}

async function encrypt_wander(text: string) {
  if (window.arweaveWallet) {
    await window.arweaveWallet.connect(["ENCRYPT"]);
    const encryptedData = await window.arweaveWallet.encrypt(text, {
      algorithm: "RSA-OAEP",
      hash: "SHA-256",
    });
    function uint8ArrayToString(data: Uint8Array | ArrayBufferLike): string {
      if (data instanceof ArrayBuffer) {
        data = new Uint8Array(data);
      }
      return Array.from(data as Uint8Array)
        .map((byte) => String.fromCharCode(byte))
        .join("");
    }
    const encryptedDataString = uint8ArrayToString(encryptedData);
    return { encryptedData: encryptedDataString, walletType: "Wander" };
  }
  return null;
}

async function encrypt_arweave(text: string) {
  const publicKey = await wallet.getPublicKey();
  if (!publicKey) {
    console.error("Public key not found");
    return null;
  }
  console.log("Public Key:", publicKey);
  const encryptedData = await wallet.encrypt(
    new TextEncoder().encode(text),
    publicKey,
    { name: "RSA-OAEP" }
  );
  return encryptedData;
}
export default async function encrypt(text: string) {
  const walletType = useAddress.getState().walletType;
  if (walletType && walletType === "Metamask") {
    const encrypted_data = await encrypt_metamask(text);
    if (!encrypted_data) {
      console.error("Encryption failed for Metamask");
      return false;
    }
    const data = await sign_ethereum(encrypted_data);
    if (!data) {
      console.error("Signing failed for Metamask");
      return false;
    }
    const uploadResult = await upload(data);
    if (!uploadResult) {
      console.error("Upload failed for Metamask");
      return false;
    }
    return uploadResult;
  }
  if (walletType && walletType === "Wander") {
    const encrypted_data = await encrypt_wander(text);
    if (!encrypted_data) {
      console.error("Encryption failed for Wander");
      return false;
    }
    const data = await sign_wander(encrypted_data);
    if (!data) {
      console.error("Signing failed for Wander");
      return false;
    }
    const uploadResult = await upload(data);
    if (!uploadResult) {
      console.error("Upload failed for Wander");
      return false;
    }
    return uploadResult;
  }
  return false;
}

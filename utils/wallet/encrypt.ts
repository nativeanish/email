import useAddress from "../../store/useAddress"
import { encrypt as metamask_encrypt } from "@metamask/eth-sig-util";
import wallet from "../arweave";
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
    })
    return encypted;
  }
  return null;
}

async function encrypt_wander(text: string) {
  if (window.arweaveWallet) {
    await window.arweaveWallet.connect(["ENCRYPT"]);
    const encryptedData = await window.arweaveWallet.encrypt(
      text
      , {
        algorithm: "RSA-OAEP",
        hash: "SHA-256",

      })
    console.log("Encrypted Data:", encryptedData);
    return { data: encryptedData, version: "RSA-OAEP", hash: "SHA-256" }
  }
  return null;
}

async function encrypt_arweave(text: string) {
  console.log(text)
  const publicKey = await wallet.getPublicKey();
  console.log("Public Key:", publicKey);
  const encryptedData = await wallet.encrypt(new TextEncoder().encode(text), publicKey, { name: "RSA-OAEP" });
  return {
    data: encryptedData, version: "RSA-OAEP"
  }
}
export default async function encrypt(text: string) {
  const walletType = useAddress.getState().walletType;
  if (walletType && walletType === "Metamask") {
    return await encrypt_metamask(text);
  }
  if (walletType && walletType === "Wander") {
    return await encrypt_wander(text);
  }
  if (walletType && walletType === "Arweave.app") {
    return await encrypt_arweave(text);
  }
  return null;
}

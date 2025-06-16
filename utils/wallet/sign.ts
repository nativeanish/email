import {
  ArconnectSigner,
  createData,
  InjectedEthereumSigner,
} from "@ar.io/arbundles";
export async function sign_wander(message: Object) {
  const signer = new ArconnectSigner(window.arweaveWallet);
  await signer.setPublicKey();
  const dataitems = await createData(JSON.stringify(message), signer);
  await dataitems.sign(signer);
  return dataitems;
}
export async function sign_ethereum(message: Object) {
  if (!window.ethereum) {
    throw new Error("Ethereum provider not found");
  }
  const signer = {
    signMessage: async (message: string | Uint8Array) => {
      // Request accounts if not already connected
      if (!window.ethereum) {
        throw new Error("Ethereum provider not found");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
        throw new Error("No Ethereum accounts found");
      }
      const account = (accounts as string[])[0];

      // Convert Uint8Array to hex string if needed
      const messageToSign =
        typeof message === "string"
          ? message
          : "0x" + Buffer.from(message).toString("hex");

      // Request MetaMask to sign the message
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [messageToSign, account],
      });

      if (typeof signature !== "string") {
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
  const data = await createData(JSON.stringify(message), sign);
  await data.sign(sign);
  return data;
}

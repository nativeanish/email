import { InjectedEthereumSigner, createData } from "@ar.io/arbundles";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
import { process } from "../../constants";
import { useWalletStore } from "../../../store/useWallet";
import { get_metamask_signer } from "../../wallet/signer";
import { showDanger } from "../../../Components/UI/Toast/Toast-Context";
export default async function register(
  tags: { name: string; value: string }[]
) {
  const walletType = useWalletStore.getState().connectedWallet;
  let signer: any;
  if (walletType === "wander") {
    signer = createDataItemSigner(window.arweaveWallet);
  }
  if (walletType === "ethereum") {
    signer = createBrowserEthereumDataItemSignerWithoutEthers();
  }
  const msg = await message({
    process: process,
    signer: signer,
    tags,
  });
  const res = await result({
    process,
    message: msg,
  });
  return res;
}

export function createBrowserEthereumDataItemSignerWithoutEthers() {
  if (!window.ethereum) {
    showDanger(
      "Ethereum Provider Not Found",
      "Please install MetaMask or another Ethereum provider to sign messages.",
      6000
    );
    throw new Error("Ethereum provider is not available.");
  }
  try {
    const eth = get_metamask_signer();
    const signer = async ({ data, tags, target, anchor }: any) => {
      const provider = {
        getSigner: () => ({
          signMessage: async (message: string) => {
            return await eth?.getSigner().signMessage(message);
          },
        }),
      };
      const ethSigner = new InjectedEthereumSigner(provider as any);
      await ethSigner.setPublicKey();
      const dataItem = createData(data, ethSigner, {
        tags,
        target,
        anchor,
      });
      const res = await dataItem
        .sign(ethSigner)
        .then(async () => ({
          id: await dataItem.id,
          raw: await dataItem.getRaw(),
        }))
        .catch((e) => {
          console.error(e);
          return null; // Handle errors gracefully
        });
      console.dir(
        {
          valid: await InjectedEthereumSigner.verify(
            ethSigner.publicKey,
            await dataItem.getSignatureData(),
            dataItem.rawSignature
          ),
          signature: dataItem.signature,
          owner: dataItem.owner,
          tags: dataItem.tags,
          id: dataItem.id,
          res,
        },
        { depth: 2 }
      );

      return res;
    };
    return signer;
  } catch (error) {
    console.error("Error creating Ethereum data item signer:", error);
    showDanger(
      "Signer Creation Failed",
      "Failed to create Ethereum data item signer. Please check your connection.",
      6000
    );
  }
}

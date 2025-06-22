import { ArconnectSigner, InjectedEthereumSigner } from "@ar.io/arbundles";
import useAddress from "../../../store/useAddress";
import { showDanger } from "../../../Components/UI/Toast/Toast-Context";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
import { process } from "../../constants";
import { get_metamask_signer, get_wander_signer } from "../../wallet/signer";
export default async function register(
  tags: { name: string; value: string }[]
) {
  const wallet = useAddress.getState().walletType;
  let signer: ArconnectSigner | InjectedEthereumSigner | undefined = undefined;
  if (wallet === "Wander") {
    signer = get_wander_signer();
  }
  if (wallet === "Metamask") {
    signer = get_metamask_signer();
  }
  if (signer) {
    console.log("Signer initialized:", signer);
    const formatted = Object.fromEntries(
      tags.map(({ name, value }) => [name, value])
    );

    const jsonPayload = JSON.stringify(formatted);
    console.log("JSON Payload:", jsonPayload);
    const msg = await message({
      process: process,
      signer: createDataItemSigner(window.arweaveWallet),
      tags,
    });
    const res = await result({
      process,
      message: msg,
    });
    return res;
  } else {
    showDanger(
      "Failed to initialize wallet",
      "Please ensure your wallet is connected and try again.",
      6000
    );
    return false;
  }
}

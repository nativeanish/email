import useAddress from "../store/useAddress";

export const wander = async () => {
  if (window.arweaveWallet) {
    try {
      await window.arweaveWallet.connect(
        [
          "ACCESS_ADDRESS",
          "ACCESS_ALL_ADDRESSES",
          "ACCESS_ARWEAVE_CONFIG",
          "ACCESS_PUBLIC_KEY",
          "DECRYPT",
          "ENCRYPT",
          "DISPATCH",
          "SIGNATURE",
          "SIGN_TRANSACTION",
        ],
        {
          name: "Permaemail",
          logo: "https://arweave.net/aQwuIBqt4Iz5n837EMzor_lIaNl8lBBsRb_Yqup0xQI",
        }
      );
      return await wander_checkConnection()
    } catch (err) {
      console.log(JSON.stringify(err))
    }
  } else {
    alert("Wander is not installed")
  }
}
const unset_account = () => {
  useAddress.getState().setType(null);
  useAddress.getState().setAddress(null);

}
const wander_checkConnection = async () => {
  try {
    const data = await window.arweaveWallet.getActiveAddress();
    if (data && data.length) {
      useAddress.getState().setType("Wander");
      useAddress.getState().setAddress(data);
      return true;
    } else {
      unset_account()
      return false;
    }
  } catch (err) {
    console.log(err);
    unset_account()
    return false;
  }
};
const metmake_checkConnection = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (Array.isArray(accounts) && accounts.length > 0) {
      useAddress.getState().setType("Metamask");
      useAddress.getState().setAddress(accounts[0]);
      return true;
    }
  }
  unset_account()
  return false
}
export const disconnect = async () => {
  const walletType = useAddress.getState().walletType
  const address = useAddress.getState().address
  if (walletType === "Wander") {
    await window.arweaveWallet.disconnect();
    const re = await wander_checkConnection()
    console.log(re)
    if (walletType === null && address === null && re === false) {
      alert("Disconnected")
    }
  }

  if (walletType === "Metamask") {
    useAddress.getState().setType(null);
    useAddress.getState().setAddress(null);
    alert("Disconnected")
  }
}

export const metamask = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (Array.isArray(accounts) && accounts.length > 0) {
      const check = await metmake_checkConnection()
      if (check) {
        return true
      }
    }
    return false
  } else {
    alert("Metamask is installed")
  }

}

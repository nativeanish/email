import { useEffect, useState } from "react";
import ConnectButton from "../../Components/ConnectButton";
import { check_user } from "../../utils/ao";
import useUser from "../../store/useUser";
import { Link } from "react-router-dom";
import { useWalletStore } from "../../store/useWallet";
function Index() {
  const { address, connectedWallet:walletType } = useWalletStore();
  const { user } = useUser();
  const [isRegister, setisRegister] = useState<boolean>(false);
  useEffect(() => {
    // if (address) {
    //   if (user && user.address === address) {
    //     setisRegister(true);
    //     return;
    //   } else {
    //     check_user()
    //       .then((data) => {
    //         if (data) {
    //           setisRegister(true);
    //         } else {
    //           setisRegister(false);
    //           localStorage.setItem("user", "undefined");
    //           useUser.setState({ user: undefined });
    //         }
    //       })
    //       .catch(console.error);
    //   }
    // }
    // console.log(address);
    console.log("Address changed:", address);
    console.log("Wallet type:", walletType);
  }, [address]);
  return (
    <div>
      <ConnectButton />
      <h1>Hello, World</h1>
      {isRegister ? (
        <p>Welcome back, {user?.username}!</p>
      ) : (
        <p>Please <Link to={"onboard"}>Click</Link> to continue.</p>
      )}
      <p>Your address: {address || "Not connected"}</p>
    </div>
  );
}
export default Index;

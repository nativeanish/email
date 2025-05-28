import { useEffect, useState } from "react";
import ConnectButton from "../../Components/ConnectButton";
import useAddress from "../../store/useAddress";
import { check_user } from "../../utils/ao";
import useUser from "../../store/useUser";
function Index() {
  const { address } = useAddress();
  const { user } = useUser();
  const [isRegister, setisRegister] = useState<boolean>(false);
  useEffect(() => {
    if (address) {
      if (user && user.address === address) {
        setisRegister(true);
        return;
      } else {
        check_user()
          .then((data) => {
            if (data) {
              setisRegister(true);
            } else {
              setisRegister(false);
              localStorage.setItem("user", "undefined");
              useUser.setState({ user: undefined });
            }
          })
          .catch(console.error);
      }
    }
    console.log(address);
  }, [address]);
  return (
    <div>
      <ConnectButton />
      <h1>Hello, World</h1>
      {isRegister ? (
        <p>Welcome back, {user?.username}!</p>
      ) : (
        <p>Please register to continue.</p>
      )}
      <p>Your address: {address || "Not connected"}</p>
    </div>
  );
}
export default Index;

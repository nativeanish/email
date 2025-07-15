import { Sidebar } from "../../Components/SideBar";
import useTheme from "../../store/useTheme";
import { Header } from "../../Components/Header";
import { EmailList } from "../../Components/EmailList";
import { EmailContent } from "../../Components/EmailContent";
import useMessage from "../../store/useMessage";
import { useEffect, useState } from "react";
import { useWalletStore } from "../../store/useWallet";
import WalletModal from "../../Components/WalletModal";
import Dialog from "../../Components/UI/Dialog";
import useLoading from "../../store/useLoading";
import { check_user } from "../../utils/ao";
import { User } from "../../types/user";
import { showDanger } from "../../Components/UI/Toast/Toast-Context";
import { useNavigate } from "react-router-dom";
import useNotification from "../../store/useNotification";
import useLoginUser from "../../store/useLoginUser";

function App() {
  const theme = useTheme((state) => state.theme);
  const isDarkMode = theme === "dark";
  const [showLogin, setLoginShow] = useState(false);
  const { show } = useMessage();
  const {
    address,
    isConnected,
    connectedWallet: walletType,
  } = useWalletStore();
  const dialog = useLoading();
  const { user, setUser } = useLoginUser();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const fetchanddecrypt = async (id: string) => {
    try {
      const data = await fetch(`https://arweave.net/${id}`);
      if (data.status === 200 && data.ok) {
        const _json = await data.json();
        if (_json.encryptedData && _json.walletType) {
          const keyuint = (await window.arweaveWallet.decrypt(
            new Uint8Array(
              atob(_json.encryptedData)
                .split("")
                .map((c) => c.charCodeAt(0))
            ),
            {
              algorithm: "RSA-OAEP",
              hash: "SHA-256",
            }
          )) as unknown as Uint8Array;
          const key = new TextDecoder().decode(keyuint);
          return key;
        }
      }
      return false;
    } catch (err) {
      console.log(err);
      showDanger("Something went wrong on fetching and decrypting wallet keys");
    }
  };
  useEffect(() => {
    if (!isConnected || !address || !walletType) {
      setLoginShow(true);
    } else {
      setLoginShow(false);
      if (isConnected && address && walletType) {
        dialog.setTitle("Fetching Emails");
        dialog.setDescription("Please wait while we fetch your emails.");
        dialog.setDarkMode(isDarkMode);
        dialog.setSize("md");
        dialog.open();
        dialog.setShowCloseButton(false);
        window.arweaveWallet.getActiveAddress().then((e) => {
          if (
            e &&
            address &&
            user &&
            user.privateKey.startsWith("-----BEGIN PRIVATE KEY-----") &&
            e === address &&
            user.address === address
          ) {
            //
          } else {
            check_user(address).then((res) => {
              if (res && res.data && res.status) {
                const ds = res.data as unknown as User;
                console.log(ds);
                dialog.setTitle("Fetching Wallet Keys");
                dialog.setDescription(
                  "Please wait while we fetch your wallet keys and Allow Wallet to decrypt them."
                );
                fetchanddecrypt(ds.privateKey)
                  .then((e) => {
                    if (!e) {
                      showDanger(
                        "Decryption failed",
                        "Please try again later."
                      );
                      dialog.close();
                      return;
                    }
                    ds.privateKey = e;
                    setUser(ds);
                    if (ds.updates && ds.updates.length > 0) {
                      addNotification(ds.updates);
                    }
                    dialog.close();
                  })
                  .catch((err) => {
                    console.error(
                      "Error fetching and decrypting wallet keys:",
                      err
                    );
                  });
              } else {
                showDanger("User not found", "Please register first.", 6000);
                navigate("/onboard");
              }
            });
          }
        });
      }
    }
  }, [isConnected, address, walletType]);
  return (
    <div className={`flex h-screen overflow-hidden ${theme ? "dark" : ""}`}>
      <Sidebar
        name={user?.username}
        image={user?.image}
        bio={user?.bio}
        display_name={user?.name}
      />

      <div className="flex-1 flex flex-col h-full">
        <Header />
        <div
          className={`flex-1 flex md:flex-row flex-col min-h-0 ${
            theme === "dark" ? "bg-[#141414]" : "bg-gray-50"
          }`}
        >
          <EmailList isEmailListVisible={true} />
          <EmailContent
            isDarkMode={isDarkMode}
            isEmailListVisible={true}
            selectedEmail={null}
            isNewMessageOpen={show}
            handleBackToList={() => {}}
          />
        </div>
      </div>
      <Dialog />
      <WalletModal
        darkMode={isDarkMode}
        showCloseButton={false}
        isOpen={showLogin}
        onClose={() => setLoginShow(false)}
        closeOnBackdropClick={false}
        closable={false}
      />
    </div>
  );
}
export default App;

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

function App() {
  const theme = useTheme((state) => state.theme);
  const isDarkMode = theme === "dark";
  const [showLogin, setLoginShow] = useState(false);
  const { show } = useMessage();
  const {address, isConnected, connectedWallet: walletType} = useWalletStore()
  const dialog = useLoading()
  const [user, setUser] = useState<null|User>(null)
  const navigate = useNavigate()
  const {addNotification} = useNotification()
  useEffect(() => {
   if(!isConnected || !address || !walletType) {
      setLoginShow(true);
    }else{
      setLoginShow(false);
      if(isConnected && address && walletType) {
          dialog.setTitle("Fetching Emails")
          dialog.setDescription("Please wait while we fetch your emails.");
          dialog.setDarkMode(isDarkMode);
          dialog.setSize("md");
          dialog.open()
          dialog.setShowCloseButton(false);
          check_user(address).then((res) => {
            if(res && res.data && res.status) {
              setUser(res.data as unknown as User);
              const ds = res.data as unknown as User;
              console.log(ds.updates.entries) 
              if(ds.updates && ds.updates.entries && ds.updates.entries.length > 0) {
                //@ts-ignore
                addNotification(ds.updates.entries);
              }
              dialog.close();
            }else{
              showDanger("User not found","Please register first.",6000);
              navigate("/onboard");
            }
          })
      }
    }
  },[isConnected, address, walletType])

  return (
    <div className={`flex h-screen ${theme ? "dark" : ""}`}>
      <Sidebar name={user?.username} image={user?.image} bio={user?.bio} />

      <div className="flex-1 flex flex-col h-full">
        <Header />
        <div
          className={`flex-1 flex md:flex-row flex-col ${
            theme === "dark" ? "bg-[#141414]" : "bg-gray-50"
          }`}
        >
          <EmailList
            isEmailListVisible={true}
            emails={[]}
            selectedEmail={null}
            handleEmailSelect={() => {}}
          />
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
      <WalletModal darkMode={isDarkMode} showCloseButton={false} isOpen={showLogin} onClose={() => setLoginShow(false)} closeOnBackdropClick={false} closable={false}/>
    </div>
  );
}
export default App;

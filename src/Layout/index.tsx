import { useState } from "react";
import { Sidebar } from "../../Components/SideBar";
import useTheme from "../../store/useTheme";
import { Header } from "../../Components/Header";
import { EmailList } from "../../Components/EmailList";
import { EmailContent } from "../../Components/EmailContent";

function App() {
  const theme = useTheme((state) => state.theme);
  const isDarkMode = theme === "dark";
  const [, setIsNewMessageOpen] = useState(false);

  const handleNewMessage = () => {
    setIsNewMessageOpen(true);
    // setSelectedEmail(null);
    // if (window.innerWidth < 768) {
    //   setIsEmailListVisible(false);
    // }
  };
  return (
    <div className={`flex h-screen ${theme ? "dark" : ""}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col h-full">
        <Header onNewMessage={handleNewMessage} />
        <div
          className={`flex-1 flex md:flex-row flex-col ${
            theme === "dark" ? "bg-black" : "bg-gray-50"
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
            isNewMessageOpen={true}
            handleBackToList={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
export default App;

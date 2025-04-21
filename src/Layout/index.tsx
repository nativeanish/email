import { Sidebar } from "../../Components/SideBar";
import useTheme from "../../store/useTheme";
import { Header } from "../../Components/Header";
import { EmailList } from "../../Components/EmailList";
import { EmailContent } from "../../Components/EmailContent";
import useMessage from "../../store/useMessage";

function App() {
  const theme = useTheme((state) => state.theme);
  const isDarkMode = theme === "dark";
  const { show } = useMessage();

  return (
    <div className={`flex h-screen ${theme ? "dark" : ""}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col h-full">
        <Header />
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
            isNewMessageOpen={show}
            handleBackToList={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
export default App;

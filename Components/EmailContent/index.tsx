import { Email } from "../../types/email";
import NewMessage from "../NewMessage";
import EC from "./EC";

interface EmailContentProps {
  isDarkMode: boolean;
  isEmailListVisible: boolean;
  selectedEmail: Email | null;
  handleBackToList: () => void;
  isNewMessageOpen: boolean;
}

export function EmailContent({
  isDarkMode,
  isEmailListVisible,
  isNewMessageOpen,
}: EmailContentProps) {
  return (
    <div
      className={`${
        !isEmailListVisible ? "block" : "hidden"
      } md:block flex-1 overflow-hidden p-4 md:p-6 ${
        isDarkMode ? "bg-[#141414]" : "bg-white"
      }`}
    >
      {isNewMessageOpen ? (
        <NewMessage isDarkMode={isDarkMode} />
      ) : (
        <div>
          <EC />
        </div>
      )}
      {/* {isNewMessageOpen ? (
        <NewMessage isDarkMode={isDarkMode} />
      ) : selectedEmail ? (
        
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select an email to read
        </div>
      )} */}
    </div>
  );
}

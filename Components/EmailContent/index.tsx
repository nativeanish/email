import type { Email } from "../../types/email";
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
      className={`${!isEmailListVisible ? "block" : "hidden"} md:block flex-1 ${
        isDarkMode ? "bg-[#141414]" : "bg-white"
      }`}
    >
      <div className="h-full p-4 md:p-6">
        {isNewMessageOpen ? (
          <NewMessage isDarkMode={isDarkMode} />
        ) : (
          <EC isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
}

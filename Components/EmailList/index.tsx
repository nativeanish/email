import useTheme from "../../store/useTheme";
import { Email } from "../../types/email";

interface EmailListProps {
  isEmailListVisible: boolean;
  emails: Email[];
  selectedEmail: Email | null;
  handleEmailSelect: (email: Email) => void;
}

export function EmailList({
  isEmailListVisible,
  emails,
  selectedEmail,
  handleEmailSelect,
}: EmailListProps) {
  const theme = useTheme((state) => state.theme);
  const isDarkMode = theme === "dark";
  return (
    <div
      className={`${
        isEmailListVisible ? "block" : "hidden"
      } md:block w-full md:w-1/3 border-r ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      } overflow-y-auto`}
    >
      <div
        className={`flex items-center gap-4 p-4 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <button
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            isDarkMode ? "text-white bg-gray-900" : "text-gray-900 bg-gray-200"
          }`}
        >
          All Mails
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium ${
            isDarkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Unread
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium ${
            isDarkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Archive
        </button>
      </div>

      <div
        className={`divide-y ${
          isDarkMode ? "divide-gray-800" : "divide-gray-200"
        }`}
      >
        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => handleEmailSelect(email)}
            className={`w-full p-4 text-left ${
              selectedEmail?.id === email.id
                ? isDarkMode
                  ? "bg-gray-900"
                  : "bg-gray-100"
                : ""
            } ${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-50"}`}
          >
            <div className="flex items-start gap-3">
              <img
                src={`https://images.unsplash.com/photo-${
                  email.id + 1
                }?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                alt=""
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium truncate ${
                      email.read
                        ? isDarkMode
                          ? "text-gray-300"
                          : "text-gray-600"
                        : isDarkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {email.from}
                  </p>
                  <p className="text-sm text-gray-400">{email.date}</p>
                </div>
                <p
                  className={`text-sm font-medium truncate ${
                    email.read
                      ? "text-gray-400"
                      : isDarkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {email.subject}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {email.preview}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

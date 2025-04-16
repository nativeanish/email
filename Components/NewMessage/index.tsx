import { useState } from "react";
import { X, Paperclip, Smile, Send } from "lucide-react";
interface EmailChip {
  email: string;
  id: string;
}
function NewMessage({ isDarkMode }: { isDarkMode: boolean }) {
  const [emailInput, setEmailInput] = useState("");
  const [emailChips, setEmailChips] = useState<EmailChip[]>([]);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailInput(value);
    setIsEmailValid(true);
  };

  const handleEmailInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const email = emailInput.trim();
      if (email && validateEmail(email)) {
        setEmailChips((prev) => [...prev, { email, id: crypto.randomUUID() }]);
        setEmailInput("");
        setIsEmailValid(true);
      } else if (email) {
        setIsEmailValid(false);
      }
    } else if (e.key === "Backspace" && !emailInput && emailChips.length > 0) {
      setEmailChips((prev) => prev.slice(0, -1));
    }
  };

  const removeEmailChip = (id: string) => {
    setEmailChips((prev) => prev.filter((chip) => chip.id !== id));
  };
  return (
    <div className="h-full flex flex-col">
      <h2
        className={`text-xl md:text-2xl font-semibold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        New Message
      </h2>

      <div className="flex-1 flex flex-col">
        <div
          className={`border-b ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          } mb-4`}
        >
          <div className="flex flex-wrap items-center gap-2 min-h-[40px]">
            {emailChips.map((chip) => (
              <div
                key={chip.id}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <span>{chip.email}</span>
                <button
                  onClick={() => removeEmailChip(chip.id)}
                  className="hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="To"
              value={emailInput}
              onChange={handleEmailInputChange}
              onKeyDown={handleEmailInputKeyDown}
              className={`flex-1 px-0 py-2 bg-transparent border-none focus:outline-none ${
                isDarkMode
                  ? "text-white placeholder-gray-500"
                  : "text-gray-900 placeholder-gray-400"
              } ${!isEmailValid ? "text-red-500" : ""}`}
            />
          </div>
          {!isEmailValid && (
            <p className="text-red-500 text-sm mb-2">
              Please enter a valid email address
            </p>
          )}
        </div>

        <div
          className={`border-b ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          } mb-4`}
        >
          <input
            type="text"
            placeholder="Subject"
            className={`w-full px-0 py-2 bg-transparent border-none focus:outline-none ${
              isDarkMode
                ? "text-white placeholder-gray-500"
                : "text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>

        <div className="flex-1">
          <textarea
            placeholder="Write your message..."
            className={`w-full h-full px-0 py-2 bg-transparent border-none resize-none focus:outline-none ${
              isDarkMode
                ? "text-white placeholder-gray-500"
                : "text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>
      </div>

      <div
        className={`mt-4 pt-4 border-t ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Send className="h-5 w-5" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewMessage;

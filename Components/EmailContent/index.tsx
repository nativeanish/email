import {
  X,
  Reply,
  Download,
  Trash2,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
} from "lucide-react";
import { Email } from "../../types/email";
import NewMessage from "../NewMessage";

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
  selectedEmail,
  handleBackToList,
  isNewMessageOpen,
}: EmailContentProps) {
  return (
    <div
      className={`${!isEmailListVisible ? "block" : "hidden"
        } md:block flex-1 p-4 md:p-6 ${isDarkMode ? "bg-[#141414]" : "bg-white"}`}
    >
      {isNewMessageOpen ? (
        <NewMessage isDarkMode={isDarkMode} />
      ) : selectedEmail ? (
        <div className="h-full flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4 md:hidden">
              <button onClick={handleBackToList} className="text-gray-400">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div>
              <h2
                className={`text-xl md:text-2xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                {selectedEmail.subject}
              </h2>
              <div className="flex items-center gap-4">
                <img
                  src={`https://images.unsplash.com/photo-${selectedEmail.id + 1
                    }?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p
                    className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {selectedEmail.from}
                  </p>
                  <p className="text-sm text-gray-400">{selectedEmail.date}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`p-2 rounded-lg ${isDarkMode
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <Reply className="h-5 w-5" />
              </button>
              <button
                className={`p-2 rounded-lg ${isDarkMode
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                className={`p-2 rounded-lg ${isDarkMode
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button
                className={`p-2 rounded-lg ${isDarkMode
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className={`flex-1 prose ${isDarkMode ? "prose-invert" : ""} max-w-none`}>
            <p>Hi John,</p>
            <p>
              I hope this message finds you well! I'm reaching out to explore a
              potential partnership between our companies. At Jane Corp, which
              could complement your offerings at John Organisation Corp.
            </p>
            <p>
              I've attached a proposal detailing how we envision our
              collaboration, including key benefits, timelines, and
              implementation strategies. I believe this partnership could unlock
              exciting opportunities for both of us!
            </p>
            <p>
              Let me know your thoughts or a convenient time to discuss this
              further. I'm happy to schedule a call or meeting at your earliest
              convenience.
            </p>
            <p>Looking forward to hearing from you!</p>
            <p>
              Best regards,
              <br />
              Jane
            </p>

            <div
              className={`mt-4 p-4 rounded-lg ${isDarkMode ? "bg-gray-900" : "bg-gray-100"
                }`}
            >
              <div className="flex items-center gap-2 text-gray-300">
                <Download className="h-5 w-5" />
                <span className="font-medium">Proposal-Partnership.pdf</span>
                <span className="text-sm text-gray-400">1.5 MB</span>
              </div>
            </div>
          </div>

          <div
            className={`mt-6 border-t pt-6 ${isDarkMode ? "border-gray-800" : "border-gray-200"
              }`}
          >
            <div
              className={`rounded-lg border ${isDarkMode
                ? "bg-black border-gray-800"
                : "bg-white border-gray-200"
                }`}
            >
              <div className="p-4">
                <textarea
                  placeholder="Write your reply..."
                  className={`w-full h-32 resize-none focus:outline-none bg-transparent reply-textarea ${isDarkMode
                    ? "text-white placeholder-gray-500"
                    : "text-gray-900 placeholder-gray-400"
                    }`}
                ></textarea>
              </div>
              <div
                className={`flex items-center justify-between px-4 py-2 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    className={`p-2 rounded-lg ${isDarkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    className={`p-2 rounded-lg ${isDarkMode
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
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          Select an email to read
        </div>
      )}
    </div>
  );
}

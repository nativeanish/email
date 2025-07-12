import {
  Download,
  Archive,
  OctagonAlert,
  Trash2,
  ChevronDown,
  ChevronUp,
  Forward,
} from "lucide-react";
import { useState } from "react";
import Modal from "../UI/Modal";
import { Reply as Rep } from "lucide-react";
import Reply from "./Reply";
import ForwardComponent from "./Forward";

function EC({ isDarkMode }: { isDarkMode: boolean }) {
  const [showModal, setShowModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 mb-4">
        <div
          className={`flex items-center justify-between border-b pb-2 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2 ${
            isDarkMode
              ? "border-gray-800 text-gray-50 hover:bg-gray-800"
              : "border-gray-200 text-gray-800"
          }`}
          onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
        >
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold ${
                isHeaderExpanded ? "" : "line-clamp-2"
              }`}
            >
              Hello, this is me Anish Gupta, what sbaouasdjfkajsflkajsdfkl
              akjsdfjaksdf ajsdif asdkjfasdjkf asdf jkasdf jkasdfjkas dfjkasdfj
              kasdfjk asdfjkasdfjkasdfjkasdf
              asdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdffa sdfasd
              fasdfasdfasdf dif asdkjfasdjkf asdf jkasdf jkasdfjkas dfjkasdfj
              kasdfjk asdfjkasdfjkasdfjkasdf
              asdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdffa
              sdfasddif asdkjfasdjkf asdf jkasdf jkasdfjkas dfjkasdfj kasdfjk
              asdfjkasdfjkasdfjkasdf
              asdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdffa
              sdfasddif asdkjfasdjkf asdf jkasdf jkasdfjkas dfjkasdfj kasdfjk
              asdfjkasdfjkasdfjkasdf
              asdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdffa sdfasddif
              asdkjfasdjkf asdf jkasdf jkasdfjkas dfjkasdfj kasdfjk
              asdfjkasdfjkasdfjkasdf
              asdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdfjkasdffa sdfasd
            </h3>
          </div>
          <div className="ml-2 flex-shrink-0">
            {isHeaderExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>

        <div
          className={`flex items-center justify-between mt-3 pb-2 border-b ${
            isDarkMode
              ? "text-gray-50 border-gray-800"
              : "text-gray-800 border-gray-200"
          }`}
        >
          <div className="flex-1 font-semibold">
            <div className="flex items-center gap-2">
              <img
                src="https://images.pexels.com/photos/32392457/pexels-photo-32392457.jpeg"
                alt="Profile"
                className={`w-12 h-12 rounded-full border-2 ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              />
              <div>
                <p>Anish Gupta | {"<nativeanish@gmail.com>"}</p>
                <p className="text-sm text-gray-500">10th July</p>
              </div>
            </div>
          </div>
          <div
            className={`flex items-center justify-end gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-800"
            }`}
          >
            <button
              className="p-2 hover:bg-pink-400 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              className="p-2 hover:bg-pink-400 rounded-lg transition-colors"
              title="Archive"
            >
              <Archive className="h-5 w-5" />
            </button>
            <button
              className="p-2 hover:bg-pink-400 rounded-lg transition-colors"
              title="Spam"
            >
              <OctagonAlert className="h-5 w-5" />
            </button>
            <button
              className="p-2 hover:bg-pink-400 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* THIS IS THE SCROLLABLE CONTENT AREA */}
      <div
        className={`flex-1 overflow-y-auto p-6 border rounded-lg min-h-0 ${
          isDarkMode
            ? " border-gray-700 text-gray-100"
            : " border-gray-300 text-gray-800"
        }`}
      >
        <h1>Hello, World dfasd fasdf asdfasdfasd fasdf</h1>
      </div>

      {/* Fixed Footer Section */}
      <div className="flex-shrink-0 pt-4">
        <div className="flex items-center justify-end gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            <Rep className="h-5 w-5" />
            Reply
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            onClick={() => setShowForwardModal(true)}
          >
            <Forward className="h-5 w-5" />
            Forward
          </button>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Reply to Anish Gupta | <nativeanish@gmail.com>"
        size="xl"
        closeOnBackdropClick={false}
        closeOnEscape={false}
        showCloseButton={false}
        theme={isDarkMode ? "dark" : "light"}
      >
        <Reply
          isDarkMode={isDarkMode}
          closeModal={() => setShowModal(false)}
          _subject="Hello"
        />
      </Modal>

      <Modal
        isOpen={showForwardModal}
        onClose={() => setShowForwardModal(false)}
        title="Forward Message"
        size="xl"
        closeOnBackdropClick={false}
        closeOnEscape={false}
        showCloseButton={false}
        theme={isDarkMode ? "dark" : "light"}
      >
        <ForwardComponent
          isDarkMode={isDarkMode}
          closeModal={() => setShowForwardModal(false)}
          _subject="Hello"
        />
      </Modal>
    </div>
  );
}

export default EC;

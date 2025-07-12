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
import { mail } from "../../store/useMailStorage";
import DOMPurify from "dompurify";

interface Props {
  mail: mail;
  User: {
    username: string;
    address: string;
    image: string;
    name: string;
  };
  isDarkMode: boolean;
}

function EC({ mail, User, isDarkMode }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const subject = DOMPurify.sanitize(mail.subject || "No Subject");
  const body = DOMPurify.sanitize(mail.body || "No Content");
  const time = DOMPurify.sanitize(mail.delivered_time.toString());
  const image = DOMPurify.sanitize(User.image);
  const name = DOMPurify.sanitize(User.name || "Unknown User");
  const address = DOMPurify.sanitize(User.address || "Unknown Address");
  const mainName = name ? name + " | " + address : address;
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
              {subject || "No Subject"}
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
                src={`https://arweave.net/${image}`}
                alt="Profile"
                className={`w-12 h-12 rounded-full border-2 ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              />
              <div>
                <p>{mainName}</p>
                <p className="text-sm text-gray-500">{formatEmailDate(time)}</p>
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
        dangerouslySetInnerHTML={{ __html: body }}
      ></div>

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
        title={mainName}
        size="xl"
        closeOnBackdropClick={false}
        closeOnEscape={false}
        showCloseButton={false}
        theme={isDarkMode ? "dark" : "light"}
      >
        <Reply
          isDarkMode={isDarkMode}
          closeModal={() => setShowModal(false)}
          _subject={subject}
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
          data={{ type: "text/html", data: body }}
        />
      </Modal>
    </div>
  );
}

export default EC;
function formatEmailDate(timestamp: string | number): string {
  const date = new Date(Number(timestamp)); // Accepts both string and number
  const now = new Date();

  const formatTime = (d: Date) =>
    d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const time = formatTime(date);
  const day = date.getDate();
  const suffix = getDaySuffix(day);
  const monthName = date.toLocaleString("default", { month: "long" });

  if (isSameDay(date, now)) {
    return `Today, ${time}`;
  }

  if (isSameDay(date, tomorrow)) {
    return `Tomorrow, ${time}`;
  }

  const sameYear = date.getFullYear() === now.getFullYear();

  if (sameYear) {
    return `${day}${suffix} ${monthName}, ${time}`;
  }

  return `${day} ${monthName}, ${date.getFullYear()}, ${time}`;
}

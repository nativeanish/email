import {
  Download,
  Archive,
  OctagonAlert,
  Trash2,
  ChevronDown,
  ChevronUp,
  Forward,
  Mail,
  Send,
  Ban,
  XCircle,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Modal from "../UI/Modal";
import { Reply as Rep } from "lucide-react";
import Reply from "./Reply";
import ForwardComponent from "./Forward";
import useMailStorage, { mail } from "../../store/useMailStorage";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import register from "../../utils/aos/core/register";
import { ReturnResult } from "../NotificationDrawer";
import useLoginUser from "../../store/useLoginUser";
import useLoading from "../../store/useLoading";
import { showDanger, showSuccess } from "../UI/Toast/Toast-Context";

interface Props {
  mail: mail;
  User: {
    username: string;
    address: string;
    image: string;
    name: string;
  };
  isDarkMode: boolean;
  setShowEmailContent: (e: null) => void;
}

function EC({ mail, User, isDarkMode, setShowEmailContent }: Props) {
  const { user, setUser } = useLoginUser();
  const { slug } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const infoPopupRef = useRef<HTMLDivElement>(null);
  const subject = DOMPurify.sanitize(mail.subject || "No Subject");
  const body = DOMPurify.sanitize(mail.body || "No Content");
  const time = DOMPurify.sanitize(mail.delivered_time.toString());
  const image = DOMPurify.sanitize(mail.image);
  const name = DOMPurify.sanitize(mail.name);
  const address = DOMPurify.sanitize(User.address || "Unknown Address");
  const mainName = name ? name + " | " + address : address;
  const [archive, showArchive] = useState(false);
  const [spam, showSpam] = useState(false);
  const [trash, showTrash] = useState(false);
  const [inbox, showInbox] = useState(false);
  const [sent, showSent] = useState(false);
  const [deletep, showDelete] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const loading = useLoading();
  const { changeOneMail, deleteMail } = useMailStorage();
  useEffect(() => {
    showArchive(false);
    showSpam(false);
    showTrash(false);
    showInbox(false);
    showSent(false);
    showDelete(true);
    if (mail.tags.length === 1 && mail.tags[0] === "inbox") {
      showArchive(true);
      showSpam(true);
      showTrash(true);
    }
    if (mail.tags.length === 1 && mail.tags[0] === "sent") {
      showTrash(true);
    }
    if (
      mail.tags.length === 2 &&
      mail.tags[0] === "inbox" &&
      mail.tags[1] === "archive"
    ) {
      showInbox(true);
      showTrash(true);
    }
    if (
      mail.tags.length === 2 &&
      mail.tags[0] === "inbox" &&
      mail.tags[1] === "spam"
    ) {
      showInbox(true);
      showTrash(true);
    }
    if (
      mail.tags.length === 2 &&
      mail.tags[0] === "sent" &&
      mail.tags[1] === "trash"
    ) {
      showSent(true);
      showTrash(true);
    }
    if (
      mail.tags.length === 2 &&
      mail.tags[0] === "inbox" &&
      mail.tags[1] === "trash"
    ) {
      showInbox(true);
      showTrash(true);
    }
  }, [mail]);
  const changeTag = async (
    e: "spam" | "archive" | "trash",
    emailId: string
  ) => {
    try {
      loading.setTitle(`Pushing to ${e}`);
      loading.setDescription("Allow wallet to push and update the state");
      loading.open();
      const response = await register([
        { name: "Action", value: "Evaluate" },
        { name: "changeTag", value: e },
        { name: "emailId", value: emailId },
      ]);
      const msg = JSON.parse(response.Messages[0].Data) as ReturnResult;
      if (msg.status == 1 && msg.data.msg === "Tag changed successfully") {
        if (msg.data.user && user?.privateKey) {
          msg.data.user.privateKey = user.privateKey;
          setUser(msg.data.user);
          changeOneMail(emailId, {
            tags: [mail.tags[0], e],
          });
          loading.close();
          showSuccess("Tag changed successfully");
          navigate(`/dashboard/${e}/${id}`);
        }
      } else {
        loading.close();
        showDanger("Something went wrong while changing tag");
      }
    } catch (error) {
      console.error("Error changing tag:", error);
      showDanger("Something went wrong while changing tag");
      loading.close();
    }
    loading.close();
  };

  const undo = async (emaiId: string) => {
    try {
      loading.setTitle(`Moving back to ${mail.tags[0]}`);
      loading.setDescription("Allow wallet to push and update the state");
      loading.open();
      // Register the action to undo the tag change
      const response = await register([
        { name: "Action", value: "Evaluate" },
        { name: "undoTag", value: "true" },
        { name: "emailId", value: emaiId },
      ]);
      console.log("Response from undo:", response);
      const reply = JSON.parse(response.Messages[0].Data) as ReturnResult;
      if (reply.status === 1 && reply.data.msg === "UnDone the Tag") {
        changeOneMail(emaiId, { tags: [mail.tags[0]] });
        setUser(reply.data.user);
        loading.close();
        navigate(`/dashboard/${mail.tags[0]}/${id}`);
      } else {
        loading.close();
        showDanger("Something went wrong while moving back mails");
      }
    } catch (error) {
      loading.close();
      console.error("Error moving back mail:", error);
      showDanger("Something went wrong while moving back mails");
    }
    loading.close();
  };

  const deleteM = async (emailId: string) => {
    try {
      loading.setTitle("Deleting Permanently");
      loading.setDescription("Allow wallet to push and update the state");
      loading.open();
      // Register the action to delete the email permanently
      const response = await register([
        { name: "Action", value: "Evaluate" },
        { name: "deletePermanent", value: emailId },
      ]);
      console.log("Response from delete:", response);
      const reply = JSON.parse(response.Messages[0].Data) as ReturnResult;
      console.log("Reply from delete:", reply);
      if (
        reply.status === 1 &&
        reply.data.msg === `Email deleted successfully` &&
        user?.privateKey
      ) {
        deleteMail(emailId);
        reply.data.user.privateKey = user.privateKey;
        setUser(reply.data.user);
        loading.close();
        showSuccess("Email deleted successfully");
        navigate(`/dashboard/${slug}`);
      } else {
        loading.close();
        showDanger("Something went wrong while deleting the email");
      }
    } catch (error) {
      loading.close();
      console.error("Error deleting email:", error);
      showDanger("Something went wrong while deleting the email");
    }
    loading.close();
  };

  useEffect(() => {
    console.log(mail);
  }, [mail]);

  // Click outside handler for info popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        infoPopupRef.current &&
        !infoPopupRef.current.contains(event.target as Node)
      ) {
        setShowInfoPopup(false);
      }
    };

    if (showInfoPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfoPopup]);
  useEffect(() => {
    console.log(mail.cc, mail.to, mail.bcc);
  }, [mail]);
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
                <div className="flex items-center gap-2">
                  <p>{mainName}</p>
                </div>
                <div className="flex items-center gap-2 mt-1 relative">
                  <p className="text-sm text-gray-500">
                    {formatEmailDate(time)}
                  </p>
                  <button
                    onClick={() => setShowInfoPopup(!showInfoPopup)}
                    className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                    title="Show email details"
                  >
                    <Info className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Info Popup */}
                  {showInfoPopup && (
                    <div
                      ref={infoPopupRef}
                      className={`absolute top-8 left-0 z-50 min-w-80 p-4 rounded-lg shadow-lg border ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-600 text-white"
                          : "bg-white border-gray-200 text-gray-900"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">
                            Message Details
                          </h4>
                          <button
                            onClick={() => setShowInfoPopup(false)}
                            className={`p-1 rounded hover:bg-gray-100 ${
                              isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                        {/* Show current category */}
                        <div className="mb-2">
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {mail.tags && mail.tags.length > 0
                              ? mail.tags
                                  .map(
                                    (tag) =>
                                      tag.charAt(0).toUpperCase() + tag.slice(1)
                                  )
                                  .join(" / ")
                              : "Unknown"}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {/* From */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              From
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {mail.from === `${user?.username}@perma.email` ? (
                                <>
                                  <img
                                    src={`https://arweave.net/${user?.image}`}
                                    alt="Profile"
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-green-600">
                                      {user?.name || user?.username} (me)
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {mail.from}
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <img
                                    src={`https://arweave.net/${image}`}
                                    alt="Profile"
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <div>
                                    <p className="text-sm font-medium">
                                      {name || "Unknown User"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {mail.from}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          {/* To */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              To
                            </span>
                            <div className="flex flex-col gap-1 mt-1">
                              {Array.isArray(mail.to) && mail.to.length > 0 ? (
                                mail.to.map((toAddr, idx) => (
                                  <div
                                    key={toAddr + idx}
                                    className="flex items-center gap-2"
                                  >
                                    {toAddr ===
                                    `${user?.username}@perma.email` ? (
                                      <>
                                        <img
                                          src={`https://arweave.net/${user?.image}`}
                                          alt="Profile"
                                          className="w-5 h-5 rounded-full"
                                        />
                                        <span className="text-sm font-medium text-blue-600">
                                          {user?.name || user?.username} (me)
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {toAddr}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-sm font-medium">
                                          {toAddr}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No recipients
                                </span>
                              )}
                            </div>
                          </div>
                          {/* CC */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              CC
                            </span>
                            <div className="flex flex-col gap-1 mt-1">
                              {Array.isArray(mail.cc) && mail.cc.length > 0 ? (
                                mail.cc.map((ccAddr, idx) => (
                                  <div
                                    key={ccAddr + idx}
                                    className="flex items-center gap-2"
                                  >
                                    {ccAddr ===
                                    `${user?.username}@perma.email` ? (
                                      <>
                                        <img
                                          src={`https://arweave.net/${user?.image}`}
                                          alt="Profile"
                                          className="w-5 h-5 rounded-full"
                                        />
                                        <span className="text-sm font-medium text-blue-600">
                                          {user?.name || user?.username} (me)
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {ccAddr}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-sm font-medium">
                                        {ccAddr}
                                      </span>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No CC
                                </span>
                              )}
                            </div>
                          </div>
                          {/* BCC */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              BCC
                            </span>
                            <div className="flex flex-col gap-1 mt-1">
                              {Array.isArray(mail.bcc) &&
                              mail.bcc.length > 0 ? (
                                mail.bcc.map((bccAddr, idx) => (
                                  <div
                                    key={bccAddr + idx}
                                    className="flex items-center gap-2"
                                  >
                                    {bccAddr ===
                                    `${user?.username}@perma.email` ? (
                                      <>
                                        <img
                                          src={`https://arweave.net/${user?.image}`}
                                          alt="Profile"
                                          className="w-5 h-5 rounded-full"
                                        />
                                        <span className="text-sm font-medium text-blue-600">
                                          {user?.name || user?.username} (me)
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {bccAddr}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-sm font-medium">
                                        {bccAddr}
                                      </span>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No BCC
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Date */}
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Date
                            </span>
                            <p className="text-sm mt-1">
                              {new Date(Number(time)).toLocaleString()}
                            </p>
                          </div>
                          {/* Secure */}
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="text-sm font-medium">Secure</p>
                              <p className="text-xs text-gray-500">
                                This message is encrypted
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex items-center justify-end gap-2 ${
              isDarkMode ? "text-gray-50" : "text-gray-900"
            }`}
          >
            <button
              className="group flex items-center gap-2 p-2 hover:bg-pink-400 rounded-lg transition-all duration-300 overflow-hidden"
              title="Download"
            >
              <Download className="h-5 w-5 flex-shrink-0" />
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-500 text-sm font-medium">
                Download Email
              </span>
            </button>
            <>
              {inbox && (
                <button
                  className="group flex items-center gap-2 p-2 hover:bg-blue-600 rounded-lg transition-all duration-500 overflow-hidden"
                  title="Move to Inbox"
                  onClick={() => undo(mail.id)}
                >
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-500 text-sm font-medium">
                    Move to Inbox
                  </span>
                </button>
              )}
              {sent && (
                <button
                  className="group flex items-center gap-2 p-2 hover:bg-green-600 rounded-lg transition-all duration-500 overflow-hidden"
                  title="Move to Sent"
                  onClick={() => undo(mail.id)}
                >
                  <Send className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-500 text-sm font-medium">
                    Move to Sent
                  </span>
                </button>
              )}
              {archive && (
                <button
                  className="group flex items-center gap-2 p-2 hover:bg-yellow-600 rounded-lg transition-all duration-500 overflow-hidden"
                  title="Move to Archive"
                  onClick={() => changeTag("archive", mail.id)}
                >
                  <Archive className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-500 text-sm font-medium">
                    Move to Archive
                  </span>
                </button>
              )}
              {spam && (
                <button
                  className="group flex items-center gap-2 p-2 hover:bg-orange-600 rounded-lg transition-all duration-500 overflow-hidden"
                  title="Move to Spam"
                  onClick={() => changeTag("spam", mail.id)}
                >
                  <OctagonAlert className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-500 text-sm font-medium">
                    Move to Spam
                  </span>
                </button>
              )}
              {trash && (
                <button
                  className="group flex items-center gap-2 p-2 hover:bg-blue-600 rounded-lg transition-all duration-500 overflow-hidden"
                  title="Move to Trash"
                  onClick={() => changeTag("trash", mail.id)}
                >
                  <Trash2 className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-500 text-sm font-medium">
                    Move to Trash
                  </span>
                </button>
              )}
              {deletep && (
                <button
                  className="group flex items-center gap-2 p-2 hover:bg-red-800 rounded-lg transition-all duration-500 overflow-hidden"
                  title="Delete Permanently"
                  onClick={() => deleteM(mail.id)}
                >
                  <Ban className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-500 text-sm font-medium">
                    Delete Permanently
                  </span>
                </button>
              )}
            </>
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
        <div className="flex  justify-between">
          <button
            className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-500"
            onClick={() => {
              navigate(`/dashboard/${slug}`);
              setShowEmailContent(null);
            }}
          >
            <XCircle className="h-5 w-5" />
            Close
          </button>
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
          mail={address}
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

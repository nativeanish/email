import { Box } from "../../types/user";
import { useEmailDetails } from "../../hooks/useEmailDetails";
import useTheme from "../../store/useTheme";
function formatEmailDate(
  timestamp: number | string
): string {
  // Convert “numeric string” → number
  const ms = typeof timestamp === "string"
    ? Number(timestamp)
    : timestamp;

  // Guard against NaN / invalid input
  if (!Number.isFinite(ms)) return "";

  const date = new Date(ms);
  if (isNaN(date.getTime())) return ""; // still invalid? bail out

  const now = new Date();

  // Same Y‑M‑D?
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth()    === now.getMonth()  &&
    date.getDate()     === now.getDate();

  if (sameDay) {
    return date.toLocaleTimeString(undefined, {
      hour:   "2-digit",
      minute: "2-digit",
      hour12: false, // change to true for “12:41 PM”
    });
  }

  // Same year?
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(undefined, {
      month: "long",
      day:   "numeric",
    });
  }

  // Older → dd/mm/yyyy (en‑GB always gives that order)
  return date.toLocaleDateString("en-GB");
}
function EmailDetails({
  box,
  selectedEmail = box,
}: {
  box: Box;
  selectedEmail: Box;
}) {
  const { user, loading, hasError, isEmpty } = useEmailDetails(box);
  const isDarkMode = useTheme((state) => state.theme) === "dark";

  if (loading) {
    return (
      <div className={`w-full p-4 text-center ${isDarkMode ? "text-gray-300 border-b border-gray-300" : "text-gray-600 border-b border-gray-200"}`}>
        <div className="animate-pulse">Loading email details...</div>
      </div>
    );
  }

  if (hasError || isEmpty) {
    return (
      <div className={`w-full p-4 text-center ${isDarkMode ? "text-red-500 border-b border-red-500" : "text-red-600 border-b border-red-200"}`}>
        Failed to load email details
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
    <button
      // onClick={() => handleEmailSelect(email)}
      className={`w-full p-4 text-left ${
        selectedEmail?.id === user.id
          ? isDarkMode
            ? "bg-gray-900 border-b border-gray-800"
            : "bg-gray-200 border-b border-gray-200"
          : ""
      } ${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-50"}`}
    >
      <div className="flex items-start gap-3">
        <img
          src={`https://arweave.net/${user.image}`}
          alt=""
          className="h-10 w-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p
              className={`font-medium truncate ${
                user.seen
                  ? isDarkMode
                    ? "text-gray-300"
                    : "text-gray-600"
                  : isDarkMode
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {user.name}
            </p>
            <p className={`text-sm ${isDarkMode ? "text-gray-100" :"text-gray-800"}`}>{formatEmailDate(user.date)}</p>
          </div>
          <p
            className={`text-sm font-medium truncate mt-2 ${
              user.seen
                ? "text-gray-200"
                : isDarkMode
              ? "text-gray-400"
                : "text-gray-700"
            }`}
          >
            {user.subject}
          </p>
        </div>
      </div>
    </button>
    </div>
  );
}

export default EmailDetails;

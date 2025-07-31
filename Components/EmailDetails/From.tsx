import { useNavigate, useParams } from "react-router-dom";
import { useEmailDetails } from "../../hooks/useEmailDetails";
import useTheme from "../../store/useTheme";
import { Box } from "../../types/user";
import { formatEmailDate } from "../../utils/dateUtils";
import { EmailErrorComponent } from "../UI/EmailErrorComponent";
import useLoginUser from "../../store/useLoginUser";
import { debugUserState } from "../../utils/mail/fetchstore";

function From({ box }: { box: Box }) {
  const {
    user,
    loading,
    hasError,
    isEmpty,
    retry,
    error,
    forceRetry,
    retryCount,
  } = useEmailDetails(box);
  const isDarkMode = useTheme((state) => state.theme) === "dark";
  const { user: _user } = useLoginUser();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { id } = useParams();
  if (loading) {
    return (
      <div
        className={`w-full p-4 text-center ${
          isDarkMode
            ? "text-gray-300 border-b border-gray-300"
            : "text-gray-600 border-b border-gray-200"
        }`}
      >
        <div className="animate-pulse">Loading email details...</div>
      </div>
    );
  }

  if (hasError || isEmpty) {
    // Debug user state when there's an error
    if (error && error.includes("private key")) {
      console.log("Private key error detected, debugging user state:");
      debugUserState();
    }

    return (
      <EmailErrorComponent
        onRetry={retry}
        onForceRetry={forceRetry}
        timestamp={box.delivered_time}
        error={error}
        retryCount={retryCount}
      />
    );
  }

  if (!user) {
    return null;
  }

  const tagType =
    box.bcc.length > 0 && box.bcc.includes(`${_user?.username}@perma.email`)
      ? "BCC"
      : box.cc.length > 0 && box.cc.includes(`${_user?.username}@perma.email`)
      ? "CC"
      : box.to.length > 0 && box.to.includes(`${_user?.username}@perma.email`)
      ? "TO"
      : null;

  return (
    <div>
      <button
        onClick={() => navigate(`/dashboard/${slug}/${user.id}`)}
        className={`w-full p-4 text-left ${
          id === box.id
            ? isDarkMode
              ? "bg-gray-800 border-b border-gray-800"
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
              <div className="flex items-center gap-2">
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
              </div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {formatEmailDate(user.date)}
              </p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p
                className={`text-sm font-medium truncate ${
                  user.seen
                    ? "text-gray-200"
                    : isDarkMode
                    ? "text-gray-400"
                    : "text-gray-700"
                }`}
              >
                {user.subject}
              </p>
              {tagType && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                    tagType === "TO"
                      ? isDarkMode
                        ? "bg-blue-700 text-white"
                        : "bg-blue-100 text-blue-800"
                      : tagType === "CC"
                      ? isDarkMode
                        ? "bg-green-700 text-white"
                        : "bg-green-100 text-green-800"
                      : isDarkMode
                      ? "bg-purple-700 text-white"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {tagType}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default From;

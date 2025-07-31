import { useNavigate, useParams } from "react-router-dom";
import { useEmailDetails } from "../../hooks/useEmailDetails";
import useTheme from "../../store/useTheme";
import { Box } from "../../types/user";
import { formatEmailDate } from "../../utils/dateUtils";
import { useEffect } from "react";
import { EmailErrorComponent } from "../UI/EmailErrorComponent";

function To({ box }: { box: Box }) {
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
  const { id } = useParams();
  const { slug } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(user);
  }, [user]);
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

  return (
    <div>
      <button
        onClick={() => navigate(`/dashboard/${slug}/${user.id}`)}
        className={`w-full p-4 text-left ${
          id === box.id
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
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {formatEmailDate(user.date)}
              </p>
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

export default To;

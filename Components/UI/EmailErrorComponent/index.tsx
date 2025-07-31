import useTheme from "../../../store/useTheme";
import { formatEmailDate } from "../../../utils/dateUtils";

interface EmailErrorComponentProps {
  onRetry: () => void;
  onForceRetry?: () => void;
  timestamp: number;
  className?: string;
  errorMessage?: string;
  error?: string | null;
  retryCount?: number;
}

export function EmailErrorComponent({
  onRetry,
  onForceRetry,
  timestamp,
  className = "",
  errorMessage,
  error,
  retryCount = 0,
}: EmailErrorComponentProps) {
  const isDarkMode = useTheme((state) => state.theme) === "dark";

  // Determine the error message to display
  const getErrorMessage = () => {
    if (error) {
      if (error.includes("Authentication required")) {
        return "Please log in to decrypt this email.";
      }
      if (error.includes("Invalid email format")) {
        return "This email has an invalid format and cannot be processed.";
      }
      if (error.includes("decrypt")) {
        return "Failed to decrypt this email. The encryption keys may be invalid.";
      }
      if (error.includes("corrupted")) {
        return "This email data appears to be corrupted or incomplete.";
      }
      return error;
    }
    return (
      errorMessage ||
      "Unable to decrypt or load this email. This might be due to network issues or encryption problems."
    );
  };

  const getErrorTitle = () => {
    if (error?.includes("Authentication required")) {
      return "Authentication Required";
    }
    if (error?.includes("Invalid email format")) {
      return "Invalid Email Format";
    }
    if (error?.includes("decrypt")) {
      return "Decryption Failed";
    }
    if (error?.includes("corrupted")) {
      return "Corrupted Email Data";
    }
    return "Failed to load email";
  };

  return (
    <div
      className={`w-full p-4 border-b ${
        isDarkMode
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-gray-50"
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Error Icon */}
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center ${
            isDarkMode ? "bg-red-900/20" : "bg-red-100"
          }`}
        >
          <svg
            className={`h-5 w-5 ${
              isDarkMode ? "text-red-400" : "text-red-500"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <p
              className={`font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {getErrorTitle()}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {formatEmailDate(timestamp)}
            </p>
          </div>
          <p
            className={`text-sm mb-3 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {getErrorMessage()}
            {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onRetry}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-gray-800"
                  : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-white"
              }`}
              aria-label="Retry loading email"
            >
              Try Again
            </button>
            {onForceRetry && retryCount >= 1 && (
              <button
                onClick={onForceRetry}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode
                    ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus:ring-offset-gray-800"
                    : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus:ring-offset-white"
                }`}
                aria-label="Force refresh email"
              >
                Force Refresh
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

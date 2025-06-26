import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Clock } from "lucide-react";
import useNotification from "../../store/useNotification";
import useTheme from "../../store/useTheme";

export function NotificationDrawer() {
  const {
    notifications,
    isDrawerOpen,
    setDrawerOpen,
    markAllAsRead,
    markAsRead,
  } = useNotification();
  const isDarkMode = useTheme((state) => state.theme === "dark");

  const unreadCount = notifications.filter((n) => !n.seen).length;

  const formatDate = (timestamp: number): string => {
    const diffMs = Date.now() - timestamp;

    // --- unit lengths (ms) ---
    const sec = 1_000;
    const min = 60 * sec;
    const hr = 60 * min;
    const day = 24 * hr;
    const mon = 30 * day; // ≈ 1 month
    const yr = 365 * day; // ≈ 1 year

    if (diffMs < 10 * sec) return "Just now"; // < 10 s
    if (diffMs < min) return `${Math.floor(diffMs / sec)}s ago`; // seconds
    if (diffMs < hr) return `${Math.floor(diffMs / min)}m ago`; // minutes
    if (diffMs < day) return `${Math.floor(diffMs / hr)}h ago`; // hours
    if (diffMs < mon) return `${Math.floor(diffMs / day)}d ago`; // days
    if (diffMs < yr) return `${Math.floor(diffMs / mon)}mo ago`; // months

    return `${Math.floor(diffMs / yr)}y ago`; // years
  };

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 shadow-2xl ${
              isDarkMode ? "bg-[#141414]" : "bg-gray-50"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <h2
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mark all as read button */}
            {unreadCount > 0 && (
              <div
                className={`p-4 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  onClick={markAllAsRead}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  <Check className="h-4 w-4" />
                  Mark all as read
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <Clock
                      className={`h-8 w-8 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-medium mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    No notifications
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    You're all caught up! Check back later for new updates.
                  </p>
                </div>
              ) : (
                <div
                  className={`divide-y ${
                    isDarkMode ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 cursor-pointer transition-colors relative ${
                        !notification.seen
                          ? isDarkMode
                            ? "bg-gray-800 hover:bg-gray-700"
                            : "bg-blue-50 hover:bg-blue-100"
                          : isDarkMode
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      {/* Unread indicator */}
                      {!notification.seen && (
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}

                      <div className={`${!notification.seen ? "ml-4" : ""}`}>
                        <p
                          className={`text-sm leading-relaxed ${
                            isDarkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {notification.log}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {formatDate(notification.date)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

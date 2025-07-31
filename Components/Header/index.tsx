import {
  Sun,
  Moon,
  PanelLeftDashed,
  Bell,
  RefreshCcw,
  LogOut,
} from "lucide-react";
import useTheme from "../../store/useTheme";
import useSideBar from "../../store/useSideBar";
import { useWalletStore } from "../../store/useWallet";
import useNotification from "../../store/useNotification";
import { NotificationDrawer } from "../NotificationDrawer";
import { useParams } from "react-router-dom";
import useBell from "../../store/useBell";
import useLoading from "../../store/useLoading";
import { showDanger, showSuccess } from "../UI/Toast/Toast-Context";
import dryRun from "../../utils/aos/core/dryRun";
import { User } from "../../types/user";
import useLoginUser from "../../store/useLoginUser";
export function Header() {
  const isDarkMode = useTheme((state) => state.theme === "dark");
  const toggleTheme = useTheme((state) => state.setTheme);
  const setSidebar = useSideBar((state) => state.change);
  const isSidebarOpen = useSideBar((state) => state.isOpen);
  const { disconnectWallet } = useWalletStore();
  const { notifications, setDrawerOpen, addNotification } = useNotification();
  const unreadCount = notifications.filter((n) => !n.seen).length;
  const section = useParams().slug;
  const { status, clear } = useBell();
  const loading = useLoading();
  const { user, setUser } = useLoginUser();
  const update = async () => {
    loading.setTitle("Updating State");
    loading.setDescription("Please wait while we update the state.");
    loading.open();
    const addresss = await window.arweaveWallet.getActiveAddress();
    if (!addresss) {
      showDanger("Please connect your wallet first.");
      loading.close();
      return;
    }
    const result = JSON.parse(
      (await dryRun([{ name: "getByAddress", value: addresss }])).Messages[0]
        .Data
    ) as {
      status: 0 | 1;
      data: User;
    };
    if (result.status === 0) {
      showDanger("Failed to update state. Please try again later.");
      loading.close();
      return;
    }
    if (result.status === 1 && result.data && user?.privateKey) {
      result.data.privateKey = user.privateKey;
      addNotification(result.data.updates);
      setUser(result.data);
      showSuccess("State updated successfully.");
    }
    loading.close();
  };
  return (
    <div>
      <header
        className={`px-4 py-4 border-b ${
          isDarkMode
            ? "bg-[#141414] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="text-gray-400"
              onClick={() => setSidebar(!isSidebarOpen)}
              aria-label="Toggle Sidebar"
            >
              <PanelLeftDashed className="h-6 w-6" />
            </button>
            <h2 className="font-semibold text-gray-400">Dashboard</h2>
            <h2 className="font-semibold text-gray-400">/</h2>
            <h2
              className={`font-semibold text-gray-400 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {section
                ? section.charAt(0).toUpperCase() + section.slice(1)
                : null}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleTheme()}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-200 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Toggle Dark/White Mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className={`p-2 rounded-lg relative ${
                isDarkMode
                  ? "text-gray-200 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                update().then(() => {
                  clear();
                });
              }}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-200 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Refresh"
            >
              <RefreshCcw className="h-5 w-5" />
              {status > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {status > 9 ? "9+" : status}
                </span>
              )}
            </button>
            <button
              onClick={() => disconnectWallet()}
              className={`p-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-200 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title="Disconnect"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <NotificationDrawer />
    </div>
  );
}

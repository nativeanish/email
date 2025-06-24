import { Menu, Plus, Sun, Moon, X, PanelLeftDashed, Bell, RefreshCcw, LogOut } from "lucide-react";
import useTheme from "../../store/useTheme";
import useSideBar from "../../store/useSideBar";
import useMessage from "../../store/useMessage";

export function Header() {
  const isDarkMode = useTheme((state) => state.theme === "dark");
  const toggleTheme = useTheme((state) => state.setTheme);
  const setSidebar = useSideBar((state) => state.change);
    const isSidebarOpen = useSideBar((state) => state.isOpen);
  // const { show, setShow } = useMessage();
  return (
    <header
      className={`px-4 py-4 border-b ${
        isDarkMode ? "bg-[#141414] border-gray-800" : "bg-white border-gray-200"
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
          <h2 className="font-semibold text-gray-400">
            Dashboard
          </h2>
          <h2 className="font-semibold text-gray-400">
           / 
          </h2>
        <h2 className={`font-semibold text-gray-400 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Inbox 
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
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => {
              setSidebar(!isSidebarOpen);
            }}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "text-gray-200 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setSidebar(!isSidebarOpen);
            }}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "text-gray-200 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setSidebar(!isSidebarOpen);
            }}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "text-gray-200 hover:bg-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

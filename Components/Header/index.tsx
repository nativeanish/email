import { Menu, Plus, Sun, Moon, X } from "lucide-react";
import useTheme from "../../store/useTheme";
import useSideBar from "../../store/useSideBar";
import useMessage from "../../store/useMessage";

export function Header() {
  const isDarkMode = useTheme((state) => state.theme === "dark");
  const toggleTheme = useTheme((state) => state.setTheme);
  const setIsSidebarOpen = useSideBar((state) => state.change);
  const { show, setShow } = useMessage();
  return (
    <header
      className={`px-4 py-4 border-b ${
        isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-gray-400"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Emails
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleTheme()}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "text-gray-400 hover:bg-gray-800"
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
              setShow(!show);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            {show ? (
              <>
                <X className="h-5 w-5" />
                <span className="hidden sm:inline">Close</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">New Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

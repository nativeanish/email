import {
  Box,
  Mail,
  Send,
  File,
  Archive,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import useTheme from "../../store/useTheme";
import useSideBar from "../../store/useSideBar";
import { useEffect, useState } from "react";
import WalletModal from "../WalletModal";

export function Sidebar({ name, image }: { name?: string; image?: string }) {
  const isDarkMode = useTheme((state) => state.theme === "dark");
  const isSidebarOpen = useSideBar((state) => state.isOpen);
  const setSidebar = useSideBar((state) => state.change);
  const isSidebarCollapsed = isSidebarOpen ? true : false;
  const [showWalletModal, setShowWalletModal] = useState(false)
  const setIsSidebarOpen = (open: boolean) => {
    setSidebar(open);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {

  },[])
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-all duration-300 ease-in-out z-50 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } ${
          isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
        } border-r`}
      >
        <div className="flex items-center justify-between p-4">
          <div
            className={`flex items-center gap-2 ${
              isSidebarCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <Box className="text-blue-8000 h-7 w-7" />
            {!isSidebarCollapsed && (
              <span
                className={`font-semibold text-lg ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Cusana
              </span>
            )}
          </div>
          <button
            className="md:hidden text-gray-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { icon: Mail, label: "Inbox", active: true },
            { icon: Send, label: "Sent" },
            { icon: File, label: "Draft" },
            { icon: Archive, label: "All Mails" },
            { icon: AlertTriangle, label: "Spam" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg ${
                item.active
                  ? "bg-blue-900/50 text-white"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              } ${isSidebarCollapsed ? "justify-center" : ""}`}
            >
              <item.icon
                className={`${isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5"}`}
              />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4 cursor-pointer" onClick={() => setShowWalletModal(true)}>
          {isSidebarCollapsed ? (
            <div className="flex justify-center">
              <img
                src={
                  image
                    ? `https://arweave.net/${image}`
                    : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt="Profile"
                className="h-10 w-10 rounded-full ring-2 ring-blue-400 mb-3"
              />
            </div>
          ) : (
            <div
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isDarkMode ? "bg-gray-900" : "bg-gray-100"
              }`}
            >
              <img
                src={
                  image
                    ? `https://arweave.net/${image}`
                    : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <p
                  className={`font-medium text-sm ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {name || "Sam Williams"}
                </p>
                <p className="text-xs text-gray-400">
                  {name ? (
                    <>
                      {`${
                        name.length > 11 ? name.slice(0, 8) + "..." : name
                      }@perma.email`}
                    </>
                  ) : (
                    "sam@perma.email"
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 rounded-full p-1 ${
            isDarkMode
              ? "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
              : "bg-white border-gray-200 text-gray-600 hover:text-gray-900"
          } border`}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
      <WalletModal isOpen={showWalletModal} darkMode={isDarkMode} showCloseButton={true} onClose={() => setShowWalletModal(false)} closeOnBackdropClick={true} closable={true}/>
    </>
  );
}

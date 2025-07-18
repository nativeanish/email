import {
  Mail,
  Send,
  File,
  Archive,
  AlertTriangle,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import useTheme from "../../store/useTheme";
import useSideBar from "../../store/useSideBar";
import WalletModal from "../WalletModal";
import useMessage from "../../store/useMessage";
import { useNavigate, useParams } from "react-router-dom";
import useLoginUser from "../../store/useLoginUser";

export function Sidebar({
  name,
  image,
  bio,
  display_name,
}: {
  name?: string;
  image?: string;
  bio?: string;
  display_name?: string;
}) {
  const isDarkMode = useTheme((state) => state.theme === "dark");
  const isSidebarOpen = useSideBar((state) => state.isOpen);
  const setSidebar = useSideBar((state) => state.change);
  const isCollapsed = isSidebarOpen ? true : false;
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { show, setShow } = useMessage();
  const email = useLoginUser((state) => state.user?.mailBox) || [];
  const { user } = useLoginUser();
  const setIsSidebarOpen = (open: boolean) => {
    setSidebar(open);
  };
  const navigate = useNavigate();
  const { slug } = useParams();

  const mainNavItems = [
    {
      icon: Mail,
      label: "Inbox",
      path: "/dashboard/inbox",
      count: email.filter((e) => e.tags.length === 1 && e.tags[0] === "inbox")
        .length,
      active: slug === "inbox",
    },
    {
      icon: Send,
      label: "Sent",
      path: "/dashboard/sent",
      count: email.filter((e) => e.tags.length === 1 && e.tags[0] === "sent")
        .length,
      active: slug === "sent",
    },
    {
      icon: File,
      label: "Draft",
      path: "/dashboard/draft",
      count: user?.draft.length || 0,
      active: slug === "draft",
    },
    {
      icon: Archive,
      label: "Archive",
      path: "/dashboard/archive",
      count: email.filter((e) => e.tags.length === 2 && e.tags[1] === "archive")
        .length,
      active: slug === "archive",
    },
    {
      icon: AlertTriangle,
      label: "Spam",
      path: "/dashboard/spam",
      count: email.filter((e) => e.tags.length === 2 && e.tags[1] === "spam")
        .length,
      active: slug === "spam",
    },
    {
      icon: Trash2,
      label: "Trash",
      path: "/dashboard/trash",
      count: email.filter((e) => e.tags.length === 2 && e.tags[1] === "trash")
        .length,
      active: slug === "trash",
    },
  ];

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-all duration-300 ease-in-out z-50 ${sidebarWidth} ${
          isDarkMode
            ? "bg-[#1a1a1a] border-gray-800"
            : "bg-white border-gray-200"
        } border-r flex flex-col font-mono`}
      >
        {/* Header Section */}
        <div
          className={`${isCollapsed ? "p-3" : "p-4"} ${
            isDarkMode ? "border-b border-gray-800" : "border-b border-gray-200"
          }`}
        >
          {/* Collapse Toggle & Mobile Close */}
          <div className="flex justify-center items-center mb-4">
            <button
              className={`md:hidden transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile */}
          {isCollapsed ? (
            // Collapsed Profile
            <div className="flex flex-col items-center space-y-4">
              <button
                className="group relative"
                onClick={() => setShowWalletModal(true)}
                title={name || "nativeanish"}
              >
                <img
                  src={
                    image
                      ? `https://arweave.net/${image}`
                      : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  }
                  alt="Profile"
                  className={`h-12 w-12 rounded-full ring-2 transition-all ${
                    isDarkMode
                      ? "ring-slate-600 group-hover:ring-slate-500"
                      : "ring-gray-300 group-hover:ring-gray-400"
                  }`}
                />
              </button>

              {/* Collapsed New Mail Button */}
              {show ? (
                <>
                  <button
                    className={`w-12 h-12 text-white rounded-xl transition-colors flex items-center justify-center shadow-lg hover:shadow-xl ${
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                    title="New Mail"
                    onClick={() => {
                      setShow(!show);
                    }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  className={`w-12 h-12 text-white rounded-xl transition-colors flex items-center justify-center shadow-lg hover:shadow-xl ${
                    isDarkMode
                      ? "bg-slate-700 hover:bg-slate-600"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                  title="New Mail"
                  onClick={() => {
                    setShow(!show);
                  }}
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>
          ) : (
            // Expanded Profile
            <div>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  isDarkMode
                    ? "bg-gray-900 hover:bg-gray-800"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
                onClick={() => setShowWalletModal(true)}
              >
                <img
                  src={
                    image
                      ? `https://arweave.net/${image}`
                      : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  }
                  alt="Profile"
                  className={`h-10 w-10 rounded-full ring-2 flex-shrink-0 ${
                    isDarkMode ? "ring-slate-600" : "ring-gray-300"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-white">
                    {display_name || "nativeanish"}
                  </p>
                  <p className="text-xs text-gray-300 truncate">
                    {name ? `${name}@perma.email` : "nativeanish@perma.email"}
                  </p>
                </div>
              </div>

              {/* Expanded New Mail Button */}
              {show ? (
                <>
                  <button
                    className={`w-full mt-3 px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                    onClick={() => {
                      setShow(!show);
                    }}
                  >
                    <X className="h-4 w-4" />
                    Close Compose
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`w-full mt-3 px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                    onClick={() => {
                      setShow(!show);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Compose
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto mt-2">
          {/* Main Navigation */}
          <div className={`${isCollapsed ? "p-2" : "p-4"}`}>
            <nav
              className={`space-y-2 ${
                isCollapsed ? "space-y-3 flex flex-col items-center" : ""
              }`}
            >
              {mainNavItems.map((item) => (
                <button
                  key={item.label}
                  className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                    isCollapsed
                      ? "w-12 h-12 justify-center hover:scale-105"
                      : "w-full px-3 py-2.5 justify-between"
                  } ${
                    item.active
                      ? isCollapsed
                        ? isDarkMode
                          ? "bg-slate-600 text-white shadow-xl border-2 border-slate-400 ring-2 ring-slate-500/50"
                          : "bg-slate-700 text-white shadow-xl border-2 border-slate-500 ring-2 ring-slate-400/50"
                        : isDarkMode
                        ? "bg-slate-700 text-white shadow-lg border border-slate-600"
                        : "bg-slate-800 text-white shadow-lg"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                  onClick={() => navigate(item.path)}
                >
                  <div
                    className={`flex items-center ${
                      isCollapsed ? "justify-center" : "gap-3"
                    } ${
                      item.active && isCollapsed ? "transform scale-110" : ""
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 flex-shrink-0 ${
                        item.active && isCollapsed ? "drop-shadow-lg" : ""
                      }`}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {/* Count Badge */}
                  {!isCollapsed && item.count > 0 && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        item.active
                          ? isDarkMode
                            ? "bg-slate-600 text-gray-200"
                            : "bg-slate-700 text-gray-200"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.count > 0 ? item.count : null}
                    </span>
                  )}

                  {/* Collapsed Count Indicator */}
                  {isCollapsed && item.count > 0 && (
                    <span
                      className={`absolute -top-1 -right-1 h-5 w-5 text-white text-xs rounded-full flex items-center justify-center shadow-lg ${
                        item.active
                          ? "bg-blue-500 ring-2 ring-blue-300"
                          : "bg-red-500"
                      }`}
                    >
                      {item.count > 0 ? item.count : null}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer Section */}
        <div
          className={`${isCollapsed ? "p-3" : "p-4"} ${
            isDarkMode ? "border-t border-gray-800" : "border-t border-gray-200"
          }`}
        >
          {/* Permaemail Branding */}
          <div
            className={`flex items-center gap-2 mb-4 ${
              isCollapsed ? "justify-center" : "justify-center"
            }`}
          >
            <Mail
              className={`h-5 w-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            {!isCollapsed && (
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Permaemail
              </span>
            )}
          </div>
        </div>
      </div>

      <WalletModal
        profileDetails={{
          name: display_name || name || "Anish Gupta",
          username: name || "nativeanish",
          email: `${name || "nativeanish"}@perma.email`,
          photo: image
            ? `https://arweave.net/${image}`
            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: bio,
        }}
        showProfile={true}
        isOpen={showWalletModal}
        darkMode={isDarkMode}
        showCloseButton={true}
        onClose={() => setShowWalletModal(false)}
        closeOnBackdropClick={true}
        closable={true}
      />
    </>
  );
}

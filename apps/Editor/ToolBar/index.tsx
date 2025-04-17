import { Send, Smile } from "lucide-react";
import Align from "./Component/Align";

function ToolBar({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Align isDarkMode={isDarkMode} />

        <button
          className={`p-2 rounded-lg ${
            isDarkMode
              ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Smile className="h-5 w-5" />
        </button>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
        <Send className="h-5 w-5" />
        Send
      </button>
    </div>
  );
}

export default ToolBar;

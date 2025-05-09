import { Send } from "lucide-react";
import Align from "./Component/Align";
import Element from "./Component/Element";
import ColorText from "./Component/ColorText";
import EmojiPickerButton from "./Component/Emoji";
function ToolBar({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Align isDarkMode={isDarkMode} />
        <Element isDarkMode={isDarkMode} />
        <ColorText />
        <EmojiPickerButton />
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
        <Send className="h-5 w-5" />
        Send
      </button>
    </div>
  );
}

export default ToolBar;

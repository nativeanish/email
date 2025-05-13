import { Send } from "lucide-react";
import Align from "./Component/Align";
import EmojiPickerButton from "./Component/Emoji";
import Attachment from "./Component/Attachment";
import { useState } from "react";
import { FileUploadModal } from "../../../Components/FileUploadModal/";
function ToolBar({ isDarkMode }: { isDarkMode: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Align isDarkMode={isDarkMode} />
          <Attachment isDarkMode={isDarkMode} open={setIsModalOpen} />
          <EmojiPickerButton />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Send className="h-5 w-5" />
          Send
        </button>
      </div>
      <FileUploadModal isDarkMode={isDarkMode} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxFileSize={100} />
    </div>
  );
}

export default ToolBar;

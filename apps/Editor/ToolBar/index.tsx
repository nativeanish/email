import { Send } from "lucide-react";
import Align from "./Component/Align";
import EmojiPickerButton from "./Component/Emoji";
import Attachment from "./Component/Attachment";
import { useState } from "react";
import { FileUploadModal } from "../../../Components/FileUploadModal/";
import { $generateHtmlFromNodes } from "@lexical/html";
import useEditor from "../../../store/useEditor";
import { inlineTailwind } from "../../../utils/inline";
import { sendEmail } from "../../../utils/mail/send";
import useLoading from "../../../store/useLoading";

function ToolBar({ isDarkMode }: { isDarkMode: boolean }) {
  const { editor } = useEditor();
  const load = useLoading()
  const send = () => {
    if (!editor) {
      console.error("Editor is not available");
      return null;
    }
    load.open()
    load.setTitle("Sending Email");
    load.setDescription("Converting content to HTML and sending email...");
    load.setDarkMode(isDarkMode);
    load.setSize("md");
    const html = editor.getEditorState().read(() => {
      return $generateHtmlFromNodes(editor, null);
    });
    sendEmail(inlineTailwind(html)).then(console.log).catch(console.error);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Align isDarkMode={isDarkMode} />
          <Attachment isDarkMode={isDarkMode} open={setIsModalOpen} />
          <EmojiPickerButton />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          onClick={() => send()}
        >
          <Send className="h-5 w-5" />
          Send
        </button>
      </div>
      <FileUploadModal
        isDarkMode={isDarkMode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxFileSize={100}
      />
    </div>
  );
}

export default ToolBar;

import { useState } from "react";
import Editor from "../../apps/Editor";
import Align from "../../apps/Editor/ToolBar/Component/Align";
import EmojiPickerButton from "../../apps/Editor/ToolBar/Component/Emoji";
import { Reply as Rep, XCircle } from "lucide-react";
import useEditor from "../../store/useEditor";
import { $generateHtmlFromNodes } from "@lexical/html";
import { inlineTailwind } from "../../utils/inline";
import replyAndForward from "../../utils/mail/replyandforward";
import { useNavigate } from "react-router-dom";
interface Props {
  isDarkMode: boolean;
  _subject: string;
  closeModal: () => void;
  mail: string;
}
function Reply({ isDarkMode, _subject, closeModal, mail }: Props) {
  const [subject, setSubject] = useState("Re: " + _subject);
  const { editor } = useEditor();
  const navigate = useNavigate();
  const reply = async () => {
    if (!editor) return;
    const html = editor.getEditorState().read(() => {
      return $generateHtmlFromNodes(editor, null);
    });
    closeModal();
    const rep = await replyAndForward(
      [mail],
      subject,
      inlineTailwind(html),
      "reply"
    );
    if (rep === true || rep === false) {
      if (rep === true) {
        navigate("/dashboard/sent");
      }
    }
  };
  return (
    <div>
      <div className="flex flex-col">
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Subject
          </label>
          <input
            type="text"
            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
            }`}
            value={subject}
            onChange={(e) => setSubject(e.currentTarget.value)}
            placeholder="Enter subject here..."
          />
        </div>
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Reply
          </label>
          <div
            className={`h-96 border rounded-md p-2 mt-4 ${
              isDarkMode ? "border-gray-700" : "border-gray-300 "
            }`}
          >
            <Editor isDarkMode={isDarkMode} />
          </div>
        </div>
        <div className="flex justify-between gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Align isDarkMode={isDarkMode} />
            <EmojiPickerButton />
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center justify-center gap-x-2 px-2 py-2 rounded-md shadow-sm transition-all ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  : "bg-white hover:bg-gray-50 text-black border border-gray-200"
              }`}
              onClick={() => reply()}
            >
              <Rep className="h-5 w-5" />
              <span className="text-sm font-medium">Send Reply</span>
            </button>
            <button
              className={`flex items-center justify-center gap-x-2 px-2 py-2 rounded-md shadow-sm transition-all ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  : "bg-white hover:bg-gray-50 text-black border border-gray-200"
              }`}
              onClick={() => closeModal()}
            >
              <XCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reply;

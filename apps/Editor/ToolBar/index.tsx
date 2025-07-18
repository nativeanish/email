import { File, Send, XCircle } from "lucide-react";
import Align from "./Component/Align";
import EmojiPickerButton from "./Component/Emoji";
import Attachment from "./Component/Attachment";
import { useState } from "react";
import { FileUploadModal } from "../../../Components/FileUploadModal/";
import { $generateHtmlFromNodes } from "@lexical/html";
import useEditor from "../../../store/useEditor";
import { inlineTailwind } from "../../../utils/inline";
import { encryptForOne, sendEmail } from "../../../utils/mail/send";
import useLoading from "../../../store/useLoading";
import useMail from "../../../store/useMail";
import {
  showDanger,
  showSuccess,
} from "../../../Components/UI/Toast/Toast-Context";
import { $getRoot } from "lexical";
import register from "../../../utils/aos/core/register";
import useLoginUser from "../../../store/useLoginUser";
import { ReturnResult } from "../../../Components/NotificationDrawer";
import useNotification from "../../../store/useNotification";
import useMessage from "../../../store/useMessage";
import { useNavigate } from "react-router-dom";

function ToolBar({ isDarkMode }: { isDarkMode: boolean }) {
  const { editor } = useEditor();
  const load = useLoading();
  const navigate = useNavigate();
  const send = () => {
    if (!editor) {
      console.error("Editor is not available");
      return null;
    }
    load.open();
    load.setTitle("Sending Email");
    load.setDescription("Converting content to HTML and sending email...");
    load.setDarkMode(isDarkMode);
    load.setSize("md");
    const html = editor.getEditorState().read(() => {
      return $generateHtmlFromNodes(editor, null);
    });
    sendEmail(inlineTailwind(html), navigate)
      .then(console.log)
      .catch(console.error);
  };
  const __mail = useMail();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addNotification } = useNotification();
  const { user } = useLoginUser();
  const { setShow } = useMessage();
  const saveDraf = async () => {
    try {
      load.setTitle("Saving Draft");
      load.setDescription("Allow wallet to update");
      load.open();
      if (!editor) {
        console.error("Editor is not available");
        load.close();
        return null;
      }
      if (__mail.subject === "") {
        load.close();
        showDanger("Subject and recipient cannot be empty to save a draft.");
        return null;
      }
      const check = editor.getEditorState().read(() => {
        const root = $getRoot();
        return root.getTextContent().trim();
      });
      if (user?.privateKey === undefined || user?.privateKey === null) {
        load.close();
        showDanger("Failed to save draft.");
        return;
      }
      const __data = await encryptForOne(
        JSON.stringify({
          subject: __mail.subject,
          to: __mail.to.length > 0 ? __mail.to : [""],
          content:
            check.length === 0
              ? ""
              : inlineTailwind(
                  editor
                    .getEditorState()
                    .read(() => $generateHtmlFromNodes(editor, null))
                ),
        }),
        user.publicKey
      );
      const msg = await register([
        { name: "Action", value: "Evaluate" },
        {
          name: "writeDraft",
          value: JSON.stringify({
            content: {
              data: __data.data,
              iv: __data.iv,
              key: __data.key,
            },
          }),
        },
      ]);
      console.log(msg);
      const result = JSON.parse(msg.Messages[0].Data) as ReturnResult;
      if (result.status === 0) {
        load.close();
        showDanger(JSON.stringify(result.data));
        return;
      }
      if (
        result.status === 1 &&
        result.data.msg === "Draft saved successfully"
      ) {
        result.data.user.privateKey = user.privateKey;
        useLoginUser.getState().setUser(result.data.user);
        addNotification(result.data.user.updates);
        showSuccess("Draft saved successfully");
        useMessage.getState().setShow(false);
        editor.update(() => {
          const root = $getRoot();
          root.clear();
        });
        navigate("/dashboard/draft");
      }
      load.close();
    } catch (err) {
      load.close();
      console.error(err);
      showDanger("Failed to save draft.");
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-500"
            onClick={() => setShow(false)}
          >
            <XCircle className="h-5 w-5" />
            Close
          </button>
          <Align isDarkMode={isDarkMode} />
          <Attachment isDarkMode={isDarkMode} open={setIsModalOpen} />
          <EmojiPickerButton />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={() => saveDraf()}
          >
            <File className="h-5 w-5" />
            Save as a Draft
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            onClick={() => send()}
          >
            <Send className="h-5 w-5" />
            Send
          </button>
        </div>
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

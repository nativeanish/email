import {
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  EditorState,
  ParagraphNode,
} from "lexical";
import { useEffect, useState } from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import SlashCommandPlugin from "./Plugin/SlashCommandPlugin";
import useEditor from "../../store/useEditor";
import theme from "./utils/theme";
import usePragraph from "../../store/useParagraph";
import { $isHeadingNode, HeadingNode, QuoteNode } from "@lexical/rich-text";
import { FloatingToolbar } from "./ToolBar/Component/FloatingToolbar";
import LexicalAutoLinkPlugin from "./Plugin/AutoLinkPlugin";

function onError(error: Error) {
  console.error(error);
}

function PlaceholderVisibilityPlugin({
  setShowPlaceholder,
}: {
  setShowPlaceholder: (isVisible: boolean) => void;
}) {
  const setEdirot = useEditor((state) => state.setEditor);
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    setEdirot(editor);
  }, [editor, setEdirot]);

  useEffect(() => {
    if (!editor) {
      return;
    }
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const isEmpty = root.getTextContent() === "";
        setShowPlaceholder(isEmpty);
      });
    });
  }, [editor, setShowPlaceholder]);

  return null;
}
function onChange(e: EditorState) {
  e.read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const blockNode = anchorNode.getTopLevelElementOrThrow();
      const alignment = blockNode.getFormatType();
      if (!alignment || alignment === "left") {
        usePragraph.setState({ align: "left" });
      } else if (alignment === "center") {
        usePragraph.setState({ align: "center" });
      } else if (alignment === "right") {
        usePragraph.setState({ align: "right" });
      }

      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        const headingTag = element.getTag();
        usePragraph.getState().setElement(headingTag);
      }

      if ($isParagraphNode(element)) {
        const paragraphTag = element.getType();
        if (paragraphTag === "paragraph") {
          usePragraph.getState().setElement("p");
        }
      }
    }
  });
}
export default function Editor({ isDarkMode }: { isDarkMode: boolean }) {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      ParagraphNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
      AutoLinkNode,
    ],
  };
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const align = usePragraph((state) => state.align);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative flex-1 w-full h-full">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              // className="w-full h-full px-0 py-2 border-none resize-none focus:outline-none"
              className={`w-full h-full px-0 py-2 border-none resize-none focus:outline-none ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}
            />
          }
          placeholder={
            showPlaceholder ? (
              <div
                className={`absolute top-0 px-0 py-2  pointer-events-none ${align === "left" ? "left-0" : ""
                  } ${align === "center" ? "left-1/2 -translate-x-1/2" : ""} ${align === "right" ? "right-0" : ""
                  } ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                }}
              >
                Write your message ... or start with /
              </div>
            ) : null
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <PlaceholderVisibilityPlugin setShowPlaceholder={setShowPlaceholder} />
      </div>
      <SlashCommandPlugin />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <LinkPlugin />
      <CheckListPlugin />
      <LexicalAutoLinkPlugin />
      <FloatingToolbar isDarkMode={isDarkMode} />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
}

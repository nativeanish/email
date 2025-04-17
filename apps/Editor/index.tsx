import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  EditorState,
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

import useEditor from "../../store/useEditor";
import theme from "./utils/theme";
import usePragraph from "../../store/useParagraph";

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
  }, [editor]);

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
    }
  });
}
export default function Editor({ isDarkMode = false }) {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const align = usePragraph((state) => state.align);
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative flex-1 w-full h-full">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={`w-full h-full px-0 py-2 bg-transparent border-none resize-none focus:outline-none ${
                isDarkMode
                  ? "text-white placeholder-gray-500"
                  : "text-gray-900 placeholder-gray-400"
              }`}
            />
          }
          placeholder={
            showPlaceholder ? (
              <div
                className={`absolute top-0 px-0 py-2 text-gray-400 pointer-events-none ${
                  align === "left" ? "left-0" : ""
                } ${align === "center" ? "left-1/2 -translate-x-1/2" : ""} ${
                  align === "right" ? "right-0" : ""
                }`}
              >
                Write your message...
              </div>
            ) : null
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <PlaceholderVisibilityPlugin setShowPlaceholder={setShowPlaceholder} />
      </div>
      <HistoryPlugin />
      <AutoFocusPlugin />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
}

import { $insertNodes, $createTextNode } from "lexical";
import { Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import useEditor from "../../../../../store/useEditor";
import useTheme from "../../../../../store/useTheme";

export default function EmojiPickerButton() {
  const editor = useEditor((state) => state.editor);
  const [showPicker, setShowPicker] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (!editor) {
      return;
    }
    editor.update(() => {
      const textNode = $createTextNode(emojiData.emoji);
      $insertNodes([textNode]);
    });
    setShowPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { theme } = useTheme();
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowPicker((prev) => !prev)}
        className="w-10 h-10 rounded-md shadow-md flex items-center justify-center mt-1 bg-white dark:bg-zinc-800"
        title="Insert emoji"
      >
        <Smile className="w-4 h-4 text-zinc-800 dark:text-zinc-100" />
      </button>

      {showPicker && (
        <div ref={pickerRef} className="absolute z-50 bottom-12 left-0">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            skinTonesDisabled
            height={350}
            theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
            width={300}
          />
        </div>
      )}
    </div>
  );
}

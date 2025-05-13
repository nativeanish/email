import { $insertNodes, $createTextNode } from "lexical";
import { Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import useEditor from "../../../../../store/useEditor";
import useTheme from "../../../../../store/useTheme";
import { motion, AnimatePresence } from "framer-motion";

export default function EmojiPickerButton() {
  const editor = useEditor((state) => state.editor);
  const [showPicker, setShowPicker] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

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

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={() => setShowPicker((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center px-3 py-2 rounded-md shadow-sm transition-all ${isDarkMode
          ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
          : "bg-white hover:bg-gray-50 text-black border border-gray-200"
          } ${showPicker ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : ""}`}
        aria-label="Insert emoji"
      >
        <Smile className="w-5 h-5" />
        <span className="ml-2 text-sm font-medium">Emoji</span>
      </motion.button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            ref={pickerRef}
            className="absolute z-50 bottom-12 right-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`p-1 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              }`}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                autoFocusSearch={false}
                skinTonesDisabled
                searchPlaceHolder="Search emoji..."
                height={350}
                theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
                width={320}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

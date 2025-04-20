import { $getSelection, $isRangeSelection, TextFormatType } from "lexical";
import { useEffect, useState } from "react";
import { useFloatingToolbarPosition } from "../../../../../hooks/useFloatingToolbarPosition";

import {
  Bold,
  CaseLower,
  CaseSensitive,
  CaseUpper,
  Code,
  Highlighter,
  Italic,
  Link,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  WandSparkles,
} from "lucide-react";
import useEditor from "../../../../../store/useEditor";

const formats = [
  "bold",
  "underline",
  "strikethrough",
  "italic",
  "highlight",
  "code",
  "subscript",
  "superscript",
  "lowercase",
  "uppercase",
  "capitalize",
] as const;

const tools = [
  { name: "AI", icon: <WandSparkles className="h-4 w-4" /> },
  { name: "bold", icon: <Bold className="h-4 w-4" /> },
  { name: "italic", icon: <Italic className="h-4 w-4" /> },
  { name: "underline", icon: <Underline className="h-4 w-4" /> },
  { name: "strikethrough", icon: <Strikethrough className="h-4 w-4" /> },
  { name: "subscript", icon: <Subscript className="h-4 w-4" /> },
  { name: "superscript", icon: <Superscript className="h-4 w-4" /> },
  { name: "uppercase", icon: <CaseUpper className="h-4 w-4" /> },
  { name: "lowercase", icon: <CaseLower className="h-4 w-4" /> },
  { name: "capitalize", icon: <CaseSensitive className="h-4 w-4" /> },
  { name: "highlight", icon: <Highlighter className="h-4 w-4" /> },
  { name: "code", icon: <Code className="h-4 w-4" /> },
  { name: "link", icon: <Link className="h-4 w-4" /> },
];

export function FloatingToolbar({ isDarkMode }: { isDarkMode: boolean }) {
  const editor = useEditor((state) => state.editor);
  const position = useFloatingToolbarPosition();
  const [activeFormats, setActiveFormats] = useState<Set<TextFormatType>>(
    new Set()
  );

  useEffect(() => {
    if (!editor) return;
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const active = new Set<TextFormatType>();
          formats.forEach((format) => {
            if (selection.hasFormat(format)) {
              active.add(format);
            }
          });
          setActiveFormats(active);
        } else {
          setActiveFormats(new Set());
        }
      });
    });
  }, [editor]);

  const applyFormat = (format: TextFormatType) => {
    if (!editor) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText(format);
      }
    });
  };

  const run = (name: (typeof tools)[number]["name"]) => {
    if (name === "highlight") {
      return;
    }
    if (formats.includes(name as TextFormatType)) {
      applyFormat(name as TextFormatType);
    }
  };

  if (!position) return null;

  const clampedLeft = Math.min(
    Math.max(position.left + position.width / 2, 8),
    window.innerWidth - 8
  );
  const clampedTop = Math.max(position.top - 48, 8);

  const baseTheme = isDarkMode
    ? "bg-[#1e1e1e] text-white border-[#3a3a3a]"
    : "bg-white text-black border-[#ccc]";

  const buttonBase = isDarkMode
    ? "hover:bg-[#333] text-white"
    : "hover:bg-[#f1f1f1] text-black";

  const activeBg = isDarkMode ? "bg-[#333]" : "bg-[#e5e5e5]";

  return (
    <div
      className={`absolute z-50 border rounded-full px-2 py-1 shadow-lg backdrop-blur ${baseTheme}`}
      style={{
        top: clampedTop,
        left: clampedLeft,
        transform: "translateX(-50%)",
      }}
    >
      <div className="flex items-center space-x-1">
        {tools.map((tool) => {
          const isActive = activeFormats.has(tool.name as TextFormatType);
          return (
            <button
              key={tool.name}
              onClick={() => run(tool.name)}
              className={`p-2 rounded-full transition-all duration-150 ease-in-out flex items-center justify-center hover:scale-105 ${buttonBase} ${
                isActive ? activeBg : ""
              }`}
              title={tool.name}
            >
              {tool.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}

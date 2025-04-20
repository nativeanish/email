import {
  $getSelection,
  $isRangeSelection,
  TextFormatType,
  $isTextNode,
} from "lexical";
import { useEffect, useState, useRef } from "react";
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
  X,
} from "lucide-react";
import useEditor from "../../../../../store/useEditor";
import useColor from "../../../../../store/useColor";

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

const highlightColors = [
  "#ffeb3b", // Yellow
  "#ff9800", // Orange
  "#4caf50", // Green
  "#03a9f4", // Blue
  "#e91e63", // Pink
];

export function FloatingToolbar({ isDarkMode }: { isDarkMode: boolean }) {
  const editor = useEditor((state) => state.editor);
  const position = useFloatingToolbarPosition();
  const [activeFormats, setActiveFormats] = useState<Set<TextFormatType>>(
    new Set()
  );
  const [toolbarWidth, setToolbarWidth] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const { setHighlightColor } = useColor();

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

          // Check if selection has highlight
          const nodes = selection.getNodes();
          const hasHighlight = nodes.some((node) => {
            if ($isTextNode(node)) {
              const style = node.getStyle();
              return style && style.includes("background-color");
            }
            return false;
          });
          setIsHighlighted(hasHighlight);
          setActiveFormats(active);
        } else {
          setActiveFormats(new Set());
          setIsHighlighted(false);
        }
      });
    });
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyFormat = (format: TextFormatType) => {
    if (!editor) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText(format);
      }
    });
  };

  const removeHighlight = () => {
    if (!editor) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const isBackward = selection.isBackward();
        const startOffset = isBackward ? focus.offset : anchor.offset;
        const endOffset = isBackward ? anchor.offset : focus.offset;

        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            const textContent = node.getTextContent();
            const nodeSize = textContent.length;

            // Only remove highlight from the selected portion
            if (startOffset > 0 || endOffset < nodeSize) {
              const originalNode = node.splitText(startOffset, endOffset)[1];
              originalNode.setStyle("");
            } else {
              node.setStyle("");
            }
          }
        });
      }
    });
    setShowColorPicker(false);
    setIsHighlighted(false);
  };

  const applyHighlight = (color: string) => {
    if (!editor) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const isBackward = selection.isBackward();
        const startOffset = isBackward ? focus.offset : anchor.offset;
        const endOffset = isBackward ? anchor.offset : focus.offset;

        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            const textContent = node.getTextContent();
            const nodeSize = textContent.length;

            // Only highlight the selected portion
            if (startOffset > 0 || endOffset < nodeSize) {
              const [, selected] = node.splitText(startOffset, endOffset);
              selected.setStyle(`background-color: ${color};`);
            } else {
              node.setStyle(`background-color: ${color};`);
            }
          }
        });
      }
    });
    setIsHighlighted(true);
  };

  const run = (name: (typeof tools)[number]["name"]) => {
    if (name === "highlight") {
      setShowColorPicker(!showColorPicker);
      return;
    }
    if (formats.includes(name as TextFormatType)) {
      applyFormat(name as TextFormatType);
    }
  };

  if (!position) return null;

  const baseTheme = isDarkMode
    ? "bg-[#1e1e1e] text-white border-[#3a3a3a]"
    : "bg-white text-black border-[#ccc]";

  const buttonBase = isDarkMode
    ? "hover:bg-[#333] text-white"
    : "hover:bg-[#f1f1f1] text-black";

  const activeBg = isDarkMode ? "bg-[#333]" : "bg-[#e5e5e5]";

  const maxLeft = window.innerWidth - toolbarWidth - 16;
  const minLeft = 16;
  let left = position.left + position.width / 2;
  left = Math.min(
    Math.max(left, minLeft + toolbarWidth / 2),
    maxLeft + toolbarWidth / 2
  );

  return (
    <div
      className={`fixed z-50 border rounded-full px-2 py-1 shadow-lg backdrop-blur ${baseTheme}`}
      style={{
        top: Math.max(position.top - 48, 8),
        left: `${left}px`,
        transform: "translateX(-50%)",
      }}
      ref={(el) => {
        if (el && el.offsetWidth !== toolbarWidth) {
          setToolbarWidth(el.offsetWidth);
        }
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

      {showColorPicker && (
        <div
          ref={colorPickerRef}
          className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 rounded-lg shadow-lg ${baseTheme}`}
        >
          <div className="flex gap-2 items-center">
            {highlightColors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setHighlightColor(color);
                  applyHighlight(color);
                  setShowColorPicker(false);
                }}
                className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title="Select highlight color"
              />
            ))}
            {isHighlighted && (
              <button
                onClick={removeHighlight}
                className={`p-1 rounded-full hover:scale-110 transition-transform ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
                title="Remove highlight"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

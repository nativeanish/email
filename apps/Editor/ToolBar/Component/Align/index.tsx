import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import useEditor from "../../../../../store/useEditor";
import usePragraph from "../../../../../store/useParagraph";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

function Align({ isDarkMode }: { isDarkMode: boolean }) {
  const editor = useEditor((state) => state.editor);
  const align = usePragraph((state) => state.align);
  const setAlign = usePragraph((state) => state.setAlign);
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const alignOptions = [
    { value: "left", icon: <AlignLeft size={16} />, label: "Left" },
    { value: "center", icon: <AlignCenter size={16} />, label: "Center" },
    { value: "right", icon: <AlignRight size={16} />, label: "Right" },
  ];

  const currentOption = alignOptions.find((option) => option.value === align) || alignOptions[0];

  const handleAlignment = (value: string) => {
    if (!editor) return;

    if (value === "left") {
      setAlign("left");
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
    } else if (value === "center") {
      setAlign("center");
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
    } else if (value === "right") {
      setAlign("right");
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
    }

    setIsOpen(false);
  };

  // Detect dropdown direction
  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setDropUp(spaceBelow < 200 && spaceAbove > spaceBelow);
      }
    };

    if (isOpen) {
      updatePosition();
    }

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        ref={buttonRef}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md shadow-sm transition-colors ${isDarkMode
          ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
          : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
          }`}
        aria-label="Text alignment"
      >
        <div className="flex items-center gap-2">
          {currentOption.icon}
          <span className="text-sm font-medium">{currentOption.label}</span>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke={isDarkMode ? "#FFFFFF" : "#4B5563"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: dropUp ? 5 : -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className={`absolute z-10 min-w-[160px] rounded-lg shadow-lg ${dropUp ? "bottom-full mb-1" : "top-full mt-1"
            } ${isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
            }`}
        >
          <div className="py-1">
            {alignOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAlignment(option.value)}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm ${option.value === align
                  ? isDarkMode
                    ? "bg-gray-700 text-blue-400"
                    : "bg-gray-100 text-blue-600"
                  : isDarkMode
                    ? "text-gray-200 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-50"
                  } transition-colors`}
              >
                <span className={option.value === align ? "text-blue-500" : ""}>{option.icon}</span>
                <span>{option.label}</span>
                {option.value === align && (
                  <svg className="ml-auto h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Align;

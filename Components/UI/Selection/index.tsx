import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface IconSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  isDarkMode?: boolean;
  placeholder?: string;
}

const Selection: React.FC<IconSelectProps> = ({
  options,
  value,
  onChange,
  isDarkMode = false,
  placeholder = "Select an option",
}) => {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const selected = options.find((opt) => opt.value === value);

  const themeBase = isDarkMode
    ? "bg-gray-800 text-white border-gray-700"
    : "bg-white text-black border-gray-300";

  const hoverItem = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  // Calculate max width from options
  useEffect(() => {
    if (open && optionsRef.current.length > 0) {
      const widths = optionsRef.current.map((el) => el?.offsetWidth || 0);
      const widest = Math.max(...widths);
      setMaxWidth(widest);
    }
  }, [open]);

  // Detect dropdown direction
  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropUp(spaceBelow < 200 && spaceAbove > spaceBelow); // heuristic
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex justify-between items-center px-3 py-2 rounded border ${themeBase} focus:outline-none`}
      >
        <span className="flex items-center gap-2">
          {selected?.icon}
          {selected?.label || placeholder}
        </span>
        <ChevronDown size={18} className="ml-2" />
      </button>

      {open && (
        <div
          className={`absolute z-10 ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          } rounded border ${themeBase} max-h-60 overflow-auto`}
          style={{ minWidth: `${maxWidth}px` }}
        >
          {options.map((opt, index) => (
            <div
              key={opt.value}
              ref={(el) => {
                optionsRef.current[index] = el;
              }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${hoverItem}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.icon}
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Selection;

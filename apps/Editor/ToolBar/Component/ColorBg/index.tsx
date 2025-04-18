import { PaintBucket } from "lucide-react";
import React, { useRef } from "react";
import useColor from "../../../../../store/useColor";

const ColorBg = () => {
  const bg = useColor((state) => state.bg);
  const setBg = useColor((state) => state.setBg);
  const text = useColor((state) => state.text);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleClick = () => {
    inputRef.current?.click();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBg(e.target.value);
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className="w-10 h-10 rounded-md shadow-md flex items-center justify-center mt-1"
        style={{ backgroundColor: bg }}
        title="Pick a color"
      >
        <PaintBucket style={{ color: text }} />
      </button>

      {/* Hidden color input */}
      <input
        type="color"
        ref={inputRef}
        value={bg}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default ColorBg;

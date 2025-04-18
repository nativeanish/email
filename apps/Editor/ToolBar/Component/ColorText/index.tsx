import React, { useRef } from "react";
import useColor from "../../../../../store/useColor";
import { ALargeSmall } from "lucide-react";

const ColorText = () => {
  const bg = useColor((state) => state.bg);
  const text = useColor((state) => state.text);
  const setText = useColor((state) => state.setText);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleClick = () => {
    inputRef.current?.click();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className="w-10 h-10 rounded-md shadow-md flex items-center justify-center mt-1"
        style={{ backgroundColor: bg }}
        title="Pick a color"
      >
        <ALargeSmall style={{ color: text }} />
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

export default ColorText;

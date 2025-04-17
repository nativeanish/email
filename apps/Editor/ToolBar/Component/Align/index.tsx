import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import Selection from "../../../../../Components/UI/Selection";
import useEditor from "../../../../../store/useEditor";
import usePragraph from "../../../../../store/useParagraph";
const AlignOptions = [
  { label: "Left", value: "left", icon: <AlignLeft size={18} /> },
  { label: "Center", value: "center", icon: <AlignCenter size={18} /> },
  { label: "Right", value: "right", icon: <AlignRight size={18} /> },
];
function Align({ isDarkMode }: { isDarkMode: boolean }) {
  const editor = useEditor((state) => state.editor);
  const align = usePragraph((state) => state.align);
  const setAlign = usePragraph((state) => state.setAlign);
  const handleChange = (value: string) => {
    if (!editor) {
      return;
    }
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
  };
  return (
    <div>
      <Selection
        options={AlignOptions}
        value={align}
        onChange={handleChange}
        isDarkMode={isDarkMode}
        placeholder="Choose a theme"
      />
    </div>
  );
}

export default Align;

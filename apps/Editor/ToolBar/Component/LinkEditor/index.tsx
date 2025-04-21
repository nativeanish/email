import { $getSelection, $isRangeSelection } from "lexical";
import { $createLinkNode, $isLinkNode } from "@lexical/link";
import { useState, useEffect } from "react";
import useEditor from "../../../../../store/useEditor";
import { X } from "lucide-react";

interface LinkEditorProps {
  showLinkEditor: boolean;
  setShowLinkEditor: (show: boolean) => void;
  isDarkMode: boolean;
}

export function LinkEditor({
  showLinkEditor,
  setShowLinkEditor,
  isDarkMode,
}: LinkEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [lastSelection, setLastSelection] = useState<any>(null);
  const editor = useEditor((state) => state.editor);

  useEffect(() => {
    if (!showLinkEditor) {
      setLinkUrl("");
      setLastSelection(null);
    } else {
      editor?.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.getNodes()[0];
          const parent = node.getParent();
          if ($isLinkNode(parent)) {
            setLinkUrl(parent.getURL());
          }
          setLastSelection(selection.clone());
        }
      });
    }
  }, [showLinkEditor, editor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || !lastSelection) return;

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        selection?.insertRawText(linkUrl);
        return;
      }

      const nodes = selection.getNodes();
      const parent = nodes[0].getParent();

      if ($isLinkNode(parent)) {
        parent.setURL(linkUrl);
        // Set target to _blank for opening in new tab
        parent.setTarget("_blank");
      } else {
        const linkNode = $createLinkNode(linkUrl);
        // Set target to _blank for opening in new tab
        linkNode.setTarget("_blank");
        selection.insertNodes([linkNode]);
        selection.getNodes().forEach((node) => {
          linkNode.append(node);
        });
      }
    });

    setShowLinkEditor(false);
  };

  const removeLink = () => {
    if (!editor) return;

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const node = selection.getNodes()[0];
      const parent = node.getParent();

      if ($isLinkNode(parent)) {
        const children = parent.getChildren();
        for (const child of children) {
          parent.insertBefore(child);
        }
        parent.remove();
      }
    });

    setShowLinkEditor(false);
  };

  const baseTheme = isDarkMode
    ? "bg-[#1e1e1e] text-white border-[#3a3a3a]"
    : "bg-white text-black border-[#ccc]";

  const buttonBase = isDarkMode
    ? "hover:bg-[#333] text-white"
    : "hover:bg-[#f1f1f1] text-black";

  if (!showLinkEditor) return null;

  return (
    <div
      className={`absolute z-50 p-3 rounded-lg shadow-lg ${baseTheme} border min-w-[300px]`}
      style={{
        top: "calc(100% + 10px)",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Link URL</label>
          <button
            type="button"
            onClick={() => setShowLinkEditor(false)}
            className={`p-1 rounded-full ${buttonBase}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="Enter URL"
          className={`w-full px-3 py-2 rounded border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-black"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <div className="flex justify-between mt-2">
          <button
            type="button"
            onClick={removeLink}
            className={`px-3 py-1 rounded ${buttonBase}`}
          >
            Remove
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

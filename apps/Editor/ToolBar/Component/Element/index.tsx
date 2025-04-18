import { JSX } from "react";
import usePragraph, { element } from "../../../../../store/useParagraph";
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListChecks,
  ListOrdered,
  Pilcrow,
  Quote,
} from "lucide-react";
import Selection from "../../../../../Components/UI/Selection";
import useEditor from "../../../../../store/useEditor";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  //   $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
const _element: Array<{ label: string; value: element; icon: JSX.Element }> = [
  { label: "Paragraph", value: "p", icon: <Pilcrow size={18} /> },
  { label: "Heading 1", value: "h1", icon: <Heading1 size={18} /> },
  { label: "Heading 2", value: "h2", icon: <Heading2 size={18} /> },
  { label: "Heading 3", value: "h3", icon: <Heading3 size={18} /> },
  { label: "Heading 4", value: "h4", icon: <Heading4 size={18} /> },
  { label: "Heading 5", value: "h5", icon: <Heading5 size={18} /> },
  { label: "Heading 6", value: "h6", icon: <Heading6 size={18} /> },
  { label: "Number List", value: "ol", icon: <ListOrdered size={18} /> },
  { label: "Bullet List", value: "ul", icon: <List size={18} /> },
  { label: "Quote", value: "q", icon: <Quote size={18} /> },
  { label: "Code Block", value: "code", icon: <Code size={18} /> },
  { label: "Check List", value: "check", icon: <ListChecks size={18} /> },
];
const headingTags: HeadingTagType[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

function Element({ isDarkMode }: { isDarkMode: boolean }) {
  const editor = useEditor((state) => state.editor);
  const el = usePragraph((state) => state.element);
  const setElement = usePragraph((state) => state.setElement);
  const activate_para = () => {
    if (!editor) {
      return;
    }
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
        setElement("p");
      }
    });
  };

  const activate_heading = (e: HeadingTagType) => {
    if (!editor) {
      return;
    }
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(e));
        setElement(e);
      }
    });
  };
  const activate_quote = () => {
    if (!editor) {
      return;
    }
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };
  const activate_list = (e: string) => {
    if (!editor) {
      return;
    }
    if (e === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else if (e === "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (e === "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    }
  };
  const handleChange = (value: string) => {
    if (!editor) {
      return;
    }
    if (headingTags.includes(value as HeadingTagType)) {
      activate_heading(value as HeadingTagType);
    }

    if (value === "p") {
      activate_para();
    }

    if (value === "ol" || value === "ul" || value === "check") {
      activate_list(value);
    }
    if (value === "q") {
      activate_quote();
    }
  };
  return (
    <div>
      <Selection
        options={_element}
        value={el}
        onChange={handleChange}
        isDarkMode={isDarkMode}
        placeholder="Choose a theme"
      />
    </div>
  );
}

export default Element;

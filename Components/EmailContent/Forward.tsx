import { useState, useRef, useEffect } from "react";
import Editor from "../../apps/Editor";
import Align from "../../apps/Editor/ToolBar/Component/Align";
import EmojiPickerButton from "../../apps/Editor/ToolBar/Component/Emoji";
import { Forward as ForwardIcon, XCircle, X } from "lucide-react";
import useEditor from "../../store/useEditor";
import { $getRoot, LexicalEditor } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import { reverseInlineTailwind } from "../../utils/inline";

interface Props {
  isDarkMode: boolean;
  _subject: string;
  closeModal: () => void;
  data: { data: string; type: "text/html" | "text/plain" };
}
const emails: string[] = [
  "alice@example.com",
  "bob@example.org",
  "charlie@example.net",
  "dave@domain.com",
  "eve@securemail.com",
  "frank@testmail.org",
  "grace@webmail.net",
  "heidi@company.com",
  "ivan@corporate.org",
  "judy@network.net",
  "karen@service.com",
  "leo@support.org",
  "mallory@info.net",
  "nancy@system.com",
  "oscar@admin.org",
  "peggy@office.net",
  "quinn@host.com",
  "ruth@api.org",
  "sybil@data.net",
  "trent@domain.org",
];
function Forward({ isDarkMode, _subject, closeModal, data }: Props) {
  const [subject, setSubject] = useState("Fwd: " + _subject);
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [emailError, setEmailError] = useState("");
  const [emaillist] = useState(emails);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLDivElement>(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const editor = useEditor((state) => state.editor);
  useEffect(() => {
    if (data.type === "text/plain") {
      data.data = `<p>${data.data}</p>`;
    }
    if (data.type === "text/html") {
      if (!editor) {
        return;
      }
      editor.update(() => {
        const nodes = convertHtmlToLexicalNodes(
          reverseInlineTailwind(data.data),
          editor
        );
        const root = $getRoot();
        root.clear(); // optional: clear current content
        nodes.forEach((node) => root.append(node));
      });
    }
  }, [data, editor]);
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateEmail = (email: string) => {
    return emailRegex.test(email.trim());
  };

  const filterSuggestions = (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = emaillist.filter(
      (email) =>
        email.toLowerCase().includes(input.toLowerCase()) &&
        !emailList.includes(email)
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  const addEmail = (emailToAdd?: string) => {
    const trimmedEmail = emailToAdd || emailInput.trim();

    if (!trimmedEmail) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (emailList.includes(trimmedEmail)) {
      setEmailError("Email already added");
      return;
    }

    setEmailList([...emailList, trimmedEmail]);
    setEmailInput("");
    setEmailError("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const removeEmail = (emailToRemove: string) => {
    setEmailList(emailList.filter((email) => email !== emailToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        selectedSuggestionIndex >= 0 &&
        suggestions[selectedSuggestionIndex]
      ) {
        addEmail(suggestions[selectedSuggestionIndex]);
      } else {
        addEmail();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailInput(value);
    if (emailError) {
      setEmailError("");
    }
    filterSuggestions(value);
  };

  return (
    <div>
      <div className="flex flex-col">
        {/* To Section */}
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            To
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 relative" ref={inputRef}>
              <input
                type="email"
                className={`flex-1 px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                } ${emailError ? "border-red-500" : ""}`}
                value={emailInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Enter email address..."
                autoComplete="off"
              />
              <button
                onClick={() => addEmail()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Add
              </button>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className={`absolute top-full left-0 right-0 z-10 mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 cursor-pointer transition-colors ${
                        selectedSuggestionIndex === index
                          ? isDarkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : isDarkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}
                      onClick={() => addEmail(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

            {/* Email List */}
            {emailList.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {emailList.map((email, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-200"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span>{email}</span>
                    <button
                      onClick={() => removeEmail(email)}
                      className={`hover:text-red-500 transition-colors ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subject Section */}
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Subject
          </label>
          <input
            type="text"
            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
            }`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject here..."
          />
        </div>

        {/* Message Section */}
        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Message
          </label>
          <div
            className={`h-96 border rounded-md p-2 mt-2 ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <Editor isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Align isDarkMode={isDarkMode} />
            <EmojiPickerButton />
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center justify-center gap-x-2 px-4 py-2 rounded-md shadow-sm transition-all ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
                  : "bg-blue-500 hover:bg-blue-600 text-white border border-blue-500"
              } ${
                emailList.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={emailList.length === 0}
            >
              <ForwardIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Forward</span>
            </button>
            <button
              className={`flex items-center justify-center gap-x-2 px-4 py-2 rounded-md shadow-sm transition-all ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  : "bg-white hover:bg-gray-50 text-black border border-gray-200"
              }`}
              onClick={closeModal}
            >
              <XCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forward;
function convertHtmlToLexicalNodes(html: string, editor: LexicalEditor) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, "text/html");
  const nodes = $generateNodesFromDOM(editor, dom);
  return nodes;
}

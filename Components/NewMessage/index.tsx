import type React from "react";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import Editor from "../../apps/Editor";
import ToolBar from "../../apps/Editor/ToolBar";
import useFileStore from "../../store/useFileStore";
import useMail, { EmailChip } from "../../store/useMail";
import useEditor from "../../store/useEditor";
import { reverseInlineTailwind } from "../../utils/inline";
import { $getRoot } from "lexical";
import convertHtmlToLexicalNodes from "../../utils/convertHtmlToLexicalNodes";

interface EmailFieldProps {
  label: string;
  emailChips: EmailChip[];
  emailInput: string;
  isEmailValid: boolean;
  isDarkMode: boolean;
  onEmailInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveEmailChip: (id: string) => void;
}

function EmailField({
  label,
  emailChips,
  emailInput,
  isEmailValid,
  isDarkMode,
  onEmailInputChange,
  onEmailInputKeyDown,
  onRemoveEmailChip,
}: EmailFieldProps) {
  return (
    <div
      className={`border-b ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      } mb-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 min-h-[40px] flex-1">
          {emailChips.map((chip) => (
            <div
              key={chip.id}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                isDarkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <span>{chip.email}</span>
              <button
                onClick={() => onRemoveEmailChip(chip.id)}
                className="hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <input
            type="text"
            placeholder={label}
            value={emailInput}
            onChange={onEmailInputChange}
            onKeyDown={onEmailInputKeyDown}
            className={`flex-1 px-0 py-2 border-none focus:outline-none bg-transparent ${
              isDarkMode
                ? "text-white placeholder-gray-50"
                : "text-black placeholder-gray-900"
            } ${!isEmailValid ? "text-red-500" : ""}`}
          />
        </div>
      </div>

      {!isEmailValid && (
        <p className="text-red-500 text-sm mb-2">
          Please enter a valid email address
        </p>
      )}
    </div>
  );
}

function NewMessage({ isDarkMode }: { isDarkMode: boolean }) {
  const {
    setSubject,
    subject,
    body,
    to: toEmailChips,
    addTo: setToEmailChips,
    removeTo: removeToEmailChip,
  } = useMail();

  // To field state
  const [toEmailInput, setToEmailInput] = useState("");
  const [isToEmailValid, setIsToEmailValid] = useState(true);

  const { clearSelectedFiles } = useFileStore();
  const editor = useEditor((state) => state.editor);

  const clearSF = useCallback(() => clearSelectedFiles(), [clearSelectedFiles]);

  useEffect(() => {
    clearSF();
  }, [clearSF]);

  // Initialize editor with draft content when body is available
  useEffect(() => {
    if (body && editor) {
      editor.update(() => {
        const nodes = convertHtmlToLexicalNodes(
          reverseInlineTailwind(body),
          editor
        );
        const root = $getRoot();
        root.clear(); // Clear existing content first
        nodes.forEach((node) => {
          root.append(node);
        });
      });
    }
  }, [body, editor]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Generic handlers for email fields
  const createEmailHandlers = (
    setEmailInput: (value: string) => void,
    addEmailChip: (email: EmailChip) => void,
    removeEmailChip: (id: string) => void,
    setIsEmailValid: (valid: boolean) => void,
    emailInput: string,
    emailChips: EmailChip[]
  ) => {
    const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmailInput(value);
      setIsEmailValid(true);
    };

    const handleEmailInputKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "," || e.key === "Enter") {
        e.preventDefault();
        const email = emailInput.trim();
        if (email && validateEmail(email)) {
          addEmailChip({ email, id: crypto.randomUUID() });
          setEmailInput("");
          setIsEmailValid(true);
        } else if (email) {
          setIsEmailValid(false);
        }
      } else if (
        e.key === "Backspace" &&
        !emailInput &&
        emailChips.length > 0
      ) {
        const lastChip = emailChips[emailChips.length - 1];
        removeEmailChip(lastChip.id);
      }
    };

    const handleRemoveEmailChip = (id: string) => {
      removeEmailChip(id);
    };

    return {
      handleEmailInputChange,
      handleEmailInputKeyDown,
      removeEmailChip: handleRemoveEmailChip,
    };
  };

  // To field handlers
  const toHandlers = createEmailHandlers(
    setToEmailInput,
    setToEmailChips,
    removeToEmailChip,
    setIsToEmailValid,
    toEmailInput,
    toEmailChips
  );

  return (
    <div className="h-full flex flex-col">
      <h2
        className={`text-xl md:text-2xl font-semibold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        New Message
      </h2>

      <div className="flex-1 flex flex-col">
        {/* To field */}
        <EmailField
          label="To"
          emailChips={toEmailChips}
          emailInput={toEmailInput}
          isEmailValid={isToEmailValid}
          isDarkMode={isDarkMode}
          onEmailInputChange={toHandlers.handleEmailInputChange}
          onEmailInputKeyDown={toHandlers.handleEmailInputKeyDown}
          onRemoveEmailChip={toHandlers.removeEmailChip}
        />

        {/* Subject field */}
        <div
          className={`border-b ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          } mb-4`}
        >
          <input
            type="text"
            placeholder="Subject"
            className={`w-full px-0 py-2 bg-transparent border-none focus:outline-none ${
              isDarkMode
                ? "text-white placeholder-gray-50"
                : "text-gray-900 placeholder-gray-900"
            }`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Editor isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Toolbar */}
      <div
        className={`mt-4 pt-4 border-t ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <ToolBar isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

export default NewMessage;

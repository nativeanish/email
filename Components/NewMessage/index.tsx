import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { X } from "lucide-react"
import Editor from "../../apps/Editor"
import ToolBar from "../../apps/Editor/ToolBar"
import useFileStore from "../../store/useFileStore"

interface EmailChip {
  email: string
  id: string
}

interface EmailFieldProps {
  label: string
  emailChips: EmailChip[]
  emailInput: string
  isEmailValid: boolean
  isDarkMode: boolean
  onEmailInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onRemoveEmailChip: (id: string) => void
  showButtons?: boolean
  onToggleCC?: () => void
  onToggleBCC?: () => void
  showCCButton?: boolean
  showBCCButton?: boolean
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
  showButtons = false,
  onToggleCC,
  onToggleBCC,
  showCCButton = false,
  showBCCButton = false,
}: EmailFieldProps) {
  return (
    <div className={`border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"} mb-4`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 min-h-[40px] flex-1">
          {emailChips.map((chip) => (
            <div
              key={chip.id}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <span>{chip.email}</span>
              <button onClick={() => onRemoveEmailChip(chip.id)} className="hover:text-red-500">
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
              isDarkMode ? "text-white placeholder-gray-50" : "text-black placeholder-gray-900"
            } ${!isEmailValid ? "text-red-500" : ""}`}
          />
        </div>

        {showButtons && (
          <div className="flex gap-2 ml-4">
            {showCCButton && (
              <button
                onClick={onToggleCC}
                className={`px-2 py-1 text-sm rounded ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                CC
              </button>
            )}
            {showBCCButton && (
              <button
                onClick={onToggleBCC}
                className={`px-2 py-1 text-sm rounded ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                BCC
              </button>
            )}
          </div>
        )}
      </div>

      {!isEmailValid && <p className="text-red-500 text-sm mb-2">Please enter a valid email address</p>}
    </div>
  )
}

function NewMessage({ isDarkMode }: { isDarkMode: boolean }) {
  // To field state
  const [toEmailInput, setToEmailInput] = useState("")
  const [toEmailChips, setToEmailChips] = useState<EmailChip[]>([])
  const [isToEmailValid, setIsToEmailValid] = useState(true)

  // CC field state
  const [showCC, setShowCC] = useState(false)
  const [ccEmailInput, setCcEmailInput] = useState("")
  const [ccEmailChips, setCcEmailChips] = useState<EmailChip[]>([])
  const [isCcEmailValid, setIsCcEmailValid] = useState(true)

  // BCC field state
  const [showBCC, setShowBCC] = useState(false)
  const [bccEmailInput, setBccEmailInput] = useState("")
  const [bccEmailChips, setBccEmailChips] = useState<EmailChip[]>([])
  const [isBccEmailValid, setIsBccEmailValid] = useState(true)

  const { clearSelectedFiles } = useFileStore()

  const clearSF = useCallback(() => clearSelectedFiles(), [clearSelectedFiles])

  useEffect(() => {
    clearSF()
  }, [clearSF])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Generic handlers for email fields
  const createEmailHandlers = (
    setEmailInput: (value: string) => void,
    setEmailChips: React.Dispatch<React.SetStateAction<EmailChip[]>>,
    setIsEmailValid: (valid: boolean) => void,
    emailInput: string,
    emailChips: EmailChip[],
  ) => {
    const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setEmailInput(value)
      setIsEmailValid(true)
    }

    const handleEmailInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "," || e.key === "Enter") {
        e.preventDefault()
        const email = emailInput.trim()
        if (email && validateEmail(email)) {
          setEmailChips((prev) => [...prev, { email, id: crypto.randomUUID() }])
          setEmailInput("")
          setIsEmailValid(true)
        } else if (email) {
          setIsEmailValid(false)
        }
      } else if (e.key === "Backspace" && !emailInput && emailChips.length > 0) {
        setEmailChips((prev) => prev.slice(0, -1))
      }
    }

    const removeEmailChip = (id: string) => {
      setEmailChips((prev) => prev.filter((chip) => chip.id !== id))
    }

    return { handleEmailInputChange, handleEmailInputKeyDown, removeEmailChip }
  }

  // To field handlers
  const toHandlers = createEmailHandlers(
    setToEmailInput,
    setToEmailChips,
    setIsToEmailValid,
    toEmailInput,
    toEmailChips,
  )

  // CC field handlers
  const ccHandlers = createEmailHandlers(
    setCcEmailInput,
    setCcEmailChips,
    setIsCcEmailValid,
    ccEmailInput,
    ccEmailChips,
  )

  // BCC field handlers
  const bccHandlers = createEmailHandlers(
    setBccEmailInput,
    setBccEmailChips,
    setIsBccEmailValid,
    bccEmailInput,
    bccEmailChips,
  )

  const toggleCC = () => {
    setShowCC(!showCC)
    if (showCC) {
      setCcEmailInput("")
      setCcEmailChips([])
      setIsCcEmailValid(true)
    }
  }

  const toggleBCC = () => {
    setShowBCC(!showBCC)
    if (showBCC) {
      setBccEmailInput("")
      setBccEmailChips([])
      setIsBccEmailValid(true)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className={`text-xl md:text-2xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
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
          showButtons={true}
          onToggleCC={toggleCC}
          onToggleBCC={toggleBCC}
          showCCButton={!showCC}
          showBCCButton={!showBCC}
        />

        {/* CC field */}
        {showCC && (
          <EmailField
            label="CC"
            emailChips={ccEmailChips}
            emailInput={ccEmailInput}
            isEmailValid={isCcEmailValid}
            isDarkMode={isDarkMode}
            onEmailInputChange={ccHandlers.handleEmailInputChange}
            onEmailInputKeyDown={ccHandlers.handleEmailInputKeyDown}
            onRemoveEmailChip={ccHandlers.removeEmailChip}
            showButtons={true}
            onToggleBCC={toggleBCC}
            showBCCButton={!showBCC}
          />
        )}

        {/* BCC field */}
        {showBCC && (
          <EmailField
            label="BCC"
            emailChips={bccEmailChips}
            emailInput={bccEmailInput}
            isEmailValid={isBccEmailValid}
            isDarkMode={isDarkMode}
            onEmailInputChange={bccHandlers.handleEmailInputChange}
            onEmailInputKeyDown={bccHandlers.handleEmailInputKeyDown}
            onRemoveEmailChip={bccHandlers.removeEmailChip}
          />
        )}

        {/* Subject field */}
        <div className={`border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"} mb-4`}>
          <input
            type="text"
            placeholder="Subject"
            className={`w-full px-0 py-2 bg-transparent border-none focus:outline-none ${
              isDarkMode ? "text-white placeholder-gray-50" : "text-gray-900 placeholder-gray-900"
            }`}
          />
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Editor isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Toolbar */}
      <div className={`mt-4 pt-4 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
        <ToolBar isDarkMode={isDarkMode} />
      </div>
    </div>
  )
}

export default NewMessage

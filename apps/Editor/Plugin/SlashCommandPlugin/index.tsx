import { JSX, useCallback, useEffect, useRef, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_NORMAL,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextNode,
} from "lexical"
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text"
import { $createParagraphNode } from "lexical"
import { $setBlocksType } from "@lexical/selection"
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
} from "lucide-react"
import usePragraph from "../../../../store/useParagraph"
import useTheme from "../../../../store/useTheme"

interface CommandOption {
  title: string
  description: string
  icon: JSX.Element
  action: () => void
}

export default function SlashCommandPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [slashCommandText, setSlashCommandText] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const setElement = usePragraph((state) => state.setElement)

  // Reset state when selection changes
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        setSlashCommandText(null)
        setPosition(null)
        return false
      },
      COMMAND_PRIORITY_NORMAL,
    )
  }, [editor])

  // Close menu on escape
  useEffect(() => {
    return editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      () => {
        if (slashCommandText !== null) {
          setSlashCommandText(null)
          setPosition(null)
          return true
        }
        return false
      },
      COMMAND_PRIORITY_NORMAL,
    )
  }, [editor, slashCommandText])

  // Handle text changes to detect slash commands
  useEffect(() => {
    const removeTextTransform = editor.registerNodeTransform(TextNode, (textNode) => {
      const textContent = textNode.getTextContent()
      const selection = $getSelection()

      if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        return
      }

      // Check if the text starts with a slash
      if (textContent === "/" && textNode.isSimpleText()) {
        const domSelection = window.getSelection()
        if (domSelection && domSelection.rangeCount > 0) {
          const range = domSelection.getRangeAt(0)
          const rect = range.getBoundingClientRect()

          // Position the menu below the cursor
          setPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          })
          setSlashCommandText("")
        }
      } else if (slashCommandText !== null) {
        // If we're already tracking a slash command, update the filter text
        const match = textContent.match(/^\/([^/\s]*)$/)
        if (match) {
          setSlashCommandText(match[1])
        } else {
          // If the text no longer matches a slash command pattern, reset
          setSlashCommandText(null)
          setPosition(null)
        }
      }
    })

    return removeTextTransform
  }, [editor, slashCommandText])

  // Handle keyboard navigation in the menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (slashCommandText === null) return

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, commandOptions.length - 1))
          break
        case "ArrowUp":
          event.preventDefault()
          setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0))
          break
        case "Enter":
          event.preventDefault()
          if (filteredOptions.length > 0) {
            executeCommand(filteredOptions[selectedIndex])
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slashCommandText, selectedIndex])

  // Scroll selected item into view
  useEffect(() => {
    if (menuRef.current) {
      const selectedElement = menuRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [selectedIndex])

  const executeCommand = useCallback(
    (option: CommandOption) => {
      editor.update(() => {
        // First, delete the slash command text
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor
          const textContent = anchor.getNode().getTextContent()
          const slashIndex = textContent.lastIndexOf("/")

          if (slashIndex !== -1) {
            selection.setTextNodeRange(
              anchor.getNode() as TextNode,
              slashIndex,
              anchor.getNode() as TextNode,
              anchor.offset,
            )
            selection.deleteCharacter(false)
          }
        }

        // Then execute the selected command
        option.action()
      })

      // Reset state
      setSlashCommandText(null)
      setPosition(null)
    },
    [editor],
  )

  // Define available commands
  const commandOptions: CommandOption[] = [
    {
      title: "Paragraph",
      description: "Normal text",
      icon: <Pilcrow size={18} />,
      action: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode())
            setElement("p")
          }
        })
      },
    },
    {
      title: "Heading 1",
      description: "Large heading",
      icon: <Heading1 size={18} />,
      action: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h1"))
            setElement("h1")
          }
        })
      },
    },
    {
      title: "Heading 2",
      description: "Medium heading",
      icon: <Heading2 size={18} />,
      action: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h2"))
            setElement("h2")
          }
        })
      },
    },
    {
      title: "Heading 3",
      description: "Small heading",
      icon: <Heading3 size={18} />,
      action: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h3"))
            setElement("h3")
          }
        })
      },
    },
    {
      title: "Heading 4",
      description: "Smaller heading",
      icon: <Heading4 size={18} />,
      action: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h4"))
            setElement("h4")
          }
        })
      },
    },
    {
      title: "Heading 5",
      description: "Tiny heading",
      icon: <Heading5 size={18} />,
      action: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h5"))
            setElement("h5")
          }
        })
      },
    },
    {
      title: "Heading 6",
      description: "Smallest heading",
      icon: <Heading6 size={18} />,
      action: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode("h6"))
            setElement("h6")
          }
        })
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list",
      icon: <List size={18} />,
      action: () => {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        setElement("ul")
      },
    },
    {
      title: "Numbered List",
      description: "Create a numbered list",
      icon: <ListOrdered size={18} />,
      action: () => {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        setElement("ol")
      },
    },
    {
      title: "Quote",
      description: "Insert a quote block",
      icon: <Quote size={18} />,
      action: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode())
            setElement("q")
          }
        })
      },
    },
  ]

  // Filter options based on slash command text
  const filteredOptions =
    slashCommandText !== null
      ? commandOptions.filter(
        (option) =>
          option.title.toLowerCase().includes(slashCommandText.toLowerCase()) ||
          option.description.toLowerCase().includes(slashCommandText.toLowerCase()),
      )
      : commandOptions

  if (slashCommandText === null || position === null) {
    return <></>
  }

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 rounded-lg shadow-lg border overflow-hidden overflow-y-auto max-h-[300px] w-[300px] ${isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className={`p-2 text-sm ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <span className="font-medium">Basic blocks</span>
      </div>
      <div>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            <div
              key={option.title}
              data-index={index}
              className={`flex items-center gap-3 p-3 cursor-pointer ${index === selectedIndex ? (isDarkMode ? "bg-gray-800" : "bg-gray-100") : ""
                } hover:${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
              onClick={() => executeCommand(option)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded ${isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
              >
                {option.icon}
              </div>
              <div>
                <div className="font-medium">{option.title}</div>
                <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{option.description}</div>
              </div>
            </div>
          ))
        ) : (
          <div className={`p-3 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            No matching commands found
          </div>
        )}
      </div>
    </div>
  )
}


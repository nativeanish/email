import { useEffect, useState } from "react";
import useLoginUser from "../../store/useLoginUser";
import useTheme from "../../store/useTheme";
import { Draft } from "../../types/user";
import DraftItem from "../EmailDetails/Draft";

interface DraftListProps {
  isEmailListVisible: boolean;
}

export function DraftList({ isEmailListVisible }: DraftListProps) {
  const theme = useTheme((state) => state.theme);
  const user = useLoginUser((state) => state.user);
  const isDarkMode = theme === "dark";
  const [sortedDrafts, setSortedDrafts] = useState<Array<Draft>>([]);

  useEffect(() => {
    const drafts = user?.draft || [];
    // Sort drafts by date, newest first
    const sorted = [...drafts].sort((a, b) => b.date - a.date);
    setSortedDrafts(sorted);
  }, [user?.draft]);

  return (
    <div
      className={`${
        isEmailListVisible ? "block" : "hidden"
      } md:block w-full md:w-1/4 border-r ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      } overflow-y-auto`}
    >
      <div
        className={`flex items-center gap-4 p-4 border-b overflow-y-auto ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              isDarkMode
                ? "text-white bg-gray-900"
                : "text-gray-900 bg-gray-200"
            }`}
          >
            Drafts ({sortedDrafts.length})
          </button>
        </div>
      </div>

      <div
        className={`divide-y ${
          isDarkMode ? "divide-gray-800" : "divide-gray-200"
        }`}
      >
        {sortedDrafts.length === 0 ? (
          <div className="p-8 text-center">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No drafts yet. Create a new message to save as draft.
            </p>
          </div>
        ) : (
          sortedDrafts.map((draft) => (
            <DraftItem key={draft.id} draft={draft} />
          ))
        )}
      </div>
    </div>
  );
}

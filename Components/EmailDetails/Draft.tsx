import { useNavigate, useParams } from "react-router-dom";
import { useDraftDetails } from "../../hooks/useDraftDetails";
import useTheme from "../../store/useTheme";
import { Draft } from "../../types/user";
import { formatEmailDate } from "../../utils/dateUtils";
import { EmailErrorComponent } from "../UI/EmailErrorComponent";
import { FileText, Users } from "lucide-react";

function DraftItem({ draft }: { draft: Draft }) {
  const { draftData, loading, hasError, isEmpty, retry, error } =
    useDraftDetails(draft);
  const isDarkMode = useTheme((state) => state.theme) === "dark";
  const { slug } = useParams();
  const navigate = useNavigate();
  const { id } = useParams();

  if (loading) {
    return (
      <div
        className={`w-full p-4 text-center ${
          isDarkMode
            ? "text-gray-300 border-b border-gray-300"
            : "text-gray-600 border-b border-gray-200"
        }`}
      >
        <div className="animate-pulse">Loading draft...</div>
      </div>
    );
  }

  if (hasError || isEmpty) {
    return (
      <EmailErrorComponent
        onRetry={retry}
        timestamp={draft.date}
        error={error}
        errorMessage="Failed to load draft"
      />
    );
  }

  if (!draftData) {
    return null;
  }

  const handleClick = () => {
    // Navigate to draft editor or preview
    navigate(`/dashboard/${slug}/${draft.id}`);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full p-4 text-left ${
          id === draft.id
            ? isDarkMode
              ? "bg-gray-800 border-b border-gray-800"
              : "bg-gray-200 border-b border-gray-200"
            : ""
        } ${isDarkMode ? "hover:bg-gray-900" : "hover:bg-gray-50"}`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <FileText className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p
                  className={`font-medium truncate ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {draftData.content.subject || "No Subject"}
                </p>
                {draftData.content.to.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="h-3 w-3" />
                    <span>
                      {draftData.content.to.length +
                        (draftData.content.cc?.length ?? 0) +
                        (draftData.content.bcc?.length ?? 0)}
                    </span>
                  </div>
                )}
              </div>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {formatEmailDate(draftData.date)}
              </p>
            </div>
            <div className="mt-1">
              {draftData.content.to.length > 0 && (
                <p className="text-xs text-gray-500 mb-1">
                  {[
                    ...(draftData.content.to ?? []),
                    ...(draftData.content.cc ?? []),
                    ...(draftData.content.bcc ?? []),
                  ]
                    .map((item) => item.email)
                    .join(", ")}
                </p>
              )}
              <p
                className={`text-sm font-medium truncate ${
                  isDarkMode ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {draftData.content.content
                  ? draftData.content.content
                      .replace(/<[^>]*>/g, "")
                      .substring(0, 100) + "..."
                  : "No content"}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default DraftItem;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLoginUser from "../../store/useLoginUser";
import { Draft } from "../../types/user";
import { useDraftDetails } from "../../hooks/useDraftDetails";
import { EmailErrorComponent } from "../UI/EmailErrorComponent";
import { formatEmailDate } from "../../utils/dateUtils";
import { FileText, Users, Edit, XCircle, Ban } from "lucide-react";
import DOMPurify from "dompurify";
import useLoading from "../../store/useLoading";
import register from "../../utils/aos/core/register";
import { ReturnResult } from "../NotificationDrawer";
import { showDanger, showSuccess } from "../UI/Toast/Toast-Context";
import useMail, { EmailChip } from "../../store/useMail";
import useEditor from "../../store/useEditor";
import useMessage from "../../store/useMessage";

interface DraftContentProps {
  isDarkMode: boolean;
}

// Type for handling both string and object recipients
type RecipientType = string | { email: string; id: string };

export function DraftContent({ isDarkMode }: DraftContentProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useLoginUser((state) => state.user);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const { draftData, loading, hasError, isEmpty, retry, error } =
    useDraftDetails(selectedDraft);
  const loadings = useLoading();
  const mail = useMail();
  const editor = useEditor((state) => state.editor);
  useEffect(() => {
    if (id && user?.draft) {
      const draft = user.draft.find((d) => d.id === id);
      setSelectedDraft(draft || null);
    } else {
      setSelectedDraft(null);
    }
  }, [id, user?.draft]);
  const { setShow } = useMessage();
  useEffect(() => {
    console.log("Selected draft:", selectedDraft);
    console.log("Draft data:", draftData);
  }, [selectedDraft, draftData]);

  if (!id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">Select a draft to view</p>
      </div>
    );
  }

  if (!selectedDraft) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">Draft not found</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">Loading draft...</div>
      </div>
    );
  }

  if (hasError || isEmpty) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmailErrorComponent
          onRetry={retry}
          timestamp={selectedDraft.date}
          error={error}
          errorMessage="Failed to load draft"
        />
      </div>
    );
  }

  if (!draftData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">Draft data not available</p>
      </div>
    );
  }
  const handleEdit = () => {
    if (!editor) {
      showDanger("Editor is not initialized");
      console.error("Editor is not initialized");
      return;
    }
    mail.clearFields();
    const recipientEmails = draftData.content.to.map(
      (recipient: RecipientType) =>
        typeof recipient === "string"
          ? recipient
          : { email: recipient.email, id: recipient.id }
    ) as EmailChip[];
    recipientEmails.map((email) =>
      mail.addTo({ email: email.email, id: email.id })
    );
    mail.setSubject(draftData.content.subject || "");

    // Store the draft content in the mail store body field
    // This will persist across navigation and component remounts
    mail.setBody(draftData.content.content || "");

    navigate("/dashboard/draft");
    setShow(true);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting draft with ID:", id);
      loadings.setTitle("Deleting draft...");
      loadings.setDescription("Please wait while we delete the draft.");
      loadings.open();
      const msg = JSON.parse(
        (
          await register([
            { name: "Action", value: "Evaluate" },
            { name: "deleteDraft", value: id },
          ])
        ).Messages[0].Data
      ) as ReturnResult;
      console.log(msg);
      if (
        msg.status === 1 &&
        msg.data.msg === "Draft deleted successfully" &&
        user?.privateKey
      ) {
        msg.data.user.privateKey = user.privateKey;
        useLoginUser.setState({ user: msg.data.user });
        loadings.close();
        navigate("/dashboard/draft");
        showSuccess("Draft deleted successfully");
      } else {
        loadings.close();
        console.error("Failed to delete draft:", msg.data.msg);
        showDanger("Failed to delete draft");
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
      loadings.close();
      showDanger("An error occurred while deleting the draft");
    }
  };

  const handleClose = () => {
    navigate("/dashboard/draft");
  };

  return (
    <div
      className={`h-full flex flex-col ${
        isDarkMode ? "bg-[#141414]" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div
          className={`flex items-center justify-between border-b pb-2 ${
            isDarkMode
              ? "border-gray-800 text-gray-50"
              : "border-gray-200 text-gray-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <FileText className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {draftData.content.subject || "No Subject"}
              </h3>
              <p className="text-sm text-gray-500">
                Draft saved on {formatEmailDate(draftData.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="group flex items-center gap-2 p-2 hover:bg-red-800 rounded-lg transition-all duration-500 overflow-hidden"
              title="Delete Permanently"
              onClick={() => handleDelete(selectedDraft.id)}
            >
              <Ban className="h-5 w-5 flex-shrink-0" />
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-500 text-sm font-medium">
                Delete Permanently
              </span>
            </button>
          </div>
        </div>

        {/* Recipients */}
        {draftData.content.to.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                Recipients ({draftData.content.to.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {draftData.content.to.length > 0 &&
                draftData.content.to.map((recipient, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs rounded-full ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {typeof recipient === "string"
                      ? recipient
                      : (recipient as RecipientType & { email: string }).email}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`flex-1 overflow-y-auto p-6 border rounded-lg min-h-0 ${
          isDarkMode
            ? "border-gray-700 text-gray-100"
            : "border-gray-300 text-gray-800"
        }`}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            draftData.content.content || "<p>No content</p>"
          ),
        }}
      />

      {/* Footer */}
      <div className="flex-shrink-0 pt-4">
        <div className="flex justify-between">
          <button
            className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-500"
            onClick={handleClose}
          >
            <XCircle className="h-5 w-5" />
            Close
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            onClick={handleEdit}
          >
            <Edit className="h-5 w-5" />
            Edit Draft
          </button>
        </div>
      </div>
    </div>
  );
}

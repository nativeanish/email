import { useParams } from "react-router-dom";
import NewMessage from "../NewMessage";
import EC from "./EC";
import { useEffect, useState } from "react";
import useMailStorage, { mail } from "../../store/useMailStorage";
import { DraftContent } from "../DraftContent";

interface EmailContentProps {
  isDarkMode: boolean;
  isEmailListVisible: boolean;
  handleBackToList: () => void;
  isNewMessageOpen: boolean;
}

export function EmailContent({
  isDarkMode,
  isEmailListVisible,
  isNewMessageOpen,
}: EmailContentProps) {
  const { slug, id } = useParams();
  const mailStorage = useMailStorage();
  const [selectedEmail, setSelectedEmail] = useState<
    | {
        mail: mail;
        user: {
          username: string;
          address: string;
          image: string;
          name: string;
        };
      }
    | null
    | false
  >(null);

  useEffect(() => {
    if (id && slug) {
      // Handle draft section
      if (slug === "draft") {
        setSelectedEmail(null);
        return;
      }

      const mail = mailStorage.getMail(id);
      if (mail && mail.id === id) {
        const user = mailStorage.getUserFrom(mail.from);
        if (user && user.address === mail.from) {
          console.log(slug, mail.tags);
          if ((slug === "inbox" || slug === "sent") && mail.tags.length === 1) {
            setSelectedEmail({ mail, user });
            return;
          } else if (
            (slug === "trash" || slug === "archive" || slug === "spam") &&
            mail.tags.length === 2
          ) {
            console.log(mail, user);
            setSelectedEmail({ mail, user });
            return;
          } else {
            setSelectedEmail(false);
            return;
          }
        }
      }
      setSelectedEmail(false);
      return;
    }
  }, [id, slug, mailStorage]);

  useEffect(() => {
    if (!slug && id) {
      setSelectedEmail(null);
    }
  }, [slug, id]);

  return (
    <div
      className={`${!isEmailListVisible ? "block" : "hidden"} md:block flex-1 ${
        isDarkMode ? "bg-[#141414]" : "bg-gray-50"
      }`}
    >
      <div className="h-full p-4 md:p-6">
        {!isNewMessageOpen && slug === "draft" && (
          <DraftContent isDarkMode={isDarkMode} />
        )}
        {selectedEmail === null && isNewMessageOpen === false && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Select an Email to Read</p>
          </div>
        )}
        {selectedEmail === false && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">
              Email not found or does not exist.
            </p>
          </div>
        )}
        {isNewMessageOpen && <NewMessage isDarkMode={isDarkMode} />}
        {selectedEmail &&
          selectedEmail !== null &&
          selectedEmail.mail &&
          selectedEmail.user &&
          isNewMessageOpen === false && (
            <EC
              setShowEmailContent={setSelectedEmail}
              isDarkMode={isDarkMode}
              mail={selectedEmail.mail}
              User={selectedEmail.user}
            />
          )}
      </div>
    </div>
  );
}

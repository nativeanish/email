import { useEffect, useState } from "react";
import useLoginUser from "../../store/useLoginUser";
import useTheme from "../../store/useTheme";
import { Box } from "../../types/user";
import { useParams } from "react-router-dom";
import From from "../EmailDetails/From";
import To from "../EmailDetails/To";

interface EmailListProps {
  isEmailListVisible: boolean;
}

export function EmailList({ isEmailListVisible }: EmailListProps) {
  const theme = useTheme((state) => state.theme);
  const emails = useLoginUser((state) => state.user)?.mailBox;
  const isDarkMode = theme === "dark";
  const section = useParams().slug;
  const [box, setBox] = useState<Array<Box>>([]);
  useEffect(() => {
    console.log("Section:", section);
    if (section === "inbox") {
      setBox(
        (emails ?? []).filter((email: Box) => {
          return email.tags.length === 1 && email.tags[0] === "inbox";
        })
      );
    } else if (section === "sent") {
      setBox(
        (emails ?? []).filter((email: Box) => {
          return email.tags.length === 1 && email.tags[0] === "sent";
        })
      );
    } else if (section === "archive") {
      setBox(
        (emails ?? []).filter((email: Box) => {
          return email.tags.length === 2 && email.tags[1] === "archive";
        })
      );
    } else if (section === "spam") {
      setBox(
        (emails ?? []).filter((email: Box) => {
          return email.tags.length === 2 && email.tags[1] === "spam";
        })
      );
    } else if (section === "trash") {
      setBox(
        (emails ?? []).filter((email: Box) => {
          return email.tags.length === 2 && email.tags[1] === "trash";
        })
      );
    } else {
      setBox([]);
    }
  }, [section, emails]);
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
        <button
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            isDarkMode ? "text-white bg-gray-900" : "text-gray-900 bg-gray-200"
          }`}
        >
          Today
        </button>
      </div>

      <div
        className={`divide-y ${
          isDarkMode ? "divide-gray-800" : "divide-gray-200"
        }`}
      >
        {box &&
          box.length > 0 &&
          (section === "inbox" ||
            section === "archive" ||
            section === "trash" ||
            section === "spam") &&
          box.map((email: Box) => <From key={email.id} box={email} />)}
        {box &&
          box.length > 0 &&
          section === "sent" &&
          box.map((email: Box) => <To key={email.id} box={email} />)}
      </div>
    </div>
  );
}

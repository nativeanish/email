import { motion } from "framer-motion";
import { PaperclipIcon } from "lucide-react";
import useFileStore from "../../../../../store/useFileStore";
function Attachment({ isDarkMode, open }: { isDarkMode: boolean, open: (arg: boolean) => void }) {
  const { getSelectedFiles } = useFileStore()
  const attchFile = getSelectedFiles()
  return <>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center px-3 py-2 rounded-md shadow-sm transition-all ${isDarkMode
        ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
        : "bg-white hover:bg-gray-50 text-black border border-gray-200"
        }`}
      aria-label="Add Attachment"
      onClick={() => open(true)}
    >
      <PaperclipIcon className="w-5 h-5" />
      {attchFile && attchFile.length > 0 && <span className="ml-2 text-sm font-medium -mr-1">{attchFile.length}</span>}
      <span className="ml-2 text-sm font-medium">Attachment</span>
    </motion.button>
  </>
}
export default Attachment;

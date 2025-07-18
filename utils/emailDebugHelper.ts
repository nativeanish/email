import {
  debugEmailLoading,
  debugStorageState,
  debugAuthState,
} from "./debugUtils";
import { Box } from "../types/user";

export const debugEmailLoadingIssues = () => {
  console.group("🐛 EMAIL LOADING DEBUG SESSION");
  console.log("🕐 Debug session started at:", new Date().toISOString());

  debugAuthState();
  debugStorageState();

  console.log("💡 Debugging Tips:");
  console.log("1. Check if user is logged in and has a private key");
  console.log("2. Verify email format matches 'user@perma.email'");
  console.log("3. Ensure encryption data (data, iv, key) are present");
  console.log("4. Check browser console for detailed error messages");
  console.log("5. Try clicking 'Try Again' on failed emails");

  console.groupEnd();
};

export const debugSpecificEmail = (box: Box, context: string) => {
  debugEmailLoading(box, context);
};

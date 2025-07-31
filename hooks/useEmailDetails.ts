import { useEffect, useState, useMemo, useCallback } from "react";
import { Box } from "../types/user";
import {
  fetchstore,
  forceRefreshEmail,
  clearFetchCache,
} from "../utils/mail/fetchstore";
import { showDanger } from "../Components/UI/Toast/Toast-Context";

export interface EmailDetailsData {
  body: string;
  subject: string;
  id: string;
  image: string;
  name: string;
  from: string;
  seen: boolean;
  date: number;
  to: Array<string>;
  cc: Array<string>;
  bcc: Array<string>;
}

export function useEmailDetails(box: Box | null) {
  const [user, setUser] = useState<EmailDetailsData | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchEmailDetails = async (boxData: Box, forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        `Fetching email details for ${boxData.id}, force refresh: ${forceRefresh}`
      );

      let data;
      if (forceRefresh) {
        // Clear caches and force fresh fetch
        clearFetchCache();
        data = await forceRefreshEmail(boxData);
      } else {
        data = await fetchstore(boxData);
      }

      console.log("Fetched email details: and is here data ", data);
      if (data) {
        setUser(data);
        setRetryCount(0); // Reset retry count on success
      } else {
        console.warn("fetchstore returned null for email:", boxData.id);
        setError("Email data could not be loaded");
        setUser(undefined);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Failed to fetch email details for:", boxData.id, error);

      // Don't show toast for authentication errors as they're expected
      if (!errorMessage.includes("Authentication required")) {
        showDanger("Failed to load email: " + errorMessage);
      }

      setError(errorMessage);
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  };

  const retry = useCallback(() => {
    if (box) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      // After 2 failed attempts, force refresh
      const shouldForceRefresh = newRetryCount >= 2;
      console.log(
        `Retry attempt ${newRetryCount}, force refresh: ${shouldForceRefresh}`
      );

      fetchEmailDetails(box, shouldForceRefresh);
    }
  }, [box, retryCount]);

  const forceRetry = useCallback(() => {
    if (box) {
      console.log("Force retry requested");
      setRetryCount(0);
      fetchEmailDetails(box, true);
    }
  }, [box]);

  useEffect(() => {
    if (!box) {
      setUser(null);
      return;
    }

    fetchEmailDetails(box);
  }, [box]);

  // Memoize the return value to prevent unnecessary re-renders
  const result = useMemo(
    () => ({
      user,
      loading,
      error,
      retry,
      forceRetry,
      retryCount,
      isLoading: loading,
      hasError: !!error,
      isEmpty: user === undefined,
      hasData: !!user,
    }),
    [user, loading, error, retry, forceRetry, retryCount]
  );

  return result;
}

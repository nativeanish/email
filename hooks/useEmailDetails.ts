import { useEffect, useState, useMemo, useCallback } from "react";
import { Box } from "../types/user";
import { fetchstore } from "../utils/mail/fetchstore";
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
}

export function useEmailDetails(box: Box | null) {
  const [user, setUser] = useState<EmailDetailsData | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmailDetails = async (boxData: Box) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchstore(boxData);
      console.log("Fetched email details:", data);
      if (data) {
        setUser(data);
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
      fetchEmailDetails(box);
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
      isLoading: loading,
      hasError: !!error,
      isEmpty: user === undefined,
      hasData: !!user,
    }),
    [user, loading, error, retry]
  );

  return result;
}

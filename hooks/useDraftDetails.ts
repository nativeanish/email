import { useEffect, useState, useMemo, useCallback } from "react";
import { Draft } from "../types/user";
import { showDanger } from "../Components/UI/Toast/Toast-Context";
import useLoginUser from "../store/useLoginUser";

export interface DraftDetailsData {
  id: string;
  date: number;
  content: {
    to: Array<{ email: string; id: string }>;
    subject: string;
    content: string;
    cc: Array<{ email: string; id: string }> | null;
    bcc: Array<{ email: string; id: string }> | null;
  };
}

export function useDraftDetails(draft: Draft | null) {
  const [draftData, setDraftData] = useState<
    DraftDetailsData | null | undefined
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useLoginUser();

  const fetchDraftDetails = useCallback(
    async (draftItem: Draft) => {
      setLoading(true);
      setError(null);

      try {
        const key = user?.privateKey;

        if (!key) {
          console.log("No private key available for draft:", draftItem.id);
          throw new Error("Authentication required - no private key available");
        }

        if (!user) {
          console.log("No user logged in for draft:", draftItem.id);
          throw new Error("Authentication required - user not logged in");
        }

        // Validate draft data
        if (
          !draftItem.content ||
          !draftItem.content.data ||
          !draftItem.content.iv ||
          !draftItem.content.key
        ) {
          console.log("Missing encryption data for draft:", draftItem.id);
          throw new Error(
            "Draft data is corrupted or missing encryption information"
          );
        }

        console.log(`Decrypting draft ${draftItem.id}...`);

        let decryptedData;
        try {
          const decryptedString = await decryptFromSender(
            key,
            draftItem.content.data,
            draftItem.content.iv,
            draftItem.content.key
          );
          decryptedData = JSON.parse(decryptedString) as {
            to: Array<{ email: string; id: string }>;
            subject: string;
            content: string;
            cc?: Array<{ email: string; id: string }> | null;
            bcc?: Array<{ email: string; id: string }> | null;
          };

          // Validate decrypted data
          if (!decryptedData || typeof decryptedData !== "object") {
            throw new Error("Decrypted data is not a valid object");
          }

          if (!decryptedData.subject && !decryptedData.content) {
            throw new Error("Decrypted data missing both subject and content");
          }
        } catch (decryptError) {
          console.error(
            "Decryption failed for draft:",
            draftItem.id,
            decryptError
          );
          throw new Error(
            `Failed to decrypt draft: ${
              decryptError instanceof Error
                ? decryptError.message
                : "Unknown decryption error"
            }`
          );
        }

        console.log(`Successfully decrypted draft ${draftItem.id}:`, {
          hasSubject: !!decryptedData.subject,
          hasContent: !!decryptedData.content,
          subjectLength: decryptedData.subject?.length || 0,
          recipientCount: decryptedData.to?.length || 0,
          ccCount: decryptedData.cc?.length || 0,
          bccCount: decryptedData.bcc?.length || 0,
        });

        setDraftData({
          id: draftItem.id,
          date: draftItem.date,
          content: {
            to: decryptedData.to || [],
            subject: decryptedData.subject || "No Subject",
            content: decryptedData.content || "",
            cc: decryptedData.cc || null,
            bcc: decryptedData.bcc || null,
          },
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          "Failed to fetch draft details for:",
          draftItem.id,
          error
        );

        // Don't show toast for authentication errors as they're expected
        if (!errorMessage.includes("Authentication required")) {
          showDanger("Failed to load draft: " + errorMessage);
        }

        setError(errorMessage);
        setDraftData(undefined);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const retry = useCallback(() => {
    if (draft) {
      fetchDraftDetails(draft);
    }
  }, [draft, fetchDraftDetails]);

  useEffect(() => {
    if (!draft) {
      setDraftData(null);
      return;
    }

    fetchDraftDetails(draft);
  }, [draft, fetchDraftDetails]);

  // Memoize the return value to prevent unnecessary re-renders
  const result = useMemo(
    () => ({
      draftData,
      loading,
      error,
      retry,
      isLoading: loading,
      hasError: !!error,
      isEmpty: draftData === undefined,
      hasData: !!draftData,
    }),
    [draftData, loading, error, retry]
  );

  return result;
}

// Draft-specific decryption function
async function decryptFromSender(
  senderPrivatePem: string,
  encryptedDataB64: string,
  ivB64: string,
  encryptedAesKeyB64: string
): Promise<string> {
  const fromB64ToUint8 = (b64: string): Uint8Array => {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Uint8Array(bytes);
  };

  const toArrayBuffer = (u8: Uint8Array): ArrayBuffer => {
    return u8.slice(0).buffer;
  };

  const pemToDerPrivate = (pem: string): ArrayBuffer => {
    const b64 = pem
      .replace(/-----\w+ PRIVATE KEY-----/g, "")
      .replace(/\s+/g, "");

    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return new Uint8Array(bytes).buffer;
  };

  const importPrivateKey = async (pem: string) =>
    crypto.subtle.importKey(
      "pkcs8",
      pemToDerPrivate(pem),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["decrypt", "unwrapKey"]
    );

  const privateKey = await importPrivateKey(senderPrivatePem);

  const encryptedAesKey = fromB64ToUint8(encryptedAesKeyB64);
  const iv = toArrayBuffer(fromB64ToUint8(ivB64));
  const ciphertext = toArrayBuffer(fromB64ToUint8(encryptedDataB64));

  const rawAesKey = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    toArrayBuffer(encryptedAesKey)
  );

  const aesKey = await crypto.subtle.importKey(
    "raw",
    rawAesKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    ciphertext
  );

  return new TextDecoder().decode(decryptedBuffer);
}

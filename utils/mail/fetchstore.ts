import useLoginUser from "../../store/useLoginUser";
import useMailStorage from "../../store/useMailStorage";
import { Box } from "../../types/user";

// Cache for ongoing fetch operations to prevent duplicate requests
const fetchingCache = new Map<
  string,
  Promise<{
    id: string;
    from: string;
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    image: string;
    name: string;
    seen: boolean;
    date: number;
  } | null>
>();

// Add a function to clear the cache when needed
export const clearFetchCache = () => {
  fetchingCache.clear();
  console.log("Fetch cache cleared");
};

// Add debugging function for user state
export const debugUserState = () => {
  const loginState = useLoginUser.getState();
  console.log("=== USER STATE DEBUG ===");
  console.log("Has user:", !!loginState.user);
  if (loginState.user) {
    console.log("User keys:", Object.keys(loginState.user));
    console.log("Has privateKey:", !!loginState.user.privateKey);
    console.log("Has publicKey:", !!loginState.user.publicKey);
    console.log("Private key type:", typeof loginState.user.privateKey);
    console.log("Public key type:", typeof loginState.user.publicKey);
    if (loginState.user.privateKey) {
      console.log(
        "Private key starts with:",
        loginState.user.privateKey.substring(0, 30)
      );
      console.log(
        "Private key includes BEGIN:",
        loginState.user.privateKey.includes("-----BEGIN")
      );
      console.log(
        "Private key includes PRIVATE:",
        loginState.user.privateKey.includes("PRIVATE KEY")
      );
    }
  }
  console.log("=== END USER STATE DEBUG ===");
};

// Add a function to clear all related caches and force refresh
export const forceRefreshEmail = async (box: Box) => {
  const ms = useMailStorage.getState();

  // Clear the fetch cache
  clearFetchCache();

  // Remove from mail storage cache
  ms.deleteMail(box.id);

  console.log(`Force refreshing email ${box.id}...`);

  // Fetch fresh data
  return await fetchstore(box);
};

export const fetchstore = async (box: Box) => {
  // Create a unique cache key for this email
  const cacheKey = `${box.id}-${box.from}-${box.to}`;

  // Check if we have a failed attempt in cache and clear it after some time
  const existingPromise = fetchingCache.get(cacheKey);
  if (existingPromise) {
    try {
      console.log(
        `Found existing promise for email ${box.id}, waiting for completion...`
      );
      const result = await existingPromise;
      return result;
    } catch (error) {
      console.log(
        `Previous attempt failed for email ${box.id}, clearing cache and retrying...`,
        error
      );
      fetchingCache.delete(cacheKey);
      // Continue to create a new promise
    }
  }

  // Create the fetch promise and cache it
  const fetchPromise = fetchEmailInternal(box);
  fetchingCache.set(cacheKey, fetchPromise);

  try {
    const result = await fetchPromise;
    return result;
  } catch (error) {
    // On error, remove from cache so retry is possible
    fetchingCache.delete(cacheKey);
    throw error;
  } finally {
    // Clean up the cache entry after successful completion
    setTimeout(() => {
      fetchingCache.delete(cacheKey);
    }, 1000); // Keep successful results cached for 1 second
  }
};

const fetchEmailInternal = async (box: Box) => {
  const ms = useMailStorage.getState();
  const loginState = useLoginUser.getState();
  const key = loginState.user?.privateKey;
  const box_mail_raw = box.tags[0] === "sent" ? box.to : box.from;
  const box_mail = Array.isArray(box_mail_raw)
    ? box_mail_raw[0]
    : String(box_mail_raw);
  const parsedEmail = parseEmail(box_mail);

  console.log(`Starting fetch for email ${box.id}, from: ${box_mail}`);

  try {
    // Validate prerequisites with more detailed logging
    if (!key) {
      console.log("No private key available for email:", box.id);
      console.log("Login state:", {
        hasUser: !!loginState.user,
        userKeys: Object.keys(loginState.user || {}),
      });
      throw new Error("Authentication required - no private key available");
    }

    if (!loginState.user) {
      console.log("No user logged in for email:", box.id);
      throw new Error("Authentication required - user not logged in");
    }

    // Validate key format
    if (
      typeof key !== "string" ||
      !key.includes("-----BEGIN") ||
      !key.includes("-----END")
    ) {
      console.error("Invalid private key format for email:", box.id);
      console.error("Key type:", typeof key);
      console.error("Key preview:", key?.toString().substring(0, 100) + "...");
      console.error("Key includes BEGIN:", key?.includes("-----BEGIN"));
      console.error("Key includes END:", key?.includes("-----END"));
      console.error("Key includes PRIVATE:", key?.includes("PRIVATE KEY"));
      throw new Error("Invalid private key format - key appears corrupted");
    }

    // Allow specific domains
    const allowedDomains = [
      "perma.email",
      "gmail.com",
      "outlook.com",
      "yahoo.com",
    ];

    if (
      !parsedEmail.valid ||
      !parsedEmail.user ||
      !allowedDomains.includes(parsedEmail.domain || "")
    ) {
      console.log("Invalid email format for:", box_mail, "Email ID:", box.id);
      throw new Error(
        `Invalid email format: ${box_mail}. Allowed domains: ${allowedDomains.join(
          ", "
        )}`
      );
    }

    // Validate box data
    if (!box.data || !box.data.data || !box.data.iv || !box.data.key) {
      console.log("Missing encryption data for email:", box.id);
      throw new Error(
        "Email data is corrupted or missing encryption information"
      );
    }

    // Check cache first with more detailed logging
    const emailExists = ms.ifMailExists(box.data, box.id, box.tags);
    console.log(`Email ${box.id} exists in cache:`, emailExists);

    if (!emailExists) {
      console.log(`Decrypting email ${box.id}...`);

      let decryptedData;
      try {
        // Validate encryption data before attempting decryption
        console.log(`Validating encryption data for email ${box.id}...`);
        console.log(
          `Data lengths - data: ${box.data.data?.length || 0}, iv: ${
            box.data.iv?.length || 0
          }, key: ${box.data.key?.length || 0}`
        );

        if (!box.data.data || typeof box.data.data !== "string") {
          throw new Error("Missing or invalid encrypted data");
        }
        if (!box.data.iv || typeof box.data.iv !== "string") {
          throw new Error("Missing or invalid IV data");
        }
        if (!box.data.key || typeof box.data.key !== "string") {
          throw new Error("Missing or invalid key data");
        }

        console.log(`Attempting to decrypt email ${box.id}...`);

        // Retry mechanism for decryption
        let decryptedString;
        let retryCount = 0;
        const maxRetries = 2;

        while (retryCount <= maxRetries) {
          try {
            decryptedString = await decryptFromSender(
              key,
              box.data.data,
              box.data.iv,
              box.data.key
            );
            break; // Success, exit retry loop
          } catch (decryptError) {
            retryCount++;
            console.log(
              `Decryption attempt ${retryCount} failed for email ${box.id}:`,
              decryptError
            );

            if (retryCount > maxRetries) {
              throw decryptError; // Re-throw the last error
            }

            // Wait before retry (exponential backoff)
            const delay = Math.pow(2, retryCount) * 100; // 200ms, 400ms
            console.log(`Retrying decryption in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        if (!decryptedString) {
          throw new Error("Failed to decrypt after all retry attempts");
        }

        decryptedData = JSON.parse(decryptedString) as {
          subject: string;
          body: string;
          from?: string;
        };

        // Validate decrypted data
        if (!decryptedData || typeof decryptedData !== "object") {
          throw new Error("Decrypted data is not a valid object");
        }

        if (!decryptedData.subject && !decryptedData.body) {
          throw new Error("Decrypted data missing both subject and body");
        }
      } catch (decryptError) {
        console.error("Decryption failed for email:", box.id, decryptError);
        throw new Error(
          `Failed to decrypt email: ${
            decryptError instanceof Error
              ? decryptError.message
              : "Unknown decryption error"
          }`
        );
      }

      console.log(`Successfully decrypted email ${box.id}:`, {
        hasSubject: !!decryptedData.subject,
        hasBody: !!decryptedData.body,
        subjectLength: decryptedData.subject?.length || 0,
      });

      // Store user if not exists
      if (!ms.ifUserExists(parsedEmail.user, box_mail)) {
        console.log(`Storing new user: ${parsedEmail.user}`);
        ms.setUser({
          username: parsedEmail.user,
          address: box.from,
          image: box.image || "",
          name: box.name || parsedEmail.user,
        });
      }

      // Store mail
      console.log(`Storing email ${box.id} in cache`);
      ms.setMail({
        id: box.id,
        from: box.from,
        to: box.to,
        received: box.received,
        data: box.data,
        delivered_time: box.delivered_time,
        seen: box.seen,
        tags: box.tags,
        body: decryptedData.body || "",
        subject: decryptedData.subject || "No Subject",
        name: box.name || parsedEmail.user,
        image: box.image || "",
        cc: box.cc,
        bcc: box.bcc,
        error: box.error,
      });

      return {
        id: box.id,
        from: box.from,
        to: box.to,
        cc: box.cc,
        bcc: box.bcc,
        subject: decryptedData.subject || "No Subject",
        body: decryptedData.body || "",
        image: box.image || "",
        name: box.name || parsedEmail.user,
        seen: box.seen,
        date: box.delivered_time,
      };
    } else {
      console.log(`Loading email ${box.id} from cache...`);

      const mail = ms.getMail(box.id);
      if (!mail) {
        console.log("Mail not found in storage despite cache hit:", box.id);
        throw new Error(
          "Email not found in cache despite positive cache check"
        );
      }

      const user = ms.getUser(parsedEmail.user, box.from);
      if (!user) {
        console.log("User not found in storage:", parsedEmail.user, box.from);
        // Try to create the user if missing
        ms.setUser({
          username: parsedEmail.user,
          address: box.from,
          image: box.image || "",
          name: box.name || parsedEmail.user,
        });
      }

      return {
        id: box.id,
        from: box.from,
        to: box.to,
        cc: box.cc,
        bcc: box.bcc,
        subject: mail.subject || "No Subject",
        body: mail.body || "",
        image: user?.image || box.image || "",
        name: user?.name || box.name || parsedEmail.user,
        seen: box.seen,
        date: box.delivered_time,
      };
    }
  } catch (err) {
    console.error("Error in fetchstore for email:", box.id, err);
    throw err; // Re-throw to be handled by the calling code
  }
};
interface ParsedEmail {
  valid: boolean;
  user?: string;
  domain?: string;
}

function parseEmail(addr: string): ParsedEmail {
  // Same pattern as in your Lua code:
  //  • user part: starts with a word char, then word/ dot / underscore / hyphen
  //  • domain:   letters, digits, dots, hyphens, must contain a final “dot TLD”
  const match = addr.match(/^(\w[\w._-]*)@([\w.-]+\.[A-Za-z]+)$/);

  if (match) {
    const [, user, domain] = match; // match[0] is the full string
    return { valid: true, user, domain };
  }

  return { valid: false };
}

async function decryptFromSender(
  senderPrivatePem: string,
  encryptedDataB64: string,
  ivB64: string,
  encryptedAesKeyB64: string
): Promise<string> {
  const validateBase64 = (str: string): boolean => {
    try {
      // Remove any whitespace and check if it's valid base64
      const cleaned = str.replace(/\s/g, "");
      // Base64 regex pattern
      const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
      return base64Pattern.test(cleaned) && cleaned.length % 4 === 0;
    } catch {
      return false;
    }
  };

  const fromB64ToUint8 = (b64: string): Uint8Array => {
    try {
      // Clean and validate the base64 string
      const cleaned = b64.replace(/\s/g, "");
      if (!validateBase64(cleaned)) {
        throw new Error(
          `Invalid base64 string: ${cleaned.substring(0, 20)}...`
        );
      }

      const binary = atob(cleaned);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new Uint8Array(bytes);
    } catch (error) {
      throw new Error(
        `Failed to decode base64: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };
  const toArrayBuffer = (u8: Uint8Array): ArrayBuffer => {
    return u8.slice(0).buffer;
  };

  const pemToDerPrivate = (pem: string): ArrayBuffer => {
    try {
      // Enhanced validation for private key format
      if (!pem || typeof pem !== "string") {
        throw new Error("Private key is not a string");
      }

      if (!pem.includes("-----BEGIN") || !pem.includes("-----END")) {
        throw new Error("Private key missing PEM headers/footers");
      }

      if (!pem.includes("PRIVATE KEY")) {
        throw new Error(
          "Key is not a private key (missing PRIVATE KEY marker)"
        );
      }

      const b64 = pem
        .replace(/-----\w+ PRIVATE KEY-----/g, "")
        .replace(/\s+/g, "");

      if (!b64 || b64.length === 0) {
        throw new Error(
          "Private key has no content after removing PEM headers"
        );
      }

      if (!validateBase64(b64)) {
        throw new Error(
          `Private key content is not valid base64. Length: ${
            b64.length
          }, Preview: ${b64.substring(0, 50)}...`
        );
      }

      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      return new Uint8Array(bytes).buffer; // ensures ArrayBuffer, not SharedArrayBuffer
    } catch (error) {
      console.error("Private key validation failed:", error);
      console.error("Key preview:", pem?.substring(0, 100) + "...");
      throw new Error(
        `Failed to parse private key: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
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

  // Validate and decode all base64 strings with detailed error reporting
  let encryptedAesKey, iv, ciphertext;

  try {
    console.log("Decoding encrypted AES key...");
    encryptedAesKey = fromB64ToUint8(encryptedAesKeyB64);
  } catch (error) {
    throw new Error(
      `Failed to decode encrypted AES key: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  try {
    console.log("Decoding IV...");
    iv = toArrayBuffer(fromB64ToUint8(ivB64));
  } catch (error) {
    throw new Error(
      `Failed to decode IV: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  try {
    console.log("Decoding encrypted data...");
    ciphertext = toArrayBuffer(fromB64ToUint8(encryptedDataB64));
  } catch (error) {
    throw new Error(
      `Failed to decode encrypted data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

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

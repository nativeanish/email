import useLoginUser from "../../store/useLoginUser";
import useMailStorage from "../../store/useMailStorage";
import { Box } from "../../types/user";

// Cache for ongoing fetch operations to prevent duplicate requests
const fetchingCache = new Map<
  string,
  Promise<{
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    image: string;
    name: string;
    seen: boolean;
    date: number;
  } | null>
>();

export const fetchstore = async (box: Box) => {
  // Create a unique cache key for this email
  const cacheKey = `${box.id}-${box.from}-${box.to}`;

  // If we're already fetching this email, return the existing promise
  if (fetchingCache.has(cacheKey)) {
    console.log(`Already fetching email ${box.id}, returning cached promise`);
    return fetchingCache.get(cacheKey);
  }

  // Create the fetch promise and cache it
  const fetchPromise = fetchEmailInternal(box);
  fetchingCache.set(cacheKey, fetchPromise);

  try {
    const result = await fetchPromise;
    return result;
  } finally {
    // Clean up the cache entry after completion (success or failure)
    fetchingCache.delete(cacheKey);
  }
};

const fetchEmailInternal = async (box: Box) => {
  const ms = useMailStorage.getState();
  const loginState = useLoginUser.getState();
  const key = loginState.user?.privateKey;
  const box_mail = box.tags[0] === "sent" ? box.to : box.from;
  const parsedEmail = parseEmail(box_mail);

  try {
    // Validate prerequisites
    if (!key) {
      console.log("No private key available for email:", box.id);
      throw new Error("Authentication required - no private key available");
    }

    if (!loginState.user) {
      console.log("No user logged in for email:", box.id);
      throw new Error("Authentication required - user not logged in");
    }

    if (
      !parsedEmail.valid ||
      !parsedEmail.user ||
      parsedEmail.domain !== "perma.email"
    ) {
      console.log("Invalid email format for:", box_mail, "Email ID:", box.id);
      throw new Error(`Invalid email format: ${box_mail}`);
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
        const decryptedString = await decryptFromSender(
          key,
          box.data.data,
          box.data.iv,
          box.data.key
        );
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
      });

      return {
        id: box.id,
        from: box.from,
        to: box.to,
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
    return new Uint8Array(bytes).buffer; // ensures ArrayBuffer, not SharedArrayBuffer
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

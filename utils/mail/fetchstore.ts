import useLoginUser from "../../store/useLoginUser";
import useMailStorage from "../../store/useMailStorage";
import { Box, User } from "../../types/user";
import dryRun from "../aos/core/dryRun";

export const fetchstore = async (box: Box) => {
  const ms = useMailStorage.getState();
  const key = useLoginUser.getState().user?.privateKey;
  const parsedEmail = parseEmail(box.from);
  try {
    if (!ms.ifMailExists(box.data, box.id, box.tags) && key) {
      const data = JSON.parse(
        await decryptFromSender(key, box.data.data, box.data.iv, box.data.key)
      ) as { subject: string; body: string; from?: string };
      console.log("Decrypted data:", data);
      if (
        parsedEmail.valid &&
        parsedEmail.user &&
        parsedEmail.domain === "perma.email"
      ) {
        if (!ms.ifUserExists(parsedEmail.user, box.from)) {
          const user = JSON.parse(
            (
              await dryRun([
                {
                  name: "getByEmail",
                  value: box.from,
                },
              ])
            ).Messages[0].Data
          ) as { status: 0 | 1; data: User };
          if (user.status === 1 && user.data) {
            ms.setUser({
              username: parsedEmail.user,
              address: box.from,
              image: user.data.image,
              name: user.data.name,
            });
            ms.setMail({
              id: box.id,
              from: box.from,
              to: box.to,
              received: box.received,
              data: box.data,
              delivered_time: box.delivered_time,
              seen: box.seen,
              tags: box.tags,
              body: data.body,
              subject: data.subject,
            });
            return {
              id: box.id,
              from: box.from,
              subject: data.subject,
              body: data.body,
              image: user.data.image,
              name: user.data.name,
              seen: box.seen,
              date: box.delivered_time,
            };
          }
        }
      }
    } else {
      const mail = ms.getMail(box.id);
      if (mail) {
        if (
          parsedEmail.valid &&
          parsedEmail.user &&
          parsedEmail.domain === "perma.email"
        ) {
          const user = ms.getUser(parsedEmail.user, box.from);
          if (user) {
            return {
              id: box.id,
              from: box.from,
              subject: mail.subject,
              body: mail.body,
              image: user.image,
              name: user.name,
              seen: box.seen,
              date: box.delivered_time,
            };
          }
        }
      }
    }
  } catch (err) {
    console.log("Error in fetchstore:", err);
    return;
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

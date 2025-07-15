import { showDanger } from "../../Components/UI/Toast/Toast-Context";
import useLoginUser from "../../store/useLoginUser";
import useMailStore from "../../store/useMailStore";
import { Box, User } from "../../types/user";
import dryRun from "../aos/core/dryRun";
interface ParsedEmail {
  valid: boolean;
  user?: string;
  domain?: string;
}
export const fetchandstore = async (box: Box): Promise<boolean> => {
  try {
    const mailengine = useMailStore.getState();
    const privateKey = useLoginUser.getState().user?.privateKey;

    // Early return if mail already exists or no private key
    if (mailengine.ifmailExits(box.id) || !privateKey) {
      return false;
    }

    // Decrypt the email data
    const decryptedDataStr = await decryptFromSender(
      privateKey,
      box.data.data,
      box.data.iv,
      box.data.key
    );

    let decryptedData: { subject: string; body: string; from?: string };
    try {
      decryptedData = JSON.parse(decryptedDataStr);
    } catch (parseError) {
      console.error("Failed to parse decrypted data:", parseError);
      showDanger("Failed to parse email data");
      return false;
    }

    // Validate required fields
    if (!decryptedData.subject || !decryptedData.body) {
      console.error("Missing required fields in decrypted data");
      showDanger("Invalid email data format");
      return false;
    }

    const box_mail = box.tags[0] === "sent" ? box.to : box.from;

    // Process user if not already exists
    if (!mailengine.ifUserExits(box_mail)) {
      const email = parseEmail(box_mail);
      if (!email.valid) {
        showDanger("Invalid email address: " + box_mail);
        console.error("Invalid email address:", box_mail);
        return false;
      }

      if (email.domain === "perma.email") {
        try {
          const result = await dryRun([
            {
              name: "getByEmail",
              value: box_mail,
            },
          ]);

          if (!result?.Messages?.[0]?.Data) {
            showDanger("Failed to fetch user data for: " + box_mail);
            return false;
          }

          const user = JSON.parse(result.Messages[0].Data) as {
            status: 0 | 1;
            data: User;
          };

          if (user.status === 1 && user.data) {
            mailengine.setUser({
              address: box_mail,
              image: user.data.image,
              name: user.data.name,
              image_type: "url",
              isArweave: true,
            });
          } else {
            showDanger("User not found for email: " + box_mail);
            return false;
          }
        } catch (userFetchError) {
          console.error("Error fetching user data:", userFetchError);
          showDanger("Failed to fetch user data");
          return false;
        }
      } else {
        mailengine.setUser({
          address: box.tags[0] === "sent" ? box.to : box.from,
          image: generateLetterSVGBase64(box_mail[0]),
          name: "",
          image_type: "base64",
          isArweave: false,
        });
      }
    }

    // Store the mail
    mailengine.setMail({
      id: box.id,
      from: box.from,
      to: box.to,
      received: box.received,
      delivered_time: box.delivered_time,
      seen: box.seen,
      tags: box.tags,
      data: box.data,
      subject: decryptedData.subject,
      body: decryptedData.body,
    });

    return true;
  } catch (err) {
    console.error("Error in fetchandstore:", err);
    showDanger("Failed to process email");
    return false;
  }
};

function parseEmail(addr: string): ParsedEmail {
  const match = addr.match(/^(\w[\w._-]*)@([\w.-]+\.[A-Za-z]+)$/);
  if (match) {
    const [, user, domain] = match;
    return { valid: true, user, domain };
  }

  return { valid: false };
}
function generateLetterSVGBase64(letter: string, size: number = 100): string {
  const char = (letter[0] || "?").toUpperCase();

  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.random() * 10; // 70–80%
  const lightness = 60 + Math.random() * 10; // 60–70%
  const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  const textColor = lightness > 65 ? "#000" : "#FFF";

  // Build SVG markup
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}" rx="${
    size * 0.2
  }" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="${
              size * 0.5
            }" fill="${textColor}">
        ${char}
      </text>
    </svg>
  `.trim();

  const encoded =
    typeof window === "undefined"
      ? Buffer.from(svg).toString("base64")
      : btoa(unescape(encodeURIComponent(svg)));

  return `data:image/svg+xml;base64,${encoded}`;
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

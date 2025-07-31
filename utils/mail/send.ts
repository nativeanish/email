import { ReturnResult } from "../../Components/NotificationDrawer";
import {
  showDanger,
  showSuccess,
} from "../../Components/UI/Toast/Toast-Context";
import useLoading from "../../store/useLoading";
import useLoginUser from "../../store/useLoginUser";
import useMail, { EmailChip } from "../../store/useMail";
import useNotification from "../../store/useNotification";
import dryRun from "../aos/core/dryRun";
import register from "../aos/core/register";
import { authorizer_publicKey } from "../constants";
export type success = {
  email: string;
  status: 1;
  data: {
    address: string;
    publicKey: string;
  };
};
export type failed = {
  email: string;
  status: 0;
  data: string;
};
export type main = {
  status: 0 | 1;
  data: string | success[] | failed[];
};
export type field = {
  email: string;
  content: { content: string; iv: string; key: string };
};
export async function sendEmail(body: string) {
  const { subject, to, cc, bcc } = useMail.getState();
  const load = useLoading.getState();
  try {
    if (!to || to.length === 0) {
      showDanger("Please add at least one recipient");
      return false;
    }
    if (!subject || subject.trim() === "") {
      showDanger("Subject cannot be empty");
      return false;
    }
    load.setDescription("Validating email addresses...");
    const allEmails = [...to, ...cc, ...bcc].map(({ email }) => email);
    const message = await dryRun([
      {
        name: "getByEmails",
        value: JSON.stringify(allEmails),
      },
    ]);
    const result = JSON.parse(message.Messages[0].Data) as main;
    if (result.status === 0) {
      const errorMsg =
        typeof result.data === "string"
          ? result.data
          : "Failed to send email. Please check the recipient addresses.";
      showDanger(errorMsg);
      return false;
    }

    // Parse data for success/failure
    const data = (result.data as (success | failed)[]).map((item) => {
      if (item.status === 1 && typeof item.data === "string") {
        return {
          ...item,
          data: JSON.parse(item.data),
        } as success;
      }
      if (item.status === 0 && typeof item.data === "string") {
        return {
          ...item,
          data: item.data,
        } as failed;
      }
      return item;
    });
    const failedEmails = data.filter((item) => item.status === 0);
    if (failedEmails.length > 0) {
      failedEmails.forEach((item) => {
        showDanger(
          `Error sending email to ${item.email}. No account found with associated email.`
        );
      });
      return false;
    }

    load.setDescription("Encrypting and sending email...");
    const encryptedDataforperma = await getKeyandIVandEncryptedData(
      JSON.stringify({
        subject: subject,
        body: body,
        "content-type": "text/html",
      })
    );
    const arra = {
      to: [] as field[],
      cc: [] as field[],
      bcc: [] as field[],
      Content: {
        content: encryptedDataforperma.encryptedData,
        iv: encryptedDataforperma.iv,
        key: encryptedDataforperma.key,
      },
    };
    const keydir = data.filter(
      (item): item is success => item.status === 1
    ) as success[];

    // Helper to push to correct array
    const pushField = async (arr: field[], item: EmailChip) => {
      const isperma = item.email.endsWith("@perma.email");
      const key = keydir.find((k) => k.email === item.email);
      if (isperma && key) {
        arr.push({
          email: item.email,
          content: {
            content: encryptedDataforperma.encryptedData,
            iv: encryptedDataforperma.iv,
            key: await encryptKey(
              key.data.publicKey,
              encryptedDataforperma.key
            ),
          },
        });
      } else {
        arr.push({
          email: item.email,
          content: {
            content: encryptedDataforperma.encryptedData,
            iv: encryptedDataforperma.iv,
            key: await encryptKey(
              authorizer_publicKey,
              encryptedDataforperma.key
            ),
          },
        });
      }
    };

    // Process to, cc, bcc
    for (const item of to) {
      await pushField(arra.to, item);
    }
    for (const item of cc) {
      await pushField(arra.cc, item);
    }
    for (const item of bcc) {
      await pushField(arra.bcc, item);
    }

    load.setDescription("Sending email...");
    const myKey = useLoginUser.getState().user?.publicKey;
    if (!myKey) {
      showDanger("Failed to send email. User public key is not available.");
      return false;
    }
    const self_key = await encryptKey(myKey, encryptedDataforperma.key);
    arra.Content = {
      content: encryptedDataforperma.encryptedData,
      iv: encryptedDataforperma.iv,
      key: self_key,
    };

    const rf = await sendmail(JSON.stringify(arra));
    console.log(rf);
    if (rf.status === 1 && rf.data.msg === "Mails processed") {
      useNotification.getState().addNotification(rf.data.user.updates);
      // Preserve the original private key instead of overwriting with public key
      const originalPrivateKey = useLoginUser.getState().user?.privateKey;
      if (originalPrivateKey) {
        rf.data.user.privateKey = originalPrivateKey;
        useLoginUser.getState().setUser(rf.data.user);
      }
      showSuccess("Email sent successfully!");

      return true;
    } else {
      showDanger("Failed to send email. " + rf.data.msg);
      console.error("Error sending email:", rf.data.msg);
      return false;
    }
  } catch (err) {
    showDanger(
      "Failed to send email.",
      err instanceof Error ? err.message : "Unknown error"
    );
    return false;
  } finally {
    load.close();
  }
}
export async function sendmail(data: string) {
  const dat = JSON.parse(
    (
      await register(
        [
          { name: "Action", value: "Evaluate" },
          { name: "sendMail", value: "true" },
        ],
        data
      )
    ).Messages[0].Data
  ) as ReturnResult;
  return dat;
}
export async function encryptForOne(
  plaintext: string,
  recipientPem: string
): Promise<{
  iv: string;
  data: string;
  key: string;
}> {
  const toB64 = (buf: ArrayBuffer | Uint8Array) => {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    return btoa(String.fromCharCode(...bytes));
  };

  const pemToDer = (pem: string): ArrayBuffer => {
    const b64 = pem
      .replace(/-----\w+ PUBLIC KEY-----/g, "")
      .replace(/\s+/g, "");
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
  };

  const importRsaPublic = async (pem: string) =>
    crypto.subtle.importKey(
      "spki",
      pemToDer(pem),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt", "wrapKey"]
    );

  const recipientKey = await importRsaPublic(recipientPem);

  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96Bit IV

  const encoded = new TextEncoder().encode(plaintext);
  const ciphertextBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded
  );

  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);

  const keyForRecipient = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    recipientKey,
    rawAesKey
  );

  const ivB64 = toB64(iv);
  const ctB64 = toB64(ciphertextBuf);

  return {
    iv: ivB64,
    data: ctB64,
    key: toB64(keyForRecipient),
  };
}

export const getKeyandIV = async (): Promise<{
  key: string;
  iv: string;
}> => {
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96Bit IV
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);
  return {
    key: btoa(String.fromCharCode(...new Uint8Array(rawAesKey))),
    iv: btoa(String.fromCharCode(...iv)),
  };
};

export const getKeyandIVandEncryptedData = async (
  data: string
): Promise<{
  key: string;
  iv: string;
  encryptedData: string;
}> => {
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96Bit IV
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);
  const encodedData = new TextEncoder().encode(data);
  const encryptedDataBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encodedData
  );
  const encryptedData = btoa(
    String.fromCharCode(...new Uint8Array(encryptedDataBuf))
  );
  return {
    key: btoa(String.fromCharCode(...new Uint8Array(rawAesKey))),
    iv: btoa(String.fromCharCode(...iv)),
    encryptedData: encryptedData,
  };
};

export const encryptKey = async (
  publicKey: string,
  key: string
): Promise<string> => {
  const pemToDer = (pem: string): ArrayBuffer => {
    const b64 = pem
      .replace(/-----\w+ PUBLIC KEY-----/g, "")
      .replace(/\s+/g, "");
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
  };
  const importRsaPublic = async (pem: string) =>
    crypto.subtle.importKey(
      "spki",
      pemToDer(pem),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt", "wrapKey"]
    );
  const recipientKey = await importRsaPublic(publicKey);
  const rawKey = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));
  const encryptedKey = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    recipientKey,
    rawKey
  );
  return btoa(String.fromCharCode(...new Uint8Array(encryptedKey)));
};

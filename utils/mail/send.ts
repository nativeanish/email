import { NavigateFunction } from "react-router-dom";
import { ReturnResult } from "../../Components/NotificationDrawer";
import {
  showDanger,
  showSuccess,
} from "../../Components/UI/Toast/Toast-Context";
import useLoading from "../../store/useLoading";
import useLoginUser from "../../store/useLoginUser";
import useMail from "../../store/useMail";
import useNotification from "../../store/useNotification";
import dryRun from "../aos/core/dryRun";
import register from "../aos/core/register";
type success = {
  email: string;
  status: 1;
  data: {
    address: string;
    publicKey: string;
  };
};
type failed = {
  email: string;
  status: 0;
  data: string;
};
type main = {
  status: 0 | 1;
  data: string | success[] | failed[];
};
export async function sendEmail(body: string, _: NavigateFunction) {
  const { subject, to } = useMail.getState();
  const load = useLoading.getState();
  try {
    if (to.length === 0) {
      load.close();
      showDanger("Please add at least one recipient");
      return false;
    }
    if (subject.trim() === "") {
      load.close();
      showDanger("Subject cannot be empty");
      return false;
    }
    load.setDescription("Validating email addresses...");
    const email = [...to].map(({ email }) => email);
    const message = await dryRun([
      {
        name: "getByEmails",
        value: JSON.stringify(email),
      },
    ]);
    const reuslt = JSON.parse(message.Messages[0].Data) as main;
    if (reuslt.status === 0) {
      load.close();
      const errorMsg =
        typeof reuslt.data === "string"
          ? reuslt.data
          : "Failed to send email. Please check the recipient addresses.";
      showDanger(errorMsg);
      return false;
    } else {
      const data = (reuslt.data as (success | failed)[]).map((item) => {
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
        load.close();
        failedEmails.forEach((item) => {
          showDanger(`Error sending email to ${item.email}`);
        });
        return;
      } else {
        load.setDescription("Encrypting and sending email...");
        const keyData = useLoginUser.getState().user?.publicKey as string;
        const arra = [];
        for (const item of data) {
          if (item.status === 1) {
            const message = {
              subject: subject,
              body: body,
            };
            const arr = item.email.split("@");
            if (arr[1] === "perma.email") {
              const { sendMsg, recipientMsg } = await encryptForBoth(
                JSON.stringify(message),
                keyData,
                item.data.publicKey
              );
              arra.push({
                mdata: sendMsg,
                udata: recipientMsg,
                to:
                  arr.length === 2 && arr[1] === "perma.email"
                    ? item.email
                    : "",
              });
            }
          } else {
            load.close();
            showDanger("No valid recipients found");
            return false;
          }
        }
        console.log("Array to send:", arra);
        load.setDescription("Sending email...");
        const rf = JSON.parse(
          (
            await register([
              { name: "Action", value: "Evaluate" },
              { name: "sendMail", value: JSON.stringify(arra) },
            ])
          ).Messages[0].Data
        ) as ReturnResult;
        const usef = useLoginUser.getState().user;
        if (rf.status === 1 && usef?.privateKey) {
          rf.data.user.privateKey = usef.privateKey;
          useLoginUser.getState().setUser(rf.data.user);
          useNotification.getState().addNotification(rf.data.user.updates);
          load.close();
          showSuccess("Email sent successfully!");
          return true;
        } else {
          load.close();
          showDanger("Failed to send email. Please try again later.");
          return false;
        }
        console.log(rf);
        load.close();
      }
    }
  } catch (err) {
    load.close();
    showDanger(
      "Failed to send email.",
      err instanceof Error ? err.message : "Unknown error"
    );
    throw new Error("Failed to send email");
  }
}

async function encryptForBoth(
  plaintext: string,
  senderPem: string,
  recipientPem: string
): Promise<{
  sendMsg: string;
  recipientMsg: string;
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

  const senderKey = await importRsaPublic(senderPem);
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

  const keyForSender = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    senderKey,
    rawAesKey
  );

  const keyForRecipient = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    recipientKey,
    rawAesKey
  );

  const ivB64 = toB64(iv);
  const ctB64 = toB64(ciphertextBuf);

  return {
    sendMsg: JSON.stringify({
      iv: ivB64,
      data: ctB64,
      key: toB64(keyForSender),
    }),
    recipientMsg: JSON.stringify({
      iv: ivB64,
      data: ctB64,
      key: toB64(keyForRecipient),
    }),
  };
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

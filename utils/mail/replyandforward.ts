import {
  showDanger,
  showSuccess,
} from "../../Components/UI/Toast/Toast-Context";
import useBell from "../../store/useBell";
import useLoading from "../../store/useLoading";
import useLoginUser from "../../store/useLoginUser";
import useNotification from "../../store/useNotification";
import dryRun from "../aos/core/dryRun";
import { authorizer_publicKey } from "../constants";
import {
  encryptKey,
  failed,
  getKeyandIVandEncryptedData,
  main,
  sendmail,
  success,
} from "./send";
export default async function replyAndForward(
  to: Array<string>,
  subject: string,
  content: string,
  _type: "forward" | "reply"
): Promise<boolean> {
  const load = useLoading.getState();
  const notify = useNotification.getState();
  const loginUser = useLoginUser.getState();
  // --- Validation ---
  if (to.length === 0) return showDanger("No recipients specified"), false;
  if (subject.length === 0) return showDanger("Subject cannot be empty"), false;
  if (_type === "reply" && to.length !== 1)
    return showDanger("Reply can only be sent to one recipient"), false;

  // --- Verify Recipients ---
  load.setTitle("Verifiying Email Addresses");
  load.setDescription("Please wait while we verify the email addresses.");
  load.open();
  let message;
  try {
    message = JSON.parse(
      (await dryRun([{ name: "getByEmails", value: JSON.stringify(to) }]))
        .Messages[0].Data
    ) as main;
  } catch (e) {
    load.close();
    console.error("Error verifying email addresses:", e);
    showDanger("Failed to verify email addresses");
    return false;
  }
  if (message.status === 0) {
    load.close();
    showDanger(
      typeof message.data === "string"
        ? message.data
        : "Failed to send email. Please check the recipient addresses."
    );
    return false;
  }

  // --- Parse Recipients ---
  const data = (message.data as (success | failed)[]).map((item) => {
    if (item.status === 1 && typeof item.data === "string") {
      return { ...item, data: JSON.parse(item.data) } as success;
    }
    if (item.status === 0 && typeof item.data === "string") {
      return { ...item, data: item.data } as failed;
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
    load.close();
    return false;
  }
  const keydir = data.filter(
    (item): item is success => item.status === 1
  ) as success[];

  // --- Encrypt Email ---
  load.setTitle("Encrypting Email");
  load.setDescription("Please wait while we encrypt the email.");
  const encryptedDataforperma = await getKeyandIVandEncryptedData(
    JSON.stringify({ subject, body: content, type: _type })
  );

  // --- Prepare Recipients Array ---
  const arr = {
    to: await Promise.all(
      to.map(async (email) => {
        const isPerma = email.endsWith("@perma.email");
        const key = keydir.find((k) => k.email === email);
        return {
          email,
          content: {
            content: encryptedDataforperma.encryptedData,
            iv: encryptedDataforperma.iv,
            key:
              isPerma && key
                ? await encryptKey(
                    key.data.publicKey,
                    encryptedDataforperma.key
                  )
                : authorizer_publicKey,
          },
        };
      })
    ),
    Content: {
      content: encryptedDataforperma.encryptedData,
      iv: encryptedDataforperma.iv,
      key: encryptedDataforperma.key,
    },
  };

  // --- Get Sender Key ---
  const myKey = loginUser.user?.publicKey;
  if (!myKey)
    return (
      showDanger("You are not logged in. Please log in to send emails."), false
    );
  const self_key = await encryptKey(myKey, encryptedDataforperma.key);
  arr.Content.key = self_key;

  // --- Send Email ---
  try {
    if (_type === "forward") {
      load.setTitle("Forwarding Email");
      load.setDescription("");
      for (let i = 0; i < arr.to.length; i++) {
        const item = arr.to[i];
        load.setDescription(
          `Forwarding email to ${item.email} (${i + 1}/${arr.to.length})`
        );
        const arufs = {
          to: [item],
          Content: { ...arr.Content },
        };
        const rf = await sendmail(JSON.stringify(arufs));
        if (rf.status === 1 && rf.data.msg === "Mails processed") {
          useBell.getState().increment();
        } else {
          showDanger(
            `Failed to forward email to ${item.email}. ${rf.data.msg}`
          );
        }
      }
      load.close();
      showSuccess(
        "Email Processed. Please Update the state or click the refresh button."
      );
      return true;
    } else {
      load.setTitle("Replying Email");
      load.setDescription("");
      const rf = await sendmail(JSON.stringify(arr));
      console.log(rf);
      if (rf.status === 1 && rf.data.msg === "Mails processed") {
        showSuccess(
          "Email Processed. Please Update the state or click the refresh button."
        );
        notify.addNotification(rf.data.user.updates);
        useBell.getState().increment();
        load.close();
        return true;
      } else {
        load.close();
        showDanger("Failed replying email");
        return false;
      }
    }
  } catch (e) {
    showDanger(
      _type === "forward"
        ? "Failed to forward the message"
        : "Failed to reply to the message"
    );
    console.error(`Error in ${_type}:`, e);
    load.close();
    return false;
  }
}

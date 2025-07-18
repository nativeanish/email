import { Box } from "../types/user";

export const debugEmailLoading = (box: Box, context: string) => {
  console.group(`🔍 Email Debug - ${context} - ID: ${box.id}`);
  console.log("📧 Email Details:", {
    id: box.id,
    from: box.from,
    to: box.to,
    tags: box.tags,
    delivered_time: box.delivered_time,
    seen: box.seen,
  });

  console.log("🔒 Encryption Data:", {
    hasData: !!box.data?.data,
    hasIV: !!box.data?.iv,
    hasKey: !!box.data?.key,
    dataLength: box.data?.data?.length || 0,
    ivLength: box.data?.iv?.length || 0,
    keyLength: box.data?.key?.length || 0,
  });

  console.log("👤 User Data:", {
    hasName: !!box.name,
    hasImage: !!box.image,
    name: box.name,
    imageLength: box.image?.length || 0,
  });

  console.groupEnd();
};

export const debugStorageState = () => {
  // Import dynamically to avoid circular dependencies
  import("../store/useMailStorage").then(({ default: useMailStorage }) => {
    const state = useMailStorage.getState();
    console.group("💾 Storage State Debug");
    console.log("📧 Emails in storage:", state.mail.length);
    console.log("👥 Users in storage:", state.user.length);
    console.log(
      "Recent emails:",
      state.mail.slice(-5).map((m) => ({
        id: m.id,
        subject: m.subject?.substring(0, 30) + "...",
        from: m.from,
        tags: m.tags,
      }))
    );
    console.groupEnd();
  });
};

export const debugAuthState = () => {
  import("../store/useLoginUser").then(({ default: useLoginUser }) => {
    const state = useLoginUser.getState();
    console.group("🔐 Auth State Debug");
    console.log("User logged in:", !!state.user);
    console.log("Has private key:", !!state.user?.privateKey);
    console.log("Private key length:", state.user?.privateKey?.length || 0);
    console.log("User address:", state.user?.address);
    console.groupEnd();
  });
};

import { DataItem } from "@ar.io/arbundles/node";

export default async function upload(data: DataItem) {
  try {
    const tx = await fetch("https://upload.ardrive.io/v1/tx", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: Buffer.from(data.getRaw()),
    });
    if (!tx.ok || tx.status !== 200) {
      return false;
    }
    const response = await tx.json();
    if (!response || !response.id) {
      return false;
    }
    return response.id as string;
  } catch (error) {
    console.error("Upload failed:", error);
    return false;
  }
}

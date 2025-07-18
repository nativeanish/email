export function formatEmailDate(timestamp: number | string): string {
  const ms = typeof timestamp === "string" ? Number(timestamp) : timestamp;
  if (!Number.isFinite(ms)) return "";

  const date = new Date(ms);
  if (isNaN(date.getTime())) return "";

  const now = new Date();

  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-GB");
}

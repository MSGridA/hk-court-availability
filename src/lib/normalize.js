export function safeText(value, fallback = "") {
  return value === null || value === undefined ? fallback : String(value).trim();
}

export function normalizeKey(value) {
  return safeText(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "")
    .trim();
}

export function dmsToDecimal(value) {
  const text = safeText(value);
  const parts = text.split("-").map(Number);

  if (parts.length !== 3 || parts.some(Number.isNaN)) return text;

  const [deg, min, sec] = parts;
  return (deg + min / 60 + sec / 3600).toFixed(6);
}

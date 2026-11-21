export function getApiBaseUrl() {
  const fromProcess =
    typeof process !== "undefined" ? process.env.API_URL : undefined;
  const fromVite = import.meta.env.VITE_API_URL as string | undefined;
  const url = fromProcess || fromVite || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

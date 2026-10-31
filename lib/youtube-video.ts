/** Shared by the server renderer and the framework-free video controller. */
export function getVslVideo(videoUrl: string) {
  try {
    const url = new URL(videoUrl);
    if (!["https:", "http:"].includes(url.protocol)) return null;
    let id: string | null | undefined;
    if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    else if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(url.hostname)) {
      id = url.pathname === "/watch" ? url.searchParams.get("v") : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)\/?$/)?.[1];
    }
    if (!id || !/^[\w-]{11}$/.test(id)) return null;
    const seconds = url.searchParams.get("t")?.match(/^(\d+)s?$/)?.[1] ?? url.searchParams.get("start");
    const start = Number(seconds ?? 0);
    return { id, start: Number.isSafeInteger(start) && start >= 0 ? start : 0 };
  } catch { return null; }
}

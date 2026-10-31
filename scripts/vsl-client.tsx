import { VIDEO_URL } from "../lib/video-config";
import { getVslVideo } from "../lib/youtube-video";

const root = document.getElementById("hero-vsl-root");
const video = getVslVideo(VIDEO_URL);
const button = root?.querySelector<HTMLButtonElement>(".vsl-trigger");
const image = button?.querySelector<HTMLImageElement>(".vsl-thumbnail");

if (root && video && button) {
  let triedFallback = false;
  const fallback = () => {
    if (!image) return;
    if (triedFallback) { image.remove(); return; }
    triedFallback = true;
    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
    image.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  };
  image?.addEventListener("error", fallback);
  if (image?.complete && image.naturalWidth <= 120) fallback();
  button.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&loop=0&start=${video.start}`;
    frame.title = "Vídeo de apresentação da Botica Viva";
    frame.width = "680";
    frame.height = "383";
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    button.replaceWith(frame);
    frame.focus();
  }, { once: true });
}

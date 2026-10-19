"use client";

import { useEffect, useRef, useState } from "react";
import { VolumeOff } from "lucide-react";

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
  } catch {
    return null;
  }
}

export function VslPlayer({ videoUrl }: { videoUrl: string }) {
  const video = getVslVideo(videoUrl);
  const [playing, setPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState<"maxresdefault" | "hqdefault" | null>("maxresdefault");
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && (image.naturalWidth === 0 || (thumbnail === "maxresdefault" && image.naturalWidth <= 120))) {
      setThumbnail(current => current === "maxresdefault" ? "hqdefault" : null);
    }
  }, [thumbnail, video?.id]);

  if (!video) return <div className="hero-video-placeholder">Vídeo de apresentação</div>;

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&loop=0&start=${video.start}`}
        title="Vídeo de apresentação da Botica Viva"
        width="680"
        height="383"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        ref={frame => { frame?.focus(); }}
      />
    );
  }

  const fallback = () => setThumbnail(current => current === "maxresdefault" ? "hqdefault" : null);

  return (
    <button className="vsl-trigger" type="button" onClick={() => setPlaying(true)} aria-label="Reproduzir vídeo com som">
      {thumbnail && (
        <img
          className="vsl-thumbnail"
          ref={imageRef}
          src={`https://img.youtube.com/vi/${video.id}/${thumbnail}.jpg`}
          alt=""
          width="1280"
          height="720"
          decoding="async"
          fetchPriority="high"
          onError={fallback}
          onLoad={event => { if (thumbnail === "maxresdefault" && event.currentTarget.naturalWidth <= 120) fallback(); }}
        />
      )}
      <span className="vsl-shade" aria-hidden="true" />
      <span className="vsl-callout">
        <span>Seu vídeo já começou</span>
        <VolumeOff className="vsl-icon" aria-hidden="true" />
        <span>Clique para ouvir</span>
      </span>
    </button>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { VolumeOff } from "lucide-react";
import { VIDEO_POSTER } from "../../lib/video-config";

import { getVslVideo } from "../../lib/youtube-video";
export { getVslVideo } from "../../lib/youtube-video";

export function VslPlayer({ videoUrl }: { videoUrl: string }) {
  const video = getVslVideo(videoUrl);
  const [playing, setPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState<"maxresdefault" | "hqdefault" | null>("maxresdefault");
  const imageRef = useRef<HTMLImageElement>(null);
  const localPoster = video?.id === VIDEO_POSTER.videoId && thumbnail === "maxresdefault";

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
          src={localPoster ? VIDEO_POSTER.src : `https://img.youtube.com/vi/${video.id}/${thumbnail}.jpg`}
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

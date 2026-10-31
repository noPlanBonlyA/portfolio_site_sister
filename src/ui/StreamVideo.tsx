import { useEffect, useRef } from 'react';

/**
 * Adaptive video: plays an HLS stream (quality follows the connection), with an MP4 fallback.
 * Safari/iOS play HLS natively; other browsers lazy-load hls.js the first time this mounts.
 */
export function StreamVideo({ hls, mp4, poster, title }: { hls: string; mp4: string; poster: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (v.canPlayType('application/vnd.apple.mpegurl')) {
      v.src = hls;
      return;
    }
    let destroy = () => {};
    let cancelled = false;
    import('hls.js/light')
      .then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) {
          v.src = mp4;
          return;
        }
        // start on the lightest rendition, then climb as the connection allows
        const h = new Hls({ startLevel: 0, capLevelToPlayerSize: true, maxBufferLength: 20 });
        h.loadSource(hls);
        h.attachMedia(v);
        h.on(Hls.Events.ERROR, (_, d) => {
          if (d.fatal) {
            h.destroy();
            v.src = mp4;
          }
        });
        destroy = () => h.destroy();
      })
      .catch(() => {
        if (!cancelled) v.src = mp4;
      });
    return () => {
      cancelled = true;
      destroy();
    };
  }, [hls, mp4]);
  return <video ref={ref} poster={poster} controls playsInline preload="metadata" aria-label={title} />;
}

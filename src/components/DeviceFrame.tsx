import { useEffect, useRef, useState } from 'react';

/**
 * DeviceFrame (HANDOFF §7.2) — an iPhone-15/16-Pro-proportioned frame with a
 * Dynamic Island, thin bezel, and continuous corners.
 *
 * - Plays a real recording when `video` is provided: autoplay, muted, loop,
 *   playsInline, poster; pauses via IntersectionObserver when offscreen and
 *   whenever `active` is false (e.g. the modal is closed).
 * - Honors reduced-motion: shows the poster/placeholder, does not autoplay,
 *   and exposes a manual play control.
 * - With no video yet, shows an honest branded placeholder (not fake app UI).
 */

export interface DeviceFrameProps {
  video?: { src: string; poster?: string };
  /** Whether the frame is in an active context (modal open / on screen). */
  active?: boolean;
  /** Accessible label for the media. */
  label?: string;
}

export default function DeviceFrame({ video, active = true, label = 'ZumNum preview' }: DeviceFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Track reduced-motion preference.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Pause when scrolled offscreen.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Drive playback from active + visibility + reduced-motion.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !video) return;
    const shouldPlay = active && inView && !reduced;
    if (shouldPlay) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [active, inView, reduced, video]);

  const manualPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  return (
    <div className="device" ref={frameRef}>
      <div className="device__frame">
        <div className="device__island" aria-hidden="true" />
        <div className="device__screen">
          {video ? (
            <>
              <video
                ref={videoRef}
                className="device__video"
                src={video.src}
                poster={video.poster}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={label}
              />
              {(reduced || !playing) && (
                <button type="button" className="device__play" onClick={manualPlay} aria-label={`Play ${label}`}>
                  <span className="device__play-glyph" aria-hidden="true">▶</span>
                </button>
              )}
            </>
          ) : (
            <div className="device__placeholder" role="img" aria-label="ZumNum preview — screen recording coming soon">
              <div className="device__ph-num">42</div>
              <div className="device__ph-name">ZumNum</div>
              <div className="device__ph-note">Screen recording coming soon</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

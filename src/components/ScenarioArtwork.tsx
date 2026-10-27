import React, { useEffect, useRef, useState } from 'react';
import type { Card } from '../types';
import { getScenarioArtwork } from '../lib/scenarioArtwork';

type ScenarioArtworkProps = {
  card: Card;
  variant: 'card' | 'intro';
  isActive?: boolean;
};

export const ScenarioArtwork: React.FC<ScenarioArtworkProps> = ({ card, variant, isActive = true }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));
  const videoRef = useRef<HTMLVideoElement>(null);
  const artwork = getScenarioArtwork(card.id);
  const className = variant === 'card'
    ? `flash-art flash-art-${artwork.art}`
    : `scene-hero-art scene-hero-art-${artwork.art}`;
  const showVideo = variant === 'intro' && Boolean(artwork.videoSrc) && !videoFailed && !prefersReducedMotion;

  useEffect(() => {
    setImageFailed(false);
    setVideoFailed(false);
    setPlaybackBlocked(false);
    setVideoReady(false);
  }, [card.id, artwork.src, artwork.videoSrc]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }
    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!isActive || prefersReducedMotion || variant !== 'intro') {
      video.pause();
      return;
    }
    let cancelled = false;
    video.play()
      .then(() => {
        if (!cancelled) setPlaybackBlocked(false);
      })
      .catch((error: unknown) => {
        // Autoplay restrictions should offer a tap-to-play option, not hide a
        // valid video behind the static fallback. Real media errors are
        // handled by the video's `error` event below.
        if (!cancelled && (!(error instanceof Error) || error.name !== 'AbortError')) {
          setPlaybackBlocked(true);
        }
      });
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [isActive, prefersReducedMotion, variant, artwork.videoSrc]);

  const startVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play()
      .then(() => setPlaybackBlocked(false))
      .catch(() => setPlaybackBlocked(true));
  };

  return (
    <span className={className} aria-hidden={playbackBlocked ? undefined : true}>
      {showVideo ? (
        <>
          {!imageFailed && artwork.src ? (
            <img className={`scene-hero-placeholder${videoReady ? ' is-hidden' : ''}`} src={artwork.src} alt="" onError={() => setImageFailed(true)} />
          ) : (
            <span className="scenario-artwork-fallback scene-hero-placeholder">{card.icon}</span>
          )}
          <video
            ref={videoRef}
            src={artwork.videoSrc}
            className={videoReady ? 'is-ready' : undefined}
            autoPlay={isActive}
            muted
            loop
            playsInline
            preload={isActive ? 'metadata' : 'none'}
            onError={() => setVideoFailed(true)}
            onPlaying={() => {
              setPlaybackBlocked(false);
              setVideoReady(true);
            }}
          />
          {playbackBlocked && (
            <button className="scene-hero-play" type="button" onClick={startVideo} aria-label="Play scenario animation">
              <span className="scene-hero-play-icon" aria-hidden="true" />
              Play animation
            </button>
          )}
        </>
      ) : !imageFailed && artwork.src ? (
        <img src={artwork.src} alt="" onError={() => setImageFailed(true)} />
      ) : (
        <span className="scenario-artwork-fallback">{card.icon}</span>
      )}
    </span>
  );
};

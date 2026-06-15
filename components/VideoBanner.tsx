'use client';

import React, {useEffect, useRef} from 'react';
import {trackEvent} from '@/lib/analytics';

interface VideoBannerProps {
  titleLine1: string;
  titleLine2: string;
}

export default function VideoBanner({titleLine1, titleLine2}: VideoBannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const progressThresholds = useRef(new Set<number>());

  useEffect(() => {
    const banner = bannerRef.current;
    const video = videoRef.current;
    if (!banner || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        void trackEvent('video_banner_impression', {
          surface: 'home_video_banner',
          video_title: 'ERNI video banner',
          visible: true
        });
        observer.disconnect();
      },
      {threshold: 0.5}
    );

    const handlePlay = () => {
      void trackEvent('video_start', {
        surface: 'home_video_banner',
        video_title: 'ERNI video banner',
        video_url: '/ERNI_video.mp4',
        video_provider: 'local',
        visible: true
      });
    };

    const handleTimeUpdate = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const percent = Math.floor((video.currentTime / video.duration) * 100);
      [10, 25, 50, 75].forEach((threshold) => {
        if (percent >= threshold && !progressThresholds.current.has(threshold)) {
          progressThresholds.current.add(threshold);
          void trackEvent('video_progress', {
            surface: 'home_video_banner',
            video_title: 'ERNI video banner',
            video_url: '/ERNI_video.mp4',
            video_provider: 'local',
            video_percent: threshold,
            video_current_time: Math.round(video.currentTime),
            video_duration: Math.round(video.duration),
            visible: true
          });
        }
      });
    };

    const handleEnded = () => {
      void trackEvent('video_complete', {
        surface: 'home_video_banner',
        video_title: 'ERNI video banner',
        video_url: '/ERNI_video.mp4',
        video_provider: 'local',
        visible: true
      });
    };

    observer.observe(banner);
    video.addEventListener('play', handlePlay, {once: true});
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      observer.disconnect();
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div ref={bannerRef} className="w-full h-[75vh] relative overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full absolute top-0 left-0 object-cover"
        src="/ERNI_video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-auto z-[1]"
        style={{
          backgroundColor: '#033778',
          opacity: 0
        }}
      />
      <div
        className="absolute left-0 bottom-0 w-full flex items-end z-[2]"
      >
        <h1
          className="text-white text-5xl md:text-7xl font-semibold pl-8 pb-8"
          style={{ 
            lineHeight: 1.1,
            fontFamily: 'var(--font-source-sans-pro), sans-serif',
            fontWeight: 600
          }}
        >
          {titleLine1}<br />{titleLine2}
        </h1>
      </div>
    </div>
  );
} 
import React from 'react';

interface VideoBannerProps {
  titleLine1: string;
  titleLine2: string;
}

export default function VideoBanner({titleLine1, titleLine2}: VideoBannerProps) {
  return (
    <div className="w-full h-[75vh] relative overflow-hidden">
      <video
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
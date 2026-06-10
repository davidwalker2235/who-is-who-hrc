'use client';

import React, { useState, useEffect } from 'react';
import { HtmlRenderer } from '@/utils/htmlRenderer';
import {Link} from '@/i18n/navigation';

// Hook para detectar si es un dispositivo móvil
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Detección específica para Android e iOS
      const androidRegex = /android/i;
      const iosRegex = /iphone|ipad|ipod/i;
      
      // También incluimos otros dispositivos móviles para mayor compatibilidad
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
      
      const isAndroid = androidRegex.test(userAgent);
      const isIOS = iosRegex.test(userAgent);
      const isMobileDevice = mobileRegex.test(userAgent);
      
      setIsMobile(isAndroid || isIOS || isMobileDevice);
    };

    checkIsMobile();
  }, []);

  return isMobile;
};

interface SectionProps {
  title: string;
  paragraph1: string;
  paragraph2: string;
  buttonText: string;
  secondaryButtonText: string;
  buttonLink: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
}

export default function Section({
  title,
  paragraph1,
  paragraph2,
  buttonText,
  secondaryButtonText,
  buttonLink,
  imageSrc,
  imageAlt,
  imagePosition = 'right'
}: SectionProps) {
  const isMobile = useIsMobile();

  const TextContent = () => (
    <div className="space-y-6">
      <h2 
        className="text-4xl md:text-5xl font-semibold text-[#033778] leading-tight"
        style={{ 
          fontFamily: 'var(--font-source-sans-pro), sans-serif',
          fontWeight: 600
        }}
      >
        {title}
      </h2>
      
      <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
        <HtmlRenderer text={paragraph1} />
        <HtmlRenderer text={paragraph2} />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href={buttonLink}
          className="inline-block bg-[#033778] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#022a5e] transition-colors duration-300"
          style={{ 
            fontFamily: 'var(--font-source-sans-pro), sans-serif',
            fontWeight: 600
          }}
        >
          {buttonText}
        </Link>
        
        {!isMobile && (
          <Link
            href="/whoIsWho3D"
            className="inline-block bg-[#033778] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#022a5e] transition-colors duration-300"
            style={{ 
              fontFamily: 'var(--font-source-sans-pro), sans-serif',
              fontWeight: 600
            }}
          >
            {secondaryButtonText}
          </Link>
        )}
      </div>
    </div>
  );

  const ImageContent = () => (
    <div className="relative">
      <div className="relative overflow-hidden shadow-lg">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );

  return (
    <section className="w-full py-16 px-12 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {imagePosition === 'left' ? (
          <>
            <ImageContent />
            <TextContent />
          </>
        ) : (
          <>
            <TextContent />
            <ImageContent />
          </>
        )}
      </div>
    </section>
  );
} 
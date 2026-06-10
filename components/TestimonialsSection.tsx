'use client';

import { HtmlRenderer } from '@/utils/htmlRenderer';
import React from 'react';

interface TestimonialProps {
  videoUrl: string;
  quote: string;
  title: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ videoUrl, quote, title }) => {
  // Extraer el ID del video de YouTube de la URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className="flex flex-col space-y-4">
      {/* Video Container */}
      <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={embedUrl}
          title={`Video testimonial de ${title}`}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* ERNI Logo overlay */}
        <div className="absolute top-2 right-2">
          <div className="bg-[#033778] text-white w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold">
            e
          </div>
        </div>
      </div>
      
      {/* Quote Block */}
      <div className="flex space-x-3">
        <div className="w-1 bg-[#033778] rounded-full"></div>
        <div className="flex-1">
          <div className="text-[#033778] font-semibold not-italic text-xl md:text-1xl">
              {title}
          </div>
          <blockquote className="text-gray-700 text-lg leading-relaxed mb-2">
            {quote}
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsSection() {
  const testimonials = [
    {
      videoUrl: "https://youtu.be/txlYlOsemSQ?si=WqoVH4Jh4LYXCygm",
      quote: "Nuestros expertos en ciberseguridad explotan a tiempo real algunas de las vulnerabilidades del Top 10 OWASP y lo más importante, cómo evitarlas. Un ponente ataca y el otro explica el fallo y las defensas. En cada caso analizan qué pasó y cómo corregirlo en el desarrollo. ¿Listo para ver el código en peligro y corregirlo?",
      title: "Hack & Patch – OWASP en combate"
    },
    {
      videoUrl: "https://youtu.be/Dq0E70n-sFc?si=LkEu1iHrAg0um5Se",
      quote: "En esta mesa redonda, expertos en innovación analizan cómo la inteligencia artificial está transformando el desarrollo de software. Hablamos de automatización, productividad, riesgos y del nuevo mindset que necesitan CEOs y CTOs para liderar el cambio.",
      title: " ¿Cuándo desarrollaremos en la mitad de tiempo? La pregunta que todo CEO le hace a su CTO"
    }
  ];

  return (
    <section className="w-full pb-16 px-12 bg-white">
      <div className="grid grid-cols-1 gap-12">
        <div className="space-y-6">
          <h2 
            className="text-4xl md:text-5xl font-semibold text-[#033778] leading-tight"
            style={{ 
              fontFamily: 'var(--font-source-sans-pro), sans-serif',
              fontWeight: 600
            }}
          >
            <HtmlRenderer text={'¿Te perdiste alguna ponencia?'} />
          </h2>
        </div>
        
        {/* Videos and Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              videoUrl={testimonial.videoUrl}
              quote={testimonial.quote}
              title={testimonial.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 
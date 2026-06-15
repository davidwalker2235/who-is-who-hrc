'use client';

import { HtmlRenderer } from '@/utils/htmlRenderer';
import React from 'react';
import {useTranslations} from 'next-intl';
import {trackOutboundLink} from '@/lib/analytics';

const jobsHref = 'https://www.betterask.erni/es-en/job-opportunities/';

export default function FooterBanner() {
  const tJobs = useTranslations('jobs');

  return (
    <section className="relative w-full py-16 px-12 overflow-hidden h-[600px]">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/footerImage.JPG)'
        }}
      />
      <div 
        className="absolute inset-0 bg-[#033778] opacity-10"
      />
      <div className="relative z-10 px-0 sm:px-12 mx-auto h-full">
        <div className="grid grid-cols-1 lg:grid-cols-10 h-full gap-6 lg:gap-0">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-source-sans-pro), sans-serif' }}
            >
              <HtmlRenderer as="span" text={tJobs('title')} />
            </h1>
            
            <div className="space-y-6 lg:space-y-0">
              <HtmlRenderer
                as="p"
                text={tJobs('description')}
                className="hidden lg:block text-base md:text-lg lg:text-xl text-white leading-relaxed max-w-2xl"
              />
            </div>
          </div>
          <div className="flex lg:flex lg:col-span-3 items-end justify-end">
            <a
              href={jobsHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => void trackOutboundLink('button.jobs.cta', jobsHref, {
                surface: 'jobs_banner'
              })}
              className="inline-flex items-center justify-center gap-2 bg-[#033778] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#022a5e] transition-colors duration-300"
              style={{ fontFamily: 'var(--font-source-sans-pro), sans-serif' }}
            >
              <HtmlRenderer as="span" text={tJobs('cta')} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 
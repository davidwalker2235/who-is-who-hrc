'use client';

import {useEffect, useMemo, useRef} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {trackEvent, setAnalyticsUserId, setAnalyticsUserProperties, type AnalyticsParams} from '@/lib/analytics';
import {getAnalyticsUserId, getAnalyticsUserProperties} from '@/lib/analyticsUserConfig';

const scrollThresholds = [25, 50, 75, 90] as const;
const campaignParamNames = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid'
] as const;

export default function FirebaseAnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const pageStartedAt = useRef(Date.now());
  const previousPagePath = useRef<string | null>(null);
  const firedScrollThresholds = useRef(new Set<number>());

  const campaignParams = useMemo(() => {
    return campaignParamNames.reduce<AnalyticsParams>((params, paramName) => {
      const value = searchParams.get(paramName);
      if (value) params[paramName] = value;
      return params;
    }, {});
  }, [searchParamsString, searchParams]);

  useEffect(() => {
    void setAnalyticsUserId(getAnalyticsUserId());
    void setAnalyticsUserProperties({
      ...getAnalyticsUserProperties(),
      locale: getLocaleFromPath(pathname),
      pathname
    });
  }, [pathname]);

  useEffect(() => {
    const now = Date.now();

    if (previousPagePath.current) {
      void trackPageEngagement(previousPagePath.current, now - pageStartedAt.current, 'route_change');
    }

    pageStartedAt.current = now;
    previousPagePath.current = pathname;
    firedScrollThresholds.current = new Set<number>();

    void trackEvent('page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
      page_referrer: document.referrer || undefined,
      locale: getLocaleFromPath(pathname),
      ...campaignParams
    });
  }, [campaignParams, pathname]);

  useEffect(() => {
    const reportCurrentPageEngagement = (reason: string) => {
      void trackPageEngagement(pathname, Date.now() - pageStartedAt.current, reason);
      pageStartedAt.current = Date.now();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        reportCurrentPageEngagement('visibility_hidden');
      }
    };

    const handlePageHide = () => {
      reportCurrentPageEngagement('pagehide');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const documentElement = document.documentElement;
      const scrollableHeight = documentElement.scrollHeight - window.innerHeight;
      const currentDepth = scrollableHeight <= 0
        ? 100
        : Math.round(((window.scrollY + window.innerHeight) / documentElement.scrollHeight) * 100);

      scrollThresholds.forEach((threshold) => {
        if (currentDepth >= threshold && !firedScrollThresholds.current.has(threshold)) {
          firedScrollThresholds.current.add(threshold);
          void trackEvent('scroll_depth', {
            scroll_percent: threshold,
            page_path: pathname,
            locale: getLocaleFromPath(pathname)
          });
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, searchParamsString]);

  return null;
}

function trackPageEngagement(pagePath: string, durationMs: number, reason: string) {
  if (durationMs < 1000) return Promise.resolve();

  return trackEvent('page_engagement', {
    page_path: pagePath,
    engagement_time_msec: Math.round(durationMs),
    time_on_page_seconds: Math.round(durationMs / 1000),
    reason,
    locale: getLocaleFromPath(pagePath)
  });
}

function getLocaleFromPath(pathname: string) {
  const locale = pathname.split('/').filter(Boolean)[0];
  return locale === 'en' || locale === 'es' ? locale : undefined;
}
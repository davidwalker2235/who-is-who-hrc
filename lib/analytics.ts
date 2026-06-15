import {debugAnalytics, getFirebaseAnalytics} from './firebase';

export type AnalyticsParamValue = string | number | boolean | null | undefined;
export type AnalyticsParams = Record<string, AnalyticsParamValue>;

const defaultStringLimit = 100;
const stringLimits: Record<string, number> = {
  page_location: 1000,
  page_referrer: 420,
  page_title: 300
};

export async function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  const normalizedEventName = normalizeEventName(eventName);
  const eventParams = sanitizeParams({
    ...getPageContext(),
    ...params
  });
  const analytics = await getFirebaseAnalytics();
  if (!analytics) {
    debugAnalytics('Event skipped because Analytics is not available.', {
      eventName: normalizedEventName,
      params: eventParams
    });
    return;
  }

  const {logEvent} = await import('firebase/analytics');
  debugAnalytics('Sending event.', {
    eventName: normalizedEventName,
    params: eventParams
  });
  logEvent(analytics, normalizedEventName, eventParams);
}

export function trackButtonClick(buttonId: string, params: AnalyticsParams = {}) {
  return trackEvent('button_click', {
    button_id: buttonId,
    ...params
  });
}

export function trackCtaClick(buttonId: string, params: AnalyticsParams = {}) {
  void trackButtonClick(buttonId, {
    button_type: 'cta',
    ...params
  });

  return trackEvent('cta_click', {
    button_id: buttonId,
    ...params
  });
}

export function trackOutboundLink(buttonId: string, linkUrl: string, params: AnalyticsParams = {}) {
  void trackButtonClick(buttonId, {
    button_type: 'outbound_link',
    target: linkUrl,
    ...params
  });

  return trackEvent('outbound_link_click', {
    button_id: buttonId,
    link_url: linkUrl,
    link_domain: getLinkDomain(linkUrl),
    outbound: true,
    ...params
  });
}

export function trackDownload(buttonId: string, fileUrl: string, fileName: string, params: AnalyticsParams = {}) {
  void trackButtonClick(buttonId, {
    button_type: 'download',
    target: fileUrl,
    ...params
  });

  return trackEvent('download_click', {
    button_id: buttonId,
    file_url: fileUrl,
    file_name: fileName,
    ...params
  });
}

export function trackModalOpen(modalId: string, params: AnalyticsParams = {}) {
  return trackEvent('modal_open', {
    modal_id: modalId,
    ...params
  });
}

export function trackModalClose(modalId: string, params: AnalyticsParams = {}) {
  return trackEvent('modal_close', {
    modal_id: modalId,
    ...params
  });
}

export function trackQuestionAnswer(params: AnalyticsParams = {}) {
  return trackEvent('question_answer', params);
}

export async function setAnalyticsUserId(userId: string | null) {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) {
    debugAnalytics('User ID skipped because Analytics is not available.');
    return;
  }

  const {setUserId} = await import('firebase/analytics');
  setUserId(analytics, userId);
}

export async function setAnalyticsUserProperties(properties: AnalyticsParams) {
  const analytics = await getFirebaseAnalytics();
  if (!analytics) {
    debugAnalytics('User properties skipped because Analytics is not available.', {
      properties: sanitizeParams(properties)
    });
    return;
  }

  const {setUserProperties} = await import('firebase/analytics');
  setUserProperties(analytics, sanitizeParams(properties));
}

function normalizeEventName(eventName: string) {
  return eventName
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function sanitizeParams(params: AnalyticsParams): Record<string, string | number | boolean> {
  return Object.entries(params).reduce<Record<string, string | number | boolean>>((result, [key, value]) => {
    if (value === null || typeof value === 'undefined') return result;

    const normalizedKey = normalizeParamKey(key);
    if (!normalizedKey) return result;

    result[normalizedKey] = typeof value === 'string'
      ? truncate(value, stringLimits[normalizedKey] ?? defaultStringLimit)
      : value;

    return result;
  }, {});
}

function normalizeParamKey(key: string) {
  return key
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function getPageContext(): AnalyticsParams {
  if (typeof window === 'undefined') return {};

  return {
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: document.title,
    locale: getLocaleFromPath(window.location.pathname)
  };
}

function getLocaleFromPath(pathname: string) {
  const locale = pathname.split('/').filter(Boolean)[0];
  return locale === 'en' || locale === 'es' ? locale : undefined;
}

function getLinkDomain(linkUrl: string) {
  try {
    return new URL(linkUrl).hostname;
  } catch {
    return undefined;
  }
}
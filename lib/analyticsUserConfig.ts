import type {AnalyticsParams} from './analytics';

export function getAnalyticsUserId(): string | null {
  return null;
}

export function getAnalyticsUserProperties(): AnalyticsParams {
  return {
    app_name: 'findyourface',
    app_environment: process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV
  };
}

export const analyticsUserIdGuidance =
  'Use an internal opaque or hashed user ID only. Do not use email, phone, DNI, names, or other directly identifying data.';
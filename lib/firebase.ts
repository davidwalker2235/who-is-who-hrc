import {getApps, initializeApp, type FirebaseApp, type FirebaseOptions} from 'firebase/app';
import type {Analytics} from 'firebase/analytics';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const requiredFirebaseConfigKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
  'measurementId'
] as const satisfies ReadonlyArray<keyof FirebaseOptions>;

let analyticsPromise: Promise<Analytics | null> | null = null;

function hasFirebaseConfig() {
  return getMissingFirebaseConfigKeys().length === 0;
}

export function getMissingFirebaseConfigKeys() {
  return requiredFirebaseConfigKeys.filter((key) => !firebaseConfig[key]);
}

export function debugAnalytics(message: string, data?: Record<string, unknown>) {
  if (!isAnalyticsDebugEnabled()) return;

  console.info(`[Firebase Analytics] ${message}`, data ?? '');
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseConfig()) return null;

  const [existingApp] = getApps();
  return existingApp ?? initializeApp(firebaseConfig);
}

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);

  analyticsPromise ??= initializeFirebaseAnalytics();
  return analyticsPromise;
}

async function initializeFirebaseAnalytics() {
  const app = getFirebaseApp();
  if (!app) {
    debugAnalytics('Analytics not initialized. Missing NEXT_PUBLIC Firebase config keys.', {
      missingKeys: getMissingFirebaseConfigKeys()
    });
    return null;
  }

  const {getAnalytics, isSupported} = await import('firebase/analytics');
  const supported = await isSupported().catch(() => false);

  if (!supported) {
    debugAnalytics('Analytics not initialized. Browser environment is not supported by Firebase Analytics.');
    return null;
  }

  debugAnalytics('Analytics initialized.', {
    projectIdConfigured: Boolean(firebaseConfig.projectId),
    measurementIdConfigured: Boolean(firebaseConfig.measurementId)
  });

  return getAnalytics(app);
}

function isAnalyticsDebugEnabled() {
  if (typeof window === 'undefined') return false;

  try {
    const params = new URLSearchParams(window.location.search);
    return params.has('analyticsDebug') || window.localStorage.getItem('analytics_debug') === 'true';
  } catch {
    return false;
  }
}
// Zero-Knowledge Storage engine with AES-GCM-256 encryption, idb-keyval (IndexedDB), and localStorage fallback
import { get, set, del } from 'idb-keyval';
import { encryptPayload, decryptPayload } from './crypto';

const SESSION_STORAGE_KEY = 'neurosynapse_session_state_v1';

export async function saveSessionState<T>(data: T): Promise<void> {
  let payloadToStore: unknown = data;
  try {
    payloadToStore = await encryptPayload(data);
  } catch (cryptoErr) {
    console.warn('ZK encryption failed, falling back to plaintext storage', cryptoErr);
  }

  try {
    // Try IndexedDB first
    await set(SESSION_STORAGE_KEY, payloadToStore);
  } catch (idbErr) {
    // Fallback to localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payloadToStore));
      }
    } catch (lsErr) {
      console.warn('Storage persistence failed in both IDB and LocalStorage', lsErr);
    }
  }
}

export async function loadSessionState<T>(): Promise<T | null> {
  try {
    const idbData = await get<unknown>(SESSION_STORAGE_KEY);
    if (idbData) {
      return await decryptPayload<T>(idbData);
    }
  } catch (idbErr) {
    console.warn('IDB read failed, attempting localStorage fallback', idbErr);
  }

  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return await decryptPayload<T>(parsed);
      }
    }
  } catch (lsErr) {
    console.warn('LocalStorage read failed', lsErr);
  }

  return null;
}

export async function clearSessionState(): Promise<void> {
  try {
    await del(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

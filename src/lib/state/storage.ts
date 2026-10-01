// Storage engine with idb-keyval (IndexedDB) and localStorage fallback
import { get, set, del } from 'idb-keyval';

const SESSION_STORAGE_KEY = 'neurosynapse_session_state_v1';

export async function saveSessionState<T>(data: T): Promise<void> {
  try {
    // Try IndexedDB first
    await set(SESSION_STORAGE_KEY, data);
  } catch (idbErr) {
    // Fallback to localStorage
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    } catch (lsErr) {
      console.warn('Storage persistence failed in both IDB and LocalStorage', lsErr);
    }
  }
}

export async function loadSessionState<T>(): Promise<T | null> {
  try {
    const idbData = await get<T>(SESSION_STORAGE_KEY);
    if (idbData) return idbData;
  } catch (idbErr) {
    console.warn('IDB read failed, attempting localStorage fallback', idbErr);
  }

  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch (lsErr) {
    console.warn('LocalStorage read failed', lsErr);
  }

  return null;
}

export async function clearSessionState(): Promise<void> {
  try {
    await del(SESSION_STORAGE_KEY);
  } catch (e) {
    // ignore
  }
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

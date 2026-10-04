/**
 * Zero-Knowledge Client-Side AES-GCM-256 Encryption Engine
 * Compliant with HIPAA ePHI and GDPR Article 9 requirements for sensitive biometric/psychometric data.
 *
 * All psychiatric indicators, CAT responses, and cognitive profiles are encrypted at rest
 * in IndexedDB / LocalStorage using a local 256-bit device key. No unencrypted clinical data
 * touches persistent storage.
 */

import { get, set } from 'idb-keyval';

const DEVICE_KEY_STORAGE_ID = 'neurosynapse_zk_device_key_v1';

export interface EncryptedEnvelope {
  __encrypted: true;
  version: 1;
  alg: 'AES-GCM-256';
  iv: string; // Base64
  ciphertext: string; // Base64
  timestamp: number;
}

// In-memory cached CryptoKey for sub-millisecond encryption/decryption
let cachedCryptoKey: CryptoKey | null = null;

/**
 * Helper: Convert Uint8Array to Base64 string
 */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper: Convert Base64 string to Uint8Array
 */
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Retrieve or generate a cryptographically secure 256-bit AES-GCM device key.
 * Key never leaves the local client device.
 */
export async function getOrCreateDeviceKey(): Promise<CryptoKey> {
  if (cachedCryptoKey) {
    return cachedCryptoKey;
  }

  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto API (subtle) is unavailable in this environment.');
  }

  // 1. Try to load existing raw key from IDB
  let rawKeyBase64: string | null = null;
  try {
    rawKeyBase64 = (await get<string>(DEVICE_KEY_STORAGE_ID)) || null;
  } catch {
    // Fall back to localStorage if IDB fails
    try {
      if (typeof localStorage !== 'undefined') {
        rawKeyBase64 = localStorage.getItem(DEVICE_KEY_STORAGE_ID);
      }
    } catch {
      rawKeyBase64 = null;
    }
  }

  let rawKeyBytes: Uint8Array;

  if (rawKeyBase64) {
    rawKeyBytes = base64ToBytes(rawKeyBase64);
  } else {
    // 2. Generate a new 256-bit cryptographically secure random key
    const generated = new Uint8Array(32);
    globalThis.crypto.getRandomValues(generated);
    rawKeyBytes = generated;
    const newKeyBase64 = bytesToBase64(rawKeyBytes);

    try {
      await set(DEVICE_KEY_STORAGE_ID, newKeyBase64);
    } catch {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(DEVICE_KEY_STORAGE_ID, newKeyBase64);
        }
      } catch (err) {
        console.warn('Failed to persist device key to persistent storage', err);
      }
    }
  }

  // 3. Import raw bytes into WebCrypto AES-GCM CryptoKey
  const importedKey = await subtle.importKey(
    'raw',
    rawKeyBytes as BufferSource,
    { name: 'AES-GCM' },
    false, // non-extractable from key object
    ['encrypt', 'decrypt']
  );

  cachedCryptoKey = importedKey;
  return importedKey;
}

/**
 * Type guard to check if an object is an EncryptedEnvelope
 */
export function isEncryptedEnvelope(value: unknown): value is EncryptedEnvelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>).__encrypted === true &&
    (value as Record<string, unknown>).alg === 'AES-GCM-256' &&
    typeof (value as Record<string, unknown>).ciphertext === 'string' &&
    typeof (value as Record<string, unknown>).iv === 'string'
  );
}

/**
 * Encrypt arbitrary serializable data with AES-GCM-256
 */
export async function encryptPayload<T>(data: T): Promise<EncryptedEnvelope> {
  const key = await getOrCreateDeviceKey();
  const subtle = globalThis.crypto.subtle;

  // Generate fresh 96-bit (12 bytes) random IV
  const iv = new Uint8Array(12);
  globalThis.crypto.getRandomValues(iv);

  const jsonString = JSON.stringify(data);
  const encodedPlaintext = new TextEncoder().encode(jsonString);

  const encryptedBuffer = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encodedPlaintext
  );

  return {
    __encrypted: true,
    version: 1,
    alg: 'AES-GCM-256',
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(encryptedBuffer)),
    timestamp: Date.now()
  };
}

/**
 * Decrypt an EncryptedEnvelope or pass through legacy plaintext data
 */
export async function decryptPayload<T>(envelopeOrData: unknown): Promise<T> {
  if (!isEncryptedEnvelope(envelopeOrData)) {
    // Legacy plaintext backward compatibility
    return envelopeOrData as T;
  }

  const key = await getOrCreateDeviceKey();
  const subtle = globalThis.crypto.subtle;

  const iv = base64ToBytes(envelopeOrData.iv);
  const ciphertext = base64ToBytes(envelopeOrData.ciphertext);

  const decryptedBuffer = await subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource
    },
    key,
    ciphertext as BufferSource
  );

  const decodedJson = new TextDecoder().decode(decryptedBuffer);
  return JSON.parse(decodedJson) as T;
}

/**
 * Reset memory cache (useful for testing or full data wipe)
 */
export function resetCryptoKeyCache(): void {
  cachedCryptoKey = null;
}

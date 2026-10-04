import { describe, it, expect, beforeEach } from 'vitest';
import {
  encryptPayload,
  decryptPayload,
  isEncryptedEnvelope,
  resetCryptoKeyCache,
  bytesToBase64,
  base64ToBytes
} from './crypto';

describe('Zero-Knowledge AES-GCM-256 Crypto Engine Tests', () => {
  beforeEach(() => {
    resetCryptoKeyCache();
  });

  it('correctly converts between Uint8Array and Base64', () => {
    const original = new Uint8Array([0, 15, 255, 128, 42, 64]);
    const b64 = bytesToBase64(original);
    const roundtrip = base64ToBytes(b64);
    expect(roundtrip).toEqual(original);
  });

  it('encrypts and decrypts structured psychometric session data round-trip', async () => {
    const sensitiveData = {
      userTheta: 2.15,
      iqScore: 132,
      monotropismMQ: 86,
      syndromeFlag: '2E_AACC_ADHD',
      bdefs: { time: 82, inhibition: 74 },
      responses: [
        { itemId: 'A1', correct: true, latency: 1250 },
        { itemId: 'B4', correct: false, latency: 890 }
      ]
    };

    const envelope = await encryptPayload(sensitiveData);

    expect(isEncryptedEnvelope(envelope)).toBe(true);
    expect(envelope.alg).toBe('AES-GCM-256');
    expect(envelope.version).toBe(1);
    expect(typeof envelope.iv).toBe('string');
    expect(typeof envelope.ciphertext).toBe('string');

    // Verify Zero-Knowledge: Plaintext should never be visible in ciphertext
    expect(envelope.ciphertext).not.toContain('2E_AACC_ADHD');
    expect(envelope.ciphertext).not.toContain('monotropismMQ');
    expect(envelope.ciphertext).not.toContain('132');

    // Decrypt and verify exact integrity
    const decrypted = await decryptPayload<typeof sensitiveData>(envelope);
    expect(decrypted).toEqual(sensitiveData);
  });

  it('produces distinct ciphertexts and IVs for repeated identical plaintext', async () => {
    const data = { secretNote: 'HIPAA and GDPR privacy protection' };

    const enc1 = await encryptPayload(data);
    const enc2 = await encryptPayload(data);

    expect(enc1.iv).not.toBe(enc2.iv);
    expect(enc1.ciphertext).not.toBe(enc2.ciphertext);

    // Both decrypt correctly
    expect(await decryptPayload(enc1)).toEqual(data);
    expect(await decryptPayload(enc2)).toEqual(data);
  });

  it('fails decryption when ciphertext is tampered with (AES-GCM integrity check)', async () => {
    const data = { score: 100 };
    const envelope = await encryptPayload(data);

    // Tamper with ciphertext by corrupting base64 bytes
    const bytes = base64ToBytes(envelope.ciphertext);
    bytes[0] = bytes[0] ^ 0xff; // flip bits
    envelope.ciphertext = bytesToBase64(bytes);

    await expect(decryptPayload(envelope)).rejects.toThrow();
  });

  it('gracefully passes through legacy unencrypted session state', async () => {
    const legacyPlaintext = {
      stage: 'STAGE_1_CAT_MATRICES',
      catResponses: [{ itemId: 'item_1', isCorrect: true }]
    };

    expect(isEncryptedEnvelope(legacyPlaintext)).toBe(false);
    const result = await decryptPayload<typeof legacyPlaintext>(legacyPlaintext);
    expect(result).toEqual(legacyPlaintext);
  });
});

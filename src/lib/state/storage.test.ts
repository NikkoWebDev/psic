import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveSessionState, loadSessionState, clearSessionState } from './storage';
import { isEncryptedEnvelope } from './crypto';

// In-memory mock for idb-keyval
const mockStore = new Map<string, unknown>();

vi.mock('idb-keyval', () => ({
  get: vi.fn(async (key: string) => mockStore.get(key)),
  set: vi.fn(async (key: string, val: unknown) => {
    mockStore.set(key, val);
  }),
  del: vi.fn(async (key: string) => {
    mockStore.delete(key);
  })
}));

describe('Zero-Knowledge Session Storage Integration Tests', () => {
  beforeEach(() => {
    mockStore.clear();
  });

  it('encrypts data at rest in storage so raw patient state is never plain text', async () => {
    const rawPatientSession = {
      stage: 'STAGE_1_CAT_MATRICES',
      thetaEAP: 1.85,
      clinicalSyndrome: '2E_AACC_ADHD',
      privateNotes: 'High masking score, severe sensory overwhelm'
    };

    await saveSessionState(rawPatientSession);

    // Inspect the actual persisted record in IDB
    const storedRecord = mockStore.get('neurosynapse_session_state_v1');
    expect(storedRecord).toBeDefined();

    // Verify it is an EncryptedEnvelope
    expect(isEncryptedEnvelope(storedRecord)).toBe(true);

    // Verify it contains no raw plaintext
    const serialized = JSON.stringify(storedRecord);
    expect(serialized).not.toContain('2E_AACC_ADHD');
    expect(serialized).not.toContain('sensory overwhelm');

    // Verify that loading it decrypts it seamlessly
    const loaded = await loadSessionState<typeof rawPatientSession>();
    expect(loaded).toEqual(rawPatientSession);
  });

  it('seamlessly loads legacy unencrypted sessions without error', async () => {
    const legacyPlainData = {
      stage: 'STAGE_3_SYMBOL_MATCH',
      thetaGs: 0.45
    };

    // Store unencrypted directly
    mockStore.set('neurosynapse_session_state_v1', legacyPlainData);

    const loaded = await loadSessionState<typeof legacyPlainData>();
    expect(loaded).toEqual(legacyPlainData);
  });

  it('clears storage state completely upon clearSessionState()', async () => {
    mockStore.set('neurosynapse_session_state_v1', { some: 'data' });
    await clearSessionState();
    expect(mockStore.has('neurosynapse_session_state_v1')).toBe(false);
  });
});

/**
 * EncryptionService port (ADR-003). Envelope encryption for PHI/PII fields.
 * KMS binding deferred to B-006; callers are insulated from that choice.
 * Decryption of PHI MUST be accompanied by an audit event (COMPLIANCE.md).
 */
export interface EncryptionService {
  /**
   * Authenticated encryption (AES-256-GCM, ADR-003). Output is non-deterministic:
   * a fresh random IV is generated per call and the IV + auth tag MUST be
   * encoded into the returned ciphertext envelope so `decrypt` can verify it.
   */
  encrypt(plaintext: string): Promise<string>;
  /** Reverses `encrypt`, verifying the GCM auth tag; throws on tamper/mismatch. */
  decrypt(ciphertext: string): Promise<string>;
  /**
   * Deterministic, keyed blind index (HMAC, ADR-003) for exact-match lookups on
   * encrypted fields (e.g. phone number). This is a one-way search token, NOT a
   * reversible cipher — there is intentionally no inverse operation.
   */
  blindIndex(plaintext: string): Promise<string>;
}

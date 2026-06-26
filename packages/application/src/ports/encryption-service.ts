/**
 * EncryptionService port (ADR-003). Envelope encryption for PHI/PII fields.
 * KMS binding deferred to B-006; callers are insulated from that choice.
 * Decryption of PHI MUST be accompanied by an audit event (COMPLIANCE.md).
 */
export interface EncryptionService {
  encrypt(plaintext: string): Promise<string>;
  decrypt(ciphertext: string): Promise<string>;
  /** Deterministic encryption for searchable/blind-index fields (ADR-003). */
  encryptDeterministic(plaintext: string): Promise<string>;
}

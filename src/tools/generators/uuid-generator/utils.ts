/**
 * UUID Generator Tool - Core Utilities
 *
 * Comprehensive implementation of UUID algorithms v1, v3, v4, v5, and NIL
 * Following RFC 4122 specifications for proper UUID generation
 */

import type {
  UUIDVersion,
  UUIDFormat,
  UUIDGenerationConfig,
  GeneratedUUID,
  UUIDBatchResult,
  UUIDValidationResult,
  UUIDStats
} from './types';
import { UUID_PATTERNS } from './types';

/**
 * Crypto utilities for secure random generation
 */
class CryptoUtils {
  private static getRandomValues(length: number): Uint8Array {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      return array;
    } else {
      // Fallback for environments without crypto (should not happen in browsers)
      const array = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }
  }

  static generateRandomBytes(count: number): number[] {
    const bytes = this.getRandomValues(count);
    return Array.from(bytes);
  }

  static async generateHash(algorithm: 'SHA-1' | 'SHA-256', data: string): Promise<Uint8Array> {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await window.crypto.subtle.digest(algorithm, dataBuffer);
      return new Uint8Array(hashBuffer);
    }

    // Fallback hash implementation (simple but not cryptographically secure)
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    let hash = 0;

    for (let i = 0; i < dataBytes.length; i++) {
      hash = ((hash << 5) - hash + dataBytes[i]) & 0xffffffff;
    }

    const result = new Uint8Array(algorithm === 'SHA-1' ? 20 : 32);
    for (let i = 0; i < result.length; i++) {
      result[i] = (hash + i) & 0xff;
    }

    return result;
  }
}

/**
 * UUID v1 Generator (timestamp-based)
 */
class UUIDv1Generator {
  private static clockSequence: number | null = null;
  private static lastTimestamp: number | null = null;
  private static nodeId: number[] | null = null;

  private static getTimestamp(): number {
    // UUID v1 timestamp: 100-nanosecond intervals since 00:00:00.00, 15 October 1582
    const UUID_EPOCH = Date.UTC(1582, 9, 15);
    const currentTime = Date.now();
    return (currentTime - UUID_EPOCH) * 10000;
  }

  private static getClockSequence(): number {
    if (this.clockSequence === null ||
        (this.lastTimestamp !== null && this.getTimestamp() <= this.lastTimestamp)) {
      this.clockSequence = Math.floor(Math.random() * 0x4000);
    }
    return this.clockSequence;
  }

  private static getNodeId(): number[] {
    if (this.nodeId === null) {
      // Generate a random 48-bit node ID with multicast bit set (since we don't have real MAC)
      this.nodeId = CryptoUtils.generateRandomBytes(6);
      this.nodeId[0] |= 0x01; // Set multicast bit
    }
    return this.nodeId;
  }

  static generate(): { uuid: string; timestamp: number; node: string; clockSequence: number } {
    const timestamp = this.getTimestamp();
    const clockSeq = this.getClockSequence();
    const node = this.getNodeId();

    this.lastTimestamp = timestamp;

    // Split timestamp into parts
    const timeLow = timestamp & 0xffffffff;
    const timeMid = (timestamp >>> 32) & 0xffff;
    const timeHiAndVersion = ((timestamp >>> 48) & 0x0fff) | 0x1000; // Version 1

    // Split clock sequence
    const clockSeqHiAndReserved = ((clockSeq >>> 8) & 0x3f) | 0x80; // Variant bits
    const clockSeqLow = clockSeq & 0xff;

    const uuidBytes = [
      ...this.numberToBytes(timeLow, 4),
      ...this.numberToBytes(timeMid, 2),
      ...this.numberToBytes(timeHiAndVersion, 2),
      clockSeqHiAndReserved,
      clockSeqLow,
      ...node
    ];

    const uuid = this.bytesToUUID(uuidBytes);

    return {
      uuid,
      timestamp,
      node: node.map(b => b.toString(16).padStart(2, '0')).join(':'),
      clockSequence: clockSeq
    };
  }

  private static numberToBytes(num: number, byteCount: number): number[] {
    const bytes: number[] = [];
    for (let i = byteCount - 1; i >= 0; i--) {
      bytes.push((num >>> (i * 8)) & 0xff);
    }
    return bytes;
  }

  private static bytesToUUID(bytes: number[]): string {
    const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20, 32)
    ].join('-');
  }
}

/**
 * UUID v3/v5 Generator (namespace-based)
 */
class UUIDNamespaceGenerator {
  static async generateV3(namespace: string, name: string): Promise<string> {
    return this.generateNamespaceBased(namespace, name, 'SHA-1', 3);
  }

  static async generateV5(namespace: string, name: string): Promise<string> {
    return this.generateNamespaceBased(namespace, name, 'SHA-256', 5);
  }

  private static async generateNamespaceBased(
    namespace: string,
    name: string,
    algorithm: 'SHA-1' | 'SHA-256',
    version: number
  ): Promise<string> {
    // Convert namespace UUID to bytes
    const namespaceBytes = this.uuidToBytes(namespace);

    // Create data to hash
    const nameBytes = new TextEncoder().encode(name);
    const data = new Uint8Array(namespaceBytes.length + nameBytes.length);
    data.set(namespaceBytes, 0);
    data.set(nameBytes, namespaceBytes.length);

    // Generate hash
    const hashBytes = await CryptoUtils.generateHash(algorithm, new TextDecoder().decode(data));

    // Take first 16 bytes for UUID
    const uuidBytes = Array.from(hashBytes.slice(0, 16));

    // Set version and variant bits
    uuidBytes[6] = (uuidBytes[6] & 0x0f) | (version << 4); // Version
    uuidBytes[8] = (uuidBytes[8] & 0x3f) | 0x80; // Variant

    return this.bytesToUUID(uuidBytes);
  }

  private static uuidToBytes(uuid: string): Uint8Array {
    const cleanUuid = uuid.replace(/[^0-9a-f]/gi, '');
    const bytes = new Uint8Array(16);

    for (let i = 0; i < 16; i++) {
      bytes[i] = parseInt(cleanUuid.substring(i * 2, i * 2 + 2), 16);
    }

    return bytes;
  }

  private static bytesToUUID(bytes: number[]): string {
    const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20, 32)
    ].join('-');
  }
}

/**
 * UUID v4 Generator (random)
 */
class UUIDv4Generator {
  static generate(): string {
    const randomBytes = CryptoUtils.generateRandomBytes(16);

    // Set version (4) and variant bits
    randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Version 4
    randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Variant

    const hex = randomBytes.map(b => b.toString(16).padStart(2, '0')).join('');

    return [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20, 32)
    ].join('-');
  }
}

/**
 * Main UUID Generator Class
 */
export class UUIDGenerator {
  private static stats: UUIDStats = {
    generatedCount: 0,
    validatedCount: 0,
    errorCount: 0,
    averageTime: 0,
    peakGenerationRate: 0
  };

  /**
   * Generate a single UUID
   */
  static async generateUUID(config: UUIDGenerationConfig): Promise<GeneratedUUID> {
    const startTime = performance.now();

    try {
      let uuid: string;
      let timestamp: number | undefined;
      let node: string | undefined;
      let clockSequence: number | undefined;

      switch (config.version) {
        case 'v1':
          const v1Result = UUIDv1Generator.generate();
          uuid = v1Result.uuid;
          timestamp = v1Result.timestamp;
          node = v1Result.node;
          clockSequence = v1Result.clockSequence;
          break;

        case 'v3':
          if (!config.namespace || !config.name) {
            throw new Error('Namespace and name are required for UUID v3');
          }
          uuid = await UUIDNamespaceGenerator.generateV3(config.namespace, config.name);
          break;

        case 'v4':
          uuid = UUIDv4Generator.generate();
          break;

        case 'v5':
          if (!config.namespace || !config.name) {
            throw new Error('Namespace and name are required for UUID v5');
          }
          uuid = await UUIDNamespaceGenerator.generateV5(config.namespace, config.name);
          break;

        case 'nil':
          uuid = '00000000-0000-0000-0000-000000000000';
          break;

        default:
          throw new Error(`Unsupported UUID version: ${config.version}`);
      }

      // Format the UUID
      const formattedUUID = this.formatUUID(uuid, config.format);

      const endTime = performance.now();
      this.updateStats(endTime - startTime);

      return {
        uuid: formattedUUID,
        version: config.version,
        format: config.format,
        timestamp,
        node,
        clockSequence,
        generatedAt: new Date()
      };

    } catch (error) {
      this.stats.errorCount++;
      throw error;
    }
  }

  /**
   * Generate multiple UUIDs
   */
  static async generateBatch(config: UUIDGenerationConfig): Promise<UUIDBatchResult> {
    const startTime = performance.now();
    const uuids: GeneratedUUID[] = [];
    const maxCount = Math.min(config.count, 1000); // Limit to 1000

    for (let i = 0; i < maxCount; i++) {
      const uuid = await this.generateUUID({
        ...config,
        count: 1
      });
      uuids.push(uuid);
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Update peak generation rate
    const generationRate = maxCount / (totalTime / 1000);
    if (generationRate > this.stats.peakGenerationRate) {
      this.stats.peakGenerationRate = generationRate;
    }

    return {
      uuids,
      totalGenerated: maxCount,
      generationTime: totalTime,
      config
    };
  }

  /**
   * Validate UUID format and extract information
   */
  static validateUUID(uuid: string): UUIDValidationResult {
    const startTime = performance.now();
    this.stats.validatedCount++;

    const result: UUIDValidationResult = {
      isValid: false,
      format: this.detectFormat(uuid),
      errors: [],
      suggestions: []
    };

    try {
      // Clean the UUID for analysis
      const cleanUUID = this.cleanUUID(uuid);

      // Basic format validation
      if (!UUID_PATTERNS.ANY.test(uuid)) {
        result.errors.push('Invalid UUID format');
        result.suggestions.push('UUID should be 32 hexadecimal digits, displayed in five groups separated by hyphens');
        return result;
      }

      // Check for NIL UUID
      if (UUID_PATTERNS.NIL.test(cleanUUID)) {
        result.isValid = true;
        result.version = 'nil';
        return result;
      }

      // Extract version from cleaned UUID
      const versionDigit = parseInt(cleanUUID.charAt(14), 16);

      if (versionDigit >= 1 && versionDigit <= 5) {
        result.version = `v${versionDigit}` as UUIDVersion;
        result.isValid = true;

        // Extract additional information for v1
        if (versionDigit === 1) {
          try {
            const info = this.extractV1Info(cleanUUID);
            result.timestamp = info.timestamp;
            result.node = info.node;
            result.clockSequence = info.clockSequence;
          } catch (error) {
            result.errors.push('Could not extract v1 timestamp information');
          }
        }
      } else {
        result.errors.push(`Unknown UUID version: ${versionDigit}`);
        result.suggestions.push('Supported versions are 1, 3, 4, and 5');
      }

      // Validate variant bits
      const variantChar = cleanUUID.charAt(19);
      const variantBits = parseInt(variantChar, 16);

      if ((variantBits & 0x8) === 0) {
        result.errors.push('Invalid variant bits (should be 10xx)');
      } else if ((variantBits & 0xC) !== 0x8) {
        result.errors.push('Non-standard variant bits detected');
        result.suggestions.push('Standard UUIDs should have variant bits 10xx');
      }

    } catch (error) {
      result.errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const endTime = performance.now();
    this.updateStats(endTime - startTime);

    return result;
  }

  /**
   * Format UUID according to specified format
   */
  static formatUUID(uuid: string, format: UUIDFormat): string {
    const clean = this.cleanUUID(uuid);

    switch (format) {
      case 'standard':
        return clean.toLowerCase();
      case 'uppercase':
        return clean.toUpperCase();
      case 'lowercase':
        return clean.toLowerCase();
      case 'no-hyphens':
        return clean.replace(/-/g, '').toLowerCase();
      case 'braces':
        return `{${clean.toLowerCase()}}`;
      case 'brackets':
        return `[${clean.toLowerCase()}]`;
      default:
        return clean.toLowerCase();
    }
  }

  /**
   * Detect UUID format
   */
  private static detectFormat(uuid: string): UUIDFormat {
    if (uuid.startsWith('{') && uuid.endsWith('}')) return 'braces';
    if (uuid.startsWith('[') && uuid.endsWith(']')) return 'brackets';
    if (!uuid.includes('-')) return 'no-hyphens';
    if (uuid === uuid.toUpperCase()) return 'uppercase';
    return 'standard';
  }

  /**
   * Clean UUID for processing
   */
  private static cleanUUID(uuid: string): string {
    // Remove braces/brackets
    let clean = uuid.replace(/^[\{\[]|[\}\]]$/g, '');

    // Add hyphens if missing
    if (!clean.includes('-') && clean.length === 32) {
      clean = [
        clean.substring(0, 8),
        clean.substring(8, 12),
        clean.substring(12, 16),
        clean.substring(16, 20),
        clean.substring(20, 32)
      ].join('-');
    }

    return clean;
  }

  /**
   * Extract v1 UUID information
   */
  private static extractV1Info(uuid: string): { timestamp: number; node: string; clockSequence: number } {
    const clean = uuid.replace(/-/g, '');

    // Extract timestamp (60-bit)
    const timeLow = parseInt(clean.substring(0, 8), 16);
    const timeMid = parseInt(clean.substring(8, 12), 16);
    const timeHi = parseInt(clean.substring(12, 16), 16) & 0x0fff;

    const timestamp = (timeHi << 48) | (timeMid << 32) | timeLow;

    // Extract clock sequence (14-bit)
    const clockSeqHi = parseInt(clean.substring(16, 18), 16) & 0x3f;
    const clockSeqLow = parseInt(clean.substring(18, 20), 16);
    const clockSequence = (clockSeqHi << 8) | clockSeqLow;

    // Extract node (48-bit)
    const nodeHex = clean.substring(20, 32);
    const node = [
      nodeHex.substring(0, 2),
      nodeHex.substring(2, 4),
      nodeHex.substring(4, 6),
      nodeHex.substring(6, 8),
      nodeHex.substring(8, 10),
      nodeHex.substring(10, 12)
    ].join(':');

    return { timestamp, node, clockSequence };
  }

  /**
   * Update performance statistics
   */
  private static updateStats(executionTime: number): void {
    this.stats.generatedCount++;

    // Update average time using exponential moving average
    const alpha = 0.1;
    this.stats.averageTime = this.stats.averageTime * (1 - alpha) + executionTime * alpha;
  }

  /**
   * Get current statistics
   */
  static getStats(): UUIDStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  static resetStats(): void {
    this.stats = {
      generatedCount: 0,
      validatedCount: 0,
      errorCount: 0,
      averageTime: 0,
      peakGenerationRate: 0
    };
  }

  /**
   * Export UUIDs to different formats
   */
  static exportUUIDs(uuids: GeneratedUUID[], format: 'csv' | 'json' | 'txt', includeMetadata = true): string {
    switch (format) {
      case 'csv':
        if (!includeMetadata) {
          return uuids.map(u => u.uuid).join('\n');
        }

        const headers = ['UUID', 'Version', 'Format', 'Generated At', 'Timestamp', 'Node', 'Clock Sequence'];
        const rows = uuids.map(u => [
          u.uuid,
          u.version,
          u.format,
          u.generatedAt.toISOString(),
          u.timestamp || '',
          u.node || '',
          u.clockSequence || ''
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');

      case 'json':
        return JSON.stringify(includeMetadata ? uuids : uuids.map(u => u.uuid), null, 2);

      case 'txt':
        return uuids.map(u => u.uuid).join('\n');

      default:
        return uuids.map(u => u.uuid).join('\n');
    }
  }
}

/**
 * Utility functions for UUID operations
 */
export const UUIDUtils = {
  /**
   * Check if two UUIDs are equal (case-insensitive, format-independent)
   */
  areEqual(uuid1: string, uuid2: string): boolean {
    const clean1 = uuid1.replace(/[^0-9a-f]/gi, '').toLowerCase();
    const clean2 = uuid2.replace(/[^0-9a-f]/gi, '').toLowerCase();
    return clean1 === clean2;
  },

  /**
   * Generate multiple random UUIDs for testing uniqueness
   */
  async testUniqueness(count: number): Promise<{ unique: boolean; collisions: string[] }> {
    const uuids = new Set<string>();
    const collisions: string[] = [];

    for (let i = 0; i < count; i++) {
      const uuid = await UUIDGenerator.generateUUID({
        version: 'v4',
        format: 'standard',
        count: 1
      });

      if (uuids.has(uuid.uuid)) {
        collisions.push(uuid.uuid);
      } else {
        uuids.add(uuid.uuid);
      }
    }

    return {
      unique: collisions.length === 0,
      collisions
    };
  },

  /**
   * Parse UUID and extract all available information
   */
  parseUUID(uuid: string): UUIDValidationResult & { cleanUUID: string } {
    const validation = UUIDGenerator.validateUUID(uuid);
    const cleanUUID = uuid.replace(/[^0-9a-f-]/gi, '').toLowerCase();

    return {
      ...validation,
      cleanUUID
    };
  }
};
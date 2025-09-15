/**
 * Hash Generator Unit Tests
 * Comprehensive test coverage for all hash generation functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateHash,
  generateHashFromFile,
  generateBatchHashes,
  compareHashes,
  formatHash,
  getAvailableAlgorithms,
  isAlgorithmSupported,
  getRecommendedAlgorithm,
  getDefaultOptions,
  validateHash,
  calculateHashStats,
  ALGORITHM_INFO
} from '../../../src/tools/encoders/hash-generator/utils';
import type {
  HashOptions,
  BatchHashInput,
  HashResult,
  HashAlgorithm
} from '../../../src/tools/encoders/hash-generator/types';

// Mock Web Crypto API for testing
const mockSubtle = {
  digest: vi.fn()
};

Object.defineProperty(global, 'crypto', {
  value: {
    subtle: mockSubtle
  }
});

// Mock performance for timing tests
Object.defineProperty(global, 'performance', {
  value: {
    now: vi.fn(() => 1000)
  }
});

describe('Hash Generator Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDefaultOptions', () => {
    it('should return default options with SHA-256', () => {
      const options = getDefaultOptions();

      expect(options).toEqual({
        algorithm: 'sha256',
        format: 'hex',
        uppercase: false,
        withSeparators: false,
        enableRealtime: true,
        enableFileUpload: true,
        enableBatchProcessing: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxBatchSize: 100
      });
    });
  });

  describe('getAvailableAlgorithms', () => {
    it('should return all available algorithms', () => {
      const algorithms = getAvailableAlgorithms();

      expect(algorithms).toHaveLength(5);
      expect(algorithms.map(a => a.algorithm)).toEqual(['md5', 'sha1', 'sha256', 'sha512', 'crc32']);
    });

    it('should include algorithm metadata', () => {
      const algorithms = getAvailableAlgorithms();
      const sha256 = algorithms.find(a => a.algorithm === 'sha256');

      expect(sha256).toEqual({
        name: 'SHA-256',
        algorithm: 'sha256',
        description: 'Secure and widely supported. Recommended for most use cases.',
        outputLength: 64,
        securityLevel: 'high',
        speed: 'medium',
        recommended: true
      });
    });
  });

  describe('isAlgorithmSupported', () => {
    it('should return true for SHA algorithms when crypto is available', () => {
      expect(isAlgorithmSupported('sha256')).toBe(true);
      expect(isAlgorithmSupported('sha512')).toBe(true);
      expect(isAlgorithmSupported('sha1')).toBe(true);
    });

    it('should return true for CRC32 (custom implementation)', () => {
      expect(isAlgorithmSupported('crc32')).toBe(true);
    });

    it('should return false for MD5 (not implemented)', () => {
      expect(isAlgorithmSupported('md5')).toBe(false);
    });
  });

  describe('getRecommendedAlgorithm', () => {
    it('should return SHA-256 as recommended', () => {
      expect(getRecommendedAlgorithm()).toBe('sha256');
    });
  });

  describe('formatHash', () => {
    const testHash = 'abcdef123456';

    it('should format hash with lowercase by default', () => {
      const formatted = formatHash(testHash);
      expect(formatted).toBe('abcdef123456');
    });

    it('should format hash with uppercase when requested', () => {
      const formatted = formatHash(testHash, false, true);
      expect(formatted).toBe('ABCDEF123456');
    });

    it('should add separators when requested', () => {
      const formatted = formatHash(testHash, true, false);
      expect(formatted).toBe('ab:cd:ef:12:34:56');
    });

    it('should combine uppercase and separators', () => {
      const formatted = formatHash(testHash, true, true);
      expect(formatted).toBe('AB:CD:EF:12:34:56');
    });

    it('should not add separators for short hashes', () => {
      const shortHash = '12345678';
      const formatted = formatHash(shortHash, true, false);
      expect(formatted).toBe('12345678');
    });
  });

  describe('generateHash', () => {
    beforeEach(() => {
      // Mock crypto.subtle.digest to return a predictable hash
      const mockHashBuffer = new ArrayBuffer(32); // SHA-256 size
      const mockHashArray = new Uint8Array(mockHashBuffer);
      mockHashArray.fill(0xab); // Fill with 0xab for predictable output

      mockSubtle.digest.mockResolvedValue(mockHashBuffer);

      // Mock performance timing
      vi.mocked(performance.now).mockReturnValueOnce(1000).mockReturnValueOnce(1005);
    });

    it('should generate SHA-256 hash successfully', async () => {
      const result = await generateHash('test', { algorithm: 'sha256', format: 'hex', uppercase: false, withSeparators: false });

      expect(result.success).toBe(true);
      expect(result.hash).toBe('abababababababababababababababababababababababababababababababab');
      expect(result.algorithm).toBe('sha256');
      expect(result.format).toBe('hex');
      expect(result.processingTime).toBe(5); // Mock timing
      expect(mockSubtle.digest).toHaveBeenCalled();
    });

    it('should generate hash in base64 format', async () => {
      const result = await generateHash('test', { algorithm: 'sha256', format: 'base64', uppercase: false, withSeparators: false });

      expect(result.success).toBe(true);
      expect(result.format).toBe('base64');
      expect(result.hash).toMatch(/^[A-Za-z0-9+/]+=*$/); // Base64 pattern
    });

    it('should generate hash with uppercase formatting', async () => {
      const result = await generateHash('test', { algorithm: 'sha256', format: 'hex', uppercase: true, withSeparators: false });

      expect(result.success).toBe(true);
      expect(result.hash).toMatch(/^[A-F0-9]+$/); // Uppercase hex pattern
    });

    it('should handle empty input', async () => {
      const result = await generateHash('');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Input cannot be empty');
    });

    it('should handle unsupported algorithm', async () => {
      const result = await generateHash('test', { algorithm: 'md5' as HashAlgorithm, format: 'hex', uppercase: false, withSeparators: false });

      expect(result.success).toBe(false);
      expect(result.error).toBe('MD5 algorithm requires a crypto library for full implementation');
    });

    it('should handle CRC32 algorithm', async () => {
      const result = await generateHash('test', { algorithm: 'crc32', format: 'hex', uppercase: false, withSeparators: false });

      expect(result.success).toBe(true);
      expect(result.algorithm).toBe('crc32');
      expect(result.hash).toHaveLength(8); // CRC32 is 4 bytes = 8 hex chars
    });

    it('should handle crypto API errors', async () => {
      mockSubtle.digest.mockRejectedValue(new Error('Crypto API error'));

      const result = await generateHash('test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Crypto API error');
    });

    it('should track input size', async () => {
      const testInput = 'hello world';
      const result = await generateHash(testInput);

      expect(result.success).toBe(true);
      expect(result.inputSize).toBe(new TextEncoder().encode(testInput).length);
    });
  });

  describe('generateHashFromFile', () => {
    beforeEach(() => {
      const mockHashBuffer = new ArrayBuffer(32);
      const mockHashArray = new Uint8Array(mockHashBuffer);
      mockHashArray.fill(0xcd);

      mockSubtle.digest.mockResolvedValue(mockHashBuffer);

      // Mock performance timing
      vi.mocked(performance.now).mockReturnValueOnce(1000).mockReturnValueOnce(1005);
    });

    it('should generate hash from file successfully', async () => {
      // Create a proper mock file with arrayBuffer method
      const mockFile = {
        name: 'test.txt',
        size: 12,
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(12))
      } as any;

      const result = await generateHashFromFile(mockFile);

      expect(result.success).toBe(true);
      expect(result.fileName).toBe('test.txt');
      expect(result.fileSize).toBe(12);
      expect(result.hash).toBeDefined();
      expect(typeof result.processingTime).toBe('number');
    });

    it('should handle missing file', async () => {
      const result = await generateHashFromFile(null as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No file provided');
    });

    it('should handle file size limit', async () => {
      const mockFile = {
        name: 'large.txt',
        size: 11 * 1024 * 1024, // 11MB
        arrayBuffer: vi.fn()
      } as any;

      const result = await generateHashFromFile(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toContain('File size exceeds maximum limit');
    });

    it('should handle file read errors', async () => {
      // Create a mock file that will cause arrayBuffer() to fail
      const mockFile = {
        name: 'test.txt',
        size: 100,
        arrayBuffer: vi.fn().mockRejectedValue(new Error('File read error'))
      } as any;

      const result = await generateHashFromFile(mockFile);

      expect(result.success).toBe(false);
      expect(result.error).toBe('File read error');
    });
  });

  describe('generateBatchHashes', () => {
    beforeEach(() => {
      const mockHashBuffer = new ArrayBuffer(32);
      const mockHashArray = new Uint8Array(mockHashBuffer);
      mockHashArray.fill(0xef);

      mockSubtle.digest.mockResolvedValue(mockHashBuffer);

      // Mock performance timing for batch processing
      vi.mocked(performance.now)
        .mockReturnValueOnce(1000) // Start time
        .mockReturnValueOnce(1002) // First hash
        .mockReturnValueOnce(1004) // Second hash
        .mockReturnValueOnce(1005); // End time
    });

    it('should generate hashes for multiple inputs', async () => {
      const inputs: BatchHashInput[] = [
        { id: '1', content: 'first', name: 'First Item' },
        { id: '2', content: 'second', name: 'Second Item' }
      ];

      const result = await generateBatchHashes(inputs);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
      expect(result.totalProcessed).toBe(2);
      expect(result.totalTime).toBe(5);

      const firstResult = result.results![0];
      expect(firstResult.id).toBe('1');
      expect(firstResult.name).toBe('First Item');
      expect(firstResult.hash).toBeDefined();
    });

    it('should handle empty inputs array', async () => {
      const result = await generateBatchHashes([]);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No inputs provided');
    });

    it('should handle null inputs', async () => {
      const result = await generateBatchHashes(null as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No inputs provided');
    });

    it('should handle batch size limit', async () => {
      const largeInputs = Array.from({ length: 101 }, (_, i) => ({
        id: i.toString(),
        content: `content ${i}`
      }));

      const result = await generateBatchHashes(largeInputs);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Batch size exceeds maximum limit');
    });

    it('should handle individual hash failures', async () => {
      mockSubtle.digest.mockRejectedValue(new Error('Hash failed'));

      const inputs: BatchHashInput[] = [
        { id: '1', content: 'test' }
      ];

      const result = await generateBatchHashes(inputs);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to hash input 1');
    });
  });

  describe('validateHash', () => {
    it('should validate SHA-256 hex hash', () => {
      const validSha256 = 'a'.repeat(64); // 64 hex characters
      const validation = validateHash(validSha256, 'sha256');

      expect(validation.isValid).toBe(true);
      expect(validation.algorithm).toBe('sha256');
      expect(validation.format).toBe('hex');
      expect(validation.length).toBe(64);
      expect(validation.expectedLength).toBe(64);
    });

    it('should validate CRC32 hex hash', () => {
      const validCrc32 = 'abcdef12'; // 8 hex characters
      const validation = validateHash(validCrc32, 'crc32');

      expect(validation.isValid).toBe(true);
      expect(validation.algorithm).toBe('crc32');
      expect(validation.format).toBe('hex');
      expect(validation.length).toBe(8);
      expect(validation.expectedLength).toBe(8);
    });

    it('should detect base64 format', () => {
      // Simple base64 string test
      const validBase64 = 'SGVsbG8gV29ybGQ=';
      const validation = validateHash(validBase64, 'sha256');

      expect(validation.format).toBe('base64');
      // Note: The isValid check depends on the base64 length calculation in utils
    });

    it('should reject invalid hex length', () => {
      const invalidSha256 = 'a'.repeat(63); // 63 hex characters (should be 64)
      const validation = validateHash(invalidSha256, 'sha256');

      expect(validation.isValid).toBe(false);
      expect(validation.length).toBe(63);
      expect(validation.expectedLength).toBe(64);
    });

    it('should reject empty hash', () => {
      const validation = validateHash('', 'sha256');

      expect(validation.isValid).toBe(false);
    });

    it('should reject invalid characters', () => {
      const invalidHash = 'xyz123'; // Contains invalid hex characters
      const validation = validateHash(invalidHash, 'crc32');

      expect(validation.isValid).toBe(false);
    });
  });

  describe('compareHashes', () => {
    it('should compare matching hashes', () => {
      const hash1 = 'abcdef123456';
      const hash2 = 'ABCDEF123456'; // Same but uppercase

      const comparison = compareHashes(hash1, hash2, 'sha256');

      expect(comparison.match).toBe(true);
      expect(comparison.hash1).toBe('abcdef123456');
      expect(comparison.hash2).toBe('abcdef123456');
      expect(comparison.algorithm).toBe('sha256');
      expect(comparison.similarity).toBe(1);
    });

    it('should compare non-matching hashes', () => {
      const hash1 = 'abcdef123456';
      const hash2 = 'fedcba654321';

      const comparison = compareHashes(hash1, hash2, 'sha256');

      expect(comparison.match).toBe(false);
      expect(comparison.similarity).toBeLessThan(1);
    });

    it('should normalize hashes with separators', () => {
      const hash1 = 'ab:cd:ef:12:34:56';
      const hash2 = 'abcdef123456';

      const comparison = compareHashes(hash1, hash2, 'sha256');

      expect(comparison.match).toBe(true);
    });

    it('should calculate partial similarity', () => {
      const hash1 = 'abcdef123456';
      const hash2 = 'abcdef654321'; // First 6 chars match

      const comparison = compareHashes(hash1, hash2, 'sha256');

      expect(comparison.match).toBe(false);
      expect(comparison.similarity).toBe(0.5); // 6 out of 12 characters match
    });
  });

  describe('calculateHashStats', () => {
    it('should calculate stats from multiple results', () => {
      const results: HashResult[] = [
        {
          success: true,
          algorithm: 'sha256',
          processingTime: 10,
          inputSize: 100
        },
        {
          success: true,
          algorithm: 'sha256',
          processingTime: 20,
          inputSize: 200
        },
        {
          success: true,
          algorithm: 'sha256',
          processingTime: 15,
          inputSize: 150
        }
      ];

      const stats = calculateHashStats(results);

      expect(stats).not.toBeNull();
      expect(stats!.algorithm).toBe('sha256');
      expect(stats!.totalHashes).toBe(3);
      expect(stats!.totalDataProcessed).toBe(450);
      expect(stats!.averageProcessingTime).toBe(15);
      expect(stats!.fastestTime).toBe(10);
      expect(stats!.slowestTime).toBe(20);
    });

    it('should handle empty results', () => {
      const stats = calculateHashStats([]);
      expect(stats).toBeNull();
    });

    it('should handle null input', () => {
      const stats = calculateHashStats(null as any);
      expect(stats).toBeNull();
    });

    it('should filter out failed results', () => {
      const results: HashResult[] = [
        {
          success: true,
          algorithm: 'sha256',
          processingTime: 10,
          inputSize: 100
        },
        {
          success: false,
          error: 'Failed'
        },
        {
          success: true,
          algorithm: 'sha256',
          processingTime: 20,
          inputSize: 200
        }
      ];

      const stats = calculateHashStats(results);

      expect(stats!.totalHashes).toBe(2); // Only successful results
      expect(stats!.averageProcessingTime).toBe(15);
    });
  });

  describe('ALGORITHM_INFO', () => {
    it('should contain all expected algorithms', () => {
      expect(ALGORITHM_INFO).toHaveProperty('md5');
      expect(ALGORITHM_INFO).toHaveProperty('sha1');
      expect(ALGORITHM_INFO).toHaveProperty('sha256');
      expect(ALGORITHM_INFO).toHaveProperty('sha512');
      expect(ALGORITHM_INFO).toHaveProperty('crc32');
    });

    it('should mark deprecated algorithms', () => {
      expect(ALGORITHM_INFO.md5.deprecated).toBe(true);
      expect(ALGORITHM_INFO.sha1.deprecated).toBe(true);
      expect(ALGORITHM_INFO.sha256.deprecated).toBeUndefined();
    });

    it('should mark recommended algorithms', () => {
      expect(ALGORITHM_INFO.sha256.recommended).toBe(true);
      expect(ALGORITHM_INFO.sha512.recommended).toBe(true);
      expect(ALGORITHM_INFO.md5.recommended).toBe(false);
    });

    it('should have correct output lengths', () => {
      expect(ALGORITHM_INFO.md5.outputLength).toBe(32);
      expect(ALGORITHM_INFO.sha1.outputLength).toBe(40);
      expect(ALGORITHM_INFO.sha256.outputLength).toBe(64);
      expect(ALGORITHM_INFO.sha512.outputLength).toBe(128);
      expect(ALGORITHM_INFO.crc32.outputLength).toBe(8);
    });
  });
});
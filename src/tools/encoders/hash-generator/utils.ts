/**
 * Hash Generator Utilities
 * Comprehensive hash generation with multiple algorithms
 */

import type {
  HashAlgorithm,
  HashOptions,
  HashResult,
  BatchHashInput,
  BatchHashResult,
  FileHashResult,
  HashValidation,
  HashComparison,
  AlgorithmInfo,
  HashStats,
  HashGenerationOptions
} from './types';

/**
 * Algorithm Information Database
 */
export const ALGORITHM_INFO: Record<HashAlgorithm, AlgorithmInfo> = {
  md5: {
    name: 'MD5',
    algorithm: 'md5',
    description: 'Fast but cryptographically broken. Use only for non-security purposes.',
    outputLength: 32,
    securityLevel: 'low',
    speed: 'fast',
    recommended: false,
    deprecated: true
  },
  sha1: {
    name: 'SHA-1',
    algorithm: 'sha1',
    description: 'Deprecated for security. Use for legacy compatibility only.',
    outputLength: 40,
    securityLevel: 'low',
    speed: 'fast',
    recommended: false,
    deprecated: true
  },
  sha256: {
    name: 'SHA-256',
    algorithm: 'sha256',
    description: 'Secure and widely supported. Recommended for most use cases.',
    outputLength: 64,
    securityLevel: 'high',
    speed: 'medium',
    recommended: true
  },
  sha512: {
    name: 'SHA-512',
    algorithm: 'sha512',
    description: 'Most secure option. Use for high-security requirements.',
    outputLength: 128,
    securityLevel: 'high',
    speed: 'slow',
    recommended: true
  },
  crc32: {
    name: 'CRC-32',
    algorithm: 'crc32',
    description: 'Fast checksum for data integrity. Not cryptographically secure.',
    outputLength: 8,
    securityLevel: 'low',
    speed: 'fast',
    recommended: false
  }
};

/**
 * Default hash generation options
 */
export const getDefaultOptions = (): HashGenerationOptions => ({
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

/**
 * Convert string to UTF-8 bytes
 */
const stringToBytes = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

/**
 * Convert bytes to hex string
 */
const bytesToHex = (bytes: Uint8Array, uppercase = false, withSeparators = false): string => {
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(withSeparators ? ':' : '');

  return uppercase ? hex.toUpperCase() : hex;
};

/**
 * Convert bytes to base64 string
 */
const bytesToBase64 = (bytes: Uint8Array): string => {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
};

/**
 * CRC-32 implementation
 */
const crc32Table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let crc = i;
  for (let j = 0; j < 8; j++) {
    crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
  }
  crc32Table[i] = crc;
}

const calculateCRC32 = (data: Uint8Array): Uint32Array => {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = crc32Table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  const result = new Uint32Array(1);
  result[0] = (crc ^ 0xFFFFFFFF) >>> 0;
  return result;
};

/**
 * Generate hash using Web Crypto API or fallback algorithms
 */
export const generateHash = async (
  input: string,
  options: HashOptions = getDefaultOptions()
): Promise<HashResult> => {
  const startTime = performance.now();

  try {
    if (!input) {
      return {
        success: false,
        error: 'Input cannot be empty'
      };
    }

    const inputBytes = stringToBytes(input);
    let hashBytes: Uint8Array;

    // Use Web Crypto API for supported algorithms
    if (options.algorithm !== 'md5' && options.algorithm !== 'crc32') {
      const algorithmMap: Record<string, string> = {
        'sha1': 'SHA-1',
        'sha256': 'SHA-256',
        'sha512': 'SHA-512'
      };

      const algorithm = algorithmMap[options.algorithm];
      if (!algorithm) {
        return {
          success: false,
          error: `Unsupported algorithm: ${options.algorithm}`
        };
      }

      const hashBuffer = await crypto.subtle.digest(algorithm, inputBytes);
      hashBytes = new Uint8Array(hashBuffer);
    } else if (options.algorithm === 'crc32') {
      const crcResult = calculateCRC32(inputBytes);
      hashBytes = new Uint8Array(crcResult.buffer);
    } else {
      // MD5 fallback implementation (simplified)
      return {
        success: false,
        error: 'MD5 algorithm requires a crypto library for full implementation'
      };
    }

    // Format output
    let hash: string;
    if (options.format === 'base64') {
      hash = bytesToBase64(hashBytes);
    } else {
      hash = bytesToHex(hashBytes, options.uppercase, options.withSeparators);
    }

    const processingTime = performance.now() - startTime;

    return {
      success: true,
      hash,
      algorithm: options.algorithm,
      format: options.format,
      inputSize: inputBytes.length,
      processingTime
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Generate hash from file
 */
export const generateHashFromFile = async (
  file: File,
  options: HashOptions = getDefaultOptions()
): Promise<FileHashResult> => {
  const startTime = performance.now();

  try {
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    if (file.size > (getDefaultOptions().maxFileSize)) {
      return {
        success: false,
        error: `File size exceeds maximum limit of ${getDefaultOptions().maxFileSize / (1024 * 1024)}MB`
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBytes = new Uint8Array(arrayBuffer);

    let hashBytes: Uint8Array;

    // Use Web Crypto API for supported algorithms
    if (options.algorithm !== 'md5' && options.algorithm !== 'crc32') {
      const algorithmMap: Record<string, string> = {
        'sha1': 'SHA-1',
        'sha256': 'SHA-256',
        'sha512': 'SHA-512'
      };

      const algorithm = algorithmMap[options.algorithm];
      if (!algorithm) {
        return {
          success: false,
          error: `Unsupported algorithm: ${options.algorithm}`
        };
      }

      const hashBuffer = await crypto.subtle.digest(algorithm, inputBytes);
      hashBytes = new Uint8Array(hashBuffer);
    } else if (options.algorithm === 'crc32') {
      const crcResult = calculateCRC32(inputBytes);
      hashBytes = new Uint8Array(crcResult.buffer);
    } else {
      return {
        success: false,
        error: 'MD5 algorithm requires a crypto library for full implementation'
      };
    }

    // Format output
    let hash: string;
    if (options.format === 'base64') {
      hash = bytesToBase64(hashBytes);
    } else {
      hash = bytesToHex(hashBytes, options.uppercase, options.withSeparators);
    }

    const processingTime = performance.now() - startTime;

    return {
      success: true,
      fileName: file.name,
      fileSize: file.size,
      hash,
      algorithm: options.algorithm,
      processingTime
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Generate hashes for multiple inputs
 */
export const generateBatchHashes = async (
  inputs: BatchHashInput[],
  options: HashOptions = getDefaultOptions()
): Promise<BatchHashResult> => {
  const startTime = performance.now();

  try {
    if (!inputs || inputs.length === 0) {
      return {
        success: false,
        error: 'No inputs provided'
      };
    }

    if (inputs.length > getDefaultOptions().maxBatchSize) {
      return {
        success: false,
        error: `Batch size exceeds maximum limit of ${getDefaultOptions().maxBatchSize}`
      };
    }

    const results = [];

    for (const input of inputs) {
      const hashResult = await generateHash(input.content, options);

      if (!hashResult.success) {
        return {
          success: false,
          error: `Failed to hash input ${input.id}: ${hashResult.error}`
        };
      }

      results.push({
        id: input.id,
        name: input.name,
        hash: hashResult.hash!,
        algorithm: options.algorithm,
        inputSize: hashResult.inputSize!,
        processingTime: hashResult.processingTime!
      });
    }

    const totalTime = performance.now() - startTime;

    return {
      success: true,
      results,
      totalProcessed: inputs.length,
      totalTime
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Validate hash format
 */
export const validateHash = (hash: string, algorithm: HashAlgorithm): HashValidation => {
  if (!hash) {
    return {
      isValid: false
    };
  }

  const algorithmInfo = ALGORITHM_INFO[algorithm];
  const expectedLength = algorithmInfo.outputLength;

  // Check if it's hexadecimal
  const hexRegex = /^[a-fA-F0-9]+$/;
  if (hexRegex.test(hash)) {
    return {
      isValid: hash.length === expectedLength,
      algorithm,
      format: 'hex',
      length: hash.length,
      expectedLength
    };
  }

  // Check if it's base64
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (base64Regex.test(hash)) {
    const expectedBase64Length = Math.ceil(expectedLength * 3 / 8);
    return {
      isValid: Math.abs(hash.length - expectedBase64Length) <= 2,
      algorithm,
      format: 'base64',
      length: hash.length,
      expectedLength: expectedBase64Length
    };
  }

  return {
    isValid: false,
    length: hash.length,
    expectedLength
  };
};

/**
 * Compare two hashes
 */
export const compareHashes = (
  hash1: string,
  hash2: string,
  algorithm: HashAlgorithm
): HashComparison => {
  const normalizedHash1 = hash1.toLowerCase().replace(/[^a-f0-9]/g, '');
  const normalizedHash2 = hash2.toLowerCase().replace(/[^a-f0-9]/g, '');

  return {
    hash1: normalizedHash1,
    hash2: normalizedHash2,
    algorithm,
    match: normalizedHash1 === normalizedHash2,
    similarity: calculateSimilarity(normalizedHash1, normalizedHash2)
  };
};

/**
 * Calculate similarity between two strings
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;

  let matches = 0;
  const minLength = Math.min(str1.length, str2.length);

  for (let i = 0; i < minLength; i++) {
    if (str1[i] === str2[i]) {
      matches++;
    }
  }

  return matches / maxLength;
};

/**
 * Format hash with separators
 */
export const formatHash = (
  hash: string,
  withSeparators: boolean = false,
  uppercase: boolean = false
): string => {
  let formatted = hash;

  if (uppercase) {
    formatted = formatted.toUpperCase();
  } else {
    formatted = formatted.toLowerCase();
  }

  if (withSeparators && formatted.length > 8) {
    // Add colon separators every 2 characters for hex hashes
    formatted = formatted.match(/.{1,2}/g)?.join(':') || formatted;
  }

  return formatted;
};

/**
 * Get available algorithms
 */
export const getAvailableAlgorithms = (): AlgorithmInfo[] => {
  return Object.values(ALGORITHM_INFO);
};

/**
 * Check if algorithm is supported
 */
export const isAlgorithmSupported = (algorithm: HashAlgorithm): boolean => {
  // Check if Web Crypto API is available for crypto algorithms
  if (['sha1', 'sha256', 'sha512'].includes(algorithm)) {
    return typeof crypto !== 'undefined' && crypto.subtle !== undefined;
  }

  // CRC32 is always supported (custom implementation)
  if (algorithm === 'crc32') {
    return true;
  }

  // MD5 requires additional library
  if (algorithm === 'md5') {
    return false; // Not implemented in this version
  }

  return false;
};

/**
 * Get recommended algorithm
 */
export const getRecommendedAlgorithm = (): HashAlgorithm => {
  return 'sha256';
};

/**
 * Calculate processing stats
 */
export const calculateHashStats = (results: HashResult[]): HashStats | null => {
  if (!results || results.length === 0) return null;

  const successfulResults = results.filter(r => r.success && r.processingTime);
  if (successfulResults.length === 0) return null;

  const times = successfulResults.map(r => r.processingTime!);
  const sizes = successfulResults.map(r => r.inputSize || 0);

  return {
    algorithm: successfulResults[0].algorithm!,
    totalHashes: successfulResults.length,
    totalDataProcessed: sizes.reduce((sum, size) => sum + size, 0),
    averageProcessingTime: times.reduce((sum, time) => sum + time, 0) / times.length,
    fastestTime: Math.min(...times),
    slowestTime: Math.max(...times)
  };
};
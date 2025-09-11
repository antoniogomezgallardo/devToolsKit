import { describe, it, expect } from 'vitest';
import { 
  encodeBase64, 
  decodeBase64, 
  isValidBase64, 
  getBase64Stats, 
  formatBase64, 
  cleanBase64 
} from '../../../src/tools/base64-encoder-decoder/utils';

describe('Base64 Encoder/Decoder Utils', () => {
  describe('encodeBase64', () => {
    it('should encode simple text correctly', () => {
      const result = encodeBase64('Hello World');
      expect(result.success).toBe(true);
      expect(result.result).toBe('SGVsbG8gV29ybGQ=');
    });

    it('should encode UTF-8 characters correctly', () => {
      const result = encodeBase64('Hola mundo! 👋');
      expect(result.success).toBe(true);
      expect(result.result).toBe('SG9sYSBtdW5kbyEg8J+Riw==');
    });

    it('should encode special characters', () => {
      const result = encodeBase64('user@example.com:password123!@#$%');
      expect(result.success).toBe(true);
      expect(result.result).toBe('dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZDEyMyFAIyQl');
    });

    it('should handle empty string', () => {
      const result = encodeBase64('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('No hay texto para codificar');
    });

    it('should encode JSON correctly', () => {
      const json = JSON.stringify({ name: 'test', value: 123 });
      const result = encodeBase64(json);
      expect(result.success).toBe(true);
      expect(result.result).toBe('eyJuYW1lIjoidGVzdCIsInZhbHVlIjoxMjN9');
    });

    it('should encode multiline text', () => {
      const multiline = 'Line 1\nLine 2\nLine 3';
      const result = encodeBase64(multiline);
      expect(result.success).toBe(true);
      expect(result.result).toBe('TGluZSAxCkxpbmUgMgpMaW5lIDM=');
    });
  });

  describe('decodeBase64', () => {
    it('should decode simple Base64 correctly', () => {
      const result = decodeBase64('SGVsbG8gV29ybGQ=');
      expect(result.success).toBe(true);
      expect(result.result).toBe('Hello World');
    });

    it('should decode UTF-8 Base64 correctly', () => {
      const result = decodeBase64('SG9sYSBtdW5kbyEg8J+Riw==');
      expect(result.success).toBe(true);
      expect(result.result).toBe('Hola mundo! 👋');
    });

    it('should decode JSON Base64 correctly', () => {
      const result = decodeBase64('eyJuYW1lIjoidGVzdCIsInZhbHVlIjoxMjN9');
      expect(result.success).toBe(true);
      expect(result.result).toBe('{"name":"test","value":123}');
    });

    it('should handle empty string', () => {
      const result = decodeBase64('');
      expect(result.success).toBe(false);
      expect(result.error).toBe('No hay Base64 para decodificar');
    });

    it('should handle invalid Base64 format', () => {
      const result = decodeBase64('invalid-base64-!@#');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Formato Base64 inválido');
    });

    it('should handle Base64 with whitespace', () => {
      const result = decodeBase64('SGVs bG8g V29y bGQ=');
      expect(result.success).toBe(true);
      expect(result.result).toBe('Hello World');
    });

    it('should handle malformed Base64', () => {
      const result = decodeBase64('SGVsbG8gV29ybGQ');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Formato Base64 inválido');
    });

    it('should decode multiline Base64', () => {
      const result = decodeBase64('TGluZSAxCkxpbmUgMgpMaW5lIDM=');
      expect(result.success).toBe(true);
      expect(result.result).toBe('Line 1\nLine 2\nLine 3');
    });
  });

  describe('isValidBase64', () => {
    it('should validate correct Base64 strings', () => {
      expect(isValidBase64('SGVsbG8gV29ybGQ=')).toBe(true);
      expect(isValidBase64('eyJuYW1lIjoidGVzdCJ9')).toBe(true);
      expect(isValidBase64('YWJjZGVmZw==')).toBe(true);
    });

    it('should invalidate incorrect Base64 strings', () => {
      expect(isValidBase64('invalid-base64-!@#')).toBe(false);
      expect(isValidBase64('SGVsbG8gV29ybGQ')).toBe(false);
      expect(isValidBase64('12345@#$%^&*(')).toBe(false);
    });

    it('should handle Base64 with whitespace', () => {
      expect(isValidBase64('SGVs bG8g V29y bGQ=')).toBe(true);
      expect(isValidBase64('SGVs\nbG8g\nV29y\nbGQ=')).toBe(true);
    });

    it('should handle empty string', () => {
      expect(isValidBase64('')).toBe(false);
    });
  });

  describe('getBase64Stats', () => {
    it('should calculate encoding stats correctly', () => {
      const stats = getBase64Stats('Hello', 'SGVsbG8=', true);
      expect(stats['Texto original']).toBe(5);
      expect(stats['Texto codificado']).toBe(8);
      expect(stats['Ratio']).toBe('160.0%');
      expect(stats['Tipo']).toBe('Codificación');
    });

    it('should calculate decoding stats correctly', () => {
      const stats = getBase64Stats('SGVsbG8=', 'Hello', false);
      expect(stats['Texto original']).toBe(8);
      expect(stats['Texto codificado']).toBe(5);
      expect(stats['Ratio']).toBe('160.0%');
      expect(stats['Tipo']).toBe('Decodificación');
    });

    it('should handle zero-length strings', () => {
      const stats = getBase64Stats('', '', true);
      expect(stats['Texto original']).toBe(0);
      expect(stats['Texto codificado']).toBe(0);
      expect(stats['Ratio']).toBe('0%');
    });
  });

  describe('formatBase64', () => {
    it('should format Base64 with line breaks', () => {
      const longBase64 = 'SGVsbG8gV29ybGQhIFRoaXMgaXMgYSBsb25nIHN0cmluZyB0byB0ZXN0IEJhc2U2NCBmb3JtYXR0aW5nIHdpdGggbGluZSBicmVha3M=';
      const formatted = formatBase64(longBase64, 20);
      const lines = formatted.split('\n');
      
      expect(lines.length).toBeGreaterThan(1);
      expect(lines[0].length).toBe(20);
    });

    it('should handle short strings', () => {
      const result = formatBase64('SGVsbG8=');
      expect(result).toBe('SGVsbG8=');
    });

    it('should handle empty strings', () => {
      const result = formatBase64('');
      expect(result).toBe('');
    });

    it('should use default line length', () => {
      const longBase64 = 'a'.repeat(100);
      const formatted = formatBase64(longBase64);
      const lines = formatted.split('\n');
      
      expect(lines[0].length).toBe(76); // Default line length
    });
  });

  describe('cleanBase64', () => {
    it('should remove whitespace and line breaks', () => {
      const dirty = 'SGVs\n bG8g\t V29y\r bGQ=';
      const clean = cleanBase64(dirty);
      expect(clean).toBe('SGVsbG8gV29ybGQ=');
    });

    it('should handle strings without whitespace', () => {
      const clean = cleanBase64('SGVsbG8gV29ybGQ=');
      expect(clean).toBe('SGVsbG8gV29ybGQ=');
    });

    it('should handle empty strings', () => {
      const clean = cleanBase64('');
      expect(clean).toBe('');
    });
  });

  describe('End-to-end encoding/decoding', () => {
    it('should maintain data integrity through encode/decode cycle', () => {
      const originalTexts = [
        'Hello World!',
        'user@example.com:password123',
        'The quick brown fox jumps over the lazy dog',
        '¡Hola mundo! 🌎 Testing UTF-8 characters: áéíóú ñÑ 中文',
        JSON.stringify({ name: 'test', nested: { value: 123, array: [1,2,3] } }),
        'Line 1\nLine 2\r\nLine 3\tTabbed content',
        '!@#$%^&*()_+{}|:"<>?[]\\;\',./',
        ''
      ];

      originalTexts.forEach(text => {
        if (text === '') return; // Skip empty string for this test
        
        const encoded = encodeBase64(text);
        expect(encoded.success).toBe(true);
        
        const decoded = decodeBase64(encoded.result);
        expect(decoded.success).toBe(true);
        expect(decoded.result).toBe(text);
      });
    });

    it('should handle large text correctly', () => {
      const largeText = 'A'.repeat(10000);
      
      const encoded = encodeBase64(largeText);
      expect(encoded.success).toBe(true);
      
      const decoded = decodeBase64(encoded.result);
      expect(decoded.success).toBe(true);
      expect(decoded.result).toBe(largeText);
    });
  });
});
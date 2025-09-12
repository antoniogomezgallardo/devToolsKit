/**
 * Password Generator Unit Tests
 * Tests for password generation, validation, and security functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  generatePassword,
  generateBatchPasswords,
  calculatePasswordStrength,
  calculateEntropy,
  validatePassword,
  getDefaultOptions,
  isSecureRandomSupported,
  getPasswordStats,
  CHARACTER_SETS
} from '../../../src/tools/password-generator/utils';
import type { 
  PasswordOptions,
  PasswordGenerationResult,
  BatchGenerationResult 
} from '../../../src/tools/password-generator/types';

describe('Password Generator Utils', () => {
  let defaultOptions: PasswordOptions;

  beforeEach(() => {
    defaultOptions = getDefaultOptions();
  });

  describe('generatePassword', () => {
    it('should generate a password with correct length', () => {
      const options: PasswordOptions = { ...defaultOptions, length: 12 };
      const result = generatePassword(options);
      
      expect(result.success).toBe(true);
      expect(result.password).toBeDefined();
      expect(result.password!.length).toBe(12);
    });

    it('should generate passwords with uppercase letters when enabled', () => {
      const options: PasswordOptions = {
        length: 50,  // Longer to increase chances
        includeUppercase: true,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false,
        excludeSimilar: false,
        excludeAmbiguous: false
      };
      
      const result = generatePassword(options);
      expect(result.success).toBe(true);
      expect(result.password).toMatch(/[A-Z]/);
    });

    it('should generate passwords with lowercase letters when enabled', () => {
      const options: PasswordOptions = {
        length: 50,
        includeUppercase: false,
        includeLowercase: true,
        includeNumbers: false,
        includeSymbols: false,
        excludeSimilar: false,
        excludeAmbiguous: false
      };
      
      const result = generatePassword(options);
      expect(result.success).toBe(true);
      expect(result.password).toMatch(/[a-z]/);
    });

    it('should generate passwords with numbers when enabled', () => {
      const options: PasswordOptions = {
        length: 50,
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: true,
        includeSymbols: false,
        excludeSimilar: false,
        excludeAmbiguous: false
      };
      
      const result = generatePassword(options);
      expect(result.success).toBe(true);
      expect(result.password).toMatch(/[0-9]/);
    });

    it('should generate passwords with symbols when enabled', () => {
      const options: PasswordOptions = {
        length: 50,
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false
      };
      
      const result = generatePassword(options);
      expect(result.success).toBe(true);
      expect(result.password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
    });

    it('should exclude similar characters when requested', () => {
      const options: PasswordOptions = {
        length: 100,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        excludeSimilar: true,
        excludeAmbiguous: false
      };
      
      const result = generatePassword(options);
      expect(result.success).toBe(true);
      
      // Check that similar characters are not present
      const similarChars = 'il1Lo0O';
      for (const char of similarChars) {
        expect(result.password).not.toContain(char);
      }
    });

    it('should exclude ambiguous characters when requested', () => {
      const options: PasswordOptions = {
        length: 100,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: false,
        excludeAmbiguous: true
      };
      
      const result = generatePassword(options);
      expect(result.success).toBe(true);
      
      // Check that ambiguous characters are not present
      const ambiguousChars = '{}[]()/\\\'"`~,;.<>';
      for (const char of ambiguousChars) {
        expect(result.password).not.toContain(char);
      }
    });

    it('should fail with invalid length (too short)', () => {
      const options: PasswordOptions = { ...defaultOptions, length: 3 };
      const result = generatePassword(options);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('longitud debe estar entre 4 y 128');
    });

    it('should fail with invalid length (too long)', () => {
      const options: PasswordOptions = { ...defaultOptions, length: 129 };
      const result = generatePassword(options);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('longitud debe estar entre 4 y 128');
    });

    it('should fail when no character types are selected', () => {
      const options: PasswordOptions = {
        length: 16,
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false,
        excludeSimilar: false,
        excludeAmbiguous: false
      };
      
      const result = generatePassword(options);
      expect(result.success).toBe(false);
      expect(result.error).toContain('seleccionar al menos un tipo de carácter');
    });

    it('should include strength and entropy in successful results', () => {
      const result = generatePassword(defaultOptions);
      
      expect(result.success).toBe(true);
      expect(result.strength).toBeDefined();
      expect(result.strength!.score).toBeGreaterThanOrEqual(0);
      expect(result.strength!.score).toBeLessThanOrEqual(4);
      expect(result.entropy).toBeDefined();
      expect(result.entropy!).toBeGreaterThan(0);
    });

    it('should enforce minimum requirements for mixed character sets', () => {
      const options: PasswordOptions = {
        length: 8,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false
      };
      
      const result = generatePassword(options);
      expect(result.success).toBe(true);
      
      // Should contain at least one of each required type
      expect(result.password).toMatch(/[A-Z]/);
      expect(result.password).toMatch(/[a-z]/);
      expect(result.password).toMatch(/[0-9]/);
      expect(result.password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
    });
  });

  describe('generateBatchPasswords', () => {
    it('should generate the correct number of passwords', () => {
      const options = { ...defaultOptions, count: 5 };
      const result = generateBatchPasswords(options);
      
      expect(result.success).toBe(true);
      expect(result.passwords).toBeDefined();
      expect(result.passwords!.length).toBe(5);
      expect(result.totalGenerated).toBe(5);
    });

    it('should generate unique passwords in batch', () => {
      const options = { ...defaultOptions, count: 10, length: 20 };
      const result = generateBatchPasswords(options);
      
      expect(result.success).toBe(true);
      const passwords = result.passwords!;
      const uniquePasswords = [...new Set(passwords)];
      
      // All passwords should be unique
      expect(uniquePasswords.length).toBe(passwords.length);
    });

    it('should fail with invalid count (too few)', () => {
      const options = { ...defaultOptions, count: 0 };
      const result = generateBatchPasswords(options);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('debe estar entre 1 y 20');
    });

    it('should fail with invalid count (too many)', () => {
      const options = { ...defaultOptions, count: 21 };
      const result = generateBatchPasswords(options);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('debe estar entre 1 y 20');
    });

    it('should propagate password generation errors', () => {
      const options = { 
        ...defaultOptions, 
        count: 5, 
        length: 3  // Invalid length
      };
      const result = generateBatchPasswords(options);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('calculatePasswordStrength', () => {
    it('should return very weak for empty password', () => {
      const strength = calculatePasswordStrength('');
      
      expect(strength.score).toBe(0);
      expect(strength.label).toBe('Muy Débil');
      expect(strength.crackTime).toBe('Inmediato');
    });

    it('should return weak for short passwords', () => {
      const strength = calculatePasswordStrength('abc');
      
      expect(strength.score).toBeLessThanOrEqual(1);
      expect(strength.feedback).toContain('Usa al menos 8 caracteres');
    });

    it('should give higher scores for complex passwords', () => {
      const complexPassword = 'MyVerySecure123!Password';
      const strength = calculatePasswordStrength(complexPassword);
      
      expect(strength.score).toBeGreaterThanOrEqual(3);
      expect(['Buena', 'Excelente']).toContain(strength.label);
    });

    it('should detect common patterns', () => {
      const patternPassword = 'password123';
      const strength = calculatePasswordStrength(patternPassword);
      
      expect(strength.score).toBeLessThan(4);
      expect(strength.feedback.join(' ')).toContain('patrones comunes');
    });

    it('should detect repeating characters', () => {
      const repeatingPassword = 'aaaaabbbbb';
      const strength = calculatePasswordStrength(repeatingPassword);
      
      expect(strength.score).toBeLessThan(4);
      expect(strength.feedback.join(' ')).toContain('caracteres repetitivos');
    });

    it('should reward character diversity', () => {
      const diversePassword = 'Abc123!@#';
      const simplePassword = 'abcdefgh';
      
      const diverseStrength = calculatePasswordStrength(diversePassword);
      const simpleStrength = calculatePasswordStrength(simplePassword);
      
      expect(diverseStrength.score).toBeGreaterThan(simpleStrength.score);
    });
  });

  describe('calculateEntropy', () => {
    it('should return 0 for empty password', () => {
      const entropy = calculateEntropy('', 26);
      expect(entropy).toBe(0);
    });

    it('should return 0 for invalid pool size', () => {
      const entropy = calculateEntropy('password', 0);
      expect(entropy).toBe(0);
    });

    it('should calculate entropy correctly', () => {
      const entropy = calculateEntropy('abcd', 26); // lowercase only
      const expected = Math.log2(Math.pow(26, 4));
      expect(entropy).toBeCloseTo(expected, 5);
    });

    it('should increase with password length', () => {
      const short = calculateEntropy('ab', 26);
      const long = calculateEntropy('abcd', 26);
      expect(long).toBeGreaterThan(short);
    });

    it('should increase with character set size', () => {
      const small = calculateEntropy('abcd', 26);
      const large = calculateEntropy('abcd', 62); // uppercase + lowercase
      expect(large).toBeGreaterThan(small);
    });
  });

  describe('validatePassword', () => {
    it('should validate password meets all requirements', () => {
      const password = 'Test123!';
      const options: PasswordOptions = {
        length: 8,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false
      };
      
      const validation = validatePassword(password, options);
      
      expect(validation.isValid).toBe(true);
      expect(validation.hasUppercase).toBe(true);
      expect(validation.hasLowercase).toBe(true);
      expect(validation.hasNumbers).toBe(true);
      expect(validation.hasSymbols).toBe(true);
      expect(validation.length).toBe(8);
      expect(validation.entropy).toBeGreaterThan(0);
    });

    it('should fail validation when requirements not met', () => {
      const password = 'test123'; // no uppercase or symbols
      const options: PasswordOptions = {
        length: 7,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false
      };
      
      const validation = validatePassword(password, options);
      
      expect(validation.isValid).toBe(false);
      expect(validation.hasUppercase).toBe(false);
      expect(validation.hasSymbols).toBe(false);
    });

    it('should handle optional requirements correctly', () => {
      const password = 'testtest';
      const options: PasswordOptions = {
        length: 8,
        includeUppercase: false,
        includeLowercase: true,
        includeNumbers: false,
        includeSymbols: false,
        excludeSimilar: false,
        excludeAmbiguous: false
      };
      
      const validation = validatePassword(password, options);
      
      expect(validation.isValid).toBe(true);
      expect(validation.hasLowercase).toBe(true);
      expect(validation.hasUppercase).toBe(false);
      expect(validation.hasNumbers).toBe(false);
      expect(validation.hasSymbols).toBe(false);
    });
  });

  describe('getDefaultOptions', () => {
    it('should return valid default options', () => {
      const defaults = getDefaultOptions();
      
      expect(defaults.length).toBe(16);
      expect(defaults.includeUppercase).toBe(true);
      expect(defaults.includeLowercase).toBe(true);
      expect(defaults.includeNumbers).toBe(true);
      expect(defaults.includeSymbols).toBe(true);
      expect(defaults.excludeSimilar).toBe(false);
      expect(defaults.excludeAmbiguous).toBe(false);
    });
  });

  describe('isSecureRandomSupported', () => {
    it('should check for crypto support', () => {
      const supported = isSecureRandomSupported();
      // In test environment, this should return true
      expect(typeof supported).toBe('boolean');
    });
  });

  describe('getPasswordStats', () => {
    it('should return comprehensive password statistics', () => {
      const password = 'MySecure123!';
      const options = getDefaultOptions();
      
      const stats = getPasswordStats(password, options);
      
      expect(stats).toHaveProperty('Longitud');
      expect(stats).toHaveProperty('Entropía');
      expect(stats).toHaveProperty('Fortaleza');
      expect(stats).toHaveProperty('Tiempo de crack');
      expect(stats).toHaveProperty('Mayúsculas');
      expect(stats).toHaveProperty('Minúsculas');
      expect(stats).toHaveProperty('Números');
      expect(stats).toHaveProperty('Símbolos');
      
      expect(stats['Longitud']).toBe(password.length);
      expect(stats['Mayúsculas']).toBe('Sí');
      expect(stats['Minúsculas']).toBe('Sí');
      expect(stats['Números']).toBe('Sí');
      expect(stats['Símbolos']).toBe('Sí');
    });
  });

  describe('CHARACTER_SETS', () => {
    it('should contain all expected character sets', () => {
      expect(CHARACTER_SETS.uppercase).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      expect(CHARACTER_SETS.lowercase).toBe('abcdefghijklmnopqrstuvwxyz');
      expect(CHARACTER_SETS.numbers).toBe('0123456789');
      expect(CHARACTER_SETS.symbols).toBe('!@#$%^&*()_+-=[]{}|;:,.<>?');
      expect(CHARACTER_SETS.similar).toContain('i');
      expect(CHARACTER_SETS.similar).toContain('l');
      expect(CHARACTER_SETS.similar).toContain('1');
      expect(CHARACTER_SETS.similar).toContain('O');
      expect(CHARACTER_SETS.similar).toContain('0');
    });
  });

  describe('Security and Randomness', () => {
    it('should generate different passwords on multiple calls', () => {
      const options = { ...defaultOptions, length: 20 };
      
      const passwords = Array.from({ length: 10 }, () => 
        generatePassword(options).password!
      );
      
      // All passwords should be unique
      const uniquePasswords = [...new Set(passwords)];
      expect(uniquePasswords.length).toBe(passwords.length);
    });

    it('should have reasonable entropy for complex passwords', () => {
      const password = 'MyVerySecure123!ComplexPassword';
      const entropy = calculateEntropy(password, 95); // Full ASCII printable
      
      // Should have high entropy
      expect(entropy).toBeGreaterThan(150);
    });
  });
});
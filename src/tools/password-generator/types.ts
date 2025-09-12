/**
 * Password Generator Types and Interfaces
 */

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export interface PasswordGenerationResult {
  success: boolean;
  password?: string;
  strength?: PasswordStrength;
  entropy?: number;
  error?: string;
}

export interface PasswordStrength {
  score: number; // 0-4 (Very Weak, Weak, Fair, Good, Strong)
  label: string;
  feedback: string[];
  crackTime: string;
  crackTimeSeconds: number;
}

export interface CharacterSet {
  name: string;
  characters: string;
  enabled: boolean;
}

export interface PasswordValidation {
  isValid: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  length: number;
  entropy: number;
}

export interface BatchGenerationOptions extends PasswordOptions {
  count: number;
}

export interface BatchGenerationResult {
  success: boolean;
  passwords?: string[];
  totalGenerated?: number;
  error?: string;
}

export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4;
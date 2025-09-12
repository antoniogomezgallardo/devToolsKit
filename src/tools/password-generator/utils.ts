import type { 
  PasswordOptions, 
  PasswordGenerationResult, 
  PasswordStrength, 
  PasswordValidation,
  BatchGenerationOptions,
  BatchGenerationResult,
  PasswordStrengthScore
} from './types';

// Character sets for password generation
export const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  // Characters that are often confused or hard to distinguish
  similar: 'il1Lo0O',
  // Characters that might be ambiguous in some fonts
  ambiguous: '{}[]()/\\\'"`~,;.<>'
};

/**
 * Generate a secure random password based on options
 */
export function generatePassword(options: PasswordOptions): PasswordGenerationResult {
  try {
    if (options.length < 4 || options.length > 128) {
      return {
        success: false,
        error: 'La longitud debe estar entre 4 y 128 caracteres'
      };
    }

    const characterPool = buildCharacterPool(options);
    
    if (characterPool.length === 0) {
      return {
        success: false,
        error: 'Debe seleccionar al menos un tipo de carácter'
      };
    }

    const password = generateSecurePassword(characterPool, options);
    const strength = calculatePasswordStrength(password);
    const entropy = calculateEntropy(password, characterPool.length);

    return {
      success: true,
      password,
      strength,
      entropy
    };
  } catch (error) {
    return {
      success: false,
      error: `Error al generar contraseña: ${(error as Error).message}`
    };
  }
}

/**
 * Generate multiple passwords at once
 */
export function generateBatchPasswords(options: BatchGenerationOptions): BatchGenerationResult {
  try {
    if (options.count < 1 || options.count > 20) {
      return {
        success: false,
        error: 'El número de contraseñas debe estar entre 1 y 20'
      };
    }

    const passwords: string[] = [];
    for (let i = 0; i < options.count; i++) {
      const result = generatePassword(options);
      if (result.success && result.password) {
        passwords.push(result.password);
      } else {
        return {
          success: false,
          error: result.error || 'Error al generar contraseña del lote'
        };
      }
    }

    return {
      success: true,
      passwords,
      totalGenerated: passwords.length
    };
  } catch (error) {
    return {
      success: false,
      error: `Error al generar lote de contraseñas: ${(error as Error).message}`
    };
  }
}

/**
 * Build character pool based on selected options
 */
function buildCharacterPool(options: PasswordOptions): string {
  let pool = '';

  if (options.includeUppercase) {
    pool += CHARACTER_SETS.uppercase;
  }
  if (options.includeLowercase) {
    pool += CHARACTER_SETS.lowercase;
  }
  if (options.includeNumbers) {
    pool += CHARACTER_SETS.numbers;
  }
  if (options.includeSymbols) {
    pool += CHARACTER_SETS.symbols;
  }

  // Remove similar characters if requested
  if (options.excludeSimilar) {
    pool = pool.split('').filter(char => !CHARACTER_SETS.similar.includes(char)).join('');
  }

  // Remove ambiguous characters if requested
  if (options.excludeAmbiguous) {
    pool = pool.split('').filter(char => !CHARACTER_SETS.ambiguous.includes(char)).join('');
  }

  // Remove duplicates and return
  return [...new Set(pool.split(''))].join('');
}

/**
 * Generate cryptographically secure password
 */
function generateSecurePassword(characterPool: string, options: PasswordOptions): string {
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  
  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += characterPool[array[i] % characterPool.length];
  }

  // Ensure password meets minimum requirements by enforcing at least one character from each selected type
  password = enforcePasswordRequirements(password, options);

  return password;
}

/**
 * Ensure the generated password contains at least one character from each selected type
 */
function enforcePasswordRequirements(password: string, options: PasswordOptions): string {
  const chars = password.split('');
  const requiredSets: string[] = [];
  
  if (options.includeUppercase) requiredSets.push(CHARACTER_SETS.uppercase);
  if (options.includeLowercase) requiredSets.push(CHARACTER_SETS.lowercase);
  if (options.includeNumbers) requiredSets.push(CHARACTER_SETS.numbers);
  if (options.includeSymbols) requiredSets.push(CHARACTER_SETS.symbols);

  // Check if password already satisfies all requirements
  const satisfiesAll = requiredSets.every(set => 
    chars.some(char => set.includes(char))
  );

  if (satisfiesAll) {
    return password;
  }

  // Replace some random characters to ensure requirements are met
  const randomIndices = new Uint32Array(requiredSets.length);
  crypto.getRandomValues(randomIndices);

  requiredSets.forEach((set, index) => {
    if (!chars.some(char => set.includes(char))) {
      const randomCharIndex = new Uint32Array(1);
      crypto.getRandomValues(randomCharIndex);
      
      const randomChar = set[randomCharIndex[0] % set.length];
      const replaceIndex = randomIndices[index] % chars.length;
      
      chars[replaceIndex] = randomChar;
    }
  });

  return chars.join('');
}

/**
 * Calculate password entropy (bits of randomness)
 */
export function calculateEntropy(password: string, poolSize: number): number {
  if (!password || poolSize <= 1) return 0;
  return Math.log2(Math.pow(poolSize, password.length));
}

/**
 * Calculate password strength score and feedback
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: 'Muy Débil',
      feedback: ['Ingresa una contraseña'],
      crackTime: 'Inmediato',
      crackTimeSeconds: 0
    };
  }

  let score: PasswordStrengthScore = 0;
  const feedback: string[] = [];
  const checks = {
    length: password.length >= 8,
    longLength: password.length >= 12,
    veryLongLength: password.length >= 16,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
    noCommonPatterns: !hasCommonPatterns(password),
    noRepeating: !hasRepeatingChars(password)
  };

  // Length scoring
  if (checks.length) score++;
  if (checks.longLength) score++;
  else if (!checks.length) feedback.push('Usa al menos 8 caracteres');

  // Character diversity
  const charTypes = [checks.hasLower, checks.hasUpper, checks.hasNumber, checks.hasSymbol].filter(Boolean).length;
  if (charTypes >= 3) score++;
  else feedback.push('Incluye mayúsculas, minúsculas, números y símbolos');

  // Advanced checks
  if (checks.veryLongLength && charTypes >= 4 && checks.noCommonPatterns) score++;
  if (!checks.noCommonPatterns) feedback.push('Evita patrones comunes como "123" o "abc"');
  if (!checks.noRepeating) feedback.push('Evita caracteres repetitivos');

  // Determine final score
  const labels = ['Muy Débil', 'Débil', 'Regular', 'Buena', 'Excelente'];
  const finalScore = Math.min(score, 4) as PasswordStrengthScore;
  
  const crackTime = estimateCrackTime(password);

  return {
    score: finalScore,
    label: labels[finalScore],
    feedback: feedback.length > 0 ? feedback : ['¡Excelente contraseña!'],
    crackTime: crackTime.human,
    crackTimeSeconds: crackTime.seconds
  };
}

/**
 * Check for common password patterns
 */
function hasCommonPatterns(password: string): boolean {
  const commonPatterns = [
    /123/,
    /abc/i,
    /qwe/i,
    /password/i,
    /admin/i,
    /(\w)\1{2,}/  // Three or more repeated characters
  ];

  return commonPatterns.some(pattern => pattern.test(password));
}

/**
 * Check for repeating characters
 */
function hasRepeatingChars(password: string): boolean {
  return /(.)\1{2,}/.test(password);
}

/**
 * Estimate password crack time
 */
function estimateCrackTime(password: string): { human: string; seconds: number } {
  const charset = getCharsetSize(password);
  const combinations = Math.pow(charset, password.length);
  
  // Assume 1 billion guesses per second (modern GPU cracking)
  const secondsToHalfSpace = combinations / 2 / 1e9;
  
  if (secondsToHalfSpace < 1) {
    return { human: 'Menos de 1 segundo', seconds: secondsToHalfSpace };
  }
  if (secondsToHalfSpace < 60) {
    return { human: `${Math.round(secondsToHalfSpace)} segundos`, seconds: secondsToHalfSpace };
  }
  if (secondsToHalfSpace < 3600) {
    return { human: `${Math.round(secondsToHalfSpace / 60)} minutos`, seconds: secondsToHalfSpace };
  }
  if (secondsToHalfSpace < 86400) {
    return { human: `${Math.round(secondsToHalfSpace / 3600)} horas`, seconds: secondsToHalfSpace };
  }
  if (secondsToHalfSpace < 31536000) {
    return { human: `${Math.round(secondsToHalfSpace / 86400)} días`, seconds: secondsToHalfSpace };
  }
  if (secondsToHalfSpace < 31536000000) {
    return { human: `${Math.round(secondsToHalfSpace / 31536000)} años`, seconds: secondsToHalfSpace };
  }
  
  return { human: 'Más de 1000 años', seconds: secondsToHalfSpace };
}

/**
 * Get estimated character set size for a password
 */
function getCharsetSize(password: string): number {
  let size = 0;
  
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 30; // Approximation for symbols
  
  return Math.max(size, 1);
}

/**
 * Validate password against given options
 */
export function validatePassword(password: string, options: PasswordOptions): PasswordValidation {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);
  
  const meetsRequirements = 
    (!options.includeUppercase || hasUppercase) &&
    (!options.includeLowercase || hasLowercase) &&
    (!options.includeNumbers || hasNumbers) &&
    (!options.includeSymbols || hasSymbols) &&
    password.length === options.length;

  const charset = getCharsetSize(password);
  const entropy = calculateEntropy(password, charset);

  return {
    isValid: meetsRequirements,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSymbols,
    length: password.length,
    entropy
  };
}

/**
 * Get default password generation options
 */
export function getDefaultOptions(): PasswordOptions {
  return {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  };
}

/**
 * Check if the browser supports crypto.getRandomValues
 */
export function isSecureRandomSupported(): boolean {
  return typeof crypto !== 'undefined' && 
         typeof crypto.getRandomValues === 'function';
}

/**
 * Get password generation statistics for analytics
 */
export function getPasswordStats(password: string, options: PasswordOptions): Record<string, any> {
  const validation = validatePassword(password, options);
  const strength = calculatePasswordStrength(password);
  
  return {
    'Longitud': password.length,
    'Entropía': `${Math.round(validation.entropy)} bits`,
    'Fortaleza': strength.label,
    'Tiempo de crack': strength.crackTime,
    'Mayúsculas': validation.hasUppercase ? 'Sí' : 'No',
    'Minúsculas': validation.hasLowercase ? 'Sí' : 'No',
    'Números': validation.hasNumbers ? 'Sí' : 'No',
    'Símbolos': validation.hasSymbols ? 'Sí' : 'No'
  };
}
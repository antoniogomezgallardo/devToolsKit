import type { Base64Result, Base64Stats } from './types';

/**
 * Encode text to Base64
 */
export function encodeBase64(input: string): Base64Result {
  try {
    if (!input) {
      return {
        result: '',
        success: false,
        error: 'No hay texto para codificar'
      };
    }

    const encoded = btoa(unescape(encodeURIComponent(input)));
    return {
      result: encoded,
      success: true
    };
  } catch (error) {
    return {
      result: '',
      success: false,
      error: error instanceof Error ? error.message : 'Error al codificar'
    };
  }
}

/**
 * Decode Base64 to text
 */
export function decodeBase64(input: string): Base64Result {
  try {
    if (!input) {
      return {
        result: '',
        success: false,
        error: 'No hay Base64 para decodificar'
      };
    }

    const cleanInput = input.replace(/\s/g, '');
    
    // Check if it's a valid Base64 string
    if (!isValidBase64(input)) {
      return {
        result: '',
        success: false,
        error: 'Formato Base64 inválido'
      };
    }

    const decoded = decodeURIComponent(escape(atob(cleanInput)));
    return {
      result: decoded,
      success: true
    };
  } catch (error) {
    return {
      result: '',
      success: false,
      error: 'Error al decodificar Base64'
    };
  }
}

/**
 * Check if string is valid Base64
 */
export function isValidBase64(str: string): boolean {
  try {
    if (!str || str.trim() === '') return false;
    
    const cleanStr = str.replace(/\s/g, '');
    
    // Base64 strings should have length multiple of 4 (with padding)
    if (cleanStr.length % 4 !== 0) return false;
    
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(cleanStr)) return false;
    
    // Try to decode
    atob(cleanStr);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get statistics about the Base64 encoding/decoding
 */
export function getBase64Stats(original: string, converted: string, isEncoding: boolean): Base64Stats {
  const originalLength = original.length;
  const convertedLength = converted.length;
  
  let ratio: string;
  if (isEncoding) {
    ratio = originalLength > 0 ? `${((convertedLength / originalLength) * 100).toFixed(1)}%` : '0%';
  } else {
    ratio = convertedLength > 0 ? `${((originalLength / convertedLength) * 100).toFixed(1)}%` : '0%';
  }

  return {
    'Texto original': originalLength,
    'Texto codificado': convertedLength,
    'Ratio': ratio,
    'Tipo': isEncoding ? 'Codificación' : 'Decodificación'
  };
}

/**
 * Handle file reading for Base64 encoding
 */
export function readFileAsBase64(file: File): Promise<Base64Result> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        // Remove data URL prefix (data:mime/type;base64,)
        const base64Data = result.split(',')[1] || result;
        
        resolve({
          result: base64Data,
          success: true
        });
      } catch (error) {
        resolve({
          result: '',
          success: false,
          error: 'Error al leer el archivo'
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        result: '',
        success: false,
        error: 'Error al leer el archivo'
      });
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Format Base64 with line breaks for better readability
 */
export function formatBase64(base64: string, lineLength: number = 76): string {
  if (!base64) return base64;
  
  const lines = [];
  for (let i = 0; i < base64.length; i += lineLength) {
    lines.push(base64.slice(i, i + lineLength));
  }
  
  return lines.join('\n');
}

/**
 * Clean Base64 string (remove whitespace and line breaks)
 */
export function cleanBase64(base64: string): string {
  return base64.replace(/\s/g, '');
}
/**
 * JWT Decoder Utilities
 * DevToolsKit - JWT Token Decoder & Analyzer
 */

interface JWTHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: any;
}

interface JWTPayload {
  iss?: string; // Issuer
  sub?: string; // Subject
  aud?: string | string[]; // Audience
  exp?: number; // Expiration time
  nbf?: number; // Not before
  iat?: number; // Issued at
  jti?: string; // JWT ID
  [key: string]: any;
}

interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  isExpired?: boolean;
  expiresIn?: string;
  issuedAt?: string;
}

interface JWTValidationResult {
  isValid: boolean;
  decoded?: DecodedJWT;
  error?: string;
  formatted?: {
    header: string;
    payload: string;
  };
}

/**
 * Base64 URL decode (JWT uses base64url encoding)
 */
const base64UrlDecode = (str: string): string => {
  // Add padding if needed
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  
  try {
    return atob(base64);
  } catch (error) {
    throw new Error('Invalid base64url encoding');
  }
};

/**
 * Format timestamp to readable date
 */
const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
};

/**
 * Calculate time remaining until expiration
 */
const getTimeRemaining = (exp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const diff = exp - now;
  
  if (diff <= 0) {
    const expiredAgo = Math.abs(diff);
    if (expiredAgo < 60) return `Expirado hace ${expiredAgo}s`;
    if (expiredAgo < 3600) return `Expirado hace ${Math.floor(expiredAgo / 60)}m`;
    if (expiredAgo < 86400) return `Expirado hace ${Math.floor(expiredAgo / 3600)}h`;
    return `Expirado hace ${Math.floor(expiredAgo / 86400)}d`;
  }
  
  if (diff < 60) return `Expira en ${diff}s`;
  if (diff < 3600) return `Expira en ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `Expira en ${Math.floor(diff / 3600)}h`;
  return `Expira en ${Math.floor(diff / 86400)}d`;
};

/**
 * Decode and validate JWT token
 */
export const decodeJWT = (token: string): JWTValidationResult => {
  try {
    // Remove Bearer prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    
    if (!cleanToken) {
      return { isValid: false, error: 'Token vacío' };
    }

    // Split JWT into parts
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      return { isValid: false, error: 'JWT debe tener 3 partes separadas por puntos' };
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode header
    let header: JWTHeader;
    try {
      const headerJson = base64UrlDecode(headerB64);
      header = JSON.parse(headerJson);
    } catch (error) {
      return { isValid: false, error: 'Header JWT inválido o mal formateado' };
    }

    // Decode payload
    let payload: JWTPayload;
    try {
      const payloadJson = base64UrlDecode(payloadB64);
      payload = JSON.parse(payloadJson);
    } catch (error) {
      return { isValid: false, error: 'Payload JWT inválido o mal formateado' };
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp ? payload.exp < now : false;
    
    // Calculate expiration info
    let expiresIn: string | undefined;
    if (payload.exp) {
      expiresIn = getTimeRemaining(payload.exp);
    }
    
    // Format issued at
    let issuedAt: string | undefined;
    if (payload.iat) {
      issuedAt = formatTimestamp(payload.iat);
    }

    const decoded: DecodedJWT = {
      header,
      payload,
      signature: signatureB64,
      isExpired,
      expiresIn,
      issuedAt
    };

    // Format for display
    const formatted = {
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2)
    };

    return {
      isValid: true,
      decoded,
      formatted
    };

  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Error desconocido al decodificar JWT'
    };
  }
};

/**
 * Get JWT information and statistics
 */
export const getJWTInfo = (decoded: DecodedJWT): { [key: string]: any } => {
  const info: { [key: string]: any } = {};
  
  // Algorithm
  if (decoded.header.alg) {
    info['Algoritmo'] = decoded.header.alg;
  }
  
  // Token type
  if (decoded.header.typ) {
    info['Tipo'] = decoded.header.typ;
  }
  
  // Key ID
  if (decoded.header.kid) {
    info['Key ID'] = decoded.header.kid;
  }
  
  // Issuer
  if (decoded.payload.iss) {
    info['Emisor'] = decoded.payload.iss;
  }
  
  // Subject
  if (decoded.payload.sub) {
    info['Sujeto'] = decoded.payload.sub;
  }
  
  // Audience
  if (decoded.payload.aud) {
    const audience = Array.isArray(decoded.payload.aud) 
      ? decoded.payload.aud.join(', ') 
      : decoded.payload.aud;
    info['Audiencia'] = audience;
  }
  
  // Expiration
  if (decoded.payload.exp) {
    info['Expira'] = formatTimestamp(decoded.payload.exp);
    info['Estado'] = decoded.isExpired ? '🔴 Expirado' : '🟢 Válido';
    if (decoded.expiresIn) {
      info['Tiempo restante'] = decoded.expiresIn;
    }
  }
  
  // Issued at
  if (decoded.payload.iat) {
    info['Emitido'] = formatTimestamp(decoded.payload.iat);
  }
  
  // Not before
  if (decoded.payload.nbf) {
    info['Válido desde'] = formatTimestamp(decoded.payload.nbf);
  }
  
  // JWT ID
  if (decoded.payload.jti) {
    info['JWT ID'] = decoded.payload.jti;
  }
  
  // Custom claims count
  const standardClaims = ['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti'];
  const customClaims = Object.keys(decoded.payload).filter(key => !standardClaims.includes(key));
  if (customClaims.length > 0) {
    info['Claims personalizados'] = customClaims.length;
  }
  
  return info;
};

/**
 * Validate JWT structure without decoding
 */
export const validateJWTStructure = (token: string): { isValid: boolean; error?: string } => {
  const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
  
  if (!cleanToken) {
    return { isValid: false, error: 'Token vacío' };
  }
  
  const parts = cleanToken.split('.');
  if (parts.length !== 3) {
    return { isValid: false, error: 'JWT debe tener exactamente 3 partes separadas por puntos' };
  }
  
  // Check if parts are base64url encoded
  const base64UrlRegex = /^[A-Za-z0-9_-]*$/;
  if (!parts.every(part => base64UrlRegex.test(part))) {
    return { isValid: false, error: 'Partes del JWT contienen caracteres inválidos para base64url' };
  }
  
  return { isValid: true };
};
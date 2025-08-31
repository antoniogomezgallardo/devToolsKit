import { describe, it, expect, beforeEach } from 'vitest';
import { decodeJWT, getJWTInfo, validateJWTStructure } from '@/tools/jwt-decoder/utils';

describe('JWT Decoder Utils', () => {
  describe('validateJWTStructure', () => {
    it('should validate correct JWT structure', () => {
      const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      const result = validateJWTStructure(validJWT);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty token', () => {
      const result = validateJWTStructure('');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Token vacío');
    });

    it('should reject token with wrong number of parts', () => {
      const invalidJWT = 'header.payload'; // Missing signature
      
      const result = validateJWTStructure(invalidJWT);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('JWT debe tener exactamente 3 partes separadas por puntos');
    });

    it('should reject token with invalid base64url characters', () => {
      const invalidJWT = 'header!.payload$.signature@';
      
      const result = validateJWTStructure(invalidJWT);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Partes del JWT contienen caracteres inválidos para base64url');
    });

    it('should handle Bearer prefix', () => {
      const jwtWithBearer = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      const result = validateJWTStructure(jwtWithBearer);
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('decodeJWT', () => {
    const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    it('should decode valid JWT correctly', () => {
      const result = decodeJWT(validJWT);
      
      expect(result.isValid).toBe(true);
      expect(result.decoded).toBeDefined();
      expect(result.decoded!.header.alg).toBe('HS256');
      expect(result.decoded!.header.typ).toBe('JWT');
      expect(result.decoded!.payload.sub).toBe('1234567890');
      expect(result.decoded!.payload.name).toBe('John Doe');
      expect(result.decoded!.payload.iat).toBe(1516239022);
    });

    it('should provide formatted output', () => {
      const result = decodeJWT(validJWT);
      
      expect(result.formatted).toBeDefined();
      expect(result.formatted!.header).toContain('"alg": "HS256"');
      expect(result.formatted!.payload).toContain('"name": "John Doe"');
    });

    it('should handle empty token', () => {
      const result = decodeJWT('');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Token vacío');
    });

    it('should handle malformed header', () => {
      const malformedJWT = 'invalid-base64.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature';
      
      const result = decodeJWT(malformedJWT);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Header JWT inválido');
    });

    it('should handle malformed payload', () => {
      const malformedJWT = 'eyJhbGciOiJIUzI1NiJ9.invalid-json.signature';
      
      const result = decodeJWT(malformedJWT);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Payload JWT inválido');
    });

    it('should detect expired tokens', () => {
      // JWT with exp in the past (timestamp: 1516239022 = January 2018)
      const expiredJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';
      
      const result = decodeJWT(expiredJWT);
      
      expect(result.isValid).toBe(true);
      expect(result.decoded!.isExpired).toBe(true);
      expect(result.decoded!.expiresIn).toContain('Expirado hace');
    });

    it('should handle future expiration', () => {
      // Create JWT with future expiration
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: '123', exp: futureExp }));
      const futureJWT = `${header}.${payload}.signature`;
      
      const result = decodeJWT(futureJWT);
      
      expect(result.isValid).toBe(true);
      expect(result.decoded!.isExpired).toBe(false);
      expect(result.decoded!.expiresIn).toContain('Expira en');
    });
  });

  describe('getJWTInfo', () => {
    const sampleDecoded = {
      header: { alg: 'HS256', typ: 'JWT', kid: 'key-1' },
      payload: {
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
        exp: 1516242622,
        iss: 'devtoolskit.com',
        aud: ['developers', 'testers'],
        jti: 'unique-jwt-id'
      },
      signature: 'signature',
      isExpired: false,
      expiresIn: 'Expira en 1h',
      issuedAt: '18/01/2018, 01:30:22 UTC'
    };

    it('should extract all JWT information', () => {
      const info = getJWTInfo(sampleDecoded);
      
      expect(info['Algoritmo']).toBe('HS256');
      expect(info['Tipo']).toBe('JWT');
      expect(info['Key ID']).toBe('key-1');
      expect(info['Sujeto']).toBe('1234567890');
      expect(info['Emisor']).toBe('devtoolskit.com');
      expect(info['Audiencia']).toBe('developers, testers');
      expect(info['JWT ID']).toBe('unique-jwt-id');
      expect(info['Estado']).toBe('🟢 Válido');
    });

    it('should handle expired tokens', () => {
      const expiredDecoded = { ...sampleDecoded, isExpired: true };
      const info = getJWTInfo(expiredDecoded);
      
      expect(info['Estado']).toBe('🔴 Expirado');
    });

    it('should handle single audience', () => {
      const singleAudDecoded = { 
        ...sampleDecoded, 
        payload: { ...sampleDecoded.payload, aud: 'single-audience' }
      };
      const info = getJWTInfo(singleAudDecoded);
      
      expect(info['Audiencia']).toBe('single-audience');
    });

    it('should count custom claims', () => {
      const customClaimsDecoded = {
        ...sampleDecoded,
        payload: {
          ...sampleDecoded.payload,
          customClaim1: 'value1',
          customClaim2: 'value2',
          role: 'admin'
        }
      };
      const info = getJWTInfo(customClaimsDecoded);
      
      expect(info['Claims personalizados']).toBe(4); // customClaim1, customClaim2, role, name
    });

    it('should handle minimal JWT', () => {
      const minimalDecoded = {
        header: { alg: 'none' },
        payload: {},
        signature: '',
        isExpired: false
      };
      const info = getJWTInfo(minimalDecoded);
      
      expect(info['Algoritmo']).toBe('none');
      expect(Object.keys(info)).toHaveLength(1);
    });
  });
});
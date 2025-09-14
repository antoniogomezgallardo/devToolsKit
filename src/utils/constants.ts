import type { Tool } from '../types';

export const SITE_CONFIG = {
  name: 'Online DevToolsKit',
  description: '🛠️ Portal de herramientas online para desarrolladores - Rápido, minimalista y sin registro',
  url: 'https://onlinedevtoolskit.com',
  author: 'Online DevToolsKit Team',
  keywords: ['herramientas desarrolladores', 'tools online', 'json validator', 'base64', 'jwt decoder', 'devtools', 'utilities']
};

export const TOOLS: Tool[] = [
  {
    id: 'json-validator',
    name: 'Validador JSON',
    description: 'Valida y formatea código JSON con detección de errores en tiempo real',
    category: 'validators',
    icon: '{ }',
    path: '/tools/json-validator',
    keywords: ['json', 'validador', 'formatter', 'parser'],
    featured: true
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decodifica y valida tokens JWT mostrando header, payload y signature',
    category: 'encoders',
    icon: '🔐',
    path: '/tools/jwt-decoder',
    keywords: ['jwt', 'token', 'decode', 'authentication'],
    featured: true
  },
  {
    id: 'locator-generator',
    name: 'Generador de Locators',
    description: 'Genera locators robustos para testing automatizado (Playwright, Selenium, Cypress)',
    category: 'utilities',
    icon: '🎯',
    path: '/tools/locator-generator',
    keywords: ['locators', 'selectors', 'testing', 'automation', 'playwright', 'selenium', 'cypress'],
    featured: true
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Codifica y decodifica texto en formato Base64 de forma bidireccional',
    category: 'encoders',
    icon: '📝',
    path: '/tools/base64',
    keywords: ['base64', 'encode', 'decode', 'converter'],
    featured: true
  },
  {
    id: 'password-generator',
    name: 'Generador de Contraseñas',
    description: 'Genera contraseñas seguras con opciones personalizables de longitud y caracteres',
    category: 'generators',
    icon: '🔒',
    path: '/tools/password-generator',
    keywords: ['password', 'generator', 'security', 'random'],
    featured: true
  },
  {
    id: 'color-palette',
    name: 'Generador de Paleta de Colores',
    description: 'Crea paletas de colores armoniosas con códigos HEX, RGB y HSL',
    category: 'generators',
    icon: '🎨',
    path: '/tools/color-palette',
    keywords: ['colors', 'palette', 'hex', 'rgb', 'design'],
    featured: true
  },
  {
    id: 'uuid-generator',
    name: 'Generador de UUID',
    description: 'Genera identificadores únicos universales (UUID) v1, v3, v4, v5 con validación y múltiples formatos',
    category: 'generators',
    icon: '🔑',
    path: '/tools/uuid-generator',
    keywords: ['uuid', 'guid', 'identifier', 'unique', 'generator', 'random', 'timestamp', 'namespace'],
    featured: true
  }
];

export const CATEGORIES = {
  converters: 'Convertidores',
  validators: 'Validadores', 
  generators: 'Generadores',
  formatters: 'Formateadores',
  encoders: 'Codificadores',
  utilities: 'Utilidades'
};
import type { Tool, ToolCategory } from '../types';

export const SITE_CONFIG = {
  name: 'Online DevToolsKit',
  description: '🛠️ Portal de herramientas online para desarrolladores - Rápido, minimalista y sin registro',
  url: 'https://onlinedevtoolskit.com',
  author: 'Online DevToolsKit Team',
  keywords: ['herramientas desarrolladores', 'tools online', 'json validator', 'base64', 'jwt decoder', 'devtools', 'utilities']
};

// Phase 5: Enhanced Tool Categories (6 categories for 30+ tools)
export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'converters',
    name: 'Convertidores',
    description: 'Transforma datos entre diferentes formatos',
    icon: '🔄',
    color: 'blue',
    featured: true,
    order: 1,
    targetTools: 8
  },
  {
    id: 'validators',
    name: 'Validadores',
    description: 'Valida sintaxis y estructura de código',
    icon: '✅',
    color: 'green',
    featured: true,
    order: 2,
    targetTools: 4
  },
  {
    id: 'generators',
    name: 'Generadores',
    description: 'Crea datos y contenido automáticamente',
    icon: '🎲',
    color: 'purple',
    featured: true,
    order: 3,
    targetTools: 7
  },
  {
    id: 'encoders',
    name: 'Codificadores',
    description: 'Codifica y decodifica diferentes formatos',
    icon: '🔐',
    color: 'orange',
    featured: true,
    order: 4,
    targetTools: 5
  },
  {
    id: 'formatters',
    name: 'Formateadores',
    description: 'Embellece y minimiza código',
    icon: '✨',
    color: 'pink',
    featured: true,
    order: 5,
    targetTools: 4
  },
  {
    id: 'productivity',
    name: 'Productividad',
    description: 'Herramientas para flujo de desarrollo',
    icon: '⚡',
    color: 'indigo',
    featured: true,
    order: 6,
    targetTools: 5
  }
];

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
    category: 'productivity',
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
    id: 'hash-generator',
    name: 'Generador de Hash',
    description: 'Genera hash seguros MD5, SHA1, SHA256, SHA512 y CRC32 para texto y archivos',
    category: 'encoders',
    icon: '🔐',
    path: '/tools/hash-generator',
    keywords: ['hash', 'md5', 'sha256', 'sha512', 'crc32', 'checksum', 'crypto'],
    featured: true,
    wave: 1
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

// Legacy category mapping (maintain compatibility)
export const CATEGORIES = {
  converters: 'Convertidores',
  validators: 'Validadores',
  generators: 'Generadores',
  formatters: 'Formateadores',
  encoders: 'Codificadores',
  productivity: 'Productividad',
  utilities: 'Utilidades' // Legacy - mapped to productivity
};

// Phase 5: Tool Registry Helper Functions
export const getToolsByCategory = (categoryId: string): Tool[] => {
  return TOOLS.filter(tool => tool.category === categoryId);
};

export const getCategoryInfo = (categoryId: string): ToolCategory | undefined => {
  return TOOL_CATEGORIES.find(category => category.id === categoryId);
};

export const getFeaturedTools = (): Tool[] => {
  return TOOLS.filter(tool => tool.featured);
};

export const getToolById = (toolId: string): Tool | undefined => {
  return TOOLS.find(tool => tool.id === toolId);
};

// Search configuration for Phase 5
export const SEARCH_CONFIG = {
  maxResults: 20,
  threshold: 0.3,
  keys: ['name', 'description', 'keywords'],
  includeScore: true,
  shouldSort: true
};

// Performance budgets for Phase 5 scaling
export const PERFORMANCE_BUDGETS = {
  initialBundle: 150 * 1024, // 150KB
  toolBundle: 100 * 1024,    // 100KB per tool
  totalBudget: 500 * 1024,   // 500KB total
  imageOptimization: true,
  lazyLoading: true
};
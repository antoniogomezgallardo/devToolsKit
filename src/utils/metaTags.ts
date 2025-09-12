/**
 * Dynamic Meta Tags Management for SEO
 * DevToolsKit - SEO Optimization
 */

interface MetaTagConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  robots?: string;
  author?: string;
  generator?: string;
  viewport?: string;
  themeColor?: string;
}

/**
 * Default meta configuration
 */
const DEFAULT_META: MetaTagConfig = {
  title: "Online DevToolsKit - Herramientas Online para Desarrolladores",
  description: "🛠️ Portal de herramientas online para desarrolladores - JSON Validator, JWT Decoder, Base64 Encoder y más. Rápido, minimalista y sin registro.",
  keywords: "herramientas desarrolladores, json validator, jwt decoder, base64 encoder, tools online, devtools, desarrollo web",
  canonical: "https://onlinedevtoolskit.com",
  ogTitle: "Online DevToolsKit - Herramientas para Desarrolladores",
  ogDescription: "Portal de herramientas online para desarrolladores. JSON Validator, JWT Decoder, Base64 Encoder y más.",
  ogImage: "https://onlinedevtoolskit.com/images/og-image.jpg",
  ogUrl: "https://onlinedevtoolskit.com",
  ogType: "website",
  twitterTitle: "Online DevToolsKit - Herramientas para Desarrolladores",
  twitterDescription: "Portal de herramientas online para desarrolladores. Rápido, minimalista y sin registro.",
  twitterImage: "https://onlinedevtoolskit.com/images/twitter-image.jpg",
  twitterCard: "summary_large_image",
  robots: "index, follow",
  author: "DevToolsKit Team",
  generator: "DevToolsKit v1.0",
  viewport: "width=device-width, initial-scale=1.0",
  themeColor: "#3B82F6"
};

/**
 * Page-specific meta configurations
 */
export const PAGE_META_CONFIG: { [key: string]: MetaTagConfig } = {
  "/": {
    title: "Online DevToolsKit - Herramientas Online para Desarrolladores",
    description: "🛠️ Portal de herramientas online para desarrolladores - JSON Validator, JWT Decoder, Base64 Encoder y más. Rápido, minimalista y sin registro.",
    keywords: "herramientas desarrolladores, json validator, jwt decoder, base64 encoder, tools online, devtools, desarrollo web, programacion",
    canonical: "https://onlinedevtoolskit.com",
    ogTitle: "DevToolsKit - Las Mejores Herramientas para Desarrolladores",
    ogDescription: "Descubre nuestro portal de herramientas online gratuitas para desarrolladores. Sin registro, ultra rápido y 100% privado.",
    ogImage: "https://onlinedevtoolskit.com/images/home-og.jpg",
    ogUrl: "https://onlinedevtoolskit.com",
    ogType: "website"
  },
  
  "/tools/json-validator": {
    title: "Validador JSON Online Gratis - DevToolsKit",
    description: "✅ Validador JSON online gratis. Valida, formatea y analiza código JSON con detección de errores en tiempo real. Sin registro requerido.",
    keywords: "validador json, json validator, formatear json, validar json online, json parser, json formatter, herramientas json",
    canonical: "https://onlinedevtoolskit.com/tools/json-validator",
    ogTitle: "Validador JSON Online - Gratis y Sin Registro",
    ogDescription: "Valida y formatea código JSON al instante. Detección de errores en tiempo real, análisis completo y estadísticas detalladas.",
    ogImage: "https://onlinedevtoolskit.com/images/json-validator-og.jpg",
    ogUrl: "https://onlinedevtoolskit.com/tools/json-validator",
    ogType: "website",
    twitterTitle: "🔧 Validador JSON Online - DevToolsKit",
    twitterDescription: "Valida y formatea JSON al instante. Gratis, rápido y sin registro. ¡Pruébalo ahora!"
  },

  "/tools/jwt-decoder": {
    title: "JWT Decoder Online Gratis - DevToolsKit",
    description: "🔐 Decodificador JWT online gratis. Decodifica y valida tokens JWT mostrando header, payload y signature. Sin registro requerido.",
    keywords: "jwt decoder, decodificar jwt, jwt token, jwt validator, jwt parser, json web token, autenticacion",
    canonical: "https://onlinedevtoolskit.com/tools/jwt-decoder",
    ogTitle: "JWT Decoder Online - Decodifica Tokens JWT Gratis",
    ogDescription: "Decodifica y analiza tokens JWT al instante. Muestra header, payload, signature y valida expiración.",
    ogImage: "https://onlinedevtoolskit.com/images/jwt-decoder-og.jpg",
    ogUrl: "https://onlinedevtoolskit.com/tools/jwt-decoder",
    ogType: "website",
    twitterTitle: "🔐 JWT Decoder Online - DevToolsKit",
    twitterDescription: "Decodifica tokens JWT al instante. Gratis, seguro y sin registro. ¡Pruébalo ahora!"
  },

  "/tools/locator-generator": {
    title: "Generador de Locators para Testing - DevToolsKit",
    description: "🎯 Genera locators robustos para testing automatizado. Compatible con Playwright, Selenium, Cypress y más frameworks. Gratis y sin registro.",
    keywords: "locator generator, selector generator, testing automation, playwright locators, selenium selectors, cypress selectors, qa testing, test automation",
    canonical: "https://onlinedevtoolskit.com/tools/locator-generator",
    ogTitle: "Generador de Locators - Testing Automation Tool",
    ogDescription: "Genera locators robustos para Playwright, Selenium y Cypress. Analiza HTML y sugiere los mejores selectores para tus tests automatizados.",
    ogImage: "https://onlinedevtoolskit.com/images/locator-generator-og.jpg",
    ogUrl: "https://onlinedevtoolskit.com/tools/locator-generator",
    ogType: "website",
    twitterTitle: "🎯 Generador de Locators - DevToolsKit",
    twitterDescription: "Genera locators robustos para testing automatizado. Compatible con Playwright, Selenium, Cypress. ¡Gratis!"
  },

  "/tools/base64": {
    title: "Base64 Encoder/Decoder Online Gratis - DevToolsKit",
    description: "📝 Codifica y decodifica texto en Base64 online gratis. Soporte para archivos, formato automático y validación robusta. Sin registro requerido.",
    keywords: "base64 encoder, base64 decoder, codificar base64, decodificar base64, base64 converter, base64 online, encoding, decoding",
    canonical: "https://onlinedevtoolskit.com/tools/base64",
    ogTitle: "Base64 Encoder/Decoder Online - Gratis y Sin Registro",
    ogDescription: "Codifica y decodifica Base64 al instante. Soporte para archivos, formateo automático y validación completa.",
    ogImage: "https://onlinedevtoolskit.com/images/base64-encoder-og.jpg",
    ogUrl: "https://onlinedevtoolskit.com/tools/base64",
    ogType: "website",
    twitterTitle: "📝 Base64 Encoder/Decoder - DevToolsKit",
    twitterDescription: "Codifica/decodifica Base64 al instante. Soporte para archivos, gratis y sin registro. ¡Pruébalo!"
  },

  "/tools/password-generator": {
    title: "Generador de Contraseñas Seguras Online Gratis - DevToolsKit",
    description: "🔒 Genera contraseñas seguras y personalizables online. Indicadores de fortaleza, generación por lotes y 100% privado. Sin registro requerido.",
    keywords: "generador contraseñas, password generator, contraseñas seguras, generar password, secure passwords, random password, password strength, cybersecurity",
    canonical: "https://onlinedevtoolskit.com/tools/password-generator",
    ogTitle: "Generador de Contraseñas Seguras - Online y Gratis",
    ogDescription: "Genera contraseñas ultra seguras al instante. Personalizable, con análisis de fortaleza y generación por lotes. 100% privado y local.",
    ogImage: "https://onlinedevtoolskit.com/images/password-generator-og.jpg",
    ogUrl: "https://onlinedevtoolskit.com/tools/password-generator",
    ogType: "website",
    twitterTitle: "🔒 Generador de Contraseñas Seguras - DevToolsKit",
    twitterDescription: "Genera contraseñas ultra seguras al instante. Personalizable, privado y gratis. ¡Protege tus cuentas!"
  },

  "/tools/color-palette": {
    title: "Generador de Paleta de Colores Online - DevToolsKit",
    description: "🎨 Genera paletas de colores armoniosas con teoría del color. Esquemas complementarios, triádicos, análogos y más. Exportación profesional gratis.",
    keywords: "color palette generator, generador paleta colores, teoria del color, complementario, triadico, analogico, hex colors, rgb colors, design colors, ui colors",
    canonical: "https://onlinedevtoolskit.com/tools/color-palette",
    ogTitle: "Generador de Paleta de Colores - Teoría del Color Online",
    ogDescription: "Crea paletas armoniosas usando teoría del color. Generación automática, simulación de daltonismo, verificación de accesibilidad y exportación profesional.",
    ogImage: "https://onlinedevtoolskit.com/images/color-palette-generator-og.jpg",
    ogUrl: "https://onlinedevtoolskit.com/tools/color-palette",
    ogType: "website",
    twitterTitle: "🎨 Generador de Paletas de Color - DevToolsKit",
    twitterDescription: "Genera paletas armoniosas con teoría del color. Exportación CSS, SCSS, JSON, Tailwind. ¡Gratis!"
  }
};

/**
 * Update meta tag in document head
 */
const updateMetaTag = (property: string, content: string, type: 'name' | 'property' = 'name'): void => {
  let meta = document.querySelector(`meta[${type}="${property}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(type, property);
    document.head.appendChild(meta);
  }
  
  meta.content = content;
};

/**
 * Update canonical link
 */
const updateCanonical = (url: string): void => {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  
  canonical.href = url;
};

/**
 * Update document title
 */
const updateTitle = (title: string): void => {
  document.title = title;
};

/**
 * Update all meta tags for a page
 */
export const updateMetaTags = (path: string): void => {
  const config = { ...DEFAULT_META, ...PAGE_META_CONFIG[path] };
  
  // Basic meta tags
  updateTitle(config.title);
  updateMetaTag('description', config.description);
  
  if (config.keywords) {
    updateMetaTag('keywords', config.keywords);
  }
  
  if (config.robots) {
    updateMetaTag('robots', config.robots);
  }
  
  if (config.author) {
    updateMetaTag('author', config.author);
  }
  
  if (config.generator) {
    updateMetaTag('generator', config.generator);
  }
  
  // Canonical URL
  if (config.canonical) {
    updateCanonical(config.canonical);
  }
  
  // Open Graph tags
  updateMetaTag('og:title', config.ogTitle || config.title, 'property');
  updateMetaTag('og:description', config.ogDescription || config.description, 'property');
  updateMetaTag('og:type', config.ogType || 'website', 'property');
  updateMetaTag('og:url', config.ogUrl || config.canonical || window.location.href, 'property');
  
  if (config.ogImage) {
    updateMetaTag('og:image', config.ogImage, 'property');
    updateMetaTag('og:image:width', '1200', 'property');
    updateMetaTag('og:image:height', '630', 'property');
    updateMetaTag('og:image:type', 'image/jpeg', 'property');
  }
  
  // Twitter Card tags
  updateMetaTag('twitter:card', config.twitterCard || 'summary_large_image');
  updateMetaTag('twitter:title', config.twitterTitle || config.ogTitle || config.title);
  updateMetaTag('twitter:description', config.twitterDescription || config.ogDescription || config.description);
  
  if (config.twitterImage) {
    updateMetaTag('twitter:image', config.twitterImage);
  }
  
  // Additional SEO tags
  updateMetaTag('theme-color', config.themeColor || '#3B82F6');
  updateMetaTag('msapplication-TileColor', config.themeColor || '#3B82F6');
  
  // Language and locale
  updateMetaTag('og:locale', 'es_ES', 'property');
  updateMetaTag('og:site_name', 'DevToolsKit', 'property');
  
  // Enhanced meta for tools
  if (path.includes('/tools/')) {
    updateMetaTag('og:type', 'article', 'property');
    updateMetaTag('article:author', 'DevToolsKit', 'property');
    updateMetaTag('article:section', 'Herramientas de Desarrollo', 'property');
    updateMetaTag('article:tag', config.keywords || '', 'property');
  }
  
  console.log(`🏷️ SEO: Meta tags updated for ${path}`);
};

/**
 * Add JSON-LD structured data for enhanced SEO
 */
export const addWebsiteJsonLd = (): void => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DevToolsKit",
    "url": "https://onlinedevtoolskit.com",
    "description": "Portal de herramientas online para desarrolladores",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://onlinedevtoolskit.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DevToolsKit",
      "url": "https://onlinedevtoolskit.com"
    }
  };
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
};

/**
 * Initialize meta tags for the current page
 */
export const initializeMetaTags = (): void => {
  const path = window.location.pathname;
  updateMetaTags(path);
};

/**
 * Add favicon and app icons if not present
 */
export const addAppIcons = (): void => {
  // Check if favicon exists
  if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🛠️</text></svg>';
    document.head.appendChild(favicon);
  }
  
  // Apple touch icon
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.sizes = '180x180';
    appleTouchIcon.href = '/images/apple-touch-icon.png';
    document.head.appendChild(appleTouchIcon);
  }
  
  // PWA manifest
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = '/manifest.json';
    document.head.appendChild(manifest);
  }
};
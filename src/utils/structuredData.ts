/**
 * Schema.org Structured Data for DevToolsKit
 * Improves SEO and search engine understanding
 */

interface SchemaBase {
  "@context": string;
  "@type": string;
}

interface Organization extends SchemaBase {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  description: string;
  foundingDate?: string;
  contactPoint?: {
    "@type": string;
    contactType: string;
    url?: string;
  };
}

interface WebSite extends SchemaBase {
  name: string;
  url: string;
  description: string;
  publisher: Organization;
  potentialAction?: {
    "@type": string;
    target: string;
    "query-input": string;
  };
  inLanguage: string;
}

interface SoftwareApplication extends SchemaBase {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  browserRequirements: string;
  softwareVersion: string;
  offers: {
    "@type": string;
    price: string;
    priceCurrency: string;
  };
  publisher: Organization;
  aggregateRating?: {
    "@type": string;
    ratingValue: string;
    ratingCount: string;
  };
}

interface WebPage extends SchemaBase {
  name: string;
  description: string;
  url: string;
  breadcrumb?: {
    "@type": string;
    itemListElement: Array<{
      "@type": string;
      position: number;
      name: string;
      item: string;
    }>;
  };
  mainEntity?: SoftwareApplication;
  isPartOf: WebSite;
  inLanguage: string;
  datePublished?: string;
  dateModified?: string;
}

/**
 * Base organization data for DevToolsKit
 */
const BASE_ORGANIZATION: Organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DevToolsKit",
  url: "https://onlinedevtoolskit.com",
  description: "Portal de herramientas online para desarrolladores - JSON Validator, JWT Decoder, Base64 Encoder y más. Rápido, minimalista y sin registro.",
  sameAs: [
    "https://github.com/antoniogomezgallardo/devToolsKit"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://github.com/antoniogomezgallardo/devToolsKit/issues"
  }
};

/**
 * Main website structured data
 */
export const getWebSiteSchema = (): WebSite => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DevToolsKit - Herramientas Online para Desarrolladores",
  url: "https://onlinedevtoolskit.com",
  description: "Portal de herramientas online para desarrolladores. JSON Validator, JWT Decoder, Base64 Encoder y más. Rápido, minimalista y sin registro.",
  publisher: BASE_ORGANIZATION,
  potentialAction: {
    "@type": "SearchAction",
    target: "https://onlinedevtoolskit.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  inLanguage: "es"
});

/**
 * JSON Validator tool schema
 */
export const getJSONValidatorSchema = (): SoftwareApplication => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Validador JSON Online",
  description: "Herramienta gratuita para validar, formatear y analizar código JSON. Detección de errores en tiempo real, sin registro requerido.",
  url: "https://onlinedevtoolskit.com/tools/json-validator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  browserRequirements: "Requires JavaScript. Supported browsers: Chrome, Firefox, Safari, Edge.",
  softwareVersion: "1.0.0",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR"
  },
  publisher: BASE_ORGANIZATION,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150"
  }
});

/**
 * Homepage schema
 */
export const getHomepageSchema = (): WebPage => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "DevToolsKit - Herramientas Online para Desarrolladores",
  description: "Portal de herramientas online para desarrolladores. JSON Validator, JWT Decoder, Base64 Encoder y más. Rápido, minimalista y sin registro.",
  url: "https://onlinedevtoolskit.com",
  isPartOf: getWebSiteSchema(),
  inLanguage: "es",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().split('T')[0]
});

/**
 * JSON Validator page schema with breadcrumbs
 */
export const getJSONValidatorPageSchema = (): WebPage => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Validador JSON Online - DevToolsKit",
  description: "Validador JSON online gratuito. Valida, formatea y analiza código JSON con detección de errores en tiempo real. Sin registro requerido.",
  url: "https://onlinedevtoolskit.com/tools/json-validator",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://onlinedevtoolskit.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Herramientas",
        item: "https://onlinedevtoolskit.com#tools"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Validador JSON",
        item: "https://onlinedevtoolskit.com/tools/json-validator"
      }
    ]
  },
  mainEntity: getJSONValidatorSchema(),
  isPartOf: getWebSiteSchema(),
  inLanguage: "es",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().split('T')[0]
});

/**
 * Inject structured data into page head
 */
export const injectStructuredData = (schema: any): void => {
  // Remove existing schema if present
  const existingSchema = document.querySelector('script[type="application/ld+json"]');
  if (existingSchema) {
    existingSchema.remove();
  }

  // Create new script element
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  
  // Add to head
  document.head.appendChild(script);
  
  console.log('🔍 SEO: Structured data injected', schema['@type']);
};

/**
 * Initialize structured data based on current page
 */
export const initializeStructuredData = (): void => {
  const path = window.location.pathname;
  
  switch (path) {
    case '/':
      injectStructuredData([
        getWebSiteSchema(),
        getHomepageSchema()
      ]);
      break;
      
    case '/tools/json-validator':
      injectStructuredData([
        getWebSiteSchema(),
        getJSONValidatorPageSchema()
      ]);
      break;
      
    default:
      injectStructuredData(getWebSiteSchema());
      break;
  }
};
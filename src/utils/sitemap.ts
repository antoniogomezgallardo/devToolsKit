/**
 * Dynamic Sitemap Generation for DevToolsKit
 * SEO Optimization - XML Sitemap
 */

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

/**
 * Get current date in ISO format for sitemap
 */
const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Base URLs configuration for sitemap
 */
export const SITEMAP_URLS: SitemapUrl[] = [
  {
    loc: 'https://onlinedevtoolskit.com/',
    lastmod: getCurrentDate(),
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    loc: 'https://onlinedevtoolskit.com/tools/json-validator',
    lastmod: getCurrentDate(),
    changefreq: 'weekly',
    priority: '0.9'
  }
];

/**
 * Generate XML sitemap content
 */
export const generateSitemap = (urls: SitemapUrl[] = SITEMAP_URLS): string => {
  const urlEntries = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = (): string => {
  return `# DevToolsKit - robots.txt
# Permitir acceso a todos los crawlers

User-agent: *
Allow: /

# Sitemap location
Sitemap: https://onlinedevtoolskit.com/sitemap.xml

# Crawl-delay para ser amigables con los servers
Crawl-delay: 1

# Bloquear archivos que no deben indexarse
Disallow: /dist/
Disallow: /node_modules/
Disallow: /*.js$
Disallow: /*.css$
Disallow: /*.map$

# Permitir herramientas específicas
Allow: /tools/json-validator
Allow: /tools/jwt-decoder
Allow: /tools/base64-encoder
Allow: /tools/password-generator
Allow: /tools/color-palette

# Información adicional
# Sitio web: https://onlinedevtoolskit.com
# Contacto: https://github.com/antoniogomezgallardo/devToolsKit
`;
};

/**
 * Create and download sitemap file
 */
export const downloadSitemap = (): void => {
  const sitemapContent = generateSitemap();
  const blob = new Blob([sitemapContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  console.log('📄 SEO: Sitemap downloaded successfully');
};

/**
 * Create and download robots.txt file
 */
export const downloadRobotsTxt = (): void => {
  const robotsContent = generateRobotsTxt();
  const blob = new Blob([robotsContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'robots.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  console.log('🤖 SEO: Robots.txt downloaded successfully');
};

/**
 * Auto-generate sitemap with current tools
 */
export const generateDynamicSitemap = (): string => {
  const baseUrls: SitemapUrl[] = [
    {
      loc: 'https://onlinedevtoolskit.com/',
      lastmod: getCurrentDate(),
      changefreq: 'daily',
      priority: '1.0'
    }
  ];
  
  // Add tool pages dynamically
  const toolUrls: SitemapUrl[] = [
    {
      loc: 'https://onlinedevtoolskit.com/tools/json-validator',
      lastmod: getCurrentDate(),
      changefreq: 'weekly',
      priority: '0.9'
    }
    // Future tools will be added here automatically
  ];
  
  const allUrls = [...baseUrls, ...toolUrls];
  return generateSitemap(allUrls);
};

/**
 * Submit sitemap to search engines
 */
export const submitToSearchEngines = (): void => {
  const sitemapUrl = 'https://onlinedevtoolskit.com/sitemap.xml';
  
  // Google Search Console submission URL
  const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  
  // Bing Webmaster Tools submission URL  
  const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  
  console.log('🔍 SEO: Submit sitemap URLs:');
  console.log('Google:', googleUrl);
  console.log('Bing:', bingUrl);
  
  // Open submission URLs (manual process)
  window.open(googleUrl, '_blank');
  setTimeout(() => {
    window.open(bingUrl, '_blank');
  }, 2000);
};

/**
 * Validate sitemap structure
 */
export const validateSitemap = (xmlContent: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Basic XML validation
  if (!xmlContent.includes('<?xml version="1.0"')) {
    errors.push('Missing XML declaration');
  }
  
  if (!xmlContent.includes('<urlset')) {
    errors.push('Missing urlset element');
  }
  
  if (!xmlContent.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    errors.push('Missing or incorrect xmlns declaration');
  }
  
  // Check for required URL elements
  const urlMatches = xmlContent.match(/<url>/g);
  const locMatches = xmlContent.match(/<loc>https?:\/\/[^<]+<\/loc>/g);
  
  if (!urlMatches || !locMatches) {
    errors.push('Missing URL entries or loc elements');
  } else if (urlMatches.length !== locMatches.length) {
    errors.push('Mismatch between URL entries and loc elements');
  }
  
  // Validate priority values
  const priorityMatches = xmlContent.match(/<priority>([0-9.]+)<\/priority>/g);
  if (priorityMatches) {
    priorityMatches.forEach(match => {
      const value = parseFloat(match.replace(/<\/?priority>/g, ''));
      if (value < 0 || value > 1) {
        errors.push(`Invalid priority value: ${value} (must be between 0.0 and 1.0)`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Initialize sitemap generation for development
 */
export const initializeSitemap = (): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🗺️ SEO: Sitemap utility loaded');
    console.log('Use generateSitemap() or downloadSitemap() in console');
  }
};
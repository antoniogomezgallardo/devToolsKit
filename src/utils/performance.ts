/**
 * Performance Monitoring and Core Web Vitals
 * DevToolsKit - SEO & UX Optimization
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface CoreWebVitals {
  LCP?: PerformanceMetric; // Largest Contentful Paint
  FID?: PerformanceMetric; // First Input Delay
  CLS?: PerformanceMetric; // Cumulative Layout Shift
  FCP?: PerformanceMetric; // First Contentful Paint
  TTFB?: PerformanceMetric; // Time to First Byte
}

/**
 * Core Web Vitals thresholds (Google's standards)
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 }
};

/**
 * Get rating based on value and thresholds
 */
const getRating = (value: number, metric: keyof typeof THRESHOLDS): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = THRESHOLDS[metric];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

/**
 * Track Largest Contentful Paint (LCP)
 */
const measureLCP = (): Promise<PerformanceMetric | null> => {
  return new Promise((resolve) => {
    if (!('PerformanceObserver' in window)) {
      resolve(null);
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      
      if (lastEntry) {
        const value = lastEntry.startTime;
        const metric: PerformanceMetric = {
          name: 'LCP',
          value: Math.round(value),
          rating: getRating(value, 'LCP'),
          timestamp: Date.now()
        };
        resolve(metric);
        observer.disconnect();
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 10000);
    } catch (error) {
      resolve(null);
    }
  });
};

/**
 * Track First Input Delay (FID)
 */
const measureFID = (): Promise<PerformanceMetric | null> => {
  return new Promise((resolve) => {
    if (!('PerformanceObserver' in window)) {
      resolve(null);
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0] as any;
      
      if (firstEntry) {
        const value = firstEntry.processingStart - firstEntry.startTime;
        const metric: PerformanceMetric = {
          name: 'FID',
          value: Math.round(value),
          rating: getRating(value, 'FID'),
          timestamp: Date.now()
        };
        resolve(metric);
        observer.disconnect();
      }
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
      
      // Timeout after 30 seconds (user might not interact)
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 30000);
    } catch (error) {
      resolve(null);
    }
  });
};

/**
 * Track Cumulative Layout Shift (CLS)
 */
const measureCLS = (): Promise<PerformanceMetric | null> => {
  return new Promise((resolve) => {
    if (!('PerformanceObserver' in window)) {
      resolve(null);
      return;
    }

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (sessionValue && entry.startTime - lastSessionEntry.startTime < 1000 && 
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
          }
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Measure for 5 seconds then resolve
      setTimeout(() => {
        observer.disconnect();
        const metric: PerformanceMetric = {
          name: 'CLS',
          value: Math.round(clsValue * 1000) / 1000,
          rating: getRating(clsValue, 'CLS'),
          timestamp: Date.now()
        };
        resolve(metric);
      }, 5000);
    } catch (error) {
      resolve(null);
    }
  });
};

/**
 * Track First Contentful Paint (FCP)
 */
const measureFCP = (): Promise<PerformanceMetric | null> => {
  return new Promise((resolve) => {
    if (!('PerformanceObserver' in window)) {
      resolve(null);
      return;
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          const value = entry.startTime;
          const metric: PerformanceMetric = {
            name: 'FCP',
            value: Math.round(value),
            rating: getRating(value, 'FCP'),
            timestamp: Date.now()
          };
          resolve(metric);
          observer.disconnect();
          return;
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
      
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 5000);
    } catch (error) {
      resolve(null);
    }
  });
};

/**
 * Track Time to First Byte (TTFB)
 */
const measureTTFB = (): PerformanceMetric | null => {
  if (!performance.navigation || !performance.timing) {
    return null;
  }

  const navigationStart = performance.timing.navigationStart;
  const responseStart = performance.timing.responseStart;
  const value = responseStart - navigationStart;

  return {
    name: 'TTFB',
    value: Math.round(value),
    rating: getRating(value, 'TTFB'),
    timestamp: Date.now()
  };
};

/**
 * Get all Core Web Vitals
 */
export const getCoreWebVitals = async (): Promise<CoreWebVitals> => {
  const vitals: CoreWebVitals = {};

  try {
    const [lcp, fid, cls, fcp] = await Promise.all([
      measureLCP(),
      measureFID(),
      measureCLS(),
      measureFCP()
    ]);

    if (lcp) vitals.LCP = lcp;
    if (fid) vitals.FID = fid;
    if (cls) vitals.CLS = cls;
    if (fcp) vitals.FCP = fcp;
    
    const ttfb = measureTTFB();
    if (ttfb) vitals.TTFB = ttfb;

  } catch (error) {
    console.warn('Error measuring Core Web Vitals:', error);
  }

  return vitals;
};

/**
 * Track performance metrics to Google Analytics
 */
export const trackPerformanceMetrics = (vitals: CoreWebVitals): void => {
  Object.entries(vitals).forEach(([metric, data]) => {
    if (data && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric,
        value: Math.round(data.value),
        custom_parameter_1: data.rating,
        metric_name: data.name,
        metric_value: data.value,
        metric_rating: data.rating
      });
    }
  });
};

/**
 * Performance monitoring initialization
 */
export const initializePerformanceMonitoring = (): void => {
  // Wait for page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMonitoring);
  } else {
    startMonitoring();
  }
};

/**
 * Start performance monitoring
 */
const startMonitoring = async (): Promise<void> => {
  try {
    // Wait a bit for the page to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const vitals = await getCoreWebVitals();
    
    if (Object.keys(vitals).length > 0) {
      console.log('📊 Core Web Vitals:', vitals);
      trackPerformanceMetrics(vitals);
      
      // Store in localStorage for debugging
      localStorage.setItem('devtools-performance', JSON.stringify(vitals));
    }
  } catch (error) {
    console.warn('Performance monitoring failed:', error);
  }
};

/**
 * Get performance insights and recommendations
 */
export const getPerformanceInsights = (vitals: CoreWebVitals): { [key: string]: string[] } => {
  const insights: { [key: string]: string[] } = {};

  if (vitals.LCP && vitals.LCP.rating !== 'good') {
    insights.LCP = [
      'Optimizar imágenes y usar formatos modernos (WebP, AVIF)',
      'Implementar lazy loading para imágenes',
      'Minimizar CSS y JavaScript críticos',
      'Usar CDN para recursos estáticos'
    ];
  }

  if (vitals.FID && vitals.FID.rating !== 'good') {
    insights.FID = [
      'Reducir el trabajo del hilo principal',
      'Dividir tareas largas en chunks más pequeños',
      'Implementar code splitting',
      'Optimizar event listeners'
    ];
  }

  if (vitals.CLS && vitals.CLS.rating !== 'good') {
    insights.CLS = [
      'Definir dimensiones explícitas para imágenes',
      'Reservar espacio para contenido dinámico',
      'Usar transform en lugar de cambiar propiedades de layout',
      'Cargar fuentes de manera optimizada'
    ];
  }

  if (vitals.FCP && vitals.FCP.rating !== 'good') {
    insights.FCP = [
      'Optimizar el Critical Rendering Path',
      'Minimizar el CSS above-the-fold',
      'Implementar resource hints (preload, prefetch)',
      'Optimizar el tiempo de respuesta del servidor'
    ];
  }

  if (vitals.TTFB && vitals.TTFB.rating !== 'good') {
    insights.TTFB = [
      'Optimizar configuración del servidor',
      'Usar CDN global',
      'Implementar cache de servidor',
      'Revisar consultas de base de datos'
    ];
  }

  return insights;
};

/**
 * Generate performance report
 */
export const generatePerformanceReport = async (): Promise<string> => {
  const vitals = await getCoreWebVitals();
  const insights = getPerformanceInsights(vitals);
  
  let report = '# DevToolsKit - Performance Report\n\n';
  report += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  report += '## Core Web Vitals\n\n';
  
  Object.entries(vitals).forEach(([metric, data]) => {
    if (data) {
      const emoji = data.rating === 'good' ? '✅' : data.rating === 'needs-improvement' ? '⚠️' : '❌';
      report += `- ${emoji} **${metric}**: ${data.value}ms (${data.rating})\n`;
    }
  });
  
  if (Object.keys(insights).length > 0) {
    report += '\n## Recommendations\n\n';
    
    Object.entries(insights).forEach(([metric, recommendations]) => {
      report += `### ${metric}\n`;
      recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
      report += '\n';
    });
  }
  
  return report;
};
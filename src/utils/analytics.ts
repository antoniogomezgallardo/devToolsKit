// Google Analytics 4 Utilities
// GA4 ID: G-G8CSCGH4HS

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Analytics Events for DevToolsKit
 */
export const AnalyticsEvents = {
  // Tool Usage Events
  TOOL_USED: 'tool_used',
  TOOL_SUCCESS: 'tool_success',
  TOOL_ERROR: 'tool_error',
  
  // JSON Validator Specific
  JSON_VALIDATED: 'json_validated',
  JSON_VALIDATION_SUCCESS: 'json_validation_success',
  JSON_VALIDATION_ERROR: 'json_validation_error',
  
  // JWT Decoder Specific
  JWT_DECODED: 'jwt_decoded',
  JWT_DECODE_SUCCESS: 'jwt_decode_success',
  JWT_DECODE_ERROR: 'jwt_decode_error',
  
  // User Interactions
  COPY_RESULT: 'copy_result',
  CLEAR_INPUT: 'clear_input',
  
  // Navigation
  PAGE_VIEW: 'page_view',
  TOOL_PAGE_VIEW: 'tool_page_view',
  
  // Performance
  WEB_VITALS: 'web_vitals',
  PERFORMANCE_REPORT: 'performance_report'
} as const;

/**
 * Tool Names for consistent tracking
 */
export const ToolNames = {
  JSON_VALIDATOR: 'json_validator',
  JWT_DECODER: 'jwt_decoder',
  BASE64_ENCODER: 'base64_encoder',
  PASSWORD_GENERATOR: 'password_generator',
  COLOR_PALETTE: 'color_palette'
} as const;

/**
 * Track custom events in Google Analytics 4
 */
export const trackEvent = (
  eventName: string,
  parameters: Record<string, any> = {}
): void => {
  // Check if gtag is available (analytics loaded)
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', eventName, {
        event_category: 'DevToolsKit',
        event_label: parameters.tool_name || 'unknown',
        value: parameters.value || 1,
        custom_parameter_1: parameters.tool_name,
        ...parameters
      });
      
      console.log(`📊 Analytics: ${eventName}`, parameters);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  } else {
    console.warn('Google Analytics not loaded');
  }
};

/**
 * Track tool usage
 */
export const trackToolUsage = (
  toolName: string,
  action: 'start' | 'success' | 'error',
  additionalData: Record<string, any> = {}
): void => {
  const eventMap = {
    start: AnalyticsEvents.TOOL_USED,
    success: AnalyticsEvents.TOOL_SUCCESS,
    error: AnalyticsEvents.TOOL_ERROR
  };

  trackEvent(eventMap[action], {
    tool_name: toolName,
    action,
    ...additionalData
  });
};

/**
 * Track JSON Validator specific events
 */
export const trackJSONValidator = {
  validate: (inputLength: number) => {
    trackEvent(AnalyticsEvents.JSON_VALIDATED, {
      tool_name: ToolNames.JSON_VALIDATOR,
      input_length: inputLength,
      action: 'validate'
    });
  },
  
  success: (inputLength: number, outputLength: number) => {
    trackEvent(AnalyticsEvents.JSON_VALIDATION_SUCCESS, {
      tool_name: ToolNames.JSON_VALIDATOR,
      input_length: inputLength,
      output_length: outputLength,
      action: 'success'
    });
  },
  
  error: (inputLength: number, errorType: string) => {
    trackEvent(AnalyticsEvents.JSON_VALIDATION_ERROR, {
      tool_name: ToolNames.JSON_VALIDATOR,
      input_length: inputLength,
      error_type: errorType,
      action: 'error'
    });
  }
};

/**
 * Track page views
 */
export const trackPageView = (pagePath: string, pageTitle: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-G8CSCGH4HS', {
      page_path: pagePath,
      page_title: pageTitle
    });
    
    trackEvent(AnalyticsEvents.PAGE_VIEW, {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
};

/**
 * Track JWT Decoder specific events
 */
export const trackJWTDecoder = {
  decode: (tokenLength: number, hasSignature: boolean) => {
    trackEvent(AnalyticsEvents.JWT_DECODED, {
      tool_name: ToolNames.JWT_DECODER,
      token_length: tokenLength,
      has_signature: hasSignature,
      action: 'decode'
    });
  },
  
  success: (tokenLength: number, algorithm: string, isExpired: boolean) => {
    trackEvent(AnalyticsEvents.JWT_DECODE_SUCCESS, {
      tool_name: ToolNames.JWT_DECODER,
      token_length: tokenLength,
      algorithm: algorithm,
      is_expired: isExpired,
      action: 'success'
    });
  },
  
  error: (tokenLength: number, errorType: string) => {
    trackEvent(AnalyticsEvents.JWT_DECODE_ERROR, {
      tool_name: ToolNames.JWT_DECODER,
      token_length: tokenLength,
      error_type: errorType,
      action: 'error'
    });
  }
};

/**
 * Track user interactions
 */
export const trackUserInteraction = {
  copyResult: (toolName: string) => {
    trackEvent(AnalyticsEvents.COPY_RESULT, {
      tool_name: toolName,
      action: 'copy'
    });
  },
  
  clearInput: (toolName: string) => {
    trackEvent(AnalyticsEvents.CLEAR_INPUT, {
      tool_name: toolName,
      action: 'clear'
    });
  }
};

/**
 * Initialize Analytics with user consent
 */
export const initializeAnalytics = (): void => {
  if (typeof window !== 'undefined') {
    // Track initial page load
    trackPageView(window.location.pathname, document.title);
    
    console.log('📊 Google Analytics 4 initialized for DevToolsKit');
  }
};
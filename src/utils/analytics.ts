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
  
  // Base64 Encoder/Decoder Specific
  BASE64_ENCODED: 'base64_encoded',
  BASE64_DECODED: 'base64_decoded',
  BASE64_SUCCESS: 'base64_success',
  BASE64_ERROR: 'base64_error',
  
  // Password Generator Specific
  PASSWORD_GENERATED: 'password_generated',
  PASSWORD_GENERATION_SUCCESS: 'password_generation_success',
  PASSWORD_GENERATION_ERROR: 'password_generation_error',
  PASSWORD_BATCH_GENERATED: 'password_batch_generated',
  
  // Color Palette Generator Specific
  COLOR_PALETTE_GENERATED: 'color_palette_generated',
  COLOR_PALETTE_EXPORTED: 'color_palette_exported',
  COLOR_PALETTE_SUCCESS: 'color_palette_success',
  COLOR_PALETTE_ERROR: 'color_palette_error',
  
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
 * Track Base64 Encoder/Decoder specific events
 */
export const trackBase64EncoderDecoder = {
  encode: (inputLength: number, outputLength: number) => {
    trackEvent(AnalyticsEvents.BASE64_ENCODED, {
      tool_name: ToolNames.BASE64_ENCODER,
      input_length: inputLength,
      output_length: outputLength,
      action: 'encode'
    });
  },
  
  decode: (inputLength: number, outputLength: number) => {
    trackEvent(AnalyticsEvents.BASE64_DECODED, {
      tool_name: ToolNames.BASE64_ENCODER,
      input_length: inputLength,
      output_length: outputLength,
      action: 'decode'
    });
  },
  
  success: (operation: 'encode' | 'decode', inputLength: number, outputLength: number) => {
    trackEvent(AnalyticsEvents.BASE64_SUCCESS, {
      tool_name: ToolNames.BASE64_ENCODER,
      operation: operation,
      input_length: inputLength,
      output_length: outputLength,
      action: 'success'
    });
  },
  
  error: (operation: 'encode' | 'decode', inputLength: number, errorType: string) => {
    trackEvent(AnalyticsEvents.BASE64_ERROR, {
      tool_name: ToolNames.BASE64_ENCODER,
      operation: operation,
      input_length: inputLength,
      error_type: errorType,
      action: 'error'
    });
  },
  
  fileUpload: (fileSize: number, fileType: string) => {
    trackEvent('base64_file_upload', {
      tool_name: ToolNames.BASE64_ENCODER,
      file_size: fileSize,
      file_type: fileType,
      action: 'file_upload'
    });
  },
  
  formatOutput: (outputLength: number) => {
    trackEvent('base64_format_output', {
      tool_name: ToolNames.BASE64_ENCODER,
      output_length: outputLength,
      action: 'format'
    });
  }
};

/**
 * Track Password Generator specific events
 */
export const trackPasswordGenerator = {
  generate: (length: number, options: any) => {
    trackEvent(AnalyticsEvents.PASSWORD_GENERATED, {
      tool_name: ToolNames.PASSWORD_GENERATOR,
      password_length: length,
      include_uppercase: options.includeUppercase,
      include_lowercase: options.includeLowercase,
      include_numbers: options.includeNumbers,
      include_symbols: options.includeSymbols,
      exclude_similar: options.excludeSimilar,
      exclude_ambiguous: options.excludeAmbiguous,
      action: 'generate'
    });
  },
  
  success: (length: number, strengthScore: number, entropy: number) => {
    trackEvent(AnalyticsEvents.PASSWORD_GENERATION_SUCCESS, {
      tool_name: ToolNames.PASSWORD_GENERATOR,
      password_length: length,
      strength_score: strengthScore,
      entropy_bits: Math.round(entropy),
      action: 'success'
    });
  },
  
  error: (length: number, errorType: string) => {
    trackEvent(AnalyticsEvents.PASSWORD_GENERATION_ERROR, {
      tool_name: ToolNames.PASSWORD_GENERATOR,
      password_length: length,
      error_type: errorType,
      action: 'error'
    });
  },

  generateBatch: (count: number, options: any) => {
    trackEvent(AnalyticsEvents.PASSWORD_BATCH_GENERATED, {
      tool_name: ToolNames.PASSWORD_GENERATOR,
      batch_count: count,
      password_length: options.length,
      include_uppercase: options.includeUppercase,
      include_lowercase: options.includeLowercase,
      include_numbers: options.includeNumbers,
      include_symbols: options.includeSymbols,
      action: 'batch_generate'
    });
  },

  batchSuccess: (requested: number, generated: number) => {
    trackEvent('password_batch_success', {
      tool_name: ToolNames.PASSWORD_GENERATOR,
      requested_count: requested,
      generated_count: generated,
      action: 'batch_success'
    });
  },

  batchError: (count: number, errorType: string) => {
    trackEvent('password_batch_error', {
      tool_name: ToolNames.PASSWORD_GENERATOR,
      batch_count: count,
      error_type: errorType,
      action: 'batch_error'
    });
  }
};

/**
 * Track Color Palette Generator specific events
 */
export const trackColorPaletteGenerator = {
  generate: (harmony: string, colorsCount: number, baseColor: string) => {
    trackEvent(AnalyticsEvents.COLOR_PALETTE_GENERATED, {
      tool_name: ToolNames.COLOR_PALETTE,
      harmony: harmony,
      colors_count: colorsCount,
      base_color: baseColor,
      action: 'generate'
    });
  },
  
  export: (format: string, colorsCount: number) => {
    trackEvent(AnalyticsEvents.COLOR_PALETTE_EXPORTED, {
      tool_name: ToolNames.COLOR_PALETTE,
      export_format: format,
      colors_count: colorsCount,
      action: 'export'
    });
  },
  
  success: (action: 'generate' | 'export', harmony: string, colorsCount: number) => {
    trackEvent(AnalyticsEvents.COLOR_PALETTE_SUCCESS, {
      tool_name: ToolNames.COLOR_PALETTE,
      action: action,
      harmony: harmony,
      colors_count: colorsCount,
      operation_type: action
    });
  },
  
  error: (action: 'generate' | 'export', errorType: string, harmony?: string) => {
    trackEvent(AnalyticsEvents.COLOR_PALETTE_ERROR, {
      tool_name: ToolNames.COLOR_PALETTE,
      action: action,
      error_type: errorType,
      harmony: harmony || 'unknown',
      operation_type: action
    });
  },
  
  randomGeneration: () => {
    trackEvent('color_palette_random_generate', {
      tool_name: ToolNames.COLOR_PALETTE,
      action: 'random_generate'
    });
  },
  
  colorBlindnessSimulation: (type: string) => {
    trackEvent('color_palette_accessibility_simulation', {
      tool_name: ToolNames.COLOR_PALETTE,
      simulation_type: type,
      action: 'accessibility_check'
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
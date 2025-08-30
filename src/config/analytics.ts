/**
 * Google Analytics 4 Configuration
 * DevToolsKit Analytics Setup
 */

export const GA4_CONFIG = {
  // Measurement ID
  MEASUREMENT_ID: 'G-G8CSCGH4HS',
  
  // Custom dimensions setup (configure in GA4 dashboard)
  CUSTOM_DIMENSIONS: {
    TOOL_NAME: 'tool_name',
    ACTION_TYPE: 'action_type',
    INPUT_LENGTH: 'input_length',
    ERROR_TYPE: 'error_type'
  },
  
  // Enhanced ecommerce parameters (future use)
  ENHANCED_ECOMMERCE: {
    ITEM_CATEGORY: 'DevTools',
    ITEM_BRAND: 'DevToolsKit',
    VALUE_CURRENCY: 'EUR'
  },
  
  // Debug mode (set to false in production)
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  
  // Privacy settings
  PRIVACY: {
    ANONYMIZE_IP: true,
    RESPECT_DNT: true, // Do Not Track
    COOKIE_EXPIRES: 63072000 // 2 years in seconds
  }
};

/**
 * Goals and conversions to track
 */
export const GA4_GOALS = {
  // Primary goals
  TOOL_USAGE: 'tool_used',
  SUCCESSFUL_VALIDATION: 'successful_validation',
  RESULT_COPIED: 'result_copied',
  
  // Secondary goals  
  MULTIPLE_TOOLS_USED: 'multiple_tools_session',
  POWER_USER: 'power_user_session', // 5+ validations
  
  // Future monetization goals
  AD_INTERACTION: 'ad_interaction',
  PREMIUM_FEATURE_VIEWED: 'premium_viewed'
};

/**
 * Custom events for better analytics
 */
export const CUSTOM_EVENTS = {
  // JSON Validator specific
  JSON_SIZE_LARGE: 'json_large_file', // >10KB
  JSON_COMPLEX: 'json_complex_structure', // Deep nesting
  JSON_ERROR_COMMON: 'json_common_error', // Common syntax errors
  
  // User behavior
  FAST_USER: 'fast_validation', // <5 seconds
  THOROUGH_USER: 'thorough_validation', // Uses multiple examples
  
  // Performance
  SLOW_LOAD: 'slow_page_load', // >3 seconds
  MOBILE_USER: 'mobile_usage'
};

/**
 * Audience segmentation
 */
export const USER_SEGMENTS = {
  NEW_USER: 'new_user',
  RETURNING_USER: 'returning_user',
  POWER_USER: 'power_user', // 10+ sessions
  DEVELOPER: 'developer_user', // Uses technical tools
  DESIGNER: 'designer_user' // Uses design tools
};
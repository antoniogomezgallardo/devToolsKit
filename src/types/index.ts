export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  path: string;
  keywords: string[];
  featured?: boolean;
}

export type ToolCategory = 
  | 'converters'
  | 'validators' 
  | 'generators'
  | 'formatters'
  | 'encoders'
  | 'utilities';

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  warning?: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
}
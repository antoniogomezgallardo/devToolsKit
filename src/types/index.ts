export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategoryId;
  icon: string;
  path: string;
  keywords: string[];
  featured?: boolean;
  wave?: number; // Phase 5: Wave number for development tracking
}

export type ToolCategoryId =
  | 'converters'
  | 'validators'
  | 'generators'
  | 'formatters'
  | 'encoders'
  | 'productivity'
  | 'utilities'; // Legacy support

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
  description: string;
  icon: string;
  color: string;
  featured: boolean;
  order: number;
  targetTools: number;
}

// Phase 5: Search and Discovery Types
export interface SearchResult extends Tool {
  score?: number;
  matchedKeywords?: string[];
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  suggestions: string[];
}

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
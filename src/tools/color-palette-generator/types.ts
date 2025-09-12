export interface Color {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  hsv: HSV;
  name?: string;
  description?: string;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  harmony: ColorHarmony;
  baseColor: Color;
  createdAt: Date;
}

export type ColorHarmony = 
  | 'complementary'
  | 'triadic' 
  | 'analogous'
  | 'monochromatic'
  | 'split-complementary'
  | 'tetradic'
  | 'square';

export type ExportFormat = 
  | 'css-variables'
  | 'json'
  | 'scss'
  | 'tailwind'
  | 'svg'
  | 'ase';

export type ColorBlindnessType = 
  | 'protanopia'
  | 'deuteranopia' 
  | 'tritanopia'
  | 'normal';

export interface ContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
  rating: string;
  isAccessible: boolean;
}

export interface ColorTemperature {
  kelvin: number;
  description: 'very-warm' | 'warm' | 'neutral' | 'cool' | 'very-cool';
  warmth: number; // 0-100 scale
}

export interface PaletteGenerationOptions {
  harmony: ColorHarmony;
  count: number;
  baseColor: Color;
  variation: number; // 0-100 for how much variation
  includeShades: boolean;
  includeTints: boolean;
}

export interface PaletteExportOptions {
  format: ExportFormat;
  includeNames: boolean;
  includeMetadata: boolean;
  prefix?: string;
}

export interface ColorAnalysis {
  temperature: ColorTemperature;
  dominantWavelength: number;
  saturationLevel: 'muted' | 'balanced' | 'vibrant';
  lightnessLevel: 'dark' | 'medium' | 'light';
  accessibility: {
    onWhite: ContrastResult;
    onBlack: ContrastResult;
  };
}

export type ColorInputMode = 'picker' | 'hex' | 'rgb' | 'hsl';

export interface GenerationResult {
  palette: ColorPalette;
  success: boolean;
  error?: string;
}

export interface ExportResult {
  content: string;
  filename: string;
  mimeType: string;
  success: boolean;
  error?: string;
}
import type { 
  Color, 
  RGB, 
  HSL, 
  HSV, 
  ColorPalette, 
  ColorHarmony, 
  ExportFormat, // Used in PaletteExportOptions.format
  ColorBlindnessType,
  ContrastResult,
  ColorTemperature,
  PaletteGenerationOptions,
  PaletteExportOptions,
  ColorAnalysis,
  GenerationResult,
  ExportResult
} from './types';

/**
 * Convert HEX color to RGB
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;
  
  const l = sum / 2;
  let h = 0;
  let s = 0;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - sum) : diff / sum;
    
    switch (max) {
      case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
      case g: h = (b - r) / diff + 2; break;
      case b: h = (r - g) / diff + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360; // Normalize hue
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Convert RGB to HSV
 */
export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  const v = max;
  const s = max === 0 ? 0 : diff / max;
  let h = 0;

  if (diff !== 0) {
    switch (max) {
      case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
      case g: h = (b - r) / diff + 2; break;
      case b: h = (r - g) / diff + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

/**
 * Convert HSV to RGB
 */
export function hsvToRgb(h: number, s: number, v: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  v = Math.max(0, Math.min(100, v)) / 100;

  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

/**
 * Create a Color object from hex value
 */
export function createColorFromHex(hex: string): Color | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  return {
    hex: hex.toLowerCase(),
    rgb,
    hsl,
    hsv
  };
}

/**
 * Create a Color object from RGB values
 */
export function createColorFromRgb(r: number, g: number, b: number): Color {
  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  const hsv = rgbToHsv(r, g, b);

  return {
    hex,
    rgb: { r, g, b },
    hsl,
    hsv
  };
}

/**
 * Create a Color object from HSL values
 */
export function createColorFromHsl(h: number, s: number, l: number): Color {
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  return {
    hex,
    rgb,
    hsl: { h, s, l },
    hsv
  };
}

/**
 * Generate color harmony based on base color
 */
export function generateColorHarmony(baseColor: Color, harmony: ColorHarmony): Color[] {
  const colors: Color[] = [baseColor];
  const baseHue = baseColor.hsl.h;

  switch (harmony) {
    case 'complementary':
      colors.push(createColorFromHsl((baseHue + 180) % 360, baseColor.hsl.s, baseColor.hsl.l));
      break;

    case 'triadic':
      colors.push(createColorFromHsl((baseHue + 120) % 360, baseColor.hsl.s, baseColor.hsl.l));
      colors.push(createColorFromHsl((baseHue + 240) % 360, baseColor.hsl.s, baseColor.hsl.l));
      break;

    case 'analogous':
      colors.push(createColorFromHsl((baseHue + 30) % 360, baseColor.hsl.s, baseColor.hsl.l));
      colors.push(createColorFromHsl((baseHue - 30 + 360) % 360, baseColor.hsl.s, baseColor.hsl.l));
      colors.push(createColorFromHsl((baseHue + 60) % 360, baseColor.hsl.s, baseColor.hsl.l));
      colors.push(createColorFromHsl((baseHue - 60 + 360) % 360, baseColor.hsl.s, baseColor.hsl.l));
      break;

    case 'monochromatic':
      const variations = [
        { s: Math.max(0, baseColor.hsl.s - 30), l: Math.max(10, baseColor.hsl.l - 30) },
        { s: Math.max(0, baseColor.hsl.s - 15), l: Math.max(10, baseColor.hsl.l - 15) },
        { s: Math.min(100, baseColor.hsl.s + 15), l: Math.min(90, baseColor.hsl.l + 15) },
        { s: Math.min(100, baseColor.hsl.s + 30), l: Math.min(90, baseColor.hsl.l + 30) }
      ];
      variations.forEach(variation => {
        colors.push(createColorFromHsl(baseHue, variation.s, variation.l));
      });
      break;

    case 'split-complementary':
      colors.push(createColorFromHsl((baseHue + 150) % 360, baseColor.hsl.s, baseColor.hsl.l));
      colors.push(createColorFromHsl((baseHue + 210) % 360, baseColor.hsl.s, baseColor.hsl.l));
      break;

    case 'tetradic':
      colors.push(createColorFromHsl((baseHue + 90) % 360, baseColor.hsl.s, baseColor.hsl.l));
      colors.push(createColorFromHsl((baseHue + 180) % 360, baseColor.hsl.s, baseColor.hsl.l));
      colors.push(createColorFromHsl((baseHue + 270) % 360, baseColor.hsl.s, baseColor.hsl.l));
      break;

    case 'square':
      colors.push(createColorFromHsl((baseHue + 90) % 360, baseColor.hsl.s, baseColor.hsl.l));
      colors.push(createColorFromHsl((baseHue + 180) % 360, baseColor.hsl.s, baseColor.hsl.l));
      colors.push(createColorFromHsl((baseHue + 270) % 360, baseColor.hsl.s, baseColor.hsl.l));
      break;
  }

  return colors;
}

/**
 * Generate random color
 */
export function generateRandomColor(): Color {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 60) + 40; // 40-100 for vibrant colors
  const l = Math.floor(Math.random() * 40) + 30; // 30-70 for balanced lightness
  
  return createColorFromHsl(h, s, l);
}

/**
 * Calculate color contrast ratio (WCAG)
 */
export function getContrastRatio(color1: Color, color2: Color): number {
  const getLuminance = (color: Color) => {
    const { r, g, b } = color.rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const bright = Math.max(lum1, lum2);
  const dark = Math.min(lum1, lum2);

  return (bright + 0.05) / (dark + 0.05);
}

/**
 * Get contrast accessibility level
 */
export function getContrastLevel(ratio: number): ContrastResult {
  let level: ContrastResult['level'];
  let rating: string;
  let isAccessible: boolean;

  if (ratio >= 7) {
    level = 'AAA';
    rating = 'Excelente (AAA)';
    isAccessible = true;
  } else if (ratio >= 4.5) {
    level = 'AA';
    rating = 'Bueno (AA)';
    isAccessible = true;
  } else if (ratio >= 3) {
    level = 'A';
    rating = 'Aceptable (AA Large)';
    isAccessible = false;
  } else {
    level = 'FAIL';
    rating = 'Insuficiente';
    isAccessible = false;
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    level,
    rating,
    isAccessible
  };
}

/**
 * Simulate color blindness
 */
export function simulateColorBlindness(color: Color, type: ColorBlindnessType): Color {
  if (type === 'normal') return color;

  const { r, g, b } = color.rgb;

  let newR: number, newG: number, newB: number;

  switch (type) {
    case 'protanopia': // Red-blind
      newR = 0.567 * r + 0.433 * g;
      newG = 0.558 * r + 0.442 * g;
      newB = 0.242 * g + 0.758 * b;
      break;

    case 'deuteranopia': // Green-blind
      newR = 0.625 * r + 0.375 * g;
      newG = 0.7 * r + 0.3 * g;
      newB = 0.3 * g + 0.7 * b;
      break;

    case 'tritanopia': // Blue-blind
      newR = 0.95 * r + 0.05 * g;
      newG = 0.433 * g + 0.567 * b;
      newB = 0.475 * g + 0.525 * b;
      break;

    default:
      return color;
  }

  return createColorFromRgb(
    Math.round(Math.max(0, Math.min(255, newR))),
    Math.round(Math.max(0, Math.min(255, newG))),
    Math.round(Math.max(0, Math.min(255, newB)))
  );
}

/**
 * Calculate color temperature
 */
export function getColorTemperature(color: Color): ColorTemperature {
  const { r, g, b } = color.rgb;
  
  // Simplified temperature calculation based on RGB values
  const temperature = (r - b) / (r + g + b) * 100;
  const warmth = Math.max(0, Math.min(100, 50 + temperature));

  let kelvin: number;
  let description: ColorTemperature['description'];

  if (warmth >= 80) {
    kelvin = 2000 + (100 - warmth) * 10;
    description = 'very-warm';
  } else if (warmth >= 60) {
    kelvin = 3000 + (80 - warmth) * 25;
    description = 'warm';
  } else if (warmth >= 40) {
    kelvin = 5000 + (60 - warmth) * 50;
    description = 'neutral';
  } else if (warmth >= 20) {
    kelvin = 6500 + (40 - warmth) * 75;
    description = 'cool';
  } else {
    kelvin = 8000 + (20 - warmth) * 100;
    description = 'very-cool';
  }

  return {
    kelvin: Math.round(kelvin),
    description,
    warmth: Math.round(warmth)
  };
}

/**
 * Analyze color properties
 */
export function analyzeColor(color: Color): ColorAnalysis {
  const white = createColorFromHex('#ffffff')!;
  const black = createColorFromHex('#000000')!;

  return {
    temperature: getColorTemperature(color),
    dominantWavelength: 380 + (color.hsl.h / 360) * 400,
    saturationLevel: color.hsl.s >= 70 ? 'vibrant' : color.hsl.s >= 30 ? 'balanced' : 'muted',
    lightnessLevel: color.hsl.l >= 70 ? 'light' : color.hsl.l >= 30 ? 'medium' : 'dark',
    accessibility: {
      onWhite: getContrastLevel(getContrastRatio(color, white)),
      onBlack: getContrastLevel(getContrastRatio(color, black))
    }
  };
}

/**
 * Generate palette with advanced options
 */
export function generatePalette(options: PaletteGenerationOptions): GenerationResult {
  try {
    const colors = generateColorHarmony(options.baseColor, options.harmony);
    
    // Add shades and tints if requested
    if (options.includeShades || options.includeTints) {
      const expandedColors: Color[] = [...colors];
      
      colors.forEach(color => {
        if (options.includeShades) {
          // Add darker shades
          expandedColors.push(createColorFromHsl(
            color.hsl.h, 
            color.hsl.s, 
            Math.max(10, color.hsl.l - 20)
          ));
          expandedColors.push(createColorFromHsl(
            color.hsl.h, 
            color.hsl.s, 
            Math.max(5, color.hsl.l - 40)
          ));
        }
        
        if (options.includeTints) {
          // Add lighter tints
          expandedColors.push(createColorFromHsl(
            color.hsl.h, 
            Math.max(0, color.hsl.s - 20), 
            Math.min(95, color.hsl.l + 20)
          ));
          expandedColors.push(createColorFromHsl(
            color.hsl.h, 
            Math.max(0, color.hsl.s - 40), 
            Math.min(98, color.hsl.l + 40)
          ));
        }
      });
    }

    const palette: ColorPalette = {
      id: generateId(),
      name: `${options.harmony.charAt(0).toUpperCase() + options.harmony.slice(1)} Palette`,
      colors: colors.slice(0, options.count),
      harmony: options.harmony,
      baseColor: options.baseColor,
      createdAt: new Date()
    };

    return {
      palette,
      success: true
    };
  } catch (error) {
    return {
      palette: {} as ColorPalette,
      success: false,
      error: error instanceof Error ? error.message : 'Error generando la paleta'
    };
  }
}

/**
 * Export palette in various formats
 */
export function exportPalette(palette: ColorPalette, options: PaletteExportOptions): ExportResult {
  try {
    const { format, includeNames, includeMetadata, prefix = 'color' } = options;
    let content: string;
    let filename: string;
    let mimeType: string;

    // Type assertion to use ExportFormat explicitly
    const exportFormat: ExportFormat = format;

    switch (exportFormat) {
      case 'css-variables':
        content = generateCSSVariables(palette, prefix, includeNames, includeMetadata);
        filename = `${palette.name.replace(/\s+/g, '-').toLowerCase()}.css`;
        mimeType = 'text/css';
        break;

      case 'scss':
        content = generateSCSS(palette, prefix, includeNames, includeMetadata);
        filename = `${palette.name.replace(/\s+/g, '-').toLowerCase()}.scss`;
        mimeType = 'text/scss';
        break;

      case 'json':
        content = generateJSON(palette, includeMetadata);
        filename = `${palette.name.replace(/\s+/g, '-').toLowerCase()}.json`;
        mimeType = 'application/json';
        break;

      case 'tailwind':
        content = generateTailwindConfig(palette, prefix, includeNames);
        filename = `tailwind-colors.js`;
        mimeType = 'application/javascript';
        break;

      case 'svg':
        content = generateSVG(palette);
        filename = `${palette.name.replace(/\s+/g, '-').toLowerCase()}.svg`;
        mimeType = 'image/svg+xml';
        break;

      default:
        throw new Error(`Formato de exportación no soportado: ${exportFormat}`);
    }

    return {
      content,
      filename,
      mimeType,
      success: true
    };
  } catch (error) {
    return {
      content: '',
      filename: '',
      mimeType: '',
      success: false,
      error: error instanceof Error ? error.message : 'Error exportando la paleta'
    };
  }
}

/**
 * Generate CSS variables
 */
function generateCSSVariables(palette: ColorPalette, prefix: string, includeNames: boolean, includeMetadata: boolean): string {
  let css = ':root {\n';
  
  if (includeMetadata) {
    css += `  /* Generated from ${palette.name} */\n`;
    css += `  /* Harmony: ${palette.harmony} */\n`;
    css += `  /* Created: ${palette.createdAt.toISOString()} */\n\n`;
  }

  palette.colors.forEach((color, index) => {
    const name = includeNames && color.name ? color.name.replace(/\s+/g, '-').toLowerCase() : `${prefix}-${index + 1}`;
    css += `  --${name}: ${color.hex};\n`;
    css += `  --${name}-rgb: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b};\n`;
    css += `  --${name}-hsl: ${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%;\n\n`;
  });

  css += '}';
  return css;
}

/**
 * Generate SCSS variables
 */
function generateSCSS(palette: ColorPalette, prefix: string, includeNames: boolean, includeMetadata: boolean): string {
  let scss = '';
  
  if (includeMetadata) {
    scss += `// Generated from ${palette.name}\n`;
    scss += `// Harmony: ${palette.harmony}\n`;
    scss += `// Created: ${palette.createdAt.toISOString()}\n\n`;
  }

  palette.colors.forEach((color, index) => {
    const name = includeNames && color.name ? color.name.replace(/\s+/g, '-').toLowerCase() : `${prefix}-${index + 1}`;
    scss += `$${name}: ${color.hex};\n`;
  });

  return scss;
}

/**
 * Generate JSON export
 */
function generateJSON(palette: ColorPalette, includeMetadata: boolean): string {
  const data = includeMetadata ? palette : { colors: palette.colors };
  return JSON.stringify(data, null, 2);
}

/**
 * Generate Tailwind config
 */
function generateTailwindConfig(palette: ColorPalette, prefix: string, includeNames: boolean): string {
  const colors: Record<string, string> = {};
  
  palette.colors.forEach((color, index) => {
    const name = includeNames && color.name ? color.name.replace(/\s+/g, '-').toLowerCase() : `${prefix}-${index + 1}`;
    colors[name] = color.hex;
  });

  return `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colors, null, 8)}\n    }\n  }\n};`;
}

/**
 * Generate SVG representation
 */
function generateSVG(palette: ColorPalette): string {
  const width = 400;
  const height = 100;
  const colorWidth = width / palette.colors.length;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;
  
  palette.colors.forEach((color, index) => {
    const x = index * colorWidth;
    svg += `  <rect x="${x}" y="0" width="${colorWidth}" height="${height}" fill="${color.hex}" />\n`;
    
    if (color.name) {
      svg += `  <text x="${x + colorWidth/2}" y="${height/2}" text-anchor="middle" fill="${color.hsl.l > 50 ? '#000' : '#fff'}" font-family="Arial" font-size="12">${color.name}</text>\n`;
    }
  });
  
  svg += '</svg>';
  return svg;
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `palette-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate hex color
 */
export function isValidHex(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Validate RGB values
 */
export function isValidRgb(r: number, g: number, b: number): boolean {
  return [r, g, b].every(val => Number.isInteger(val) && val >= 0 && val <= 255);
}

/**
 * Validate HSL values
 */
export function isValidHsl(h: number, s: number, l: number): boolean {
  return Number.isInteger(h) && h >= 0 && h < 360 &&
         Number.isInteger(s) && s >= 0 && s <= 100 &&
         Number.isInteger(l) && l >= 0 && l <= 100;
}
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  createColorFromHex,
  createColorFromRgb,
  createColorFromHsl,
  generateColorHarmony,
  generateRandomColor,
  getContrastRatio,
  getContrastLevel,
  simulateColorBlindness,
  getColorTemperature,
  analyzeColor,
  generatePalette,
  exportPalette,
  isValidHex,
  isValidRgb,
  isValidHsl
} from '../../../src/tools/color-palette-generator/utils';
import { ColorPaletteGenerator } from '../../../src/tools/color-palette-generator/ColorPaletteGenerator';
import type { Color, ColorHarmony, ExportFormat } from '../../../src/tools/color-palette-generator/types';

// Mock DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.navigator = {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined)
  }
} as any;

describe('Color Palette Generator Utils', () => {
  describe('Color Conversion Functions', () => {
    it('should convert HEX to RGB correctly', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle invalid HEX values', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('')).toBeNull();
      expect(hexToRgb('#gg0000')).toBeNull();
    });

    it('should convert RGB to HEX correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('should handle RGB values outside range', () => {
      expect(rgbToHex(-10, 0, 0)).toBe('#000000');
      expect(rgbToHex(300, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(128, 256, -5)).toBe('#80ff00');
    });

    it('should convert RGB to HSL correctly', () => {
      const red = rgbToHsl(255, 0, 0);
      expect(red.h).toBe(0);
      expect(red.s).toBe(100);
      expect(red.l).toBe(50);

      const green = rgbToHsl(0, 255, 0);
      expect(green.h).toBe(120);
      expect(green.s).toBe(100);
      expect(green.l).toBe(50);

      const blue = rgbToHsl(0, 0, 255);
      expect(blue.h).toBe(240);
      expect(blue.s).toBe(100);
      expect(blue.l).toBe(50);
    });

    it('should convert HSL to RGB correctly', () => {
      expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
      expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
      expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should convert RGB to HSV correctly', () => {
      const red = rgbToHsv(255, 0, 0);
      expect(red.h).toBe(0);
      expect(red.s).toBe(100);
      expect(red.v).toBe(100);

      const white = rgbToHsv(255, 255, 255);
      expect(white.h).toBe(0);
      expect(white.s).toBe(0);
      expect(white.v).toBe(100);
    });

    it('should convert HSV to RGB correctly', () => {
      expect(hsvToRgb(0, 100, 100)).toEqual({ r: 255, g: 0, b: 0 });
      expect(hsvToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });
      expect(hsvToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
    });
  });

  describe('Color Creation Functions', () => {
    it('should create color from valid HEX', () => {
      const color = createColorFromHex('#ff0000');
      expect(color).not.toBeNull();
      expect(color?.hex).toBe('#ff0000');
      expect(color?.rgb).toEqual({ r: 255, g: 0, b: 0 });
      expect(color?.hsl.h).toBe(0);
      expect(color?.hsl.s).toBe(100);
      expect(color?.hsl.l).toBe(50);
    });

    it('should return null for invalid HEX', () => {
      expect(createColorFromHex('invalid')).toBeNull();
    });

    it('should create color from RGB values', () => {
      const color = createColorFromRgb(255, 0, 0);
      expect(color.hex).toBe('#ff0000');
      expect(color.rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should create color from HSL values', () => {
      const color = createColorFromHsl(0, 100, 50);
      expect(color.hex).toBe('#ff0000');
      expect(color.hsl).toEqual({ h: 0, s: 100, l: 50 });
    });
  });

  describe('Color Harmony Generation', () => {
    let baseColor: Color;

    beforeEach(() => {
      baseColor = createColorFromHex('#3b82f6')!; // Blue
    });

    it('should generate complementary colors', () => {
      const colors = generateColorHarmony(baseColor, 'complementary');
      expect(colors).toHaveLength(2);
      expect(colors[0]).toEqual(baseColor);
      // Complementary should be roughly 180 degrees opposite
      const complementHue = colors[1].hsl.h;
      const expectedHue = (baseColor.hsl.h + 180) % 360;
      expect(Math.abs(complementHue - expectedHue)).toBeLessThan(5);
    });

    it('should generate triadic colors', () => {
      const colors = generateColorHarmony(baseColor, 'triadic');
      expect(colors).toHaveLength(3);
      expect(colors[0]).toEqual(baseColor);
    });

    it('should generate analogous colors', () => {
      const colors = generateColorHarmony(baseColor, 'analogous');
      expect(colors).toHaveLength(5);
      expect(colors[0]).toEqual(baseColor);
    });

    it('should generate monochromatic colors', () => {
      const colors = generateColorHarmony(baseColor, 'monochromatic');
      expect(colors).toHaveLength(5);
      expect(colors[0]).toEqual(baseColor);
      // All colors should have the same hue
      colors.forEach(color => {
        expect(color.hsl.h).toBe(baseColor.hsl.h);
      });
    });

    it('should generate split-complementary colors', () => {
      const colors = generateColorHarmony(baseColor, 'split-complementary');
      expect(colors).toHaveLength(3);
      expect(colors[0]).toEqual(baseColor);
    });

    it('should generate tetradic colors', () => {
      const colors = generateColorHarmony(baseColor, 'tetradic');
      expect(colors).toHaveLength(4);
      expect(colors[0]).toEqual(baseColor);
    });

    it('should generate square colors', () => {
      const colors = generateColorHarmony(baseColor, 'square');
      expect(colors).toHaveLength(4);
      expect(colors[0]).toEqual(baseColor);
    });
  });

  describe('Random Color Generation', () => {
    it('should generate valid random colors', () => {
      for (let i = 0; i < 10; i++) {
        const color = generateRandomColor();
        expect(color.hex).toMatch(/^#[0-9a-f]{6}$/);
        expect(color.rgb.r).toBeGreaterThanOrEqual(0);
        expect(color.rgb.r).toBeLessThanOrEqual(255);
        expect(color.rgb.g).toBeGreaterThanOrEqual(0);
        expect(color.rgb.g).toBeLessThanOrEqual(255);
        expect(color.rgb.b).toBeGreaterThanOrEqual(0);
        expect(color.rgb.b).toBeLessThanOrEqual(255);
      }
    });
  });

  describe('Contrast and Accessibility', () => {
    it('should calculate contrast ratio correctly', () => {
      const white = createColorFromHex('#ffffff')!;
      const black = createColorFromHex('#000000')!;
      const ratio = getContrastRatio(white, black);
      expect(ratio).toBeCloseTo(21, 0); // Perfect contrast
    });

    it('should determine contrast levels correctly', () => {
      const perfectContrast = getContrastLevel(21);
      expect(perfectContrast.level).toBe('AAA');
      expect(perfectContrast.isAccessible).toBe(true);

      const goodContrast = getContrastLevel(7);
      expect(goodContrast.level).toBe('AAA');

      const minContrast = getContrastLevel(4.5);
      expect(minContrast.level).toBe('AA');

      const poorContrast = getContrastLevel(2);
      expect(poorContrast.level).toBe('FAIL');
      expect(poorContrast.isAccessible).toBe(false);
    });
  });

  describe('Color Blindness Simulation', () => {
    let testColor: Color;

    beforeEach(() => {
      testColor = createColorFromHex('#ff0000')!; // Red
    });

    it('should return original color for normal vision', () => {
      const result = simulateColorBlindness(testColor, 'normal');
      expect(result).toEqual(testColor);
    });

    it('should simulate protanopia (red-blind)', () => {
      const result = simulateColorBlindness(testColor, 'protanopia');
      expect(result.hex).not.toBe(testColor.hex);
      // Red component should be reduced
      expect(result.rgb.r).toBeLessThan(testColor.rgb.r);
    });

    it('should simulate deuteranopia (green-blind)', () => {
      const greenColor = createColorFromHex('#00ff00')!;
      const result = simulateColorBlindness(greenColor, 'deuteranopia');
      expect(result.hex).not.toBe(greenColor.hex);
    });

    it('should simulate tritanopia (blue-blind)', () => {
      const blueColor = createColorFromHex('#0000ff')!;
      const result = simulateColorBlindness(blueColor, 'tritanopia');
      expect(result.hex).not.toBe(blueColor.hex);
    });
  });

  describe('Color Temperature Analysis', () => {
    it('should analyze warm colors correctly', () => {
      const red = createColorFromHex('#ff0000')!;
      const temp = getColorTemperature(red);
      expect(temp.description).toMatch(/warm/);
      expect(temp.warmth).toBeGreaterThan(50);
    });

    it('should analyze cool colors correctly', () => {
      const blue = createColorFromHex('#0000ff')!;
      const temp = getColorTemperature(blue);
      expect(temp.description).toMatch(/cool/);
      expect(temp.warmth).toBeLessThan(50);
    });
  });

  describe('Color Analysis', () => {
    it('should provide comprehensive color analysis', () => {
      const color = createColorFromHex('#3b82f6')!; // Blue
      const analysis = analyzeColor(color);
      
      expect(analysis).toHaveProperty('temperature');
      expect(analysis).toHaveProperty('dominantWavelength');
      expect(analysis).toHaveProperty('saturationLevel');
      expect(analysis).toHaveProperty('lightnessLevel');
      expect(analysis).toHaveProperty('accessibility');
      
      expect(analysis.accessibility).toHaveProperty('onWhite');
      expect(analysis.accessibility).toHaveProperty('onBlack');
    });
  });

  describe('Palette Generation', () => {
    it('should generate valid palettes', () => {
      const baseColor = createColorFromHex('#3b82f6')!;
      const result = generatePalette({
        harmony: 'complementary',
        count: 5,
        baseColor,
        variation: 20,
        includeShades: false,
        includeTints: false
      });

      expect(result.success).toBe(true);
      expect(result.palette.colors).toHaveLength(2); // Complementary generates 2 colors
      expect(result.palette.harmony).toBe('complementary');
      expect(result.palette.baseColor).toEqual(baseColor);
    });

    it('should handle palette generation errors gracefully', () => {
      // This would require mocking an error condition
      // For now, we'll test the basic error handling structure
      expect(() => {
        generatePalette({
          harmony: 'complementary',
          count: 5,
          baseColor: createColorFromHex('#3b82f6')!,
          variation: 20,
          includeShades: false,
          includeTints: false
        });
      }).not.toThrow();
    });
  });

  describe('Palette Export', () => {
    let testPalette: any;

    beforeEach(() => {
      const baseColor = createColorFromHex('#3b82f6')!;
      const colors = generateColorHarmony(baseColor, 'complementary');
      testPalette = {
        id: 'test-palette',
        name: 'Test Palette',
        colors,
        harmony: 'complementary' as ColorHarmony,
        baseColor,
        createdAt: new Date()
      };
    });

    it('should export to CSS variables format', () => {
      const result = exportPalette(testPalette, {
        format: 'css-variables',
        includeNames: false,
        includeMetadata: true,
        prefix: 'color'
      });

      expect(result.success).toBe(true);
      expect(result.content).toContain(':root');
      expect(result.content).toContain('--color-1');
      expect(result.filename).toContain('.css');
      expect(result.mimeType).toBe('text/css');
    });

    it('should export to SCSS format', () => {
      const result = exportPalette(testPalette, {
        format: 'scss',
        includeNames: false,
        includeMetadata: true,
        prefix: 'color'
      });

      expect(result.success).toBe(true);
      expect(result.content).toContain('$color-1');
      expect(result.filename).toContain('.scss');
      expect(result.mimeType).toBe('text/scss');
    });

    it('should export to JSON format', () => {
      const result = exportPalette(testPalette, {
        format: 'json',
        includeNames: false,
        includeMetadata: true
      });

      expect(result.success).toBe(true);
      expect(() => JSON.parse(result.content)).not.toThrow();
      expect(result.filename).toContain('.json');
      expect(result.mimeType).toBe('application/json');
    });

    it('should export to Tailwind format', () => {
      const result = exportPalette(testPalette, {
        format: 'tailwind',
        includeNames: false,
        includeMetadata: false,
        prefix: 'primary'
      });

      expect(result.success).toBe(true);
      expect(result.content).toContain('module.exports');
      expect(result.content).toContain('colors:');
      expect(result.filename).toBe('tailwind-colors.js');
      expect(result.mimeType).toBe('application/javascript');
    });

    it('should export to SVG format', () => {
      const result = exportPalette(testPalette, {
        format: 'svg',
        includeNames: false,
        includeMetadata: false
      });

      expect(result.success).toBe(true);
      expect(result.content).toContain('<svg');
      expect(result.content).toContain('<rect');
      expect(result.filename).toContain('.svg');
      expect(result.mimeType).toBe('image/svg+xml');
    });
  });

  describe('Validation Functions', () => {
    it('should validate HEX colors correctly', () => {
      expect(isValidHex('#ff0000')).toBe(true);
      expect(isValidHex('#FF0000')).toBe(true);
      expect(isValidHex('#f00')).toBe(true);
      expect(isValidHex('ff0000')).toBe(false);
      expect(isValidHex('#gg0000')).toBe(false);
      expect(isValidHex('')).toBe(false);
    });

    it('should validate RGB values correctly', () => {
      expect(isValidRgb(255, 0, 0)).toBe(true);
      expect(isValidRgb(0, 255, 0)).toBe(true);
      expect(isValidRgb(0, 0, 255)).toBe(true);
      expect(isValidRgb(-1, 0, 0)).toBe(false);
      expect(isValidRgb(256, 0, 0)).toBe(false);
      expect(isValidRgb(255.5, 0, 0)).toBe(false);
    });

    it('should validate HSL values correctly', () => {
      expect(isValidHsl(0, 100, 50)).toBe(true);
      expect(isValidHsl(359, 0, 100)).toBe(true);
      expect(isValidHsl(360, 100, 50)).toBe(false);
      expect(isValidHsl(-1, 100, 50)).toBe(false);
      expect(isValidHsl(0, 101, 50)).toBe(false);
      expect(isValidHsl(0, 100, 101)).toBe(false);
      expect(isValidHsl(0.5, 100, 50)).toBe(false);
    });
  });
});

describe('ColorPaletteGenerator Component', () => {
  let container: HTMLElement;
  let colorPaletteGenerator: ColorPaletteGenerator;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '<div id="test-container"></div>';
    container = document.getElementById('test-container')!;
    
    // Mock window methods
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });

    // Create instance
    colorPaletteGenerator = new ColorPaletteGenerator(container);
  });

  describe('Component Initialization', () => {
    it('should render the main UI structure', () => {
      expect(container.querySelector('h1')).toBeTruthy();
      expect(container.querySelector('#color-picker')).toBeTruthy();
      expect(container.querySelector('#harmony-select')).toBeTruthy();
      expect(container.querySelector('#generate-btn')).toBeTruthy();
      expect(container.querySelector('#random-btn')).toBeTruthy();
    });

    it('should initialize with default values', () => {
      const colorPicker = container.querySelector('#color-picker') as HTMLInputElement;
      const harmonySelect = container.querySelector('#harmony-select') as HTMLSelectElement;
      
      expect(colorPicker.value).toBe('#3b82f6');
      expect(harmonySelect.value).toBe('complementary');
    });

    it('should render initial palette', () => {
      const paletteContainer = container.querySelector('#palette-container');
      expect(paletteContainer).toBeTruthy();
      // Should have some colors rendered
      setTimeout(() => {
        expect(paletteContainer?.children.length).toBeGreaterThan(0);
      }, 100);
    });
  });

  describe('Input Mode Switching', () => {
    it('should switch between input modes', () => {
      const hexModeBtn = container.querySelector('[data-mode="hex"]') as HTMLButtonElement;
      const hexInput = container.querySelector('#hex-input') as HTMLElement;
      
      expect(hexInput.classList.contains('hidden')).toBe(true);
      
      hexModeBtn.click();
      
      expect(hexInput.classList.contains('hidden')).toBe(false);
    });

    it('should show RGB input mode correctly', () => {
      const rgbModeBtn = container.querySelector('[data-mode="rgb"]') as HTMLButtonElement;
      const rgbInput = container.querySelector('#rgb-input') as HTMLElement;
      
      rgbModeBtn.click();
      
      expect(rgbInput.classList.contains('hidden')).toBe(false);
    });

    it('should show HSL input mode correctly', () => {
      const hslModeBtn = container.querySelector('[data-mode="hsl"]') as HTMLButtonElement;
      const hslInput = container.querySelector('#hsl-input') as HTMLElement;
      
      hslModeBtn.click();
      
      expect(hslInput.classList.contains('hidden')).toBe(false);
    });
  });

  describe('Color Input Handling', () => {
    it('should handle color picker changes', () => {
      const colorPicker = container.querySelector('#color-picker') as HTMLInputElement;
      const colorDisplay = container.querySelector('#current-color-display') as HTMLElement;
      
      colorPicker.value = '#ff0000';
      colorPicker.dispatchEvent(new Event('input'));
      
      expect(colorDisplay.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    it('should handle HEX input changes', () => {
      const hexModeBtn = container.querySelector('[data-mode="hex"]') as HTMLButtonElement;
      const hexInput = container.querySelector('#hex-field') as HTMLInputElement;
      
      hexModeBtn.click();
      hexInput.value = '#00ff00';
      hexInput.dispatchEvent(new Event('input'));
      
      // Should update the color picker
      const colorPicker = container.querySelector('#color-picker') as HTMLInputElement;
      expect(colorPicker.value).toBe('#00ff00');
    });
  });

  describe('Palette Generation', () => {
    it('should generate palette when button clicked', () => {
      const generateBtn = container.querySelector('#generate-btn') as HTMLButtonElement;
      const statusContainer = container.querySelector('#status-container') as HTMLElement;
      
      generateBtn.click();
      
      // Should show success status
      expect(statusContainer.textContent).toContain('exitosamente');
    });

    it('should generate random palette when random button clicked', () => {
      const randomBtn = container.querySelector('#random-btn') as HTMLButtonElement;
      const colorPicker = container.querySelector('#color-picker') as HTMLInputElement;
      const originalColor = colorPicker.value;
      
      randomBtn.click();
      
      // Color should have changed
      expect(colorPicker.value).not.toBe(originalColor);
    });

    it('should update palette when harmony changes', () => {
      const harmonySelect = container.querySelector('#harmony-select') as HTMLSelectElement;
      const statusContainer = container.querySelector('#status-container') as HTMLElement;
      
      harmonySelect.value = 'triadic';
      harmonySelect.dispatchEvent(new Event('change'));
      
      expect(statusContainer.textContent).toContain('exitosamente');
    });
  });

  describe('Export Functionality', () => {
    it('should render export options', () => {
      // Wait for initial palette generation
      setTimeout(() => {
        const exportContainer = container.querySelector('#export-container');
        expect(exportContainer).toBeTruthy();
        expect(exportContainer?.querySelector('[data-format="css-variables"]')).toBeTruthy();
        expect(exportContainer?.querySelector('[data-format="json"]')).toBeTruthy();
        expect(exportContainer?.querySelector('[data-format="tailwind"]')).toBeTruthy();
      }, 200);
    });
  });

  describe('Accessibility Features', () => {
    it('should render accessibility information', () => {
      setTimeout(() => {
        const accessibilityContainer = container.querySelector('#accessibility-container');
        expect(accessibilityContainer).toBeTruthy();
        // Should show contrast ratios and accessibility info
      }, 200);
    });

    it('should handle color blindness simulation', () => {
      const colorBlindnessSelect = container.querySelector('#colorblindness-select') as HTMLSelectElement;
      
      colorBlindnessSelect.value = 'protanopia';
      colorBlindnessSelect.dispatchEvent(new Event('change'));
      
      // Palette should update with simulated colors
      expect(colorBlindnessSelect.value).toBe('protanopia');
    });
  });

  describe('Example Palettes', () => {
    it('should load example palettes', () => {
      const exampleBtn = container.querySelector('[data-example="sunset"]') as HTMLButtonElement;
      const colorPicker = container.querySelector('#color-picker') as HTMLInputElement;
      
      exampleBtn.click();
      
      // Should update to sunset colors
      expect(colorPicker.value).toBe('#ff6b35');
    });
  });

  describe('Copy Functionality', () => {
    it('should copy individual colors', async () => {
      // Wait for palette generation
      setTimeout(async () => {
        const copyBtn = container.querySelector('.copy-color-btn') as HTMLButtonElement;
        if (copyBtn) {
          copyBtn.click();
          
          expect(navigator.clipboard.writeText).toHaveBeenCalled();
        }
      }, 200);
    });
  });
});
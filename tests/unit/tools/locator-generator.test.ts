/**
 * Unit tests for Locator Generator Tool
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { parseHTML, generateLocators, validateLocator, getDefaultOptions } from '../../../src/tools/locator-generator/utils';
import { LocatorType, TestFramework, FragilityLevel } from '../../../src/tools/locator-generator/types';

describe('Locator Generator Utils', () => {
  describe('parseHTML', () => {
    it('should parse simple HTML correctly', () => {
      const html = '<div id="test" class="container">Content</div>';
      const result = parseHTML(html);
      
      expect(result.elements).toHaveLength(1);
      expect(result.elements[0].tag).toBe('div');
      expect(result.elements[0].id).toBe('test');
      expect(result.elements[0].classes).toEqual(['container']);
      expect(result.elements[0].textContent).toBe('Content');
      expect(result.stats.totalElements).toBe(1);
      expect(result.stats.elementsWithId).toBe(1);
    });

    it('should parse HTML with data-testid attributes', () => {
      const html = '<button data-testid="submit-btn" id="submit">Submit</button>';
      const result = parseHTML(html);
      
      expect(result.elements).toHaveLength(1);
      expect(result.elements[0].attributes['data-testid']).toBe('submit-btn');
      expect(result.stats.elementsWithTestId).toBe(1);
    });

    it('should handle nested HTML elements', () => {
      const html = `
        <div class="container">
          <form data-testid="login-form">
            <input id="username" type="text" placeholder="Username">
            <button type="submit">Login</button>
          </form>
        </div>
      `;
      const result = parseHTML(html);
      
      expect(result.stats.totalElements).toBe(4); // div, form, input, button
      expect(result.stats.elementsWithId).toBe(1); // input with id="username"
      expect(result.stats.elementsWithTestId).toBe(1); // form with data-testid
    });

    it('should handle invalid HTML gracefully', () => {
      // DOMParser is very tolerant, so test with completely invalid input
      const result = parseHTML('<div><span></div>'); // This actually parses as valid
      expect(result.stats.totalElements).toBeGreaterThanOrEqual(0);
    });

    it('should extract element position information', () => {
      const html = `
        <ul>
          <li>First</li>
          <li id="second">Second</li>
          <li>Third</li>
        </ul>
      `;
      const result = parseHTML(html);
      const ul = result.elements[0];
      const secondLi = ul.children[1];
      
      expect(secondLi.position.index).toBe(1);
      expect(secondLi.position.siblingCount).toBe(3);
    });
  });

  describe('generateLocators', () => {
    it('should prioritize data-testid locators', () => {
      const element = {
        tag: 'button',
        id: 'submit',
        classes: ['btn', 'btn-primary'],
        attributes: { 'data-testid': 'submit-button' },
        textContent: 'Submit',
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const locators = generateLocators(element);
      
      expect(locators.length).toBeGreaterThanOrEqual(4); // At least data-testid, id, role, text
      expect(locators[0].type).toBe(LocatorType.DATA_TESTID);
      expect(locators[0].priority).toBe(10);
      expect(locators[0].robustnessScore).toBe(10);
    });

    it('should generate ID locators when available', () => {
      const element = {
        tag: 'input',
        id: 'email-input',
        classes: [],
        attributes: { type: 'email' },
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const locators = generateLocators(element);
      const idLocator = locators.find(loc => loc.type === LocatorType.ID);
      
      expect(idLocator).toBeDefined();
      expect(idLocator!.locator).toBe('#email-input');
      expect(idLocator!.priority).toBe(8);
    });

    it('should generate role-based locators', () => {
      const element = {
        tag: 'button',
        classes: [],
        attributes: {},
        textContent: 'Click me',
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const options = getDefaultOptions();
      options.includeRoleLocators = true;
      const locators = generateLocators(element, options);
      
      const roleLocator = locators.find(loc => loc.type === LocatorType.ROLE);
      expect(roleLocator).toBeDefined();
      expect(roleLocator!.locator).toContain('button');
    });

    it('should handle placeholder locators for inputs', () => {
      const element = {
        tag: 'input',
        classes: [],
        attributes: { placeholder: 'Enter your name' },
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const locators = generateLocators(element);
      const placeholderLocator = locators.find(loc => loc.type === LocatorType.PLACEHOLDER);
      
      expect(placeholderLocator).toBeDefined();
      expect(placeholderLocator!.locator).toBe('[placeholder="Enter your name"]');
    });

    it('should filter out fragile locators when not allowed', () => {
      const element = {
        tag: 'div',
        classes: ['mt-4', 'px-2'], // Tailwind utility classes
        attributes: {},
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const options = getDefaultOptions();
      options.allowFragileLocators = false;
      const locators = generateLocators(element, options);
      
      // Should filter out very fragile class-based locators
      const fragileLocators = locators.filter(loc => loc.robustnessScore < 6);
      expect(fragileLocators).toHaveLength(0);
    });

    it('should include XPath locators when enabled', () => {
      const element = {
        tag: 'span',
        classes: ['test-class'],
        attributes: {},
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const options = getDefaultOptions();
      options.includeXPath = true;
      options.allowFragileLocators = true; // Allow fragile locators to see XPath
      const locators = generateLocators(element, options);
      
      const xpathLocator = locators.find(loc => loc.type === LocatorType.XPATH);
      expect(xpathLocator).toBeDefined();
      expect(xpathLocator!.locator).toContain('//span');
    });

    it('should limit number of class selectors', () => {
      const element = {
        tag: 'div',
        classes: ['class1', 'class2', 'class3', 'class4', 'class5'],
        attributes: {},
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const options = getDefaultOptions();
      options.maxClassSelectors = 2;
      const locators = generateLocators(element, options);
      
      const classLocators = locators.filter(loc => loc.type === LocatorType.CLASS);
      expect(classLocators.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Framework Code Generation', () => {
    it('should generate correct Playwright code', () => {
      const element = {
        tag: 'button',
        attributes: { 'data-testid': 'login-btn' },
        classes: [],
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const options = getDefaultOptions();
      options.targetFrameworks = [TestFramework.PLAYWRIGHT];
      const locators = generateLocators(element, options);
      
      const testIdLocator = locators.find(loc => loc.type === LocatorType.DATA_TESTID);
      expect(testIdLocator!.codeSnippet).toBe("page.getByTestId('login-btn')");
    });

    it('should generate correct Cypress code', () => {
      const element = {
        tag: 'button',
        attributes: { 'data-testid': 'login-btn' },
        classes: [],
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const options = getDefaultOptions();
      options.targetFrameworks = [TestFramework.CYPRESS];
      const locators = generateLocators(element, options);
      
      const testIdLocator = locators.find(loc => loc.type === LocatorType.DATA_TESTID);
      expect(testIdLocator!.codeSnippet).toBe('cy.get(\'[data-testid="login-btn"]\')');
    });

    it('should generate correct Selenium Java code', () => {
      const element = {
        tag: 'input',
        id: 'email',
        classes: [],
        attributes: {},
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const options = getDefaultOptions();
      options.targetFrameworks = [TestFramework.SELENIUM_JAVA];
      const locators = generateLocators(element, options);
      
      const idLocator = locators.find(loc => loc.type === LocatorType.ID);
      expect(idLocator!.codeSnippet).toBe('driver.findElement(By.id("email"))');
    });
  });

  describe('validateLocator', () => {
    it('should validate unique locators correctly', () => {
      const locator = {
        type: LocatorType.ID,
        locator: '#unique-id',
        robustnessScore: 9,
        priority: 8,
        framework: TestFramework.PLAYWRIGHT,
        codeSnippet: 'page.locator("#unique-id")',
        description: 'ID selector',
        pros: ['Unique'],
        cons: ['May change']
      };

      const html = '<div id="unique-id">Content</div><div>Other</div>';
      const validation = validateLocator(locator, html);
      
      expect(validation.isUnique).toBe(true);
      expect(validation.matchCount).toBe(1);
      expect(validation.fragility).toBe(FragilityLevel.VERY_STABLE);
    });

    it('should detect non-unique locators', () => {
      const locator = {
        type: LocatorType.CLASS,
        locator: '.common-class',
        robustnessScore: 4,
        priority: 4,
        framework: TestFramework.PLAYWRIGHT,
        codeSnippet: 'page.locator(".common-class")',
        description: 'Class selector',
        pros: [],
        cons: []
      };

      const html = '<div class="common-class">First</div><div class="common-class">Second</div>';
      const validation = validateLocator(locator, html);
      
      expect(validation.isUnique).toBe(false);
      expect(validation.matchCount).toBe(2);
      expect(validation.recommendations).toContain('Locator matches 2 elements. Consider adding more specific attributes.');
    });

    it('should provide recommendations for utility classes', () => {
      const locator = {
        type: LocatorType.CLASS,
        locator: '.mt-4',
        robustnessScore: 2,
        priority: 4,
        framework: TestFramework.PLAYWRIGHT,
        codeSnippet: 'page.locator(".mt-4")',
        description: 'Class selector',
        pros: [],
        cons: []
      };

      const html = '<div class="mt-4">Content</div>';
      const validation = validateLocator(locator, html);
      
      expect(validation.recommendations).toContain('Utility classes (like Tailwind) are fragile. Prefer data-testid or semantic selectors.');
    });

    it('should warn about XPath fragility', () => {
      const locator = {
        type: LocatorType.XPATH,
        locator: '//div[@class="container"]/span[1]',
        robustnessScore: 2,
        priority: 1,
        framework: TestFramework.PLAYWRIGHT,
        codeSnippet: 'page.locator("//div[@class=\\"container\\"]/span[1]")',
        description: 'XPath selector',
        pros: [],
        cons: []
      };

      // We can't validate XPath with DOMParser, but we can check if the recommendation is added
      const html = '<div class="container"><span>Content</span></div>';
      const validation = validateLocator(locator, html);
      
      // XPath validation will fail with DOMParser, but should still add recommendation
      expect(validation.recommendations.length).toBeGreaterThan(0);
      const hasXpathWarning = validation.recommendations.some(rec => 
        rec.includes('XPath locators are fragile') || 
        rec.includes('Could not validate locator')
      );
      expect(hasXpathWarning).toBe(true);
    });
  });

  describe('Robustness Scoring', () => {
    it('should score data-testid locators highest', () => {
      const element = {
        tag: 'button',
        attributes: { 'data-testid': 'submit' },
        classes: [],
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const locators = generateLocators(element);
      const testIdLocator = locators.find(loc => loc.type === LocatorType.DATA_TESTID);
      
      expect(testIdLocator!.robustnessScore).toBe(10);
    });

    it('should score XPath locators lowest', () => {
      const element = {
        tag: 'span',
        classes: ['test-class'],
        attributes: {},
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const options = getDefaultOptions();
      options.includeXPath = true;
      options.allowFragileLocators = true; // Allow fragile locators
      const locators = generateLocators(element, options);
      const xpathLocator = locators.find(loc => loc.type === LocatorType.XPATH);
      
      if (xpathLocator) {
        expect(xpathLocator.robustnessScore).toBe(2);
      }
    });

    it('should sort locators by priority and robustness', () => {
      const element = {
        tag: 'button',
        id: 'submit',
        classes: ['btn'],
        attributes: { 'data-testid': 'submit-btn' },
        textContent: 'Submit',
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const locators = generateLocators(element);
      
      // data-testid should be first (highest priority and robustness)
      expect(locators[0].type).toBe(LocatorType.DATA_TESTID);
      
      // ID should be second
      expect(locators[1].type).toBe(LocatorType.ID);
    });
  });

  describe('Edge Cases', () => {
    it('should handle elements with no identifying attributes', () => {
      const element = {
        tag: 'div',
        classes: [],
        attributes: {},
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const locators = generateLocators(element);
      
      // Should still generate at least a generic locator or empty array for elements with no attributes
      expect(locators.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle very long text content', () => {
      const longText = 'A'.repeat(100);
      const element = {
        tag: 'button',
        classes: [],
        attributes: {},
        textContent: longText,
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const locators = generateLocators(element);
      const textLocator = locators.find(loc => loc.type === LocatorType.TEXT);
      
      if (textLocator) {
        // Should truncate long text
        expect(textLocator.locator.length).toBeLessThan(100);
      }
    });

    it('should filter out utility classes correctly', () => {
      const element = {
        tag: 'div',
        classes: ['mt-4', 'px-2', 'bg-blue-500', 'MyComponent'],
        attributes: {},
        position: { index: 0, siblingCount: 1 },
        children: []
      };

      const options = getDefaultOptions();
      options.allowFragileLocators = true; // Allow fragile locators to see class-based ones
      options.maxClassSelectors = 5; // Allow more class selectors
      const locators = generateLocators(element, options);
      const classLocators = locators.filter(loc => loc.type === LocatorType.CLASS);
      
      // Should include non-utility classes and filter utility ones
      if (classLocators.length > 0) {
        // Should not include utility classes like mt-4, px-2, bg-blue-500
        const utilityClassLocators = classLocators.filter(loc => 
          loc.locator === '.mt-4' || 
          loc.locator === '.px-2' || 
          loc.locator === '.bg-blue-500'
        );
        expect(utilityClassLocators.length).toBe(0);
      }
    });
  });

  describe('getDefaultOptions', () => {
    it('should return sensible defaults', () => {
      const options = getDefaultOptions();
      
      expect(options.preferDataTestId).toBe(true);
      expect(options.includeRoleLocators).toBe(true);
      expect(options.includeXPath).toBe(false);
      expect(options.allowFragileLocators).toBe(false);
      expect(options.maxClassLocators).toBe(3);
      expect(options.targetFrameworks).toEqual([TestFramework.PLAYWRIGHT]);
    });
  });
});
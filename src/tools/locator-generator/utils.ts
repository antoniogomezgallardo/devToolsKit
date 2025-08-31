/**
 * Utilities for Locator Generator Tool
 */

import type {
  ElementInfo,
  GeneratedLocator,
  LocatorGenerationOptions,
  LocatorValidation,
  ParsedHTML
} from './types';
import { LocatorType, TestFramework, FragilityLevel } from './types';

/**
 * Parse HTML string and extract element information
 */
export function parseHTML(htmlString: string): ParsedHTML {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    const elements: ElementInfo[] = [];
    const stats = {
      totalElements: 0,
      elementsWithId: 0,
      elementsWithTestId: 0,
      elementsWithClasses: 0
    };

    function extractElementInfo(element: Element, parent?: ElementInfo): ElementInfo {
      const info: ElementInfo = {
        tag: element.tagName.toLowerCase(),
        classes: Array.from(element.classList),
        attributes: {},
        textContent: element.textContent?.trim() || undefined,
        position: {
          index: Array.from(element.parentElement?.children || []).indexOf(element),
          siblingCount: element.parentElement?.children.length || 0
        },
        parent,
        children: []
      };

      // Extract attributes
      Array.from(element.attributes).forEach(attr => {
        info.attributes[attr.name] = attr.value;
        if (attr.name === 'id') {
          info.id = attr.value;
        }
      });

      // Update stats
      stats.totalElements++;
      if (info.id) stats.elementsWithId++;
      if (info.attributes['data-testid'] || info.attributes['data-test']) {
        stats.elementsWithTestId++;
      }
      if (info.classes.length > 0) stats.elementsWithClasses++;

      // Process children
      Array.from(element.children).forEach(child => {
        const childInfo = extractElementInfo(child, info);
        info.children.push(childInfo);
      });

      return info;
    }

    Array.from(doc.body.querySelectorAll('*')).forEach(element => {
      if (!element.parentElement || element.parentElement === doc.body) {
        elements.push(extractElementInfo(element));
      }
    });

    return { elements, stats };
  } catch (error) {
    throw new Error(`Failed to parse HTML: ${(error as Error).message}`);
  }
}

/**
 * Generate locators for a specific element
 */
export function generateLocators(
  elementInfo: ElementInfo,
  options: LocatorGenerationOptions = getDefaultOptions()
): GeneratedLocator[] {
  const locators: GeneratedLocator[] = [];

  // Data-testid locators (highest priority)
  if (elementInfo.attributes['data-testid']) {
    locators.push(createDataTestIdLocator(elementInfo.attributes['data-testid'], options.targetFrameworks));
  }
  
  if (elementInfo.attributes['data-test']) {
    locators.push(createDataTestLocator(elementInfo.attributes['data-test'], options.targetFrameworks));
  }

  // ID locators (second highest priority)
  if (elementInfo.id) {
    locators.push(createIdLocator(elementInfo.id, options.targetFrameworks));
  }

  // Role-based locators (accessibility-first)
  if (options.includeRoleLocators) {
    const roleLocators = createRoleLocators(elementInfo, options.targetFrameworks);
    locators.push(...roleLocators);
  }

  // Text-based locators
  if (elementInfo.textContent) {
    locators.push(createTextLocator(elementInfo.textContent, options.targetFrameworks));
  }

  // Placeholder locators
  if (elementInfo.attributes.placeholder) {
    locators.push(createPlaceholderLocator(elementInfo.attributes.placeholder, options.targetFrameworks));
  }

  // Class-based locators (moderate priority)
  if (elementInfo.classes.length > 0 && options.maxClassLocators > 0) {
    const classLocators = createClassLocators(elementInfo, options.maxClassLocators, options.targetFrameworks);
    locators.push(...classLocators);
  }

  // XPath locators (lowest priority, highest fragility)
  if (options.includeXPath) {
    const xpathLocator = createXPathLocator(elementInfo, options.targetFrameworks);
    if (xpathLocator) {
      locators.push(xpathLocator);
    }
  }

  // Filter fragile locators if not allowed
  const filteredLocators = options.allowFragileLocators 
    ? locators 
    : locators.filter(loc => loc.robustnessScore >= 6);

  // Sort by priority and robustness
  return filteredLocators.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return b.robustnessScore - a.robustnessScore;
  });
}

/**
 * Create data-testid locator
 */
function createDataTestIdLocator(testId: string, frameworks: TestFramework[]): GeneratedLocator {
  return {
    type: LocatorType.DATA_TESTID,
    locator: `[data-testid="${testId}"]`,
    robustnessScore: 10,
    priority: 10,
    framework: frameworks[0] || TestFramework.PLAYWRIGHT,
    codeSnippet: generateFrameworkCode(LocatorType.DATA_TESTID, testId, frameworks[0] || TestFramework.PLAYWRIGHT),
    description: 'Best practice: data-testid attribute specifically for testing',
    pros: ['Stable', 'Created specifically for testing', 'Unique identifier'],
    cons: ['Requires adding data-testid to HTML']
  };
}

/**
 * Create data-test locator
 */
function createDataTestLocator(test: string, frameworks: TestFramework[]): GeneratedLocator {
  return {
    type: LocatorType.DATA_TEST,
    locator: `[data-test="${test}"]`,
    robustnessScore: 10,
    priority: 9,
    framework: frameworks[0] || TestFramework.PLAYWRIGHT,
    codeSnippet: generateFrameworkCode(LocatorType.DATA_TEST, test, frameworks[0] || TestFramework.PLAYWRIGHT),
    description: 'Alternative data attribute for testing',
    pros: ['Stable', 'Created specifically for testing', 'Clear intent'],
    cons: ['Requires adding data-test to HTML']
  };
}

/**
 * Create ID locator
 */
function createIdLocator(id: string, frameworks: TestFramework[]): GeneratedLocator {
  return {
    type: LocatorType.ID,
    locator: `#${id}`,
    robustnessScore: 9,
    priority: 8,
    framework: frameworks[0] || TestFramework.PLAYWRIGHT,
    codeSnippet: generateFrameworkCode(LocatorType.ID, id, frameworks[0] || TestFramework.PLAYWRIGHT),
    description: 'ID selector - generally stable if IDs are meaningful',
    pros: ['Usually unique', 'Fast selection', 'Semantic'],
    cons: ['May change if ID is auto-generated', 'Developers might modify IDs']
  };
}

/**
 * Create role-based locators
 */
function createRoleLocators(elementInfo: ElementInfo, frameworks: TestFramework[]): GeneratedLocator[] {
  const locators: GeneratedLocator[] = [];
  const role = elementInfo.attributes.role || getImplicitRole(elementInfo.tag);
  
  if (role) {
    const textContent = elementInfo.textContent;
    
    if (textContent) {
      // Role with name
      locators.push({
        type: LocatorType.ROLE,
        locator: `role=${role}[name="${textContent}"]`,
        robustnessScore: 8,
        priority: 7,
        framework: frameworks[0] || TestFramework.PLAYWRIGHT,
        codeSnippet: generateFrameworkCode(LocatorType.ROLE, `${role}[name="${textContent}"]`, frameworks[0] || TestFramework.PLAYWRIGHT),
        description: 'Accessibility-first locator using role and accessible name',
        pros: ['Accessibility-friendly', 'Semantic', 'Relatively stable'],
        cons: ['Text content might change', 'Requires accessible name']
      });
    }

    // Role only
    locators.push({
      type: LocatorType.ROLE,
      locator: `role=${role}`,
      robustnessScore: 6,
      priority: 6,
      framework: frameworks[0] || TestFramework.PLAYWRIGHT,
      codeSnippet: generateFrameworkCode(LocatorType.ROLE, role, frameworks[0] || TestFramework.PLAYWRIGHT),
      description: 'Role-based locator (may match multiple elements)',
      pros: ['Accessibility-friendly', 'Semantic'],
      cons: ['May not be unique', 'Could match multiple elements']
    });
  }

  return locators;
}

/**
 * Create text-based locator
 */
function createTextLocator(text: string, frameworks: TestFramework[]): GeneratedLocator {
  const trimmedText = text.substring(0, 50); // Limit text length
  
  return {
    type: LocatorType.TEXT,
    locator: `text="${trimmedText}"`,
    robustnessScore: 5,
    priority: 5,
    framework: frameworks[0] || TestFramework.PLAYWRIGHT,
    codeSnippet: generateFrameworkCode(LocatorType.TEXT, trimmedText, frameworks[0] || TestFramework.PLAYWRIGHT),
    description: 'Text content locator',
    pros: ['Human-readable', 'Intuitive'],
    cons: ['Fragile if text changes', 'Localization issues', 'May not be unique']
  };
}

/**
 * Create placeholder locator
 */
function createPlaceholderLocator(placeholder: string, frameworks: TestFramework[]): GeneratedLocator {
  return {
    type: LocatorType.PLACEHOLDER,
    locator: `[placeholder="${placeholder}"]`,
    robustnessScore: 7,
    priority: 6,
    framework: frameworks[0] || TestFramework.PLAYWRIGHT,
    codeSnippet: generateFrameworkCode(LocatorType.PLACEHOLDER, placeholder, frameworks[0] || TestFramework.PLAYWRIGHT),
    description: 'Placeholder attribute locator for input elements',
    pros: ['Specific to input elements', 'User-facing text'],
    cons: ['Only works for input elements', 'Localization issues']
  };
}

/**
 * Create class-based locators
 */
function createClassLocators(
  elementInfo: ElementInfo,
  maxCount: number,
  frameworks: TestFramework[]
): GeneratedLocator[] {
  const locators: GeneratedLocator[] = [];
  
  // Single class selectors
  elementInfo.classes.slice(0, maxCount).forEach((className, index) => {
    if (!isUtilityClass(className)) {
      locators.push({
        type: LocatorType.CLASS,
        locator: `.${className}`,
        robustnessScore: 4 - (index * 0.5), // Decrease score for later classes
        priority: 4,
        framework: frameworks[0] || TestFramework.PLAYWRIGHT,
        codeSnippet: generateFrameworkCode(LocatorType.CLASS, className, frameworks[0] || TestFramework.PLAYWRIGHT),
        description: `Class selector: ${className}`,
        pros: ['Fast selection', 'Semantic if meaningful class name'],
        cons: ['May not be unique', 'Fragile if classes change', 'CSS framework classes are unstable']
      });
    }
  });

  return locators;
}

/**
 * Create XPath locator
 */
function createXPathLocator(elementInfo: ElementInfo, frameworks: TestFramework[]): GeneratedLocator {
  const xpath = generateXPath(elementInfo);
  
  return {
    type: LocatorType.XPATH,
    locator: xpath,
    robustnessScore: 2,
    priority: 1,
    framework: frameworks[0] || TestFramework.PLAYWRIGHT,
    codeSnippet: generateFrameworkCode(LocatorType.XPATH, xpath, frameworks[0] || TestFramework.PLAYWRIGHT),
    description: 'XPath selector (last resort)',
    pros: ['Very specific', 'Can target any element'],
    cons: ['Very fragile', 'Hard to read', 'Breaks with DOM structure changes']
  };
}

/**
 * Generate framework-specific code
 */
function generateFrameworkCode(type: LocatorType, value: string, framework: TestFramework): string {
  switch (framework) {
    case TestFramework.PLAYWRIGHT:
      switch (type) {
        case LocatorType.DATA_TESTID:
          return `page.getByTestId('${value}')`;
        case LocatorType.DATA_TEST:
          return `page.locator('[data-test="${value}"]')`;
        case LocatorType.ID:
          return `page.locator('#${value}')`;
        case LocatorType.ROLE:
          if (value.includes('[name=')) {
            const [role, name] = value.split('[name="');
            const cleanName = name.replace('"]', '');
            return `page.getByRole('${role}', { name: '${cleanName}' })`;
          }
          return `page.getByRole('${value}')`;
        case LocatorType.TEXT:
          return `page.getByText('${value}')`;
        case LocatorType.PLACEHOLDER:
          return `page.getByPlaceholder('${value}')`;
        case LocatorType.CLASS:
          return `page.locator('.${value}')`;
        case LocatorType.XPATH:
          return `page.locator('${value}')`;
        default:
          return `page.locator('${value}')`;
      }
    
    case TestFramework.CYPRESS:
      switch (type) {
        case LocatorType.DATA_TESTID:
          return `cy.get('[data-testid="${value}"]')`;
        case LocatorType.DATA_TEST:
          return `cy.get('[data-test="${value}"]')`;
        case LocatorType.ID:
          return `cy.get('#${value}')`;
        case LocatorType.TEXT:
          return `cy.contains('${value}')`;
        case LocatorType.PLACEHOLDER:
          return `cy.get('[placeholder="${value}"]')`;
        case LocatorType.CLASS:
          return `cy.get('.${value}')`;
        default:
          return `cy.get('${value}')`;
      }
    
    case TestFramework.SELENIUM_JAVA:
      switch (type) {
        case LocatorType.DATA_TESTID:
          return `driver.findElement(By.cssSelector("[data-testid='${value}']"))`;
        case LocatorType.ID:
          return `driver.findElement(By.id("${value}"))`;
        case LocatorType.CLASS:
          return `driver.findElement(By.className("${value}"))`;
        case LocatorType.XPATH:
          return `driver.findElement(By.xpath("${value}"))`;
        default:
          return `driver.findElement(By.cssSelector("${value}"))`;
      }
    
    default:
      return `locator: ${value}`;
  }
}

/**
 * Get implicit ARIA role for HTML element
 */
function getImplicitRole(tag: string): string | null {
  const roleMap: Record<string, string> = {
    'button': 'button',
    'a': 'link',
    'input': 'textbox',
    'textarea': 'textbox',
    'select': 'combobox',
    'h1': 'heading',
    'h2': 'heading',
    'h3': 'heading',
    'h4': 'heading',
    'h5': 'heading',
    'h6': 'heading',
    'img': 'img',
    'nav': 'navigation',
    'main': 'main',
    'header': 'banner',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'section': 'region',
    'article': 'article',
    'form': 'form',
    'table': 'table',
    'ul': 'list',
    'ol': 'list',
    'li': 'listitem'
  };
  
  return roleMap[tag] || null;
}

/**
 * Check if class is a utility class (like Tailwind)
 */
function isUtilityClass(className: string): boolean {
  const utilityPatterns = [
    /^[mp][trblxy]?-\d+$/, // Tailwind margin/padding
    /^[wh]-\d+$/, // Tailwind width/height
    /^text-(xs|sm|base|lg|xl|\d?xl)$/, // Tailwind text sizes
    /^bg-(red|blue|green|yellow|gray|purple|pink|indigo)-\d+$/, // Tailwind colors
    /^flex/, // Tailwind flex utilities
    /^grid/, // Tailwind grid utilities
    /^col-/, // Bootstrap/Tailwind columns
    /^row-/, // Bootstrap/Tailwind rows
    /^d-(none|block|inline|flex)/, // Bootstrap display
  ];
  
  return utilityPatterns.some(pattern => pattern.test(className));
}

/**
 * Generate XPath for element (simplified)
 */
function generateXPath(elementInfo: ElementInfo): string {
  let xpath = `//${elementInfo.tag}`;
  
  if (elementInfo.id) {
    xpath += `[@id='${elementInfo.id}']`;
  } else if (elementInfo.classes.length > 0) {
    xpath += `[@class='${elementInfo.classes.join(' ')}']`;
  } else {
    xpath += `[${elementInfo.position.index + 1}]`;
  }
  
  return xpath;
}

/**
 * Validate locator uniqueness and stability
 */
export function validateLocator(locator: GeneratedLocator, htmlString: string): LocatorValidation {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    const matchCount = doc.querySelectorAll(locator.locator).length;
    const isUnique = matchCount === 1;
    
    // Determine fragility based on locator type and robustness score
    let fragility: FragilityLevel;
    if (locator.robustnessScore >= 9) fragility = FragilityLevel.VERY_STABLE;
    else if (locator.robustnessScore >= 7) fragility = FragilityLevel.STABLE;
    else if (locator.robustnessScore >= 5) fragility = FragilityLevel.MODERATE;
    else if (locator.robustnessScore >= 3) fragility = FragilityLevel.FRAGILE;
    else fragility = FragilityLevel.VERY_FRAGILE;
    
    const recommendations: string[] = [];
    
    if (!isUnique) {
      recommendations.push(`Locator matches ${matchCount} elements. Consider adding more specific attributes.`);
    }
    
    if (locator.type === LocatorType.CLASS && locator.locator.includes('-')) {
      recommendations.push('Utility classes (like Tailwind) are fragile. Prefer data-testid or semantic selectors.');
    }
    
    if (locator.type === LocatorType.XPATH) {
      recommendations.push('XPath locators are fragile. Consider using CSS selectors or semantic locators instead.');
    }
    
    if (locator.type === LocatorType.TEXT && locator.locator.length > 20) {
      recommendations.push('Long text selectors may break with content changes. Consider using shorter, more stable text.');
    }

    return {
      isUnique,
      matchCount,
      isStable: locator.robustnessScore >= 7,
      fragility,
      recommendations
    };
  } catch (error) {
    return {
      isUnique: false,
      matchCount: 0,
      isStable: false,
      fragility: FragilityLevel.VERY_FRAGILE,
      recommendations: ['Could not validate locator due to parsing error']
    };
  }
}

/**
 * Get default generation options
 */
export function getDefaultOptions(): LocatorGenerationOptions {
  return {
    preferDataTestId: true,
    includeRoleLocators: true,
    includeXPath: false,
    maxClassLocators: 3,
    allowFragileLocators: false,
    targetFrameworks: [TestFramework.PLAYWRIGHT]
  };
}
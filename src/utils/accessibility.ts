/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Trap focus within a modal or dialog
 */
export const trapFocus = (element: HTMLElement): (() => void) => {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable?.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable?.focus();
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Check if an element is visible to screen readers
 */
export const isScreenReaderVisible = (element: HTMLElement): boolean => {
  return !element.hasAttribute('aria-hidden') || element.getAttribute('aria-hidden') !== 'true';
};

/**
 * Announce message to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Get contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const [r, g, b] = rgb.map((val) => {
      const sRGB = val / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if color contrast meets WCAG AA standards
 */
export const meetsContrastAA = (foreground: string, background: string, largeText: boolean = false): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Check if color contrast meets WCAG AAA standards
 */
export const meetsContrastAAA = (foreground: string, background: string, largeText: boolean = false): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return largeText ? ratio >= 4.5 : ratio >= 7;
};

/**
 * Add skip links for keyboard navigation
 */
export const addSkipLinks = (): void => {
  const skipLinksContainer = document.createElement('div');
  skipLinksContainer.className = 'skip-links';
  skipLinksContainer.innerHTML = `
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#navigation" class="skip-link">Skip to navigation</a>
  `;

  document.body.insertBefore(skipLinksContainer, document.body.firstChild);
};

/**
 * Check if element has accessible name
 */
export const hasAccessibleName = (element: HTMLElement): boolean => {
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const title = element.getAttribute('title');
  const textContent = element.textContent?.trim();

  return !!(ariaLabel || ariaLabelledBy || title || textContent);
};

/**
 * Validate form field for accessibility
 */
export const validateFormFieldAccessibility = (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string[] => {
  const issues: string[] = [];

  // Check for label
  const label = document.querySelector(`label[for="${field.id}"]`);
  const ariaLabel = field.getAttribute('aria-label');
  const ariaLabelledBy = field.getAttribute('aria-labelledby');

  if (!label && !ariaLabel && !ariaLabelledBy) {
    issues.push('Field missing accessible label');
  }

  // Check for error message association
  if (field.getAttribute('aria-invalid') === 'true') {
    const ariaDescribedBy = field.getAttribute('aria-describedby');
    if (!ariaDescribedBy) {
      issues.push('Invalid field missing error message association');
    }
  }

  // Check for required indicator
  if (field.hasAttribute('required')) {
    const ariaRequired = field.getAttribute('aria-required');
    if (!ariaRequired) {
      issues.push('Required field missing aria-required');
    }
  }

  return issues;
};

/**
 * Set up keyboard navigation for custom components
 */
export const setupKeyboardNavigation = (container: HTMLElement, items: HTMLElement[]): (() => void) => {
  let currentIndex = 0;

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex]?.focus();
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        items[currentIndex]?.focus();
        break;

      case 'Home':
        e.preventDefault();
        currentIndex = 0;
        items[currentIndex]?.focus();
        break;

      case 'End':
        e.preventDefault();
        currentIndex = items.length - 1;
        items[currentIndex]?.focus();
        break;
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Check for common accessibility issues
 */
export const runAccessibilityAudit = (): string[] => {
  const issues: string[] = [];

  // Check for images without alt text
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push(`Image missing alt text: ${img.src}`);
    }
  });

  // Check for form fields without labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    if (input instanceof HTMLElement) {
      const fieldIssues = validateFormFieldAccessibility(input as any);
      issues.push(...fieldIssues.map((issue) => `${input.id || 'unnamed field'}: ${issue}`));
    }
  });

  // Check for links without text
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    if (!hasAccessibleName(link)) {
      issues.push(`Link missing accessible name: ${link.href}`);
    }
  });

  // Check for buttons without text
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!hasAccessibleName(button)) {
      issues.push('Button missing accessible name');
    }
  });

  // Check for proper heading structure
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headingLevels = headings.map((h) => parseInt(h.tagName[1]));
  
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i - 1] > 1) {
      issues.push(`Heading hierarchy skip: h${headingLevels[i - 1]} to h${headingLevels[i]}`);
    }
  }

  return issues;
};

/**
 * Create accessible tooltip
 */
export const createAccessibleTooltip = (trigger: HTMLElement, content: string): (() => void) => {
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  
  trigger.setAttribute('aria-describedby', tooltipId);
  
  const tooltip = document.createElement('div');
  tooltip.id = tooltipId;
  tooltip.role = 'tooltip';
  tooltip.className = 'tooltip';
  tooltip.textContent = content;
  tooltip.style.display = 'none';
  
  document.body.appendChild(tooltip);

  const show = () => {
    tooltip.style.display = 'block';
  };

  const hide = () => {
    tooltip.style.display = 'none';
  };

  trigger.addEventListener('mouseenter', show);
  trigger.addEventListener('mouseleave', hide);
  trigger.addEventListener('focus', show);
  trigger.addEventListener('blur', hide);

  return () => {
    trigger.removeEventListener('mouseenter', show);
    trigger.removeEventListener('mouseleave', hide);
    trigger.removeEventListener('focus', show);
    trigger.removeEventListener('blur', hide);
    document.body.removeChild(tooltip);
  };
};


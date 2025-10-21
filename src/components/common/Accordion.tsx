import React, { ReactNode, useState } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
  className?: string;
  variant?: 'default' | 'bordered' | 'separated';
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenItems = [],
  className = '',
  variant = 'default',
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpenItems);

  const toggleItem = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item?.disabled) return;

    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setOpenItems((prev) => (prev.includes(itemId) ? [] : [itemId]));
    }
  };

  const isOpen = (itemId: string) => openItems.includes(itemId);

  const getVariantStyles = () => {
    switch (variant) {
      case 'bordered':
        return {
          container:
            'border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700',
          item: '',
        };
      case 'separated':
        return {
          container: 'space-y-2',
          item: 'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
        };
      default:
        return {
          container: 'divide-y divide-gray-200 dark:divide-gray-700',
          item: '',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${styles.container} ${className}`}>
      {items.map((item) => {
        const itemIsOpen = isOpen(item.id);

        return (
          <div key={item.id} className={styles.item}>
            {/* Accordion Header */}
            <button
              onClick={() => toggleItem(item.id)}
              disabled={item.disabled}
              className={`
                flex w-full items-center justify-between px-6 py-4 text-left transition-colors
                ${
                  item.disabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
              aria-expanded={itemIsOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-header-${item.id}`}
            >
              <div className="flex items-center space-x-3">
                {item.icon && (
                  <span className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                    {item.icon}
                  </span>
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.title}
                </span>
              </div>

              {/* Chevron Icon */}
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 dark:text-gray-400 ${
                  itemIsOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Accordion Content */}
            <div
              id={`accordion-content-${item.id}`}
              role="region"
              aria-labelledby={`accordion-header-${item.id}`}
              className={`
                overflow-hidden transition-all duration-200
                ${itemIsOpen ? 'max-h-screen' : 'max-h-0'}
              `}
            >
              <div className="px-6 py-4 text-gray-600 dark:text-gray-400">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Simple accordion with just expand/collapse animation
export interface SimpleAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
  className?: string;
}

export const SimpleAccordion: React.FC<SimpleAccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  icon,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <span className="flex-shrink-0 text-gray-500 dark:text-gray-400">
              {icon}
            </span>
          )}
          <span className="font-medium text-gray-900 dark:text-white">
            {title}
          </span>
        </div>

        <svg
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 dark:text-gray-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="border-t border-gray-200 px-6 py-4 text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {children}
        </div>
      </div>
    </div>
  );
};

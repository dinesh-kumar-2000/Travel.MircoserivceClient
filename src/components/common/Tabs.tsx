import React, { ReactNode, useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  onChange,
  variant = 'default',
  className = '',
  tabsClassName = '',
  contentClassName = '',
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id || ''
  );

  const handleTabChange = (tabId: string) => {
    if (tabs.find((tab) => tab.id === tabId)?.disabled) return;
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  const getTabStyles = () => {
    switch (variant) {
      case 'pills':
        return {
          container: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
          tab: 'px-4 py-2 rounded-lg transition-colors duration-200',
          active:
            'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm',
          inactive:
            'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
        };
      case 'underline':
        return {
          container: 'border-b border-gray-200 dark:border-gray-700',
          tab: 'px-4 py-3 transition-colors duration-200 border-b-2 -mb-px',
          active:
            'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400',
          inactive:
            'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600',
        };
      default:
        return {
          container: 'border-b border-gray-200 dark:border-gray-700',
          tab: 'px-6 py-3 transition-colors duration-200 rounded-t-lg',
          active:
            'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-t border-l border-r border-gray-200 dark:border-gray-700 -mb-px',
          inactive:
            'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
        };
    }
  };

  const styles = getTabStyles();

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Headers */}
      <div
        className={`flex space-x-1 ${styles.container} ${tabsClassName}`}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
              ${styles.tab}
              ${activeTab === tab.id ? styles.active : styles.inactive}
              ${
                tab.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer'
              }
              flex items-center space-x-2 whitespace-nowrap text-sm font-medium
            `}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className={`mt-4 ${contentClassName}`}
      >
        {activeTabContent}
      </div>
    </div>
  );
};

// Vertical Tabs variant
export interface VerticalTabsProps extends Omit<TabsProps, 'variant'> {
  tabsWidth?: string;
}

export const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  defaultActiveTab,
  onChange,
  className = '',
  tabsClassName = '',
  contentClassName = '',
  tabsWidth = 'w-48',
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id || ''
  );

  const handleTabChange = (tabId: string) => {
    if (tabs.find((tab) => tab.id === tabId)?.disabled) return;
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={`flex space-x-6 ${className}`}>
      {/* Vertical Tab Headers */}
      <div
        className={`${tabsWidth} flex-shrink-0 ${tabsClassName}`}
        role="tablist"
        aria-orientation="vertical"
      >
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left transition-colors duration-200
                ${
                  activeTab === tab.id
                    ? 'bg-primary-50 font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                }
                ${
                  tab.disabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }
              `}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span className="flex-1">{tab.label}</span>
              {tab.badge && (
                <span className="inline-flex items-center justify-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Vertical Tab Content */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className={`flex-1 ${contentClassName}`}
      >
        {activeTabContent}
      </div>
    </div>
  );
};

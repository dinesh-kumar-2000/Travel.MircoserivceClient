import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ThemeConfig, defaultThemes } from '../theme/themeConfig';
import { applyTheme } from '../utils/themeHelper';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  toggleMode: () => void;
  customizeTheme: (colors: Partial<ThemeConfig['colors']>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  tenantTheme?: Partial<ThemeConfig>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  tenantTheme,
}) => {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedMode = localStorage.getItem('themeMode') as
      | 'light'
      | 'dark'
      | null;

    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch {
        return defaultThemes[savedMode || 'light'];
      }
    }

    return defaultThemes[savedMode || 'light'];
  });

  useEffect(() => {
    // Apply tenant theme if provided
    if (tenantTheme) {
      const mergedTheme: ThemeConfig = {
        ...theme,
        ...tenantTheme,
        colors: {
          ...theme.colors,
          ...tenantTheme.colors,
        },
      };
      setThemeState(mergedTheme);
    }
  }, [tenantTheme]);

  useEffect(() => {
    // Apply theme to DOM
    applyTheme(theme);

    // Save theme to localStorage
    localStorage.setItem('theme', JSON.stringify(theme));
    localStorage.setItem('themeMode', theme.mode);
  }, [theme]);

  const setTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme);
  };

  const toggleMode = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    setThemeState(defaultThemes[newMode]);
  };

  const customizeTheme = (colors: Partial<ThemeConfig['colors']>) => {
    setThemeState({
      ...theme,
      colors: {
        ...theme.colors,
        ...colors,
      },
    });
  };

  const resetTheme = () => {
    setThemeState(defaultThemes[theme.mode]);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleMode,
        customizeTheme,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

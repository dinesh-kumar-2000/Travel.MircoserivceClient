export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  colors: ThemeColors;
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    unit: number;
  };
}

export const lightTheme: ThemeConfig = {
  id: 'light',
  name: 'Light',
  mode: 'light',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },
  fonts: {
    primary:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: 'Georgia, serif',
    mono: 'Menlo, Monaco, "Courier New", monospace',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  spacing: {
    unit: 8,
  },
};

export const darkTheme: ThemeConfig = {
  id: 'dark',
  name: 'Dark',
  mode: 'dark',
  colors: {
    primary: '#60A5FA',
    secondary: '#A78BFA',
    accent: '#34D399',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#374151',
  },
  fonts: {
    primary:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: 'Georgia, serif',
    mono: 'Menlo, Monaco, "Courier New", monospace',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  spacing: {
    unit: 8,
  },
};

export const defaultThemes: Record<string, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
};

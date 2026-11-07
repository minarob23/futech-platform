import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'futech_theme';
const THEME_CHANGE_EVENT = 'futech-theme-change';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // fallback if localStorage is unavailable
  }

  return 'light';
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply on mount and sync
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Listen for changes from other components or tabs
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<Theme>;
      if (customEvent.detail && (customEvent.detail === 'light' || customEvent.detail === 'dark')) {
        setThemeState(customEvent.detail);
        applyThemeToDocument(customEvent.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
        applyThemeToDocument(e.newValue);
      }
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDocument(newTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {}

    window.dispatchEvent(
      new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: newTheme })
    );
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  };
}

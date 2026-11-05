// src/components/ui/ThemeToggle.jsx
'use client';
import { useTheme } from '@/hooks/useTheme';
import { useLang } from '@/i18n/LanguageProvider';

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  const { t } = useLang();

  return (
    <button
      className="theme-btn"
      onClick={toggle}
      aria-label={t.header.toggleTheme}
    >
      <i className={`fas ${dark ? 'fa-moon' : 'fa-sun'}`} />
    </button>
  );
}

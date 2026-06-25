// src/components/ui/ThemeToggle.jsx
'use client';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      className="theme-btn"
      onClick={toggle}
      aria-label="تغییر تم"
    >
      <i className={`fas ${dark ? 'fa-moon' : 'fa-sun'}`} />
    </button>
  );
}
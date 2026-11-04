// src/hooks/useTheme.js
'use client';
import { useState, useEffect } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      setDark(saved !== 'light');
    } catch (_) {}
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.remove('light');
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (_) {}
  }, [dark]);

  return { dark, toggle: () => setDark(p => !p) };
}
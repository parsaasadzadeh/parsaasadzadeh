// src/components/ui/NavHighlight.jsx
'use client';
import { useEffect } from 'react';

export default function NavHighlight() {
  useEffect(() => {
    const sections = [...document.querySelectorAll('section[id]')];
    const navLinks = [...document.querySelectorAll('.nav-link')];
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        let cur = '';
        sections.forEach(s => {
          if (window.scrollY >= s.offsetTop - s.clientHeight / 3) cur = s.id;
        });
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
        });
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null; // فقط effect — هیچ UI نداره
}
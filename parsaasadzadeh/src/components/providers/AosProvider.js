// src/components/providers/AosProvider.jsx
'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AosInit() {
  useEffect(() => {
    AOS.init({
      duration: 650,
      offset: 50,
      once: false,
      mirror: true,
      disable: false,
    });
  }, []);

  return null; // هیچ children نمی‌گیره
}
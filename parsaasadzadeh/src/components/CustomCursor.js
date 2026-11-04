// src/components/ui/CustomCursor.jsx
'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const curRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;

    const cur  = curRef.current;
    const ring = ringRef.current;
    if (!cur || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0, rafId = 0;
    const onMove = e => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cur.style.transform  = `translate(${mx - 4}px,${my - 4}px)`;
      ring.style.transform = `translate(${rx - 16}px,${ry - 16}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const hoverEls = document.querySelectorAll('a,button,.proj-card,.contact-card');
    const addBig   = () => ring.classList.add('big');
    const rmBig    = () => ring.classList.remove('big');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', addBig,  { passive: true });
      el.addEventListener('mouseleave', rmBig,   { passive: true });
    });

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else rafId = requestAnimationFrame(tick);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <>
      <div id="cur"   ref={curRef}  aria-hidden="true" />
      <div id="cur-r" ref={ringRef} aria-hidden="true" />
    </>
  );
}
"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import fa from "./fa";
import en from "./en";

const DICTS = { fa, en };
const STORAGE_KEY = "lang";

// صفحات ادمین فقط فارسی هستند و تحت‌تأثیر انتخاب زبان قرار نمی‌گیرند
const FA_ONLY_PREFIXES = ["/panel", "/admin-sign"];


const LanguageContext = createContext({
  lang: "fa",
  t: fa,
  dir: "rtl",
  setLang: () => {},
});

export function LanguageProvider({ children }) {
  const pathname = usePathname() || "/";
  const [pref, setPref] = useState("fa");

  // خواندن زبان ذخیره‌شده (بعد از mount تا hydration به‌هم نریزد)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "fa") setPref(saved);
    } catch (_) {}
  }, []);

  const faOnly = FA_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
  const lang = faOnly ? "fa" : pref;
  const t = DICTS[lang];

  const setLang = useCallback((l) => {
    if (l !== "fa" && l !== "en") return;
    setPref(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch (_) {}
  }, []);

  // جهت و زبان صفحه + عنوان تب و توضیحات
  useEffect(() => {
    const html = document.documentElement;
    html.lang = t.code;
    html.dir = t.dir;

    let title = null;
    let desc = null;
    if (pathname === "/") { title = t.meta.homeTitle; desc = t.meta.homeDesc; }
    else if (pathname.startsWith("/courses")) { title = t.meta.coursesTitle; desc = t.meta.coursesDesc; }

    if (title) document.title = title;
    if (desc) {
      const m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", desc);
    }
  }, [t, pathname]);

  const value = useMemo(() => ({ lang, t, dir: t.dir, setLang }), [lang, t, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}
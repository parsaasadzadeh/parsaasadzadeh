// src/components/layout/Navbar.jsx
"use client";
import ThemeToggle from "../ThemeToggle";
import { useLang } from "@/i18n/LanguageProvider";

export default function Header() {
    const { lang, setLang, t } = useLang();

    return (
        <>
            <nav data-aos="fade-down">
                <div className="top-nav">
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <button
                            className={`lang-btn ${lang === "en" ? "active" : ""}`}
                            aria-label={t.header.switchToEnglish}
                            aria-pressed={lang === "en"}
                            onClick={() => setLang("en")}
                        >
                            English
                        </button>
                        <button
                            className={`lang-btn ${lang === "fa" ? "active" : ""}`}
                            aria-label={t.header.switchToPersian}
                            aria-pressed={lang === "fa"}
                            onClick={() => setLang("fa")}
                        >
                            فارسی
                        </button>
                    </div>
                    <div className="logo" aria-label={t.header.logoLabel}>ParsaAsadzadeh</div>
                    <ThemeToggle />
                </div>
            </nav>
        </>
    );
}

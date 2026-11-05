"use client";
import { useLang } from "@/i18n/LanguageProvider";

const ITEMS = [
    { id: "home", icon: "fa-home" },
    { id: "about", icon: "fa-user" },
    { id: "projects", icon: "fa-briefcase" },
    { id: "contact", icon: "fa-envelope" },
];

export default function NavSite() {
    const { t } = useLang();

    return (
        <>
            <nav className="side-nav" aria-label={t.nav.main} data-aos="fade-left" data-aos-delay="300">
                {ITEMS.map(({ id, icon }) => (
                    <a key={id} href={`#${id}`} className={`nav-link ${id === "home" ? "active" : ""}`} data-sec={id} aria-label={t.nav[id]}>
                        <i className={`fas ${icon}`} style={{ fontSize: "17px" }} />
                    </a>
                ))}
            </nav>

            <nav className="bot-nav" aria-label={t.nav.mobile}>
                {ITEMS.map(({ id, icon }) => (
                    <a key={id} href={`#${id}`} className={`nav-link ${id === "home" ? "active" : ""}`} data-sec={id} aria-label={t.nav[id]}>
                        <i className={`fas ${icon}`}></i>
                    </a>
                ))}
            </nav>
        </>
    );
}

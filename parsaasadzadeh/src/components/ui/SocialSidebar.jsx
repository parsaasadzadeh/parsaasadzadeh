"use client";
import { useLang } from "@/i18n/LanguageProvider";

export default function SocialSidebar() {
    const { t } = useLang();
    return (
        <div className="social-side" data-aos="fade-right" data-aos-delay="300">
            <a href="https://instagram.com/parsa.asadzadeh" target="_blank" rel="noopener noreferrer" className="soc-a fab fa-instagram" aria-label={t.social.instagram}></a>
            <a href="https://github.com/parsaasadzadeh" target="_blank" rel="noopener noreferrer" className="soc-a fab fa-github" aria-label={t.social.github}></a>
            <a href="https://t.me/parsaa_asadzadeh" target="_blank" rel="noopener noreferrer" className="soc-a fab fa-telegram" aria-label={t.social.telegram}></a>
            <a href="https://linkedin.com/in/parsaasadzadeh" target="_blank" rel="noopener noreferrer" className="soc-a fab fa-linkedin" aria-label={t.social.linkedin}></a>
        </div>
    )
}

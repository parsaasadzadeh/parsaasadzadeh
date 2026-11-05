"use client";
import Image from "next/image";
import { useLang } from "@/i18n/LanguageProvider";

export default function Hero() {
    const { t } = useLang();
    return (
        <section id="home" aria-label={t.hero.label}>
            {/* عکس */}
            <div
                className="float mx-auto"
                style={{ width: '100%', maxWidth: '300px', flexShrink: 0 }}
                data-aos="zoom-in"
                data-aos-duration="1100"
            >
                <div className="hero-img-wrap">
                    <Image
                        src="/parsaasad.jpg"
                        alt="Parsa Asadzadeh"
                        loading="eager"
                        width={400}
                        height={500}
                    />
                </div>
            </div>
            {/* متن */}
            <div className="hero-text">
                {/* تگ کوچک بالای اسم */}
                <span
                    style={{
                        fontSize: '13px',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        color: 'var(--ac)',
                        marginBottom: '16px',
                        fontWeight: 500,
                        display: 'block',
                        opacity: 0.8,
                    }}
                    data-aos="fade-up"
                    data-aos-delay="80"
                >
                    {t.hero.role}
                </span>
                {/* اسم کامل — یه h1 */}
                <h1
                    className="h1"
                    data-aos="fade-up"
                    data-aos-delay="180"
                    style={{ marginBottom: '20px' }}
                >
                    <span className="glitch" data-text={t.hero.name}>
                        {t.hero.name}
                    </span>
                </h1>
                {/* توضیح */}
                <p
                    className="hero-desc"
                    data-aos="fade-up"
                    data-aos-delay="320"
                >
                    {t.hero.desc}
                </p>
                {/* بج‌ها */}
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '32px',
                    }}
                    data-aos="fade-up"
                    data-aos-delay="420"
                >
                    <div className="badge">
                        <div className="dot" aria-hidden="true" />
                        <span style={{ fontSize: '13px', color: 'var(--text1)' }}>
                            {t.hero.available}
                        </span>
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text2)' }}>
                        {t.hero.location}
                    </span>
                </div>
                {/* دکمه‌ها */}
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    data-aos="fade-up"
                    data-aos-delay="500"
                >
                    {/* دکمه دانلود رزومه */}
                    <a
                        href="parsaasadzadeh.pdf"
                        className="dl-btn"
                        download="resume.pdf"
                    >
                        <i className="fas fa-download" aria-hidden="true" />
                        {' '}{t.hero.resume}
                    </a>
                    {/* دکمه آموزش */}
                    <a
                        href="/courses"
                        className="dl-btn"
                        style={{
                            background: 'transparent',
                            border: '1.5px solid var(--ac)',
                            color: 'var(--ac)',
                        }}
                    >
                        <i className="fas fa-graduation-cap" aria-hidden="true" />
                        {' '}{t.hero.courses}
                    </a>
                    {/* دکمه سفارش طراحی سایت */}
                    <a
                        href="/order"
                        className="dl-btn"
                        style={{
                            background: 'transparent',
                            border: '1.5px solid var(--text2)',
                            color: 'var(--text1)',
                        }}
                    >
                        <i className="fas fa-palette" aria-hidden="true" />
                        {' '}{t.hero.order}
                    </a>
                </div>
            </div>
        </section>
    );
}

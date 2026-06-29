import Image from "next/image";


export default function Hero() {
    return (
        <section id="home" aria-label="معرفی">
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
                    FullStack Developer
                </span>

                {/* اسم کامل — یه h1 */}
                <h1
                    className="h1"
                    data-aos="fade-up"
                    data-aos-delay="180"
                    style={{ marginBottom: '20px' }}
                >
                    <span className="glitch" data-text="پارسا اسدزاده">
                        پارسا اسدزاده
                    </span>
                </h1>

                {/* توضیح */}
                <p
                    className="hero-desc"
                    data-aos="fade-up"
                    data-aos-delay="320"
                >
                    توسعه‌دهنده فرانت‌اند با تخصص در React و Next.js —
                    رابط‌های کاربری می‌سازم که هم سریع‌اند، هم زیبا، هم حرفه‌ای.
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
                            آماده همکاری
                        </span>
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text2)' }}>
                        ایران — ارومیه
                    </span>
                </div>

                {/* دکمه */}
                <a
                    href="parsaasadzadeh.pdf"
                    className="dl-btn"
                    data-aos="fade-up"
                    data-aos-delay="500"
                    download="resume.pdf"
                >
                    <i className="fas fa-download" aria-hidden="true" />
                    {' '}دانلود رزومه
                </a>
            </div>
        </section>
    );

    
}

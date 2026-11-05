'use client';
import Link from 'next/link';
import { useLang } from '@/i18n/LanguageProvider';

export default function NotFoundView() {
  const { t } = useLang();
  return (
    <main
      style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* گرید پس‌زمینه */}
      <div className="grid-404" aria-hidden="true" />

      {/* اسکن لاین */}
      <div className="scan-404" aria-hidden="true" />

      {/* عدد ۴۰۴ */}
      <div
        className="num-404"
        data-aos="zoom-in"
        data-aos-duration="800"
        aria-hidden="true"
      >
        404
      </div>

      {/* محتوا */}
      <p
        style={{
          fontSize: '12px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: 'var(--ac)',
          opacity: 0.7,
          marginBottom: '16px',
        }}
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {t.notFound.eyebrow}
      </p>

      <h1
        style={{
          fontSize: 'clamp(18px, 4vw, 26px)',
          fontWeight: 700,
          color: 'var(--text0)',
          marginBottom: '10px',
        }}
        data-aos="fade-up"
        data-aos-delay="200"
      >
        {t.notFound.title}
      </h1>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--text2)',
          lineHeight: 1.8,
          maxWidth: '360px',
          marginBottom: '32px',
        }}
        data-aos="fade-up"
        data-aos-delay="300"
      >
        {t.notFound.text}
      </p>

      <div
        style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <Link href="/" className="dl-btn" style={{ fontSize: '14px', padding: '12px 28px' }}>
          <i className="fas fa-home" aria-hidden="true" />
          {t.notFound.home}
        </Link>
        <Link
          href="/#projects"
          className="dl-btn"
          style={{
            fontSize: '14px',
            padding: '12px 28px',
            background: 'var(--ac-dim)',
            color: 'var(--ac)',
            border: '1px solid var(--border-h)',
            boxShadow: 'none',
          }}
        >
          <i className="fas fa-briefcase" aria-hidden="true" />
          {t.notFound.projects}
        </Link>
      </div>
    </main>
  );
}

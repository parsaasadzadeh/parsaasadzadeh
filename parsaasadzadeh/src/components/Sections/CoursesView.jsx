"use client";
import { useLang } from "@/i18n/LanguageProvider";

// داده‌های ثابت — متن‌ها از فایل‌های i18n و به‌ترتیب همین آرایه خوانده می‌شوند
const COURSES = [
  {
    image: "https://c317884.parspack.net/c317884/images/1778674607541-125435750.png",
    siteUrl: "https://algolearno.ir/courses/html-css-course",
    tagTypes: ["ac", "muted"],
  },
  {
    image: "https://c317884.parspack.net/c317884/images/1777454446989-467981797.png",
    siteUrl: "https://algolearno.ir/courses/javascript",
    tagTypes: ["ac", "muted"],
  },
  {
    image: "https://c317884.parspack.net/c317884/images/1777480680356-401462917.png",
    siteUrl: "https://algolearno.ir/courses/flex-box",
    tagTypes: ["muted", "muted"],
  },
];

export default function CoursesView() {
  const { t, dir } = useLang();

  const courses = COURSES.map((base, i) => {
    const txt = t.courses.items[i];
    return {
      ...base,
      title: txt.title,
      desc: txt.desc,
      hours: txt.hours,
      tags: txt.tags.map((label, j) => ({ label, type: base.tagTypes[j] })),
    };
  });

  return (
    <section id="courses" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div className="sec-head">
          <div className="sec-line" />
          <h2 className="sec-title">{t.courses.title}</h2>
        </div>

        <div className="proj-grid">
          {courses.map((c) => (
            <div className="proj-card" key={c.siteUrl}>

              {/* بنر */}
              <div className={`course-banner ${c.bannerClass}`}>
                <span style={{ position: 'relative', zIndex: 1, fontSize: '38px' }}>
                  {c.icon}
                </span>
              </div>

              <div className="proj-body">
                {/* تگ‌ها */}
                <div className="tags">
                  {c.tags.map((tg) => (
                    <span key={tg.label} className={tg.type === 'ac' ? 'tag-ac' : 'tag-muted'}>
                      {tg.label}
                    </span>
                  ))}
                </div>

                <div className="proj-title">{c.title}</div>
                <p className="proj-desc">{c.desc}</p>

                {/* متا */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text2)' }}>
                    <i className="fas fa-clock" style={{ color: 'var(--ac)', marginInlineEnd: '4px' }} />
                    {c.hours}
                  </span>
                </div>

                {/* دکمه */}
                <a href={c.siteUrl} className="dl-btn" style={{ justifyContent: 'center', fontSize: '14px', padding: '10px 20px' }}>
                  <i className={`fas ${dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right'}`} aria-hidden="true" />
                  {t.courses.view}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

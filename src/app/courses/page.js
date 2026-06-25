// src/components/Sections/Courses.jsx
// src/app/page.jsx
export const metadata = {
  title: 'پارسا اسدزاده | دوره‌های آموزش برنامه‌نویسی',
  description:
    'دوره‌های آموزشی React.js، Next.js، TypeScript و CSS پیشرفته توسط پارسا اسدزاده — یادگیری عملی و حرفه‌ای فرانت‌اند',
  keywords: [
    'دوره React',
    'آموزش Next.js',
    'دوره TypeScript',
    'آموزش CSS',
    'دوره فرانت اند',
    'پارسا اسدزاده',
    'آموزش برنامه نویسی',
  ],
  openGraph: {
    title: 'دوره‌های آموزشی پارسا اسدزاده',
    description: 'یادگیری React، Next.js، TypeScript و CSS به شکل حرفه‌ای',
    url: 'https://parsaasadzadeh.ir/courses',
    images: [{ url: 'https://parsaasadzadeh.ir/icon.svg' }],
  },
};
export default function Courses() {
 const courses = [
  {
    image: "https://c317884.parspack.net/c317884/images/1778674607541-125435750.png",        // آدرس عکس
    siteUrl: "https://algolearno.ir/courses/html-css-course",            // آدرس وب‌سایت دوره
    tags: [{ label: 'متوسط', type: 'ac' }, { label: 'وب', type: 'muted' }],
    title: 'دوره HTML',
    desc: 'یادگیری ساختار صفحات وب از صفر با HTML5',
    hours: '',

  },
  {
    image: "https://c317884.parspack.net/c317884/images/1777454446989-467981797.png",
    siteUrl: "https://algolearno.ir/courses/javascript",
    tags: [{ label: 'محبوب', type: 'ac' }, { label: 'فرانت‌اند', type: 'muted' }],
    title: 'دوره JavaScript',
    desc: 'برنامه‌نویسی جاوااسکریپت از مقدماتی تا پیشرفته',
    hours: 'در حال برگذاری'
  },
  {
    image: "https://c317884.parspack.net/c317884/images/1777480680356-401462917.png",
    siteUrl: "https://algolearno.ir/courses/flex-box",
    tags: [{ label: 'CSS', type: 'muted' }, { label: 'چیدمان', type: 'muted' }],
    title: 'دوره Flexbox',
    desc: 'تسلط کامل بر Flexbox برای چیدمان‌های حرفه‌ای',
    hours: '3 ساعت',
  
  },
];

  return (
    <section id="courses" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div className="sec-head">
          <div className="sec-line" />
          <h2 className="sec-title">دوره‌ها</h2>
        </div>

        <div className="proj-grid">
          {courses.map((c) => (
            <div className="proj-card" key={c.href}>

              {/* بنر */}
              <div className={`course-banner ${c.bannerClass}`}>
                <span style={{ position: 'relative', zIndex: 1, fontSize: '38px' }}>
                  {c.icon}
                </span>
              </div>

              <div className="proj-body">
                {/* تگ‌ها */}
                <div className="tags">
                  {c.tags.map((t) => (
                    <span key={t.label} className={t.type === 'ac' ? 'tag-ac' : 'tag-muted'}>
                      {t.label}
                    </span>
                  ))}
                </div>

                <div className="proj-title">{c.title}</div>
                <p className="proj-desc">{c.desc}</p>

                {/* متا */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text2)' }}>
                    <i className="fas fa-clock" style={{ color: 'var(--ac)', marginLeft: '4px' }} />
                    {c.hours}
                  </span>
                
                </div>

                {/* دکمه */}
                <a href={c.siteUrl} className="dl-btn" style={{ justifyContent: 'center', fontSize: '14px', padding: '10px 20px' }}>
                  <i className="fas fa-arrow-left" aria-hidden="true" />
                  مشاهده دوره
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
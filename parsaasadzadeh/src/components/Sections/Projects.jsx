const projects = [
  {
    title: "اپ سایت وبلاگ", // یا هر عنوان درست
    category: "بلاگ",
    tag: "website",
    description: "وب سایت وبلاگ  برای اشتراک گذاری مطالب ",
    image: "./inevesht.png",
    link: "https://inevesht.ir",
  },
  {
    title: "وب سایت آموزشی",
    category: "اموزشی",
    tag: "website",
    description: "وب سایت آموزشی با سیستم پیشرفته مدیریت کاربران، ویدیوها و اشتراک‌ها.",
    image: "./algolearnoo.png",
    link: "https://algolearno.ir",
  },
  {
    title: "Voxez | کتابخانه آیکون",
    category: "ابزار",
    tag: "Open Source",
    description: "کتابخانه آیکون برای برنامه‌نویسان frontend که می‌توانند در پروژه‌ها از آیکون‌ها به‌راحتی استفاده کنند.",
    image: "./voxezlib.png",
    link: "https://voxez.ir",
  },
    {
    title: "وب سایت فروشگاهی ",
    category: "فروشگاهی",
    tag: "website",
    description: "وب سایت فروشگاهی پیشرفته مدریت ادرس ها کاربران و محصولات ",
    image: "./shopparsa.png",
    link: "https://shop-frontend-six-beta.vercel.app",
  },    {
    title: "اپلیکیشن مدیریت مالی سابلو ",
    category: "حسابداری شخصی",
    tag: "website",
    description: "وب سایت و اپلیکیشن مدیریت مالی شخصی",
    image: "./sablo.png",
    link: "https://sablo.ir",
  }, {
    title: "وب اپلیکیشن مدیریت کافه ها",
    category: "مدیریتی",
    tag: "website",
    description: "وب سایت و اپلیکیشن مدیریت کافه ",
    image: "./cafeto.png",
    link: "https://cafeto-client.vercel.app",
  }
];
export default function Projects() {
  return (
    <section id="projects" aria-label="Projects">
      <div className="proj-intro" data-aos="fade-up">
        <h2>نمونه کارها</h2>
        <p>مجموعه‌ای از پروژه‌هایی که روی آن‌ها کار کرده‌ام</p>
      </div>

      <div className="proj-grid">
        {projects.map((project, index) => (
          <article
            key={index}
            className="proj-card"
            data-aos="fade-up"
            data-aos-delay={(index + 1) * 60}
          >
            <div className="proj-img">
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                width={560}
                height={200}
              />
              <div className="proj-overlay" aria-hidden="true" />
            </div>

            <div className="proj-body">
              <div className="tags">
                <span className="tag-ac">{project.category}</span>
                <span className="tag-muted">{project.tag}</span>
              </div>

              <h3 className="proj-title">{project.title}</h3>

              <p className="proj-desc">{project.description}</p>

              <a  target="_blank" href={project.link} className="proj-link">
                مشاهده پروژه
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

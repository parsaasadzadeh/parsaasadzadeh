"use client";
import { useLang } from "@/i18n/LanguageProvider";

// داده‌های ثابت (عکس و لینک) — متن‌ها از فایل‌های i18n و به‌ترتیب همین آرایه خوانده می‌شوند
const projects = [
  { tag: "website",     image: "./inevesht.png",     link: "https://inevesht.ir" },
  { tag: "website",     image: "./algolearnoo.png",  link: "https://algolearno.ir" },
  { tag: "Open Source", image: "./voxezlib.png",     link: "https://voxez.ir" },
  { tag: "website",     image: "./shopparsa.png",    link: "https://shop-frontend-six-beta.vercel.app" },
  { tag: "website",     image: "./sablo.png",        link: "https://sablo.ir" },
  { tag: "website",     image: "./cafeto.png",       link: "https://cafeto-client.vercel.app" },
];

export default function Projects() {
  const { t } = useLang();
  return (
    <section id="projects" aria-label={t.projects.label}>
      <div className="proj-intro" data-aos="fade-up">
        <h2>{t.projects.title}</h2>
        <p>{t.projects.subtitle}</p>
      </div>

      <div className="proj-grid">
        {projects.map((base, index) => {
          const project = { ...base, ...t.projects.items[index] };
          return (
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
                {t.projects.view}
              </a>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

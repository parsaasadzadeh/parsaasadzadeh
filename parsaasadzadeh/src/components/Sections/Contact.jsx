"use client";
import { useLang } from "@/i18n/LanguageProvider";

export default function Contact() {
  const { t } = useLang();

  return (
    <section id="contact" className="section-bg ">
      <div className="contact-inner" >
        <h2 data-aos="zoom-in" style={{margin : "6rem"}}>{t.contact.title}</h2>

        <p data-aos="fade-up" data-aos-delay="80">
          {t.contact.line1}
          <br />
          {t.contact.line2} <span className="ac">{t.contact.accent}</span>
        </p>

        <div className="contact-cards" data-aos="fade-up" data-aos-delay="180">
          <a href="mailto:parsa@example.com" className="contact-card">
            <div className="con-icon">
              <i className="fas fa-envelope" aria-hidden="true"></i>
            </div>

            <div className="con-text">
              <p className="con-label">{t.contact.email}</p>
              <p className="con-val">parsaasadzadeh.dev@gmail.com</p>
            </div>
          </a>

          <a href="tel:09143834148" className="contact-card">
            <div className="con-icon">
              <i className="fas fa-phone" aria-hidden="true"></i>
            </div>

            <div className="con-text">
              <p className="con-label">{t.contact.phone}</p>
              <p className="con-val" >
                0914 383 4148
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}


export default function Contact() {

  return (
    <section id="contact" className="section-bg ">
      <div className="contact-inner" >
        <h2 data-aos="zoom-in"style={{margin : "6rem"}}>بیایید باهم بسازیم!</h2>

        <p data-aos="fade-up" data-aos-delay="80">
          سایت هایی نیاز دارید که حرفه ای سریع باشه ؟
          <br />
         یا میخوایید در مورد یک ایده حرف بزنید <span className="ac">در دسترسیم.</span>
        </p>

        <div className="contact-cards" data-aos="fade-up" data-aos-delay="180">
          <a href="mailto:parsa@example.com" className="contact-card">
            <div className="con-icon">
              <i className="fas fa-envelope" aria-hidden="true"></i>
            </div>

            <div className="con-text">
              <p className="con-label">ایمیل</p>
              <p className="con-val">parsaasadzadeh.dev@gmail.com</p>
            </div>
          </a>

          <a href="tel:09143834148" className="contact-card">
            <div className="con-icon">
              <i className="fas fa-phone" aria-hidden="true"></i>
            </div>

            <div className="con-text">
              <p className="con-label">تلفن</p>
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
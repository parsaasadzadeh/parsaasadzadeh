


export default function NavSite() {
    return (
        <>
            <nav className="side-nav" aria-label="ناوبری اصلی" data-aos="fade-left" data-aos-delay="300">
                <a href="#home" className="nav-link active" data-sec="home" aria-label="خانه">  <i className="fas fa-home" style={{ fontSize: "17px" }} /></a>
                <a href="#about" className="nav-link" data-sec="about" aria-label="درباره"> <i className="fas fa-user" style={{ fontSize: "17px" }} /></a>
                <a href="#projects" className="nav-link" data-sec="projects" aria-label="پروژه‌ها"><i className="fas fa-briefcase" style={{ fontSize: "17px" }} /></a>
                <a href="#contact" className="nav-link" data-sec="contact" aria-label="تماس">   <i className="fas fa-envelope" style={{ fontSize: "17px" }} /></a>
            </nav>



            <nav className="bot-nav" aria-label="ناوبری موبایل">
                <a href="#home" className="nav-link active" data-sec="home" aria-label="خانه">   <i className="fas fa-home"></i></a>
                <a href="#about" className="nav-link" data-sec="about" aria-label="درباره"> <i className="fas fa-user"></i></a>
                <a href="#projects" className="nav-link" data-sec="projects" aria-label="پروژه‌ها"><i className="fas fa-briefcase"></i></a>
                <a href="#contact" className="nav-link" data-sec="contact" aria-label="تماس">   <i className="fas fa-envelope"></i></a>
            </nav>
        </>

    )
}
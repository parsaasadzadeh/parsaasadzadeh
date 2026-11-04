// src/components/layout/Navbar.jsx
import ThemeToggle from "../ThemeToggle";

export default function Header() {
    return (
        <>
            <nav data-aos="fade-down">
                <div className="top-nav">
                    <div style={{display :"flex", gap:"12px", alignitems:"center"}}>
                        <button className="lang-btn" aria-label="Switch to English">English</button>
                        <button className="lang-btn active" aria-label="زبان فارسی">فارسی</button>
                    </div>
                    <div className="logo" aria-label="لوگو پارسا">ParsaAsadzadeh</div>
                    <ThemeToggle />
                </div>
            </nav>
        </>
    );
}
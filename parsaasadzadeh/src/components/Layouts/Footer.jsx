// Footer.jsx
"use client";
import { useLang } from "@/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer style={{ paddingBottom: 'calc(70px + env(safe-area-inset-bottom))' }}>
      <div className="foot-inner">
        <p className="foot-copy">
          {t.footer.credit}
        </p>
        <div className="stack-badge">
          <i
            className="fas fa-code"
            style={{ color: "var(--ac)", fontSize: "14px" }}
          ></i>
        </div>
      </div>
    </footer>
  );
}

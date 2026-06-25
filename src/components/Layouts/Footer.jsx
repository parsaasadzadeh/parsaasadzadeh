// Footer.jsx
export default function Footer() {
  return (
    <footer style={{ paddingBottom: 'calc(70px + env(safe-area-inset-bottom))' }}>
      <div className="foot-inner">
        <p className="foot-copy">
          طراحی شده توسط پارسا اسدزاده
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
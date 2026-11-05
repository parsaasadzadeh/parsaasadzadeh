"use client";
import { useState } from "react";
import { API_BASE } from "../../lib/api";
import { useLang } from "@/i18n/LanguageProvider";
import fa from "@/i18n/fa";

/* ─── data (فقط id و آیکون؛ متن‌ها از فایل‌های i18n می‌آیند) ───────── */
const SITE_TYPE_IDS = [
  { id: "landing",   icon: "fa-rocket" },
  { id: "portfolio", icon: "fa-briefcase" },
  { id: "store",     icon: "fa-store" },
  { id: "corporate", icon: "fa-building" },
  { id: "blog",      icon: "fa-pen-nib" },
  { id: "webapp",    icon: "fa-layer-group" },
];

const FEATURE_IDS = [
  { id: "auth",    icon: "fa-lock" },
  { id: "panel",   icon: "fa-table-columns" },
  { id: "payment", icon: "fa-credit-card" },
  { id: "seo",     icon: "fa-magnifying-glass" },
  { id: "blog_f",  icon: "fa-newspaper" },
  { id: "chat",    icon: "fa-comments" },
  { id: "map",     icon: "fa-map-pin" },
  { id: "api",     icon: "fa-plug" },
  { id: "multi",   icon: "fa-language" },
  { id: "pwa",     icon: "fa-mobile-screen" },
];

const BUDGET_IDS   = ["b1", "b2", "b3", "b4"];
const DEADLINE_IDS = ["d1", "d2", "d3"];

/* ─── helpers ──────────────────────────────────────────── */
function Step({ n, label, active, done }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700,
        background: done ? "var(--ac)" : active ? "var(--ac-dim)" : "var(--bg2)",
        border: `1.5px solid ${done || active ? "var(--ac)" : "var(--border)"}`,
        color: done ? "var(--bg0)" : active ? "var(--ac)" : "var(--text2)",
        transition: "all .3s",
      }}>
        {done ? <i className="fas fa-check" style={{ fontSize: 12 }} /> : n}
      </div>
      <span style={{ fontSize: 11, color: active ? "var(--ac)" : "var(--text2)", whiteSpace: "nowrap" }}>
        {label}
      </span>
    </div>
  );
}

function Card({ selected, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: selected ? "var(--ac-dim)" : "var(--bg2)",
      border: `1.5px solid ${selected ? "var(--ac)" : "var(--border)"}`,
      borderRadius: 16, padding: "18px 16px",
      cursor: "pointer", textAlign: "start",
      transition: "all .25s", color: "var(--text0)",
      fontFamily: "inherit", width: "100%",
      transform: selected ? "scale(1.02)" : "scale(1)",
      boxShadow: selected ? "0 0 0 1px var(--ac), 0 8px 24px var(--ac-glow)" : "none",
    }}>
      {children}
    </button>
  );
}

function ToggleChip({ selected, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8,
      background: selected ? "var(--ac-dim)" : "var(--bg2)",
      border: `1px solid ${selected ? "var(--ac)" : "var(--border)"}`,
      borderRadius: 999, padding: "9px 16px",
      cursor: "pointer", color: selected ? "var(--ac)" : "var(--text1)",
      fontFamily: "inherit", fontSize: 13, fontWeight: 500,
      transition: "all .2s",
    }}>
      <i className={`fas ${icon}`} style={{ fontSize: 12 }} />
      {label}
    </button>
  );
}

/* ─── main component ────────────────────────────────────── */
export default function OrderPage() {
  const { t: all, dir } = useLang();
  const t = all.order;
  const rtl = dir === "rtl";
  const [step, setStep]         = useState(0);
  const [siteType, setSiteType] = useState(null);
  const [features, setFeatures] = useState([]);
  const [budget, setBudget]     = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [desc, setDesc]         = useState("");
  const [refUrl, setRefUrl]     = useState("");
  const [name, setName]         = useState("");
  const [contact, setContact]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  const toggleFeature = (id) =>
    setFeatures(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const canNext = [
    !!siteType,
    true,                              // features optional
    !!(budget && deadline),
    desc.trim().length >= 20,
    !!(name.trim() && contact.trim()),
  ][step];

async function handleSubmit() {
  setLoading(true);
  try {
    // مقادیر ارسالی به سرور همیشه فارسی‌اند تا پنل ادمین یکدست بماند
    const payload = {
      siteType,
      features,
      budget:   fa.order.budgets[budget]?.label,
      deadline: fa.order.deadlines[deadline]?.label,
      desc,
      refUrl,
      name,
      contact,
    };

    const res = await fetch(`${API_BASE}/orders/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || t.submitError);

    setSubmitted(true);
  } catch (err) {
    alert("❌ " + err.message);
  } finally {
    setLoading(false);
  }
}
  /* ── submitted ── */
  if (submitted) return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 24, padding: 24,
      background: "var(--bg0)", textAlign: "center",
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "var(--ac-dim)", border: "2px solid var(--ac)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, color: "var(--ac)",
      }}>
        <i className="fas fa-check" />
      </div>
      <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 900 }}>
        {t.doneTitle}
      </h1>
      <p style={{ color: "var(--text1)", lineHeight: 2, maxWidth: 420 }}>
        {t.doneText1}<br />
        {t.doneText2a} <span style={{ color: "var(--ac)", fontWeight: 700 }}>{t.doneText2b}</span>{t.doneText2c ? (t.doneText2c === "." ? "." : " " + t.doneText2c) : ""}
      </p>
      <a href="/" style={{
        background: "var(--ac)", color: "var(--bg0)",
        padding: "12px 28px", borderRadius: 999,
        textDecoration: "none", fontWeight: 700, fontSize: 15,
      }}>
        {t.doneHome}
      </a>
    </div>
  );

  return (
    <div style={{ background: "var(--bg0)", minHeight: "100vh", fontFamily: "Vazirmatn, sans-serif", direction: dir }}>

      {/* ── hero banner ── */}
      <div style={{
        background: "var(--bg1)", borderBottom: "1px solid var(--border)",
        padding: "48px 24px 40px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <span style={{
            fontSize: 12, letterSpacing: 3, textTransform: "uppercase",
            color: "var(--ac)", opacity: .8, fontWeight: 500,
          }}>
            {t.eyebrow}
          </span>
          <h1 style={{
            fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 900,
            marginTop: 12, marginBottom: 14, lineHeight: 1.2,
          }}>
            {t.title}
          </h1>
          <p style={{ color: "var(--text1)", fontSize: 15, lineHeight: 1.9, maxWidth: 480, margin: "0 auto 32px" }}>
            {t.intro}
          </p>

          {/* stats */}
          <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {t.stats.map(({ icon, value: val, label: sub }) => (
              <div key={sub} style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 4 }}>
                  <i className={`fas ${icon}`} style={{ color: "var(--ac)", fontSize: 13 }} />
                  <span style={{ fontWeight: 900, fontSize: 20 }}>{val}</span>
                </div>
                <span style={{ color: "var(--text2)", fontSize: 12 }}>{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── form area ── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 120px" }}>

        {/* stepper */}
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 48, position: "relative" }}>
          {/* connector line */}
          <div style={{
            position: "absolute", top: 17, right: "8%", left: "8%", height: 1,
            background: "var(--border)", zIndex: 0,
          }} />
          {t.steps.map((s, i) => (
            <Step key={s} n={i + 1} label={s} active={i === step} done={i < step} />
          ))}
        </div>

        {/* ── STEP 0 — نوع پروژه ── */}
        {step === 0 && (
          <section>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>{t.q1Title}</h2>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>{t.q1Hint}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(200px,100%),1fr))", gap: 14 }}>
              {SITE_TYPE_IDS.map(st => (
                <Card key={st.id} selected={siteType === st.id} onClick={() => setSiteType(st.id)}>
                  <i className={`fas ${st.icon}`} style={{ color: "var(--ac)", fontSize: 22, marginBottom: 10, display: "block" }} />
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.siteTypes[st.id].label}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{t.siteTypes[st.id].desc}</div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── STEP 1 — امکانات ── */}
        {step === 1 && (
          <section>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>{t.q2Title}</h2>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>{t.q2Hint}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {FEATURE_IDS.map(f => (
                <ToggleChip
                  key={f.id}
                  selected={features.includes(f.id)}
                  onClick={() => toggleFeature(f.id)}
                  icon={f.icon}
                  label={t.features[f.id]}
                />
              ))}
            </div>
            {features.length > 0 && (
              <p style={{ marginTop: 20, fontSize: 13, color: "var(--ac)" }}>
                <i className="fas fa-check-circle" style={{ marginInlineEnd: 6 }} />
                {t.featuresSelected(features.length)}
              </p>
            )}
          </section>
        )}

        {/* ── STEP 2 — بودجه و زمان ── */}
        {step === 2 && (
          <section>
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>{t.q3BudgetTitle}</h2>
              <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>{t.q3BudgetHint}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(160px,100%),1fr))", gap: 12 }}>
                {BUDGET_IDS.map(id => (
                  <Card key={id} selected={budget === id} onClick={() => setBudget(id)}>
                    <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{t.budgets[id].label}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>{t.budgets[id].sub}</div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>{t.q3DeadlineTitle}</h2>
              <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>{t.q3DeadlineHint}</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {DEADLINE_IDS.map(id => (
                  <Card key={id} selected={deadline === id} onClick={() => setDeadline(id)}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.deadlines[id].label}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>{t.deadlines[id].sub}</div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 3 — توضیحات ── */}
        {step === 3 && (
          <section>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>{t.q4Title}</h2>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>
              {t.q4Hint}
            </p>

            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder={t.descPlaceholder}
              rows={6}
              style={{
                width: "100%", resize: "vertical",
                background: "var(--bg2)", border: "1.5px solid var(--border)",
                borderRadius: 16, padding: "16px 18px",
                color: "var(--text0)", fontFamily: "Vazirmatn, sans-serif",
                fontSize: 14, lineHeight: 1.9,
                outline: "none", transition: "border-color .25s",
                direction: dir,
              }}
              onFocus={e => e.target.style.borderColor = "var(--ac)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: desc.length >= 20 ? "var(--ac)" : "var(--text2)" }}>
                {t.charCount(desc.length)} {desc.length < 20 && t.charsMissing(20 - desc.length)}
              </span>
            </div>

            <div style={{ marginTop: 28 }}>
              <label style={{ display: "block", fontSize: 13, color: "var(--text1)", marginBottom: 10 }}>
                <i className="fas fa-link" style={{ color: "var(--ac)", marginInlineEnd: 6 }} />
                {t.refLabel}
              </label>
              <input
                type="url"
                value={refUrl}
                onChange={e => setRefUrl(e.target.value)}
                placeholder="https://example.com"
                style={{
                  width: "100%", background: "var(--bg2)",
                  border: "1.5px solid var(--border)", borderRadius: 12,
                  padding: "12px 16px", color: "var(--text0)",
                  fontFamily: "Vazirmatn, sans-serif", fontSize: 14,
                  outline: "none", direction: "ltr", transition: "border-color .25s",
                }}
                onFocus={e => e.target.style.borderColor = "var(--ac)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
          </section>
        )}

        {/* ── STEP 4 — تماس ── */}
        {step === 4 && (
          <section>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>{t.q5Title}</h2>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>
              {t.q5Hint}
            </p>

            {[
              { label: t.nameLabel, ph: t.namePh, val: name, set: setName, icon: "fa-user" },
              { label: t.contactLabel, ph: t.contactPh, val: contact, set: setContact, icon: "fa-paper-plane" },
            ].map(({ label, ph, val, set, icon }) => (
              <div key={label} style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, color: "var(--text1)", marginBottom: 10 }}>
                  <i className={`fas ${icon}`} style={{ color: "var(--ac)", marginInlineEnd: 6 }} />
                  {label}
                </label>
                <input
                  value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={ph}
                  style={{
                    width: "100%", background: "var(--bg2)",
                    border: "1.5px solid var(--border)", borderRadius: 12,
                    padding: "13px 16px", color: "var(--text0)",
                    fontFamily: "Vazirmatn, sans-serif", fontSize: 14,
                    outline: "none", transition: "border-color .25s",
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--ac)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            ))}

            {/* summary */}
            <div style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "20px 18px", marginTop: 28,
            }}>
              <div style={{ fontSize: 12, color: "var(--ac)", fontWeight: 700, marginBottom: 14, letterSpacing: 1 }}>
                {t.summary}
              </div>
              {[
                [t.sumType,      t.siteTypes[siteType]?.label || "—"],
                [t.sumFeatures,  features.length ? t.sumItems(features.length) : t.sumNoFeatures],
                [t.sumBudget,    t.budgets[budget]?.label || "—"],
                [t.sumDeadline,  t.deadlines[deadline]?.label || "—"],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "8px 0", borderBottom: "1px solid var(--border)",
                  fontSize: 13,
                }}>
                  <span style={{ color: "var(--text2)" }}>{k}</span>
                  <span style={{ color: "var(--text0)", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── nav buttons ── */}
        <div style={{
          display: "flex", gap: 12, marginTop: 40,
          flexDirection: "row-reverse", justifyContent: "space-between",
        }}>
          {step < t.steps.length - 1 ? (
            <button
              onClick={() => canNext && setStep(s => s + 1)}
              disabled={!canNext}
              style={{
                background: canNext ? "var(--ac)" : "var(--bg2)",
                color: canNext ? "var(--bg0)" : "var(--text2)",
                border: `1.5px solid ${canNext ? "var(--ac)" : "var(--border)"}`,
                padding: "13px 32px", borderRadius: 999,
                fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 15,
                cursor: canNext ? "pointer" : "not-allowed",
                transition: "all .25s",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              {t.next}
              <i className={`fas ${rtl ? "fa-arrow-left" : "fa-arrow-right"}`} style={{ fontSize: 13 }} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canNext || loading}
              style={{
                background: canNext ? "var(--ac)" : "var(--bg2)",
                color: canNext ? "var(--bg0)" : "var(--text2)",
                border: `1.5px solid ${canNext ? "var(--ac)" : "var(--border)"}`,
                padding: "13px 32px", borderRadius: 999,
                fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 15,
                cursor: canNext ? "pointer" : "not-allowed",
                transition: "all .25s",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              {loading
                ? <><i className="fas fa-spinner fa-spin" /> {t.sending}</>
                : <><i className="fas fa-paper-plane" /> {t.submit}</>}
            </button>
          )}

          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                background: "transparent", color: "var(--text1)",
                border: "1.5px solid var(--border)",
                padding: "13px 24px", borderRadius: 999,
                fontFamily: "Vazirmatn, sans-serif", fontSize: 14,
                cursor: "pointer", transition: "all .25s",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <i className={`fas ${rtl ? "fa-arrow-right" : "fa-arrow-left"}`} style={{ fontSize: 13 }} />
              {t.prev}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
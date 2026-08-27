"use client";
import { useState } from "react";

/* ─── data ─────────────────────────────────────────────── */
const SITE_TYPES = [
  { id: "landing",   icon: "fa-rocket",        label: "لندینگ پیج",       desc: "معرفی محصول یا خدمات، تک‌صفحه‌ای" },
  { id: "portfolio", icon: "fa-briefcase",      label: "پورتفولیو",        desc: "نمایش کارها و مهارت‌ها" },
  { id: "store",     icon: "fa-store",          label: "فروشگاه آنلاین",   desc: "فروش محصول با سبد خرید" },
  { id: "corporate", icon: "fa-building",       label: "سایت شرکتی",       desc: "معرفی کامل کسب‌وکار" },
  { id: "blog",      icon: "fa-pen-nib",        label: "وبلاگ / مجله",     desc: "انتشار محتوا و مقاله" },
  { id: "webapp",    icon: "fa-layer-group",    label: "وب‌اپلیکیشن",      desc: "سیستم پیچیده با داشبورد" },
];

const FEATURES = [
  { id: "auth",     icon: "fa-lock",            label: "ورود / ثبت‌نام" },
  { id: "panel",    icon: "fa-table-columns",   label: "پنل مدیریت" },
  { id: "payment",  icon: "fa-credit-card",     label: "درگاه پرداخت" },
  { id: "seo",      icon: "fa-magnifying-glass",label: "سئو پیشرفته" },
  { id: "blog_f",   icon: "fa-newspaper",       label: "سیستم بلاگ" },
  { id: "chat",     icon: "fa-comments",        label: "چت آنلاین" },
  { id: "map",      icon: "fa-map-pin",         label: "نقشه / موقعیت" },
  { id: "api",      icon: "fa-plug",            label: "اتصال API خارجی" },
  { id: "multi",    icon: "fa-language",        label: "چند زبانه" },
  { id: "pwa",      icon: "fa-mobile-screen",   label: "PWA / آفلاین" },
];

const BUDGETS = [
  { id: "b1", label: "زیر ۵ میلیون",     sub: "پروژه‌های سبک" },
  { id: "b2", label: "۵ تا ۱۵ میلیون",  sub: "پروژه‌های متوسط" },
  { id: "b3", label: "۱۵ تا ۴۰ میلیون", sub: "پروژه‌های پیچیده" },
  { id: "b4", label: "بالای ۴۰ میلیون", sub: "سیستم‌های سازمانی" },
];

const DEADLINES = [
  { id: "d1", label: "فوری",        sub: "زیر ۲ هفته" },
  { id: "d2", label: "عادی",        sub: "۱ تا ۲ ماه" },
  { id: "d3", label: "بدون عجله",   sub: "بیشتر از ۲ ماه" },
];

const STEPS = ["نوع پروژه", "امکانات", "بودجه و زمان", "توضیحات", "تماس"];

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
      cursor: "pointer", textAlign: "right",
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
    const payload = {
      siteType,
      features,
      budget:   BUDGETS.find(b => b.id === budget)?.label,
      deadline: DEADLINES.find(d => d.id === deadline)?.label,
      desc,
      refUrl,
      name,
      contact,
    };

    const res = await fetch("https://parsa-order-backend.vercel.app/api/orders/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "خطا در ثبت سفارش");

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
        سفارش ثبت شد!
      </h1>
      <p style={{ color: "var(--text1)", lineHeight: 2, maxWidth: 420 }}>
        پارسا در اسرع وقت باهات تماس می‌گیره.<br />
        معمولاً ظرف <span style={{ color: "var(--ac)", fontWeight: 700 }}>۲۴ ساعت</span> پاسخ داده می‌شه.
      </p>
      <a href="/" style={{
        background: "var(--ac)", color: "var(--bg0)",
        padding: "12px 28px", borderRadius: 999,
        textDecoration: "none", fontWeight: 700, fontSize: 15,
      }}>
        برگشت به خانه
      </a>
    </div>
  );

  return (
    <div style={{ background: "var(--bg0)", minHeight: "100vh", fontFamily: "Vazirmatn, sans-serif", direction: "rtl" }}>

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
            Website Design Order
          </span>
          <h1 style={{
            fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 900,
            marginTop: 12, marginBottom: 14, lineHeight: 1.2,
          }}>
            سفارش طراحی سایت
          </h1>
          <p style={{ color: "var(--text1)", fontSize: 15, lineHeight: 1.9, maxWidth: 480, margin: "0 auto 32px" }}>
            چند سوال کوتاه — تا پروژه‌ات رو دقیق بفهمم و یه پیشنهاد واقعی بهت بدم.
          </p>

          {/* stats */}
          <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              ["fa-clock",         "+۵۰",   "پروژه تحویل‌داده‌شده"],
              ["fa-star",          "۴.۹",   "امتیاز مشتریان"],
              ["fa-bolt",          "۴۸h",   "اولین پاسخ"],
            ].map(([icon, val, sub]) => (
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
          {STEPS.map((s, i) => (
            <Step key={s} n={i + 1} label={s} active={i === step} done={i < step} />
          ))}
        </div>

        {/* ── STEP 0 — نوع پروژه ── */}
        {step === 0 && (
          <section>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>چه نوع سایتی می‌خوای؟</h2>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>یه مورد انتخاب کن</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(200px,100%),1fr))", gap: 14 }}>
              {SITE_TYPES.map(t => (
                <Card key={t.id} selected={siteType === t.id} onClick={() => setSiteType(t.id)}>
                  <i className={`fas ${t.icon}`} style={{ color: "var(--ac)", fontSize: 22, marginBottom: 10, display: "block" }} />
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{t.desc}</div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── STEP 1 — امکانات ── */}
        {step === 1 && (
          <section>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>چه امکاناتی لازم داری؟</h2>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>هر چند تا که می‌خوای انتخاب کن (اختیاریه)</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {FEATURES.map(f => (
                <ToggleChip
                  key={f.id}
                  selected={features.includes(f.id)}
                  onClick={() => toggleFeature(f.id)}
                  icon={f.icon}
                  label={f.label}
                />
              ))}
            </div>
            {features.length > 0 && (
              <p style={{ marginTop: 20, fontSize: 13, color: "var(--ac)" }}>
                <i className="fas fa-check-circle" style={{ marginLeft: 6 }} />
                {features.length} امکان انتخاب شد
              </p>
            )}
          </section>
        )}

        {/* ── STEP 2 — بودجه و زمان ── */}
        {step === 2 && (
          <section>
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>بودجه‌ات چقدره؟</h2>
              <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>به تومان</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(160px,100%),1fr))", gap: 12 }}>
                {BUDGETS.map(b => (
                  <Card key={b.id} selected={budget === b.id} onClick={() => setBudget(b.id)}>
                    <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{b.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>{b.sub}</div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>زمان‌بندی مورد انتظار؟</h2>
              <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>چقدر وقت داری؟</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {DEADLINES.map(d => (
                  <Card key={d.id} selected={deadline === d.id} onClick={() => setDeadline(d.id)}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>{d.sub}</div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 3 — توضیحات ── */}
        {step === 3 && (
          <section>
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>پروژه‌ات رو توضیح بده</h2>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>
              هر چیزی که فکر می‌کنی مهمه — هدف سایت، مخاطب، رقبا، ایده‌ها
            </p>

            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="مثلاً: یه فروشگاه برای فروش محصولات دست‌ساز می‌خوام. مشتریام خانم‌های ۲۵ تا ۴۵ ساله‌اند. می‌خوام سایت حس گرم و دنجی داشته باشه..."
              rows={6}
              style={{
                width: "100%", resize: "vertical",
                background: "var(--bg2)", border: "1.5px solid var(--border)",
                borderRadius: 16, padding: "16px 18px",
                color: "var(--text0)", fontFamily: "Vazirmatn, sans-serif",
                fontSize: 14, lineHeight: 1.9,
                outline: "none", transition: "border-color .25s",
                direction: "rtl",
              }}
              onFocus={e => e.target.style.borderColor = "var(--ac)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: desc.length >= 20 ? "var(--ac)" : "var(--text2)" }}>
                {desc.length} کاراکتر {desc.length < 20 && `(حداقل ${20 - desc.length} کاراکتر دیگه)`}
              </span>
            </div>

            <div style={{ marginTop: 28 }}>
              <label style={{ display: "block", fontSize: 13, color: "var(--text1)", marginBottom: 10 }}>
                <i className="fas fa-link" style={{ color: "var(--ac)", marginLeft: 6 }} />
                آدرس سایت مرجع یا نمونه (اختیاری)
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
            <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 8 }}>اطلاعات تماست رو بده</h2>
            <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>
              پارسا باهات تماس می‌گیره — هیچ اطلاعاتی به‌جایی فروخته نمی‌شه
            </p>

            {[
              { label: "اسمت چیه؟", ph: "مثلاً: علی رضایی", val: name, set: setName, icon: "fa-user" },
              { label: "شماره یا آیدی تلگرام", ph: "مثلاً: @username یا ۰۹۱۲...", val: contact, set: setContact, icon: "fa-paper-plane" },
            ].map(({ label, ph, val, set, icon }) => (
              <div key={label} style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, color: "var(--text1)", marginBottom: 10 }}>
                  <i className={`fas ${icon}`} style={{ color: "var(--ac)", marginLeft: 6 }} />
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
                خلاصه سفارش
              </div>
              {[
                ["نوع",      SITE_TYPES.find(t => t.id === siteType)?.label || "—"],
                ["امکانات", features.length ? `${features.length} آیتم` : "بدون امکان ویژه"],
                ["بودجه",   BUDGETS.find(b => b.id === budget)?.label || "—"],
                ["زمان",    DEADLINES.find(d => d.id === deadline)?.label || "—"],
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
          {step < STEPS.length - 1 ? (
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
              مرحله بعد
              <i className="fas fa-arrow-left" style={{ fontSize: 13 }} />
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
                ? <><i className="fas fa-spinner fa-spin" /> در حال ارسال...</>
                : <><i className="fas fa-paper-plane" /> ثبت سفارش</>}
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
              <i className="fas fa-arrow-right" style={{ fontSize: 13 }} />
              قبلی
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

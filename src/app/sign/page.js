"use client";
import { useState, useEffect, useRef } from "react";

const BASE = "https://parsa-order-backend.vercel.app/api";

export default function SignPage() {
  const [step, setStep]   = useState("loading"); // loading | info | sign | done | error
  const [order, setOrder] = useState(null);
  const [errMsg, setErr]  = useState("");
  const [loading, setLoad] = useState(false);
  const [isEmpty, setEmpty] = useState(true);

  const canvasRef = useRef(null);
  const drawing   = useRef(false);
  const token     = useRef(null);

  // ── بارگذاری اطلاعات سفارش از توکن URL ───────────────
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (!t) { setErr("لینک امضا معتبر نیست."); setStep("error"); return; }
    token.current = t;

    fetch(`${BASE}/admin/sign/${t}`)
      .then(async r => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "خطای سرور");
        return d;
      })
      .then(d => {
        if (d.alreadySigned) { setStep("done"); return; }
        setOrder(d);
        setStep("info");
      })
      .catch(e => { setErr(e.message); setStep("error"); });
  }, []);

  // ── راه‌اندازی canvas با DPR درست ────────────────────
  useEffect(() => {
    if (step !== "sign" || !canvasRef.current) return;
    const c   = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width  = rect.width  * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = "#0f3460";
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
  }, [step]);

  // ── توابع رسم ─────────────────────────────────────────
  function getPos(e) {
    const r = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  function onDown(e) {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function onMove(e) {
    e.preventDefault();
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (isEmpty) setEmpty(false);
  }

  function onUp() { drawing.current = false; }

  function clear() {
    const c = canvasRef.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
    setEmpty(true);
  }

  // ── ارسال امضا ───────────────────────────────────────
  async function submit() {
    if (isEmpty) return;
    setLoad(true);
    setErr("");
    try {
      const signature = canvasRef.current.toDataURL("image/png");
      const res = await fetch(`${BASE}/admin/sign/${token.current}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در ثبت امضا");
      setStep("done");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoad(false);
    }
  }

  // ── استایل‌های مشترک ──────────────────────────────────
  const S = {
    card: {
      width: "100%", maxWidth: 460,
      background: "#fff", borderRadius: 20,
      boxShadow: "0 8px 40px rgba(15,52,96,.15)",
      overflow: "hidden",
      fontFamily: "Vazirmatn, Tahoma, sans-serif",
      direction: "rtl",
    },
    btn: (active) => ({
      width: "100%", border: "none", borderRadius: 12,
      padding: 14, fontFamily: "Vazirmatn, Tahoma, sans-serif",
      fontWeight: 700, fontSize: 15, cursor: active ? "pointer" : "not-allowed",
      background: active ? "#0f3460" : "#93a8c4",
      color: "#fff", transition: "background .2s",
    }),
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f0f4ff",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: 16,
    }}>
      <div style={S.card}>

        {/* ── هدر ── */}
        <div style={{
          background: "#0f3460", padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color: "#fff",
          }}>✍</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>امضای قرارداد</div>
            <div style={{ color: "rgba(255,255,255,.6)", fontSize: 12 }}>پارسا اسدزاده – طراحی وب</div>
          </div>
        </div>

        <div style={{ padding: "24px 24px 32px" }}>

          {/* ── حالت بارگذاری ── */}
          {step === "loading" && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
              در حال بارگذاری...
            </div>
          )}

          {/* ── حالت خطا ── */}
          {step === "error" && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
              <div style={{ fontWeight: 700, color: "#e03e2d", marginBottom: 8 }}>لینک نامعتبر</div>
              <div style={{ color: "#666", fontSize: 13 }}>{errMsg}</div>
            </div>
          )}

          {/* ── مرحله ۱: نمایش اطلاعات ── */}
          {step === "info" && order && (
            <>
              <div style={{
                background: "#f0f4ff", borderRight: "4px solid #0f3460",
                borderRadius: 10, padding: "16px 18px", marginBottom: 20,
              }}>
                <div style={{ fontWeight: 700, color: "#0f3460", marginBottom: 10 }}>اطلاعات قرارداد</div>
                {[
                  ["کارفرما",      order.name],
                  ["نوع سایت",    order.siteType],
                  ["مبلغ توافقی", `${Number(order.finalPrice).toLocaleString("fa-IR")} تومان`],
                  ["زمان‌بندی",   order.deadline],
                ].map(([l, v]) => (
                  <div key={l} style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: 13, padding: "6px 0",
                    borderBottom: "1px solid rgba(15,52,96,.08)",
                  }}>
                    <span style={{ color: "#666" }}>{l}</span>
                    <span style={{ fontWeight: 600 }}>{v || "—"}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#444", lineHeight: 2, marginBottom: 20 }}>
                با امضای این قرارداد، موافقت خود را با تمام شرایط مندرج اعلام می‌نمایید.
              </p>
              <button onClick={() => setStep("sign")} style={S.btn(true)}>
                مطالعه کردم — ادامه برای امضا ←
              </button>
            </>
          )}

          {/* ── مرحله ۲: امضا ── */}
          {step === "sign" && (
            <>
              <div style={{
                textAlign: "center", fontWeight: 700,
                fontSize: 14, color: "#333", marginBottom: 10,
              }}>
                امضای خود را در کادر زیر بکشید
              </div>

              <div style={{
                border: "2px dashed #0f3460", borderRadius: 12,
                background: "#fafbff", position: "relative",
                marginBottom: 12, overflow: "hidden",
                touchAction: "none",
              }}>
                <canvas
                  ref={canvasRef}
                  style={{ display: "block", width: "100%", height: 180, cursor: "crosshair" }}
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerLeave={onUp}
                />
                {isEmpty && (
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#bbb", fontSize: 13, pointerEvents: "none",
                  }}>
                    ✍ اینجا امضا کنید
                  </div>
                )}
              </div>

              {errMsg && (
                <div style={{ color: "#e03e2d", fontSize: 13, marginBottom: 10, textAlign: "center" }}>
                  ❌ {errMsg}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={clear} style={{
                  flex: 1, background: "#f0f4ff", color: "#0f3460",
                  border: "1.5px solid #0f3460", borderRadius: 10, padding: 12,
                  fontFamily: "Vazirmatn, Tahoma, sans-serif",
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                }}>
                  پاک کردن
                </button>
                <button
                  onClick={submit}
                  disabled={isEmpty || loading}
                  style={{
                    flex: 2, border: "none", borderRadius: 10, padding: 12,
                    fontFamily: "Vazirmatn, Tahoma, sans-serif",
                    fontWeight: 700, fontSize: 14,
                    background: isEmpty || loading ? "#93a8c4" : "#0f3460",
                    color: "#fff",
                    cursor: isEmpty || loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "در حال ثبت..." : "تأیید و ثبت امضا ✓"}
                </button>
              </div>
            </>
          )}

          {/* ── مرحله ۳: موفق ── */}
          {step === "done" && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(16,185,129,.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36, margin: "0 auto 16px",
              }}>✅</div>
              <div style={{ fontWeight: 800, color: "#10b981", fontSize: 20, marginBottom: 8 }}>
                امضا ثبت شد!
              </div>
              <p style={{ color: "#555", fontSize: 13, lineHeight: 2 }}>
                امضای شما دریافت شد.<br />
                پس از تأیید نهایی، قرارداد صادر خواهد شد.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

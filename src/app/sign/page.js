// app/sign/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";

const BASE = "https://parsa-order-backend.vercel.app/api";

export default function SignPage() {
  const [step, setStep]     = useState("loading"); // loading|info|sign|done|error
  const [order, setOrder]   = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoad]  = useState(false);
  const [isEmpty, setEmpty] = useState(true);
  const canvasRef = useRef(null);
  const drawing   = useRef(false);
  const token     = useRef(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    if (!t) { setErrMsg("لینک امضا معتبر نیست."); setStep("error"); return; }
    token.current = t;
    fetch(`${BASE}/admin/sign/${t}`)
      .then(r => r.json())
      .then(d => {
        if (d.message) throw new Error(d.message);
        if (d.alreadySigned) { setStep("done"); return; }
        setOrder(d); setStep("info");
      })
      .catch(e => { setErrMsg(e.message); setStep("error"); });
  }, []);

  useEffect(() => {
    if (step !== "sign" || !canvasRef.current) return;
    const c = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    c.width  = c.offsetWidth  * dpr;
    c.height = c.offsetHeight * dpr;
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = "#0f3460";
    ctx.lineWidth = 2.5;
    ctx.lineCap = ctx.lineJoin = "round";
  }, [step]);

  function pos(e) {
    const r = canvasRef.current.getBoundingClientRect();
    const s = e.touches ? e.touches[0] : e;
    return { x: s.clientX - r.left, y: s.clientY - r.top };
  }
  function onDown(e) {
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y);
    e.preventDefault();
  }
  function onMove(e) {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke();
    if (isEmpty) setEmpty(false);
    e.preventDefault();
  }
  function onUp() { drawing.current = false; }
  function clear() {
    const c = canvasRef.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
    setEmpty(true);
  }

  async function submit() {
    if (isEmpty) return;
    setLoad(true); setErrMsg("");
    const signature = canvasRef.current.toDataURL("image/png");
    try {
      const res  = await fetch(`${BASE}/admin/sign/${token.current}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep("done");
    } catch (e) { setErrMsg(e.message); }
    finally { setLoad(false); }
  }

  const card = {
    width:"100%", maxWidth:460,
    background:"#fff", borderRadius:20,
    boxShadow:"0 8px 40px rgba(15,52,96,.13)",
    overflow:"hidden", fontFamily:"Vazirmatn,Tahoma,sans-serif", direction:"rtl",
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f0f4ff",
      display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={card}>

        {/* هدر */}
        <div style={{ background:"#0f3460", padding:"20px 24px",
          display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:"50%",
            background:"rgba(255,255,255,.15)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, color:"#fff" }}>✍</div>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>امضای قرارداد</div>
            <div style={{ color:"rgba(255,255,255,.6)", fontSize:12 }}>پارسا اسدزاده – طراحی وب</div>
          </div>
        </div>

        <div style={{ padding:"24px 24px 32px" }}>

          {step === "loading" && (
            <div style={{ textAlign:"center", padding:"40px 0", color:"#888" }}>
              <div style={{ fontSize:32, marginBottom:10 }}>⏳</div>
              در حال بارگذاری...
            </div>
          )}

          {step === "error" && (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>❌</div>
              <div style={{ fontWeight:700, color:"#e03e2d", marginBottom:8 }}>لینک نامعتبر</div>
              <div style={{ color:"#666", fontSize:13 }}>{errMsg}</div>
            </div>
          )}

          {step === "info" && order && (
            <>
              <div style={{ background:"#f0f4ff", borderRight:"4px solid #0f3460",
                borderRadius:10, padding:"16px 18px", marginBottom:20 }}>
                <div style={{ fontWeight:700, color:"#0f3460", marginBottom:10 }}>اطلاعات قرارداد</div>
                {[
                  ["کارفرما",      order.name],
                  ["نوع سایت",    order.siteType],
                  ["مبلغ توافقی", `${Number(order.finalPrice).toLocaleString("fa-IR")} تومان`],
                  ["زمان‌بندی",   order.deadline],
                ].map(([l,v]) => (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between",
                    fontSize:13, padding:"6px 0", borderBottom:"1px solid rgba(15,52,96,.08)" }}>
                    <span style={{ color:"#666" }}>{l}</span>
                    <span style={{ fontWeight:600 }}>{v || "—"}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:13, color:"#444", lineHeight:2, marginBottom:20 }}>
                با امضای این قرارداد، موافقت خود را با تمام شرایط مندرج اعلام می‌نمایید.
              </p>
              <button onClick={() => setStep("sign")} style={{
                width:"100%", background:"#0f3460", color:"#fff",
                border:"none", borderRadius:12, padding:14,
                fontFamily:"inherit", fontWeight:700, fontSize:15, cursor:"pointer" }}>
                مطالعه کردم — ادامه برای امضا ←
              </button>
            </>
          )}

          {step === "sign" && (
            <>
              <div style={{ textAlign:"center", fontWeight:700,
                fontSize:14, color:"#333", marginBottom:10 }}>
                امضای خود را در کادر زیر بکشید
              </div>

              <div style={{ border:"2px dashed #0f3460", borderRadius:12,
                background:"#fafbff", position:"relative",
                marginBottom:12, overflow:"hidden", touchAction:"none" }}>
                <canvas ref={canvasRef}
                  style={{ display:"block", width:"100%", height:180, cursor:"crosshair" }}
                  onPointerDown={onDown} onPointerMove={onMove}
                  onPointerUp={onUp} onPointerLeave={onUp} />
                {isEmpty && (
                  <div style={{ position:"absolute", inset:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"#bbb", fontSize:13, pointerEvents:"none" }}>
                    ✍ اینجا امضا کنید
                  </div>
                )}
              </div>

              {errMsg && <div style={{ color:"#e03e2d", fontSize:13,
                marginBottom:10, textAlign:"center" }}>❌ {errMsg}</div>}

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={clear} style={{
                  flex:1, background:"#f0f4ff", color:"#0f3460",
                  border:"1.5px solid #0f3460", borderRadius:10, padding:12,
                  fontFamily:"inherit", fontWeight:600, fontSize:14, cursor:"pointer" }}>
                  پاک کردن
                </button>
                <button onClick={submit} disabled={isEmpty || loading} style={{
                  flex:2, background: isEmpty||loading ? "#93a8c4" : "#0f3460",
                  color:"#fff", border:"none", borderRadius:10, padding:12,
                  fontFamily:"inherit", fontWeight:700, fontSize:14,
                  cursor: isEmpty||loading ? "not-allowed" : "pointer" }}>
                  {loading ? "در حال ثبت..." : "تأیید و ثبت امضا ✓"}
                </button>
              </div>
            </>
          )}

          {step === "done" && (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{ width:72, height:72, borderRadius:"50%",
                background:"rgba(16,185,129,.12)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:36, margin:"0 auto 16px" }}>✅</div>
              <div style={{ fontWeight:800, color:"#10b981", fontSize:20, marginBottom:8 }}>
                امضا ثبت شد!
              </div>
              <p style={{ color:"#555", fontSize:13, lineHeight:2 }}>
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

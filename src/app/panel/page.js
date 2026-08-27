"use client";
import { useState, useEffect } from "react";

const BASE = "https://parsa-order-backend.vercel.app/api";

/* ── status config ── */
const STATUS = {
  pending:  { label: "در انتظار",  color: "#f59e0b", bg: "rgba(245,158,11,.12)"  },
  reviewed: { label: "بررسی شد",   color: "#3b82f6", bg: "rgba(59,130,246,.12)"  },
  approved: { label: "تایید شد",   color: "#10b981", bg: "rgba(16,185,129,.12)"  },
  rejected: { label: "رد شد",      color: "#ef4444", bg: "rgba(239,68,68,.12)"   },
};

/* ── tiny helpers ── */
function Badge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}`,
      borderRadius: 999, padding: "3px 12px",
      fontSize: 12, fontWeight: 700,
    }}>{s.label}</span>
  );
}

/* ════════════════════════════════════════════════════════ */
export default function PanelPage() {
  const [token,      setToken]      = useState(null);
  const [password,   setPassword]   = useState("");
  const [loginErr,   setLoginErr]   = useState("");
  const [loginLoad,  setLoginLoad]  = useState(false);

  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [selected,   setSelected]   = useState(null);   // order object
  const [filter,     setFilter]     = useState("all");

  const [priceInput, setPriceInput] = useState("");
  const [actionLoad, setActionLoad] = useState(false);
  const [msg,        setMsg]        = useState(null);   // { text, ok }

  /* persist token */
  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (t) setToken(t);
  }, []);

  /* fetch orders whenever token changes */
  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  /* ── auth ── */
  async function login() {
    setLoginLoad(true); setLoginErr("");
    try {
      const res  = await fetch(`${BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
    } catch (e) {
      setLoginErr(e.message || "خطا در ورود");
    } finally {
      setLoginLoad(false);
    }
  }

  function logout() {
    localStorage.removeItem("adminToken");
    setToken(null); setOrders([]); setSelected(null);
  }

  /* ── data ── */
  async function fetchOrders() {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) { logout(); return; }
      const data = await res.json();
      setOrders(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  /* ── actions ── */
  async function savePrice() {
    if (!priceInput) return;
    setActionLoad(true);
    try {
      const res  = await fetch(`${BASE}/admin/orders/${selected._id}/price`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ finalPrice: Number(priceInput) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash("قیمت ثبت شد ✓", true);
      refreshSelected(data.order);
    } catch (e) { flash(e.message, false); }
    finally { setActionLoad(false); }
  }

  // -------------------------------------------------------------
  // تغییر اصلی اینجاست: دریافت PDF به صورت Blob و دانلود مستقیم
  // -------------------------------------------------------------
  async function approve() {
    setActionLoad(true);
    try {
      const res  = await fetch(`${BASE}/admin/orders/${selected._id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        // در صورت خطا، بک‌اند همچنان JSON برمی‌گرداند
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "خطا در صدور قرارداد");
      }

      // اگر موفق بود، فایل PDF را به عنوان Blob دریافت می‌کنیم
      const blob = await res.blob();
      
      // ایجاد یک لینک موقت برای دانلود فایل PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract_${selected._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      flash("قرارداد صادر و دانلود شد ✓", true);
      refreshSelected({ ...selected, status: "approved" });
    } catch (e) { 
      flash(e.message, false); 
    } finally { 
      setActionLoad(false); 
    }
  }

  function refreshSelected(updated) {
    setOrders(o => o.map(x => x._id === updated._id ? updated : x));
    setSelected(updated);
  }

  function flash(text, ok) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  }

  /* ════════ LOGIN SCREEN ════════ */
  if (!token) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg0)",
      fontFamily: "Vazirmatn, sans-serif", direction: "rtl",
    }}>
      <div style={{
        background: "var(--bg1)", border: "1px solid var(--border)",
        borderRadius: 24, padding: "48px 40px", width: "100%", maxWidth: 380,
        display: "flex", flexDirection: "column", gap: 20,
      }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--ac-dim)", border: "1.5px solid var(--ac)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, color: "var(--ac)", margin: "0 auto 16px",
          }}>
            <i className="fas fa-lock" />
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 900, marginBottom: 4 }}>پنل ادمین</h1>
          <p style={{ color: "var(--text2)", fontSize: 13 }}>فقط برای پارسا</p>
        </div>

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          placeholder="رمز عبور"
          style={{
            background: "var(--bg2)", border: `1.5px solid ${loginErr ? "#ef4444" : "var(--border)"}`,
            borderRadius: 12, padding: "13px 16px",
            color: "var(--text0)", fontFamily: "Vazirmatn, sans-serif",
            fontSize: 15, outline: "none", textAlign: "center",
            letterSpacing: 4,
          }}
        />

        {loginErr && (
          <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", margin: "-8px 0" }}>
            {loginErr}
          </p>
        )}

        <button onClick={login} disabled={loginLoad} style={{
          background: "var(--ac)", color: "var(--bg0)",
          border: "none", borderRadius: 12, padding: "14px",
          fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 15,
          cursor: loginLoad ? "not-allowed" : "pointer", opacity: loginLoad ? .7 : 1,
        }}>
          {loginLoad ? <><i className="fas fa-spinner fa-spin" /> ورود...</> : "ورود به پنل"}
        </button>
      </div>
    </div>
  );

  /* ════════ PANEL ════════ */
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts   = Object.fromEntries(
    ["all","pending","reviewed","approved","rejected"].map(k => [
      k, k === "all" ? orders.length : orders.filter(o => o.status === k).length
    ])
  );

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg0)",
      fontFamily: "Vazirmatn, sans-serif", direction: "rtl",
    }}>

      {/* ── topbar ── */}
      <div style={{
        background: "var(--bg1)", borderBottom: "1px solid var(--border)",
        padding: "16px 24px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "var(--ac-dim)", border: "1.5px solid var(--ac)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--ac)", fontSize: 15,
          }}>
            <i className="fas fa-layer-group" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>داشبورد پارسا</div>
            <div style={{ fontSize: 11, color: "var(--text2)" }}>{orders.length} سفارش کل</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={fetchOrders} style={{
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "8px 14px",
            color: "var(--text1)", cursor: "pointer",
            fontFamily: "Vazirmatn, sans-serif", fontSize: 13,
          }}>
            <i className="fas fa-rotate-right" />
          </button>
          <button onClick={logout} style={{
            background: "transparent", border: "1px solid var(--border)",
            borderRadius: 8, padding: "8px 14px",
            color: "var(--text2)", cursor: "pointer",
            fontFamily: "Vazirmatn, sans-serif", fontSize: 13,
          }}>
            خروج
          </button>
        </div>
      </div>

      {/* ── flash message ── */}
      {msg && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: msg.ok ? "#10b981" : "#ef4444",
          color: "#fff", borderRadius: 12, padding: "12px 28px",
          fontWeight: 700, fontSize: 14, zIndex: 999,
          boxShadow: "0 8px 32px rgba(0,0,0,.3)",
        }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: "flex", height: "calc(100vh - 69px)" }}>

        {/* ── sidebar — order list ── */}
        <div style={{
          width: 320, borderLeft: "1px solid var(--border)",
          background: "var(--bg1)", display: "flex", flexDirection: "column",
          flexShrink: 0, overflowY: "auto",
        }}>

          {/* filter tabs */}
          <div style={{ padding: "16px 16px 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              ["all","همه"], ["pending","در انتظار"],
              ["reviewed","بررسی‌شده"], ["approved","تایید‌شده"],
            ].map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                background: filter === k ? "var(--ac-dim)" : "var(--bg2)",
                border: `1px solid ${filter === k ? "var(--ac)" : "var(--border)"}`,
                color: filter === k ? "var(--ac)" : "var(--text2)",
                borderRadius: 999, padding: "5px 12px",
                fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "Vazirmatn, sans-serif",
              }}>
                {label}
                <span style={{
                  marginRight: 5, background: filter===k?"var(--ac)":"var(--bg0)",
                  color: filter===k?"var(--bg0)":"var(--text2)",
                  borderRadius: "50%", width: 18, height: 18,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                }}>
                  {counts[k]}
                </span>
              </button>
            ))}
          </div>

          {/* list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
            {loading && (
              <div style={{ textAlign: "center", color: "var(--text2)", padding: 32, fontSize: 13 }}>
                <i className="fas fa-spinner fa-spin" style={{ marginLeft: 8 }} />
                در حال بارگذاری...
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text2)", padding: 40, fontSize: 13 }}>
                سفارشی پیدا نشد
              </div>
            )}
            {filtered.map(o => (
              <div
                key={o._id}
                onClick={() => { setSelected(o); setPriceInput(o.finalPrice || ""); }}
                style={{
                  background: selected?._id === o._id ? "var(--ac-dim)" : "var(--bg2)",
                  border: `1px solid ${selected?._id === o._id ? "var(--ac)" : "var(--border)"}`,
                  borderRadius: 12, padding: "14px 14px",
                  marginBottom: 8, cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{o.name}</span>
                  <Badge status={o.status} />
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>
                  <i className="fas fa-globe" style={{ marginLeft: 5 }} />{o.siteType}
                </div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>
                  {new Date(o.createdAt).toLocaleDateString("fa-IR")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── detail panel ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 32px" }}>
          {!selected ? (
            <div style={{
              height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: "var(--text2)", gap: 16,
            }}>
              <i className="fas fa-inbox" style={{ fontSize: 48, opacity: .3 }} />
              <p style={{ fontSize: 15 }}>یه سفارش از لیست انتخاب کن</p>
            </div>
          ) : (
            <div style={{ maxWidth: 680 }}>

              {/* header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: 6 }}>{selected.name}</h2>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <Badge status={selected.status} />
                    <span style={{ color: "var(--text2)", fontSize: 12 }}>
                      {new Date(selected.createdAt).toLocaleDateString("fa-IR", { year:"numeric", month:"long", day:"numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* info grid */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 20, marginBottom: 28,
              }}>
                {[
                  ["نوع سایت",   selected.siteType],
                  ["بودجه",      selected.budget],
                  ["زمان‌بندی",  selected.deadline],
                  ["تماس",       selected.contact],
                ].map(([l,v]) => (
                  <div key={l} style={{
                    background: "var(--bg1)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "16px",
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 6 }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* features */}
              {selected.features?.length > 0 && (
                <div style={{
                  background: "var(--bg1)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "16px 20px", marginBottom: 20,
                }}>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10 }}>امکانات درخواستی</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selected.features.map(f => (
                      <span key={f} style={{
                        background: "var(--bg2)", border: "1px solid var(--border)",
                        borderRadius: 999, padding: "4px 12px", fontSize: 12,
                        color: "var(--text1)",
                      }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* desc */}
              <div style={{
                background: "var(--bg1)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "16px 20px", marginBottom: 20,
              }}>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>توضیحات مشتری</div>
                <p style={{ fontSize: 14, lineHeight: 2, color: "var(--text0)" }}>{selected.desc || "توضیحاتی ثبت نشده است."}</p>
              </div>

              {/* refUrl */}
              {selected.refUrl && (
                <div style={{
                  background: "var(--bg1)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "16px 20px", marginBottom: 28,
                }}>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>سایت نمونه</div>
                  <a href={selected.refUrl} target="_blank" rel="noreferrer"
                    style={{ color: "var(--ac)", fontSize: 13, direction: "ltr", display: "inline-block" }}>
                    {selected.refUrl}
                  </a>
                </div>
              )}

              {/* ── action box ── */}
              {selected.status !== "approved" ? (
                <div style={{
                  background: "var(--bg1)", border: "1.5px solid var(--border)",
                  borderRadius: 16, padding: "24px", marginBottom: 28,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 15 }}>
                    <i className="fas fa-pen-to-square" style={{ color: "var(--ac)", marginLeft: 8 }} />
                    تعیین قیمت و تایید
                  </div>

                  <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6 }}>
                        قیمت نهایی (تومان)
                      </label>
                      <input
                        type="number"
                        value={priceInput}
                        onChange={e => setPriceInput(e.target.value)}
                        placeholder="مثلاً: 12000000"
                        style={{
                          width: "100%", background: "var(--bg2)",
                          border: "1.5px solid var(--border)", borderRadius: 10,
                          padding: "12px 14px", color: "var(--text0)",
                          fontFamily: "Vazirmatn, sans-serif", fontSize: 15,
                          outline: "none",
                        }}
                      />
                    </div>
                    <button onClick={savePrice} disabled={actionLoad || !priceInput} style={{
                      background: "var(--ac)", color: "var(--bg0)",
                      border: "none", borderRadius: 10, padding: "12px 22px",
                      fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 14,
                      cursor: "pointer", whiteSpace: "nowrap",
                      opacity: !priceInput ? .5 : 1,
                    }}>
                      ثبت قیمت
                    </button>
                  </div>

                  {selected.finalPrice && (
                    <div style={{
                      background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.25)",
                      borderRadius: 10, padding: "12px 16px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      marginBottom: 16,
                    }}>
                      <span style={{ fontSize: 13, color: "var(--text1)" }}>قیمت فعلی</span>
                      <span style={{ fontWeight: 900, color: "#10b981", fontSize: 16 }}>
                        {Number(selected.finalPrice).toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  )}

                  <button
                    onClick={approve}
                    disabled={actionLoad || !selected.finalPrice}
                    style={{
                      width: "100%", background: selected.finalPrice ? "#10b981" : "var(--bg2)",
                      color: selected.finalPrice ? "#fff" : "var(--text2)",
                      border: "none", borderRadius: 10, padding: "14px",
                      fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 15,
                      cursor: selected.finalPrice ? "pointer" : "not-allowed",
                      opacity: actionLoad ? .7 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    {actionLoad ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-file-pdf" />}
                    تایید نهایی و دانلود قرارداد PDF
                  </button>

                  {!selected.finalPrice && (
                    <p style={{ fontSize: 12, color: "var(--text2)", textAlign: "center", marginTop: 8 }}>
                      ابتدا قیمت رو ثبت کن
                    </p>
                  )}
                </div>
              ) : (
                /* ── State: Approved ── */
                <div style={{
                  background: "var(--bg1)", border: "1.5px solid #10b981",
                  borderRadius: 16, padding: "24px", marginBottom: 28,
                  textAlign: "center"
                }}>
                  <div style={{ width: 48, height: 48, background: "rgba(16,185,129,.12)", borderRadius: "50%", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", fontSize: 20 }}>
                    <i className="fas fa-check" />
                  </div>
                  <div style={{ fontWeight: 700, color: "#10b981", fontSize: 16, marginBottom: 8 }}>
                    قرارداد صادر شده است
                  </div>
                  <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>
                    برای این سفارش فایل PDF قرارداد جنریت شده است.
                  </p>
                  
                  {/* دکمه دانلود مجدد در صورت نیاز (بک‌اند باید از GET برای دریافت فایل پشتیبانی کند یا اینکه همین متد رو فراخوانی کنید) */}
                  <div style={{ fontSize: 13, color: "var(--text1)" }}>
                     قیمت نهایی: <strong>{Number(selected.finalPrice).toLocaleString("fa-IR")} تومان</strong>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

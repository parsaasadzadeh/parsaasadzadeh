"use client";
import { useState, useEffect } from "react";

const BASE = "https://parsa-order-backend.vercel.app/api";

/* ── وضعیت‌ها ── */
const STATUS = {
  pending:  { label: "در انتظار",  color: "#f59e0b", bg: "rgba(245,158,11,.12)"  },
  reviewed: { label: "بررسی شد",   color: "#3b82f6", bg: "rgba(59,130,246,.12)"  },
  approved: { label: "تایید شد",   color: "#10b981", bg: "rgba(16,185,129,.12)"  },
  rejected: { label: "رد شد",      color: "#ef4444", bg: "rgba(239,68,68,.12)"   },
};

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

export default function PanelPage() {
  const [token,      setToken]      = useState(null);
  const [password,   setPassword]   = useState("");
  const [loginErr,   setLoginErr]   = useState("");
  const [loginLoad,  setLoginLoad]  = useState(false);

  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [selected,   setSelected]   = useState(null);
  const [filter,     setFilter]     = useState("all");

  const [priceInput, setPriceInput] = useState("");
  const [actionLoad, setActionLoad] = useState(false);
  const [msg,        setMsg]        = useState(null);

  /* بازیابی توکن از حافظه مرورگر */
  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (t) setToken(t);
  }, []);

  /* دریافت لیست سفارش‌ها به محض فعال شدن توکن */
  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  /* ── ورود و خروج ── */
  async function login() {
    setLoginLoad(true); setLoginErr("");
    try {
      const res = await fetch(`${BASE}/admin/login`, {
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

  /* ── دریافت اطلاعات سفارش‌ها ── */
  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) { logout(); return; }
      const data = await res.json();
      setOrders(data);
      if (selected) {
        const updatedSelected = data.find(item => item._id === selected._id);
        if (updatedSelected) setSelected(updatedSelected);
      }
    } catch { /* نادیده گرفتن خطا */ }
    finally { setLoading(false); }
  }

  /* ── ثبت قیمت ── */
  async function savePrice() {
    if (!priceInput) return;
    setActionLoad(true);
    try {
      const res = await fetch(`${BASE}/admin/orders/${selected._id}/price`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ finalPrice: Number(priceInput) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash("قیمت با موفقیت ثبت شد ✓", true);
      refreshSelected(data.order);
    } catch (e) { flash(e.message, false); }
    finally { setActionLoad(false); }
  }

  /* ── دانلود و ذخیره فایل PDF ── */
  async function fetchAndDownloadPdf(endpoint, method = "POST") {
    setActionLoad(true);
    try {
      const res = await fetch(`${BASE}/admin/orders/${selected._id}/${endpoint}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "خطا در دریافت فایل PDF");
      }

      // دریافت فایل و دانلود اتوماتیک در مرورگر
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract_${selected._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      flash("فایل قرارداد با موفقیت دانلود شد ✓", true);
      refreshSelected({ ...selected, status: "approved" });
    } catch (e) {
      flash(e.message, false);
    } finally {
      setActionLoad(false);
    }
  }

  /* تایید برای بار اول */
  function approve() {
    fetchAndDownloadPdf("approve", "POST");
  }

  /* دانلود مجدد */
  function reDownload() {
    fetchAndDownloadPdf("download-contract", "GET");
  }

  function refreshSelected(updated) {
    setOrders(o => o.map(x => x._id === updated._id ? updated : x));
    setSelected(updated);
  }

  function flash(text, ok) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  }

  /* ════════ صفحه ورود ════════ */
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
          <p style={{ color: "var(--text2)", fontSize: 13 }}>مدیریت سفارش‌ها</p>
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
          {loginLoad ? <><i className="fas fa-spinner fa-spin" /> در حال ورود...</> : "ورود به پنل"}
        </button>
      </div>
    </div>
  );

  /* ════════ صفحه اصلی پنل ════════ */
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts = Object.fromEntries(
    ["all","pending","reviewed","approved","rejected"].map(k => [
      k, k === "all" ? orders.length : orders.filter(o => o.status === k).length
    ])
  );

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg0)",
      fontFamily: "Vazirmatn, sans-serif", direction: "rtl",
    }}>

      {/* هدر بالای پنل */}
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
            <div style={{ fontWeight: 800, fontSize: 15 }}>داشبورد مدیریت</div>
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
            <i className="fas fa-rotate-right" /> بروزرسانی
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

      {/* اعلان‌های شناور */}
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

        {/* نوار کناری - لیست سفارش‌ها */}
        <div style={{
          width: 320, borderLeft: "1px solid var(--border)",
          background: "var(--bg1)", display: "flex", flexDirection: "column",
          flexShrink: 0, overflowY: "auto",
        }}>

          {/* تب‌های فیلتر */}
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

          {/* آیتم‌های لیست */}
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

        {/* پنل جزئیات سفارش */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 32px" }}>
          {!selected ? (
            <div style={{
              height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: "var(--text2)", gap: 16,
            }}>
              <i className="fas fa-inbox" style={{ fontSize: 48, opacity: .3 }} />
              <p style={{ fontSize: 15 }}>یک سفارش را از لیست انتخاب کنید</p>
            </div>
          ) : (
            <div style={{ maxWidth: 680 }}>

              {/* عنوان */}
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

              {/* شبکه اطلاعات اولیه */}
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
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{v || "-"}</div>
                  </div>
                ))}
              </div>

              {/* امکانات درخواستی */}
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

              {/* توضیحات */}
              <div style={{
                background: "var(--bg1)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "16px 20px", marginBottom: 20,
              }}>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>توضیحات مشتری</div>
                <p style={{ fontSize: 14, lineHeight: 2, color: "var(--text0)" }}>{selected.desc || "توضیحاتی ثبت نشده است."}</p>
              </div>

              {/* نمونه سایت */}
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

              {/* ── بخش عملیات ── */}
              {selected.status !== "approved" ? (
                /* حالت ۱: هنوز تایید نشده */
                <div style={{
                  background: "var(--bg1)", border: "1.5px solid var(--border)",
                  borderRadius: 16, padding: "24px", marginBottom: 28,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 15 }}>
                    <i className="fas fa-pen-to-square" style={{ color: "var(--ac)", marginLeft: 8 }} />
                    تعیین قیمت و صدور قرارداد
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
                        placeholder="مثلاً: 14000000"
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
                      <span style={{ fontSize: 13, color: "var(--text1)" }}>قیمت ثبت‌شده</span>
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
                </div>
              ) : (
                /* حالت ۲: تایید شده (قرارداد صادر شده + امکان دانلود مجدد) */
                <div style={{
                  background: "var(--bg1)", border: "1.5px solid #10b981",
                  borderRadius: 16, padding: "24px", marginBottom: 28,
                  textAlign: "center"
                }}>
                  <div style={{ width: 48, height: 48, background: "rgba(16,185,129,.12)", borderRadius: "50%", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", fontSize: 20 }}>
                    <i className="fas fa-check" />
                  </div>
                  <div style={{ fontWeight: 700, color: "#10b981", fontSize: 16, marginBottom: 6 }}>
                    قرارداد صادر شده است
                  </div>
                  <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>
                    قیمت نهایی: <strong style={{ color: "var(--text0)" }}>{Number(selected.finalPrice).toLocaleString("fa-IR")} تومان</strong>
                  </p>

                  <button
                    onClick={reDownload}
                    disabled={actionLoad}
                    style={{
                      width: "100%", background: "#3b82f6", color: "#fff",
                      border: "none", borderRadius: 10, padding: "12px",
                      fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 14,
                      cursor: "pointer", opacity: actionLoad ? .7 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    {actionLoad ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-download" />}
                    دانلود مجدد قرارداد PDF
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

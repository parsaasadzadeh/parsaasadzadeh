"use client";
import { useState, useEffect } from "react";

const BASE = "https://parsa-order-backend.vercel.app/api";

const STATUS = {
  pending:  { label: "در انتظار",  color: "#f59e0b", bg: "rgba(245,158,11,.12)"  },
  reviewed: { label: "بررسی شد",   color: "#3b82f6", bg: "rgba(59,130,246,.12)"  },
  signed:   { label: "امضا شد",    color: "#8b5cf6", bg: "rgba(139,92,246,.12)"  },
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

  // ✅ state لینک امضا
  const [signLink,   setSignLink]   = useState(null);
  const [linkLoad,   setLinkLoad]   = useState(false);
  const [copied,     setCopied]     = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  // وقتی سفارش تغییر می‌کنه لینک قبلی پاک بشه
  useEffect(() => {
    setSignLink(null);
    setCopied(false);
  }, [selected?._id]);

  // ── لاگین ─────────────────────────────────────────────
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

  // ── دریافت سفارش‌ها ────────────────────────────────────
  async function fetchOrders() {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) { logout(); return; }
      const data = await res.json();
      setOrders(data);
      // رفرش سفارش انتخاب‌شده
      if (selected) {
        const fresh = data.find(x => x._id === selected._id);
        if (fresh) setSelected(fresh);
      }
    } catch { /* نادیده */ }
    finally { setLoading(false); }
  }

  // ── ثبت قیمت ──────────────────────────────────────────
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
      flash("قیمت با موفقیت ثبت شد ✓", true);
      refreshSelected(data.order);
    } catch (e) { flash(e.message, false); }
    finally { setActionLoad(false); }
  }

  // ✅ ساخت لینک امضا ─────────────────────────────────────
  async function generateLink() {
    setLinkLoad(true); setSignLink(null); setCopied(false);
    try {
      const res  = await fetch(`${BASE}/admin/orders/${selected._id}/generate-link`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSignLink(data.signUrl);
      flash("لینک امضا ساخته شد ✓", true);
    } catch (e) { flash(e.message, false); }
    finally { setLinkLoad(false); }
  }

  // ✅ کپی لینک ──────────────────────────────────────────
  async function copyLink() {
    if (!signLink) return;
    try {
      await navigator.clipboard.writeText(signLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      flash("کپی انجام نشد", false);
    }
  }

  // ── دانلود PDF ─────────────────────────────────────────
  async function fetchPdf(endpoint, method = "POST") {
    setActionLoad(true);
    try {
      const res = await fetch(`${BASE}/admin/orders/${selected._id}/${endpoint}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "خطا در دریافت PDF");
      }
      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `contract_${selected._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      flash("قرارداد PDF دانلود شد ✓", true);
      refreshSelected({ ...selected, status: "approved" });
      await fetchOrders();
    } catch (e) { flash(e.message, false); }
    finally { setActionLoad(false); }
  }

  function refreshSelected(updated) {
    setOrders(o => o.map(x => x._id === updated._id ? updated : x));
    setSelected(updated);
  }

  function flash(text, ok) {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  }

  // ════════ صفحه لاگین ════════
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
          }}>🔒</div>
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
            background: "var(--bg2)",
            border: `1.5px solid ${loginErr ? "#ef4444" : "var(--border)"}`,
            borderRadius: 12, padding: "13px 16px",
            color: "var(--text0)", fontFamily: "Vazirmatn, sans-serif",
            fontSize: 15, outline: "none", textAlign: "center", letterSpacing: 4,
          }}
        />

        {loginErr && (
          <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", margin: "-8px 0" }}>
            {loginErr}
          </p>
        )}

        <button onClick={login} disabled={loginLoad} style={{
          background: "var(--ac)", color: "var(--bg0)",
          border: "none", borderRadius: 12, padding: 14,
          fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 15,
          cursor: loginLoad ? "not-allowed" : "pointer", opacity: loginLoad ? .7 : 1,
        }}>
          {loginLoad ? "در حال ورود..." : "ورود به پنل"}
        </button>
      </div>
    </div>
  );

  // ════════ پنل اصلی ════════
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts   = Object.fromEntries(
    ["all", "pending", "reviewed", "signed", "approved"].map(k => [
      k, k === "all" ? orders.length : orders.filter(o => o.status === k).length,
    ])
  );

  const canGenerateLink = selected && selected.finalPrice && selected.status !== "approved";
  const canApprove      = selected && selected.finalPrice && selected.clientSignature && selected.status !== "approved";

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg0)",
      fontFamily: "Vazirmatn, sans-serif", direction: "rtl",
    }}>

      {/* ── هدر ── */}
      <div style={{
        background: "var(--bg1)", borderBottom: "1px solid var(--border)",
        padding: "16px 24px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>داشبورد مدیریت</div>
          <div style={{ fontSize: 11, color: "var(--text2)" }}>{orders.length} سفارش کل</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={fetchOrders} style={{
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "8px 14px", color: "var(--text1)",
            cursor: "pointer", fontFamily: "Vazirmatn, sans-serif", fontSize: 13,
          }}>
            بروزرسانی
          </button>
          <button onClick={logout} style={{
            background: "transparent", border: "1px solid var(--border)",
            borderRadius: 8, padding: "8px 14px", color: "var(--text2)",
            cursor: "pointer", fontFamily: "Vazirmatn, sans-serif", fontSize: 13,
          }}>
            خروج
          </button>
        </div>
      </div>

      {/* ── نوتیف شناور ── */}
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

        {/* ── ستون چپ: لیست ── */}
        <div style={{
          width: 320, borderLeft: "1px solid var(--border)",
          background: "var(--bg1)", display: "flex",
          flexDirection: "column", flexShrink: 0, overflowY: "auto",
        }}>
          {/* فیلتر */}
          <div style={{ padding: "16px 12px 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[
              ["all", "همه"], ["pending", "در انتظار"],
              ["reviewed", "بررسی‌شده"], ["signed", "امضا‌شده"],
              ["approved", "تایید‌شده"],
            ].map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                background: filter === k ? "var(--ac-dim)" : "var(--bg2)",
                border: `1px solid ${filter === k ? "var(--ac)" : "var(--border)"}`,
                color: filter === k ? "var(--ac)" : "var(--text2)",
                borderRadius: 999, padding: "5px 10px",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
                fontFamily: "Vazirmatn, sans-serif",
              }}>
                {label}
                <span style={{
                  marginRight: 4,
                  background: filter === k ? "var(--ac)" : "var(--bg0)",
                  color: filter === k ? "var(--bg0)" : "var(--text2)",
                  borderRadius: "50%", width: 16, height: 16,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700,
                }}>
                  {counts[k]}
                </span>
              </button>
            ))}
          </div>

          {/* آیتم‌ها */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
            {loading && (
              <div style={{ textAlign: "center", color: "var(--text2)", padding: 32, fontSize: 13 }}>
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
                  borderRadius: 12, padding: "14px", marginBottom: 8,
                  cursor: "pointer", transition: "all .2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{o.name}</span>
                  <Badge status={o.status} />
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>
                  {o.siteType}
                </div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>
                  {new Date(o.createdAt).toLocaleDateString("fa-IR")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── پنل جزئیات ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {!selected ? (
            <div style={{
              height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: "var(--text2)", gap: 16,
            }}>
              <div style={{ fontSize: 48, opacity: .3 }}>📥</div>
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
                      {new Date(selected.createdAt).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                    {selected.clientSignature && (
                      <span style={{ color: "#8b5cf6", fontSize: 12, fontWeight: 600 }}>✍ امضا شده</span>
                    )}
                  </div>
                </div>
              </div>

              {/* اطلاعات پایه */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
                {[
                  ["نوع سایت",   selected.siteType],
                  ["بودجه",      selected.budget],
                  ["زمان‌بندی",  selected.deadline],
                  ["تماس",       selected.contact],
                ].map(([l, v]) => (
                  <div key={l} style={{
                    background: "var(--bg1)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: 16,
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 6 }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{v || "—"}</div>
                  </div>
                ))}
              </div>

              {/* امکانات */}
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
                        borderRadius: 999, padding: "4px 12px", fontSize: 12, color: "var(--text1)",
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
                <p style={{ fontSize: 14, lineHeight: 2, color: "var(--text0)" }}>
                  {selected.desc || "توضیحاتی ثبت نشده است."}
                </p>
              </div>

              {/* سایت نمونه */}
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

              {/* ══ بخش عملیات ══ */}
              {selected.status === "approved" ? (

                /* ── تایید شده: فقط دانلود مجدد ── */
                <div style={{
                  background: "var(--bg1)", border: "1.5px solid #10b981",
                  borderRadius: 16, padding: 24, marginBottom: 28, textAlign: "center",
                }}>
                  <div style={{
                    width: 48, height: 48, background: "rgba(16,185,129,.12)",
                    borderRadius: "50%", margin: "0 auto 12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#10b981", fontSize: 22,
                  }}>✅</div>
                  <div style={{ fontWeight: 700, color: "#10b981", fontSize: 16, marginBottom: 6 }}>
                    قرارداد صادر شده است
                  </div>
                  <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>
                    قیمت نهایی:{" "}
                    <strong style={{ color: "var(--text0)" }}>
                      {Number(selected.finalPrice).toLocaleString("fa-IR")} تومان
                    </strong>
                  </p>
                  <button onClick={() => fetchPdf("download-contract", "GET")} disabled={actionLoad} style={{
                    width: "100%", background: "#3b82f6", color: "#fff",
                    border: "none", borderRadius: 10, padding: 12,
                    fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 14,
                    cursor: "pointer", opacity: actionLoad ? .7 : 1,
                  }}>
                    {actionLoad ? "در حال دانلود..." : "دانلود مجدد قرارداد PDF"}
                  </button>
                </div>

              ) : (

                /* ── هنوز تایید نشده: جریان کامل ── */
                <div style={{
                  background: "var(--bg1)", border: "1.5px solid var(--border)",
                  borderRadius: 16, padding: 24, marginBottom: 28,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 15 }}>
                    📋 تعیین قیمت و صدور قرارداد
                  </div>

                  {/* ── مرحله ۱: قیمت ── */}
                  <div style={{
                    background: "var(--bg2)", borderRadius: 12,
                    padding: "16px", marginBottom: 16,
                  }}>
                    <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10, fontWeight: 600 }}>
                      مرحله ۱ — ثبت قیمت
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          value={priceInput}
                          onChange={e => setPriceInput(e.target.value)}
                          placeholder="مثلاً: 14000000"
                          style={{
                            width: "100%", background: "var(--bg1)",
                            border: "1.5px solid var(--border)", borderRadius: 10,
                            padding: "11px 14px", color: "var(--text0)",
                            fontFamily: "Vazirmatn, sans-serif", fontSize: 15, outline: "none",
                          }}
                        />
                      </div>
                      <button onClick={savePrice} disabled={actionLoad || !priceInput} style={{
                        background: priceInput ? "var(--ac)" : "var(--bg0)",
                        color: priceInput ? "var(--bg0)" : "var(--text2)",
                        border: "none", borderRadius: 10, padding: "11px 20px",
                        fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 14,
                        cursor: priceInput ? "pointer" : "not-allowed", whiteSpace: "nowrap",
                      }}>
                        ثبت قیمت
                      </button>
                    </div>

                    {selected.finalPrice && (
                      <div style={{
                        marginTop: 10, background: "rgba(16,185,129,.08)",
                        border: "1px solid rgba(16,185,129,.25)", borderRadius: 8,
                        padding: "10px 14px",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}>
                        <span style={{ fontSize: 12, color: "var(--text1)" }}>قیمت ثبت‌شده</span>
                        <span style={{ fontWeight: 900, color: "#10b981", fontSize: 15 }}>
                          {Number(selected.finalPrice).toLocaleString("fa-IR")} تومان
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── مرحله ۲: لینک امضا ── */}
                  <div style={{
                    background: "var(--bg2)", borderRadius: 12,
                    padding: "16px", marginBottom: 16,
                    opacity: canGenerateLink ? 1 : .5,
                  }}>
                    <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10, fontWeight: 600 }}>
                      مرحله ۲ — ارسال لینک امضا به کارفرما
                    </div>

                    <button
                      onClick={generateLink}
                      disabled={!canGenerateLink || linkLoad}
                      style={{
                        width: "100%", border: "none", borderRadius: 10, padding: 11,
                        fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 14,
                        background: canGenerateLink ? "#8b5cf6" : "var(--bg0)",
                        color: canGenerateLink ? "#fff" : "var(--text2)",
                        cursor: canGenerateLink ? "pointer" : "not-allowed",
                        opacity: linkLoad ? .7 : 1,
                      }}
                    >
                      {linkLoad ? "در حال ساختن لینک..." : "✍ ساخت لینک امضا (۲۴ ساعته)"}
                    </button>

                    {/* نمایش لینک + کپی */}
                    {signLink && (
                      <div style={{
                        marginTop: 12, background: "rgba(139,92,246,.08)",
                        border: "1px solid rgba(139,92,246,.3)",
                        borderRadius: 10, padding: "12px 14px",
                      }}>
                        <div style={{ fontSize: 11, color: "#8b5cf6", marginBottom: 6, fontWeight: 600 }}>
                          لینک امضا (۲۴ ساعت اعتبار دارد)
                        </div>
                        <div style={{
                          fontSize: 11, color: "var(--text1)", wordBreak: "break-all",
                          direction: "ltr", marginBottom: 10, lineHeight: 1.6,
                        }}>
                          {signLink}
                        </div>
                        <button onClick={copyLink} style={{
                          width: "100%", border: "1px solid #8b5cf6",
                          borderRadius: 8, padding: "8px",
                          background: copied ? "rgba(139,92,246,.15)" : "transparent",
                          color: "#8b5cf6", fontFamily: "Vazirmatn, sans-serif",
                          fontWeight: 700, fontSize: 13, cursor: "pointer",
                          transition: "all .2s",
                        }}>
                          {copied ? "✓ کپی شد!" : "کپی لینک"}
                        </button>
                      </div>
                    )}

                    {/* نشانه‌ی امضا شدن */}
                    {selected.clientSignature && (
                      <div style={{
                        marginTop: 10, background: "rgba(139,92,246,.1)",
                        border: "1px solid rgba(139,92,246,.3)",
                        borderRadius: 8, padding: "10px 14px",
                        color: "#8b5cf6", fontWeight: 700, fontSize: 13,
                        textAlign: "center",
                      }}>
                        ✍ کارفرما امضا کرده است
                      </div>
                    )}
                  </div>

                  {/* ── مرحله ۳: تایید نهایی و PDF ── */}
                  <div style={{
                    background: "var(--bg2)", borderRadius: 12, padding: "16px",
                    opacity: canApprove ? 1 : .5,
                  }}>
                    <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10, fontWeight: 600 }}>
                      مرحله ۳ — صدور قرارداد نهایی
                    </div>

                    {!selected.clientSignature && (
                      <div style={{
                        fontSize: 12, color: "#f59e0b", marginBottom: 10,
                        background: "rgba(245,158,11,.08)", borderRadius: 8,
                        padding: "8px 12px", border: "1px solid rgba(245,158,11,.3)",
                      }}>
                        ⏳ منتظر امضای کارفرما هستید
                      </div>
                    )}

                    <button
                      onClick={() => fetchPdf("approve", "POST")}
                      disabled={actionLoad || !canApprove}
                      style={{
                        width: "100%", border: "none", borderRadius: 10, padding: 13,
                        fontFamily: "Vazirmatn, sans-serif", fontWeight: 700, fontSize: 15,
                        background: canApprove ? "#10b981" : "var(--bg0)",
                        color: canApprove ? "#fff" : "var(--text2)",
                        cursor: canApprove ? "pointer" : "not-allowed",
                        opacity: actionLoad ? .7 : 1,
                      }}
                    >
                      {actionLoad ? "در حال پردازش..." : "📄 تایید نهایی و دانلود قرارداد PDF"}
                    </button>
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

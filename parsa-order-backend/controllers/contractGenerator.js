// ═══════════════════════════════════════════════════════════════
//  تولید PDF قرارداد با Chromium (puppeteer)
//
//  چرا این روش؟ pdf-lib فقط «جای‌گذاری گلیف» بلد است؛ نه اتصال حروف (shaping)
//  و نه الگوریتم دوجهته (bidi) را انجام می‌دهد. مرورگر هر دو را کامل و استاندارد
//  انجام می‌دهد، پس متن فارسی/اعداد/انگلیسی دقیقاً همان‌طور که باید درمی‌آید.
//  همچنین متن داخل PDF قابل انتخاب، کپی و جستجو می‌ماند.
// ═══════════════════════════════════════════════════════════════
const fs = require("fs");
const { VAZIR_REG_B64, VAZIR_BOLD_B64 } = require("./fonts.js");

// ── ابزارهای کمکی ───────────────────────────────────────────────
const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// مقدار وارد‌شده توسط کاربر: escape + ایزوله از نظر جهت (تا شماره/لینک انگلیسی متن را به‌هم نریزد)
const val = (v, fallback = "—") => {
  const s = v === undefined || v === null || String(v).trim() === "" ? fallback : String(v);
  return `<bdi>${esc(s).replace(/\r?\n/g, "<br>")}</bdi>`;
};

const fa = (n) => Number(n).toLocaleString("fa-IR");

// امضا فقط اگر data-URL تصویر معتبر باشد
const safeImg = (dataUrl) =>
  typeof dataUrl === "string" &&
  /^data:image\/(png|jpe?g);base64,[A-Za-z0-9+/=]+$/.test(dataUrl.trim())
    ? dataUrl.trim()
    : null;

// ── استایل (فونت داخل خود HTML است؛ به فونت سیستم وابسته نیستیم) ──
const CSS = `
@font-face{font-family:"Vazir";font-weight:400;src:url(data:font/ttf;base64,${VAZIR_REG_B64}) format("truetype");}
@font-face{font-family:"Vazir";font-weight:700;src:url(data:font/ttf;base64,${VAZIR_BOLD_B64}) format("truetype");}

@page{
  size:A4; margin:13mm 15mm 18mm;
  @bottom-center{
    content:"صفحه " counter(page, persian) " از " counter(pages, persian);
    font-family:"Vazir"; font-size:8.5pt; color:#8a8a8a;
  }
}
:root{ --navy:#0f3460; --navy-d:#0a2447; --light:#f0f5ff; --line:#c9d3e6; --gray:#6b6b6b; --ink:#141414; }
*{box-sizing:border-box;}
html{direction:rtl;}
body{
  margin:0; font-family:"Vazir",sans-serif; font-size:10.4pt; line-height:1.9;
  color:var(--ink); direction:rtl; text-align:right;
  font-feature-settings:"kern","liga","calt";
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
p{margin:0 0 4px; text-align:justify;}

/* سربرگ */
.bismillah{text-align:center; color:var(--navy); font-weight:700; font-size:11pt; margin:0;}
.title{text-align:center; color:var(--navy); font-weight:700; font-size:21pt; line-height:1.6; margin:2px 0 6px;}
.rule{height:0; border-top:3px solid var(--navy); border-bottom:1px solid var(--navy); padding-top:2px; margin-bottom:10px;}
.meta{display:flex; justify-content:space-between; color:var(--gray); font-size:10pt; margin-bottom:8px;}

/* عنوان ماده */
h2{
  break-after:avoid; page-break-after:avoid;
  background:var(--navy); color:#fff; font-size:11.5pt; font-weight:700;
  margin:11px 0 6px; padding:1px 12px; border-radius:4px; line-height:1.9;
}

/* لیست */
ul{margin:0 0 6px; padding:0 18px 0 0;}
li{margin-bottom:0; text-align:justify;}
li::marker{color:var(--navy);}
.sub{font-weight:700; color:var(--navy); margin:6px 0 0;}

/* جدول */
table{width:100%; border-collapse:collapse; margin:4px 0 8px; break-inside:avoid; page-break-inside:avoid;}
th{background:var(--navy); color:#fff; font-weight:700; font-size:10pt; padding:1px 8px; border:1px solid var(--navy-d); text-align:center; line-height:1.9;}
td{padding:1px 8px; border:1px solid var(--line); text-align:center; font-size:10pt; line-height:1.9;}
tbody tr:nth-child(odd) td{background:var(--light);}
td.num{font-weight:700; color:var(--navy);}

.muted{color:var(--gray); font-size:9.5pt;}

/* صفحه امضا */
.sig-page{break-before:page; page-break-before:always;}
.sig-head{background:var(--navy); color:#fff; text-align:center; border-radius:6px; padding:12px 0 10px; margin-bottom:16px;}
.sig-head .t1{font-size:18pt; font-weight:700; line-height:1.7;}
.sig-head .t2{font-size:11pt; color:#b3c7ff; line-height:1.7;}
.infobar{display:flex; justify-content:space-between; background:var(--light); border:1px solid var(--navy); border-radius:4px; padding:6px 14px; font-size:10pt; font-weight:700; color:var(--navy); margin-bottom:14px;}
.center{text-align:center; margin:0;}
.sigs{display:flex; gap:20px; margin-top:22px;}
.sigbox{flex:1; border:1.5px solid var(--navy); border-radius:6px; overflow:hidden; height:215px; display:flex; flex-direction:column; text-align:center;}
.sigbox .hd{background:var(--navy); color:#fff; font-weight:700; font-size:12pt; line-height:2.2;}
.sigbox .nm{color:var(--navy); font-weight:700; font-size:11pt; margin-top:8px; line-height:1.8;}
.sigbox .rl{color:var(--gray); font-size:9.5pt; line-height:1.7; min-height:18px;}
.sigbox .area{flex:1; display:flex; align-items:center; justify-content:center; margin:4px 14px 0; border-bottom:1px dashed #b5b5b5; min-height:70px;}
.sigbox .area img{max-width:100%; max-height:78px; object-fit:contain;}
.sigbox .area span{color:#aaa; font-size:9pt;}
.sigbox .dt{color:var(--gray); font-size:9pt; line-height:2.2;}
.trace{margin-top:22px; background:var(--light); border:1px solid #cfd9f5; border-radius:6px; padding:10px 14px; text-align:center;}
.trace .a{color:var(--navy); font-size:9.5pt; line-height:1.9;}
.trace .b{color:var(--gray); font-size:9pt; line-height:1.9;}
`;

// ── ساخت HTML ───────────────────────────────────────────────────
function buildHTML(order, contractorSignature) {
  const price = Number(order.finalPrice) || 0;
  const p1 = Math.round(price * 0.5);
  const p2 = Math.round(price * 0.3);
  const p3 = price - p1 - p2; // مجموع اقساط همیشه دقیقاً برابر مبلغ کل

  const featuresList = Array.isArray(order.features) ? order.features.filter(Boolean) : [];
  const features = featuresList.join("، ");
  const date = new Date().toLocaleDateString("fa-IR");
  const cNo = `WEB-${String(order._id || "0001").slice(-4).toUpperCase()}`;

  const execSig = safeImg(contractorSignature);
  const clientSig = safeImg(order.clientSignature);

  const li = (arr) => `<ul>${arr.map((t) => `<li>${t}</li>`).join("")}</ul>`;

  const subject =
    `موضوع این قرارداد طراحی، توسعه و راه‌اندازی وب‌سایت از نوع «${val(order.siteType, "—")}»` +
    (features ? ` با امکانات ${val(features)}` : "") +
    ` می‌باشد.`;

  const services = [
    "طراحی رابط کاربری (UI/UX) مطابق هویت بصری کارفرما",
    "کدنویسی و توسعه فرانت‌اند و بک‌اند وب‌سایت",
    ...(features ? [`ادغام امکانات درخواستی: ${val(features)}`] : []),
    "بهینه‌سازی اولیه موتورهای جستجو (SEO On-Page)",
    "تست سازگاری مرورگرها و ریسپانسیو بودن سایت",
    "تحویل فایل‌ها و آموزش مقدماتی مدیریت سایت",
  ];

  const sigArea = (img, label) =>
    img ? `<img src="${img}" alt="">` : `<span>${label}</span>`;

  return `<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8"><style>${CSS}</style></head><body>

<p class="bismillah">بسمه تعالی</p>
<div class="title">قرارداد طراحی وب‌سایت</div>
<div class="rule"></div>
<div class="meta"><span>شماره: <bdi>${esc(cNo)}</bdi></span><span>تاریخ: ${esc(date)}</span></div>

<h2>ماده ۱ – مشخصات طرفین قرارداد</h2>
<table>
  <thead><tr><th>مجری (طراح)</th><th>کارفرما</th></tr></thead>
  <tbody>
    <tr><td>آقای پارسا اسدزاده</td><td>${val(order.name)}</td></tr>
    <tr><td>طراح و توسعه‌دهنده وب</td><td>—</td></tr>
    <tr><td>اطلاعات تماس: محرمانه</td><td>${val(order.contact)}</td></tr>
  </tbody>
</table>
<p>این قرارداد فی‌مابین آقای پارسا اسدزاده (مجری) و ${val(order.name)} (کارفرما) با اراده‌ی آزاد و بدون اکراه، بر اساس مفاد این سند منعقد و لازم‌الاجرا می‌گردد.</p>

<h2>ماده ۲ – موضوع قرارداد</h2>
<p>${subject}</p>
${order.desc ? `<p>شرح تکمیلی: ${val(order.desc)}</p>` : ""}
${order.refUrl ? `<p class="muted">سایت مرجع: <bdi dir="ltr">${esc(order.refUrl)}</bdi></p>` : ""}

<h2>ماده ۳ – شرح خدمات</h2>
${li(services)}

<h2>ماده ۴ – زمان‌بندی پروژه</h2>
<p>مهلت تحویل نهایی پروژه: ${val(order.deadline, "توافقی")}</p>
<p>در صورت تأخیر کارفرما در ارائه محتوا یا تأیید مراحل، زمان‌بندی به همان میزان به تعویق می‌افتد.</p>

<h2>ماده ۵ – مبلغ قرارداد و نحوه پرداخت</h2>
<p>مبلغ کل قرارداد: <b>${fa(price)} تومان</b></p>
<table>
  <thead><tr><th>مرحله</th><th>درصد</th><th>مبلغ (تومان)</th><th>زمان پرداخت</th></tr></thead>
  <tbody>
    <tr><td>پیش‌پرداخت</td><td>۵۰٪</td><td class="num">${fa(p1)}</td><td>هنگام امضای قرارداد</td></tr>
    <tr><td>مرحله دوم</td><td>۳۰٪</td><td class="num">${fa(p2)}</td><td>پس از تأیید طراحی</td></tr>
    <tr><td>تسویه نهایی</td><td>۲۰٪</td><td class="num">${fa(p3)}</td><td>پس از تحویل نهایی</td></tr>
  </tbody>
</table>

<h2>ماده ۶ – حقوق مالکیت معنوی</h2>
<p>کلیه حقوق مالکیت معنوی پس از تسویه کامل مبلغ به کارفرما منتقل می‌گردد. مجری حق نمایش نمونه‌کار بدون افشای اطلاعات محرمانه را دارد.</p>

<h2>ماده ۷ – تعهدات طرفین</h2>
<p class="sub">تعهدات مجری:</p>
${li([
  "انجام خدمات با کیفیت مطلوب و استانداردهای روز",
  "رعایت زمان‌بندی و ارائه گزارش پیشرفت در مراحل کلیدی",
  "حفظ محرمانگی کامل اطلاعات کارفرما",
])}
<p class="sub">تعهدات کارفرما:</p>
${li([
  "ارائه به‌موقع محتوا، تصاویر و اطلاعات مورد نیاز",
  "پرداخت اقساط در موعد مقرر",
  "ارائه بازخورد حداکثر ظرف ۷ روز کاری",
])}

<h2>ماده ۸ – ضمانت و پشتیبانی</h2>
<p>مجری متعهد است پس از تحویل نهایی، ۳ ماه پشتیبانی رایگان شامل رفع اشکالات فنی ارائه نماید. تغییرات محتوایی و توسعه امکانات جدید مشمول هزینه جداگانه است.</p>

<h2>ماده ۹ – شرایط فسخ قرارداد</h2>
<p>فسخ قرارداد مستلزم اطلاع‌رسانی کتبی حداقل ۱۰ روز قبل است. هزینه‌های انجام‌شده تا زمان فسخ بر اساس توافق طرفین تسویه می‌گردد.</p>

<h2>ماده ۱۰ – حل اختلاف و قانون حاکم</h2>
<p>اختلافات ابتدا از طریق مذاکره، سپس داوری و در نهایت مراجع قضایی جمهوری اسلامی ایران حل‌وفصل می‌شود.</p>

<h2>ماده ۱۱ – سایر شرایط</h2>
<p>این قرارداد در ۲ نسخه با اعتبار یکسان تنظیم شده است. هرگونه اصلاح باید به صورت کتبی و با امضای هر دو طرف صورت پذیرد.</p>

<!-- ═════════ صفحه امضا ═════════ -->
<section class="sig-page">
  <div class="sig-head"><div class="t1">صفحه امضا</div><div class="t2">قرارداد طراحی وب‌سایت</div></div>

  <div class="infobar">
    <span>شماره قرارداد: <bdi>${esc(cNo)}</bdi></span>
    <span>تاریخ: ${esc(date)}</span>
    <span>مبلغ: ${fa(price)} تومان</span>
  </div>

  <p class="center">این قرارداد با علم و آگاهی کامل از مفاد آن به صورت رسمی تنظیم شده</p>
  <p class="center">و با امضای طرفین لازم‌الاجرا می‌گردد.</p>

  <div class="sigs">
    <div class="sigbox">
      <div class="hd">امضای مجری</div>
      <div class="nm">آقای پارسا اسدزاده</div>
      <div class="rl">طراح و توسعه‌دهنده وب</div>
      <div class="area">${sigArea(execSig, "محل امضا")}</div>
      <div class="dt">تاریخ: ${esc(date)}</div>
    </div>
    <div class="sigbox">
      <div class="hd">امضای کارفرما</div>
      <div class="nm">${val(order.name, "کارفرما")}</div>
      <div class="rl"></div>
      <div class="area">${sigArea(clientSig, "محل امضای دیجیتال")}</div>
      <div class="dt">تاریخ:${clientSig ? " " + esc(date) : ""}</div>
    </div>
  </div>

  <div class="trace">
    <div class="a">کد رهگیری قرارداد: <bdi>${esc(cNo)}</bdi> | تاریخ صدور: ${esc(date)}</div>
    <div class="b">این قرارداد به صورت الکترونیکی صادر شده و اعتبار قانونی دارد.</div>
  </div>
</section>

</body></html>`;
}

// ── پیدا کردن Chrome/Edge نصب‌شده روی سیستم (بدون دانلود چیزی) ──
function findBrowser() {
  const env = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (env && fs.existsSync(env)) return env;
  const pf = process.env["PROGRAMFILES"] || "C:\\Program Files";
  const pf86 = process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)";
  const local = process.env["LOCALAPPDATA"] || "";
  const candidates = [
    // ویندوز
    `${pf}\\Google\\Chrome\\Application\\chrome.exe`,
    `${pf86}\\Google\\Chrome\\Application\\chrome.exe`,
    `${local}\\Google\\Chrome\\Application\\chrome.exe`,
    `${pf86}\\Microsoft\\Edge\\Application\\msedge.exe`,
    `${pf}\\Microsoft\\Edge\\Application\\msedge.exe`,
    // لینوکس
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium", "/usr/bin/chromium-browser", "/snap/bin/chromium",
    // مک
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
  const found = candidates.find((c) => c && fs.existsSync(c));
  if (!found) {
    throw new Error("Chrome یا Edge پیدا نشد. یکی را نصب کنید یا مسیرش را در .env با PUPPETEER_EXECUTABLE_PATH بدهید.");
  }
  return found;
}

// ── مرورگر مشترک (یک‌بار باز می‌شود، برای همه درخواست‌ها استفاده می‌شود) ──
let browserPromise = null;
function getBrowser() {
  if (!browserPromise) {
    browserPromise = import("puppeteer-core")
      .then((m) => (m.default || m).launch({
        headless: true,
        executablePath: findBrowser(),
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      }))
      .then((b) => {
        b.on("disconnected", () => { browserPromise = null; });
        return b;
      })
      .catch((e) => { browserPromise = null; throw e; });
  }
  return browserPromise;
}

async function closeBrowser() {
  if (!browserPromise) return;
  try { (await browserPromise).close(); } catch (_) { /* ignore */ }
  browserPromise = null;
}
process.once("exit", () => { closeBrowser(); });

// ── تابع اصلی (امضا و خروجی مثل قبل: bytes) ─────────────────────
async function generateContractPDF(order, contractorSignature = null) {
  const html = buildHTML(order, contractorSignature);
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    // امنیت: جاوااسکریپت خاموش، و هیچ درخواست شبکه‌ای (جز data:) مجاز نیست
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const u = req.url();
      if (u.startsWith("data:") || u === "about:blank") req.continue();
      else req.abort();
    });

    await page.setContent(html, { waitUntil: "load" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    return pdf; // Uint8Array/Buffer
  } finally {
    await page.close().catch(() => {});
  }
}

module.exports = { generateContractPDF, closeBrowser };

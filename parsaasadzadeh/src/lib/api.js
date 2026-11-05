// تنها نقطه تعریف آدرس API — مقدار از متغیر محیطی خوانده می‌شود
// در .env.local مقدار NEXT_PUBLIC_API_URL را تنظیم کنید (مثلاً http://localhost:5000/api)
const raw = process.env.NEXT_PUBLIC_API_URL;

if (!raw && process.env.NODE_ENV !== "production") {
  console.warn("NEXT_PUBLIC_API_URL تنظیم نشده است. فایل .env.local را بررسی کنید.");
}

// اسلش انتهایی حذف می‌شود تا آدرس‌ها دوبار // نشوند
export const API_BASE = (raw || "").replace(/\/+$/, "");

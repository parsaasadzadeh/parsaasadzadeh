const mongoose = require("mongoose");

// ✅ امضای مجری (پارسا) — چون همیشه یک نفره، فقط یک رکورد (singleton) ذخیره می‌شه
// و برای تمام قراردادها دوباره استفاده می‌شه، نه اینکه هر بار دوباره امضا کنه.
const adminSignatureSchema = new mongoose.Schema({
  signature:       { type: String, default: null }, // امضای ذخیره‌شده (base64 PNG)

  // توکن لینک امضا (برای باز کردن صفحه‌ی امضا با گوشی یا هر دستگاه دیگه)
  signToken:       { type: String, default: null },
  signTokenExpiry: { type: Date,   default: null },
}, { timestamps: true });

module.exports = mongoose.model("AdminSignature", adminSignatureSchema);
const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
// ✅ FIX: حذف import اضافی crypto که استفاده نمی‌شد
const {
  getAllOrders,
  updatePrice,
  approveAndGenerateContract,
  downloadContract,
  generateSignLink,
  getOrderByToken,
  submitClientSignature,
  // ✅ امضای مجری (پارسا)
  getMySignatureStatus,
  generateMySignLink,
  getMySignatureByToken,
  submitMySignature,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// ── لاگین ──────────────────────────────────────────────
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "رمز اشتباه است" });
  }
  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.status(200).json({ message: "خوش آمدید پارسا!", token });
});

// ── روت‌های ادمین (نیاز به توکن) ──────────────────────
router.get("/orders",                       authMiddleware, getAllOrders);
router.put("/orders/:id/price",             authMiddleware, updatePrice);
router.post("/orders/:id/approve",          authMiddleware, approveAndGenerateContract);
router.get("/orders/:id/download-contract", authMiddleware, downloadContract);
router.post("/orders/:id/generate-link",    authMiddleware, generateSignLink);

// ── روت‌های عمومی امضا (بدون توکن — برای کارفرما) ────
router.get("/sign/:token",  getOrderByToken);
router.post("/sign/:token", submitClientSignature);

// ── امضای مجری (پارسا) — نیاز به لاگین ادمین ──────────
router.get("/my-signature",                authMiddleware, getMySignatureStatus);
router.post("/my-signature/generate-link", authMiddleware, generateMySignLink);

// ── روت‌های عمومی صفحه‌ی امضای مجری (با توکن لینک) ────
router.get("/my-signature/sign/:token",  getMySignatureByToken);
router.post("/my-signature/sign/:token", submitMySignature);

module.exports = router;
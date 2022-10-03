const express = require("express");
const authRoutes = require("../controllers/auth");

const router = express.Router();

router.post("/login", authRoutes.postLogin);
router.post("/register", authRoutes.postRegister);
router.post("/logout", authRoutes.postLogout);

module.exports = router;

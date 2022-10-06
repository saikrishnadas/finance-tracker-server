const express = require("express");
const authRoutes = require("../controllers/auth");
const { body } = require("express-validator/check");

const router = express.Router();

router.post(
	"/login",
	[
		body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
		body(
			"password",
			"Incorrect password! Password must be more than 7 characters"
		)
			.isLength({ min: 8 })
			.isLength({ max: 24 })
			.trim(),
	],
	authRoutes.postLogin
);
router.post(
	"/register",
	[
		body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
		body("password", "Enter a password with more than 7 characters!")
			.isLength({ min: 8 })
			.isLength({ max: 24 })
			.trim(),
		body("confirmPassword")
			.trim()
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error("Passwords doesn't match!");
				}
			}),
	],
	authRoutes.postRegister
);
router.post("/logout", authRoutes.postLogout);

module.exports = router;

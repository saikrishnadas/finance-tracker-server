const express = require("express");
const userRoutes = require("../controllers/user");
const { body } = require("express-validator/check");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/budget", isAuth, userRoutes.GetBudget);

router.post(
	"/budget",
	[
		body("budget")
			.isNumeric()
			.isLength({ min: 1, max: 10 })
			.withMessage("Budget must be a number")
			.trim(),
	],
	isAuth,
	userRoutes.AddBudget
);

router.post("/profile", isAuth, userRoutes.UploadProfile);

module.exports = router;

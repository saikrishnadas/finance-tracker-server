const express = require("express");
const userRoutes = require("../controllers/user");
const { body } = require("express-validator/check");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/categories", isAuth, userRoutes.GetCategories);

router.post(
	"/categories",
	[
		body("title")
			.isString()
			.isLength({ min: 4, max: 18 })
			.withMessage(
				"Category name must not be a number or special character, should have 4 - 18 max characters"
			)
			.trim(),
		body("color").isString().withMessage("Invalid color").trim(),
	],
	isAuth,
	userRoutes.AddCategory
);

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

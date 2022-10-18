const express = require("express");
const userRoutes = require("../controllers/user");
const { body } = require("express-validator/check");

const router = express.Router();

router.get("/categories", userRoutes.GetCategories);

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
	userRoutes.AddCategory
);

router.get("/budget", userRoutes.GetBudget);

router.post(
	"/budget",
	[
		body("budget")
			.isNumeric()
			.isLength({ min: 1, max: 10 })
			.withMessage("Budget must be a number")
			.trim(),
	],
	userRoutes.AddBudget
);

router.post("/profile", userRoutes.UploadProfile);

module.exports = router;

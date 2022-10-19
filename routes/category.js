const express = require("express");
const categoryRoutes = require("../controllers/category");
const { body } = require("express-validator/check");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/categories", isAuth, categoryRoutes.GetCategories);

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
	categoryRoutes.AddCategory
);

router.delete("/categories", isAuth, categoryRoutes.DeleteCategory);

router.get("/metrics", isAuth, categoryRoutes.GetCategoryMetrics);

module.exports = router;

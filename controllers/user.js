const Category = require("../models/category");
const { validationResult } = require("express-validator/check");

exports.AddCategory = (req, res, next) => {
	const title = req.body.title;
	const color = req.body.color;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array()[0].msg });
	}

	Category.findOne({ title: title })
		.then((category) => {
			if (category) {
				return res.status(403).json({ error: "Category already exsist" });
			}
			const newCategory = new Category({
				title: title,
				color: color,
			});
			return newCategory
				.save()
				.then((result) => {
					return res.send("Category Created");
				})
				.catch((err) => {
					throw new Error(err);
				});
		})
		.catch((err) => {
			throw new Error(err);
		});
};

exports.GetCategories = (req, res, next) => {
	Category.find({})
		.then((categories) => {
			return res.send(categories);
		})
		.catch((err) => {
			throw new Error(err);
		});
};

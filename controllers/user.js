const Detail = require("../models/detail");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");

exports.AddCategory = (req, res, next) => {
	const title = req.body.title;
	const color = req.body.color;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array()[0].msg });
	}

	Detail.findOne({ userId: "634555e7ada8608d56a05ed0" })
		.then((user) => {
			if (user) {
				Detail.updateOne(
					{ userId: "634555e7ada8608d56a05ed0" },
					{
						$set: {
							categories: [...user.categories, { title: title, color: color }],
						},
					}
				)
					.then((result) => {
						return res.send("Category Added!");
					})
					.catch((err) => {
						throw new Error(err);
					});
			} else {
				return res.status(403).json({ error: "User does not exsist" });
			}
		})
		.catch((err) => {
			throw new Error(err);
		});
};

exports.GetCategories = (req, res, next) => {
	Detail.find({ userId: "634555e7ada8608d56a05ed0" })
		.then((user) => {
			let categories = user[0].categories;
			return res.send(categories);
		})
		.catch((err) => {
			throw new Error(err);
		});
};

exports.AddBudget = (req, res, next) => {
	const budget = req.body.budget;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array()[0].msg });
	}

	Detail.findOne({ userId: "634555e7ada8608d56a05ed0" })
		.then((user) => {
			if (user) {
				Detail.updateOne(
					{ userId: "634555e7ada8608d56a05ed0" },
					{
						$set: {
							budget: budget,
						},
					}
				)
					.then((result) => {
						return res.send("Budget Updated!");
					})
					.catch((err) => {
						throw new Error(err);
					});
			} else {
				return res.status(403).json({ error: "User does not exsist" });
			}
		})
		.catch((err) => {
			throw new Error(err);
		});
};

exports.GetBudget = (req, res, next) => {
	Detail.find({ userId: "634555e7ada8608d56a05ed0" })
		.then((user) => {
			let budget = user[0].budget;
			return res.send({ budget: budget });
		})
		.catch((err) => {
			throw new Error(err);
		});
};

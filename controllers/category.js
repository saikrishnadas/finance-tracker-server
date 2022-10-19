const Category = require("../models/category");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const mongoose = require("mongoose");

exports.AddCategory = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation failed, Entered data is incorrect.");
		error.statusCode = 422;
		throw error;
	}
	const title = req.body.title;
	const color = req.body.color;
	const type = req.body.type;
	let userId = req.userId;

	const category = new Category({
		userId: req.userId,
		categories: { title: title, color: color, type: type },
	});

	category
		.save()
		.then((result) => {
			return User.findById(req.userId).then((user) => {
				console.log("user==>", user);
				userId = user;
				user.categories.push(category);
				return user.save().then((result) => {
					res.status(201).json({
						message: "Category created successfully!",
						category: category,
						userId: { _id: user._id },
					});
				});
			});
		})

		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.GetCategories = (req, res, next) => {
	Category.find({ userId: req.userId })
		.then((user) => {
			let categories = user;
			return res.send(categories);
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.DeleteCategory = (req, res, next) => {
	const categoryId = req.body.categoryId;
	Category.findByIdAndDelete(categoryId)
		.then((result) => {
			return res.status(200).json({ message: "Category deleted!" });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.GetCategoryMetrics = (req, res, next) => {
	let filteredArray;
	Category.find({ userId: req.userId }).then((categories) => {
		Transaction.find({ userId: req.userId }).then((transactions) => {
			filteredArray = transactions.filter((value) => {
				return value.transactions.category == categories.categories.title;
			});
		});
	});
	return res.status(200).json({ allCategories: filteredArray });
};

const Category = require("../models/category");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const mongoose = require("mongoose");

exports.AddCategory = async (req, res, next) => {
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
	try {
		await category.save();
		let user = await User.findById(req.userId);
		user.categories.push(category);
		await user.save();
		res.status(201).json({
			message: "Category created successfully!",
			category: category,
			userId: { _id: user._id },
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.GetCategories = async (req, res, next) => {
	try {
		const categories = await Category.find({ userId: req.userId });
		res.status(200).json({ categories: categories });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.DeleteCategory = async (req, res, next) => {
	const categoryId = req.body.categoryId;
	try {
		await Category.findByIdAndDelete(categoryId);
		res.status(200).json({ message: "Category deleted!" });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.GetCategoryMetrics = async (req, res, next) => {
	try {
		let filteredArray;
		const categories = await Category.find({ userId: req.userId });
		const transactions = await Transaction.find({ userId: req.userId });
		filteredArray = await transactions.filter((value) => {
			return value.transactions.category == categories.categories.title;
		});
		res.status(200).json({ allCategories: filteredArray });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.Test = (req, res, next) => {
	return res.status(200).json({ data: "This is sai" });
};

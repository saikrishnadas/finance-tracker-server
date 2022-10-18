const Category = require("../models/category");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const mongoose = require("mongoose");

exports.AddBudget = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation failed, Entered data is incorrect.");
		error.statusCode = 422;
		throw error;
	}
	const budget = req.body.budget;
	User.findByIdAndUpdate(req.userId, { budget: budget })
		.then((user) => {
			return res
				.status(200)
				.json({ message: "Budget Updated!", budget: budget });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.GetBudget = (req, res, next) => {
	User.findById(req.userId)
		.then((user) => {
			console.log(user);
			let budget = user.budget;
			return res.status(200).send({ budget: budget });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.UploadProfile = (req, res, next) => {
	if (!req.file) {
		const error = new Error("No image provided.");
		error.statusCode = 422;
		throw error;
	}
	let update = { profile: req.file.path };
	Detail.findOneAndUpdate({ userId: "634555e7ada8608d56a05ed0", update })
		.then((user) => {
			return res.status(200).json({ message: "Successfully updated profile." });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

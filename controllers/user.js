const Category = require("../models/category");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");

exports.AddCategory = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation failed, Entered data is incorrect.");
		error.statusCode = 422;
		throw error;
	}
	const title = req.body.title;
	const color = req.body.color;
	let userId = req.userId;

	const category = new Category({
		userId: req.userId,
		categories: { title: title, color: color },
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
			console.log(user);
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

exports.AddBudget = (req, res, next) => {
	const budget = req.body.budget;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation failed, Entered data is incorrect.");
		error.statusCode = 422;
		throw error;
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
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.GetBudget = (req, res, next) => {
	Detail.find({ userId: "634555e7ada8608d56a05ed0" })
		.then((user) => {
			let budget = user[0].budget;
			return res.send({ budget: budget });
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

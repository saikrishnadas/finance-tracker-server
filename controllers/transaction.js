const Transaction = require("../models/transaction");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const mongoose = require("mongoose");

exports.AddTransaction = (req, res, next) => {
	// const errors = validationResult(req);
	// if (!errors.isEmpty()) {
	// 	const error = new Error("Validation failed, Entered data is incorrect.");
	// 	error.statusCode = 422;
	// 	throw error;
	// }
	const amount = req.body.amount;
	const category = req.body.category;
	const date = req.body.date;
	const note = req.body.note;
	let userId = req.userId;

	const transaction = new Transaction({
		userId: req.userId,
		transactions: {
			amount: amount,
			category: category,
			date: {
				day: +date.day,
				month: +date.month,
				year: +date.month,
				date: date.date,
			},
			note: note,
		},
	});

	transaction
		.save()
		.then((result) => {
			return User.findById(req.userId).then((user) => {
				userId = user;
				user.transactions.push(transaction);
				return user.save().then((result) => {
					res.status(201).json({
						message: "Transaction created successfully!",
						transaction: transaction,
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

exports.GetTransactions = (req, res, next) => {
	Transaction.find({
		userId: req.userId,
	})
		.then((user) => {
			let transactions = user;
			return res.status(200).json({ transactions: transactions });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.DeleteTransaction = (req, res, next) => {
	const transactionId = req.body.transactionId;
	Transaction.findByIdAndDelete(transactionId)
		.then((result) => {
			return res.status(200).json({ message: "Transaction deleted!" });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

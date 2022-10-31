const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const Detail = require("../models/category");
const jwt = require("jsonwebtoken");

exports.postRegister = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	const errors = validationResult(req);
	// if (!errors.isEmpty()) {
	// 	return res.status(422).json({ error: errors.array()[0].msg });
	// }

	User.findOne({ email: email }).then((userDoc) => {
		if (userDoc) {
			return res.status(403).json({ error: "User already exsist" });
		}
		if (password === confirmPassword) {
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						email: email,
						password: hashedPassword,
						budget: 0,
					});
					return user
						.save()
						.then((user) => {
							const token = jwt.sign(
								{ email: user.email, userId: user._id },
								process.env.SESSION_SECRET,
								{
									expiresIn: "3d",
								}
							);
							return res.status(200).json({
								token: token,
								userId: user._id.toString(),
								email: email,
							});
						})
						.catch((err) => {
							throw new Error(err);
						});
				})
				.catch((err) => {
					throw new Error(err);
				});
		} else {
			return res.status(403).json({ error: "passwords does not match!" });
		}
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array()[0].msg });
	}

	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "User does not exist!" });
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						const token = jwt.sign(
							{ email: email, userId: user._id },
							process.env.SESSION_SECRET,
							{
								expiresIn: "3d",
							}
						);
						return res.status(200).json({
							token: token,
							userId: user._id.toString(),
							email: email,
						});
					}
					return res.status(401).json({ error: "Invalid Password!" });
				})
				.catch((err) => {
					throw new Error(err);
				});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			next(error);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		if (!err) {
			return res.send("user logged out!");
		}
		throw new Error(err);
	});
};

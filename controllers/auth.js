const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");
// const nodemailer = require("nodemailer");
// const sendGridTransport = require("nodemailer-sendgrid-transport");

// const transporter = nodemailer.createTransport(sendGridTransport({
// 	auth:{
// 		api_key:""
// 	}
// }))

exports.postRegister = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array()[0].msg });
	}

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
					});
					return user
						.save()
						.then((result) => {
							return res.send("User created!");
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
				return res.status(403).json({ error: "User does not exist!" });
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(() => {
							console.log(req.session);
							console.log(user);
							return res.send(req.session.isLoggedIn);
						});
					}
					return res.status(403).json({ error: "Invalid Password!" });
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

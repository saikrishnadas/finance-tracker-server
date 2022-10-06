const bcrypt = require("bcryptjs");
const User = require("../models/user");
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
						.catch((err) => console.log(err));
				})
				.catch((err) => console.log(err));
		} else {
			return res.status(403).json({ error: "passwords does not match!" });
		}
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
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
					return res.status(403).json({ error: "Passwords doesn't match!" });
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.send("user logged out!");
	});
};

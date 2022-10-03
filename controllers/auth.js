const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.postRegister = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	User.findOne({ email: email }).then((userDoc) => {
		if (userDoc) {
			return res.send("User already exsist");
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
			res.send("passwords doest match!");
		}
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				return res.send("No user exsist!!");
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
					return res.send("Passwords doesn't match!");
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

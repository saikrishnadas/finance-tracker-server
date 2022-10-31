const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		const err = new Error("Not Authenticated");
		err.statusCode = 401;
		throw error;
	}
	const token = authHeader.split(" ")[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.SESSION_SECRET);
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}

	//if verification of jwt is failed, no decodedToken will be asigned, in that case,
	if (!decodedToken) {
		const err = new Error("Not Authenticated");
		err.statusCode = 401;
		throw error;
	}

	console.log("decodedToken ==>", decodedToken);
	req.userId = decodedToken.userId;
	next();
};

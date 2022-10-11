const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: "sessions",
});
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// setup route middlewares
const csrfProtection = csrf({ cookie: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false, //only change if the session changes and not all the time when initialized
		saveUninitialized: false,
		store: store,
	})
);

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

//send csrf token
app.get("/getCsrf", csrfProtection, (req, res, next) => {
	res.send({ csrfToken: req.csrfToken() });
});

app.post("/testCsrf", csrfProtection, function (req, res) {
	res.send("data is being processed");
});

app.use(csrfProtection, authRoutes);
app.use(csrfProtection, userRoutes);

app.use((error, req, res, next) => {
	res.status(500).json({ error: "Error Occured! Please try after sometime" });
});

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => {
		res
			.status(500)
			.json({ error: "Failed to connect to database, Please try again later" });
	});

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const multer = require("multer");

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + "-" + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// setup route middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

//Setting CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*"); //Allows all ('*') origins - change '*' to domain name to allow specfic origins
	res.setHeader("Access-Control-Allow-MethodS", "GET,POST,PUT,PATCH,DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
	next();
});

app.use(authRoutes);
app.use(userRoutes);

app.use((error, req, res, next) => {
	const status = error.statusCode || 500;
	const message = error.message;
	res.status(status).json({ message: message });
});

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		app.listen(8080);
	})
	.catch((err) => {
		res
			.status(500)
			.json({ error: "Failed to connect to database, Please try again later" });
	});

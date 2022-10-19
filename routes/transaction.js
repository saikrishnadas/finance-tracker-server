const express = require("express");
const transactionRoutes = require("../controllers/transaction");
const { body } = require("express-validator/check");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/transaction", isAuth, transactionRoutes.GetTransactions);

router.post(
	"/transaction",
	// [
	// 	body("budget")
	// 		.isNumeric()
	// 		.isLength({ min: 1, max: 10 })
	// 		.withMessage("Budget must be a number")
	// 		.trim(),
	// ],
	isAuth,
	transactionRoutes.AddTransaction
);

router.delete("/transaction", isAuth, transactionRoutes.DeleteTransaction);

module.exports = router;

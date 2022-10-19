const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		transactions: {
			amount: {
				type: Number,
				required: true,
			},
			category: {
				type: String,
				required: true,
			},
			date: {
				day: {
					type: Number,
					required: true,
				},
				month: {
					type: Number,
					required: true,
				},
				year: {
					type: Number,
					required: true,
				},
				date: {
					type: String,
					required: true,
				},
			},
			note: { type: String, required: true },
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);

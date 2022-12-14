const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		budget: {
			type: Number,
			require: true,
		},
		profile: {
			type: String,
			required: false,
		},
		categories: [
			{
				type: Schema.Types.ObjectId,
				ref: "Category",
			},
		],
		transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

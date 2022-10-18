const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const detailSchema = new Schema(
	{
		userId: { type: String, required: true },
		categories: [
			{
				title: {
					type: String,
					required: true,
				},
				color: {
					type: String,
					required: true,
				},
			},
		],
		budget: {
			type: Number,
			require: false,
		},
		profile: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Detail", detailSchema);

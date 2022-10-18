const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		categories: {
			title: {
				type: String,
				required: true,
			},
			color: {
				type: String,
				required: true,
			},
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);

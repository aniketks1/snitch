import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		price: {
			amount: {
				type: Number,
				required: true,
			},
			currency: {
				type: String,
				required: true,
				enum: ["USD", "EUR", "GBP", "INR", "JPY"],
				default: "INR",
			},
		},
		images: [
			{
				url: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true },
);

export default mongoose.model("Product", productSchema);

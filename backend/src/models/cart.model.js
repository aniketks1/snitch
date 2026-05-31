import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	items: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			variants: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product.variants",
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
				default: 1,
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
		},
	],
});

export default mongoose.model("Cart", cartSchema);

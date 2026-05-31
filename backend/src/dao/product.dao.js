import porductModel from "../models/porduct.model.js";

export const stockOfVariant = async (productId, variantId) => {
	const product = await porductModel.findOne({
		_id: productId,
		"variants._id": variantId,
	});

	if (!product) return 0;
	const variant = product.variants.find((variant) => variant._id.toString() == variantId);
	return variant ? (variant.stock ?? 0) : 0;
};

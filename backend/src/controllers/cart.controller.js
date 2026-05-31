import cartModel from "../models/cart.model.js";
import porductModel from "../models/porduct.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

export const addToCart = async (req, res, next) => {
	const { productId, variantId } = req.params;
	const quantity = Number(req.body.quantity) || 1;

	const isBaseProduct = productId === variantId;

	const product = await porductModel.findOne(
		isBaseProduct
			? { _id: productId }
			: { _id: productId, "variants._id": variantId }
	);

	if (!product)
		return res.status(404).json({
			success: false,
			message: "Product not found",
		});

	const cart = (await cartModel.findOne({ user: req.user._id })) || (await cartModel.create({ user: req.user._id }));

	const isProductAlreadyInCart = cart.items.some(
		(item) => item.product.toString() === productId && item.variants?.toString() === variantId,
	);

	if (isProductAlreadyInCart) {
		const stock = (isBaseProduct ? 9999 : await stockOfVariant(productId, variantId)) ?? 0;
		const quantityInCart = cart.items.find(
			(item) => item.product.toString() === productId && item.variants?.toString() === variantId,
		).quantity;

		if (quantityInCart + quantity <= 0) {
			const updatedCart = await cartModel.findOneAndUpdate(
				{ user: req.user._id },
				{ $pull: { items: { product: productId, variants: variantId } } },
				{ new: true }
			).populate("items.product");

			return res.status(200).json({
				success: true,
				message: "Item removed from cart successfully",
				cart: updatedCart,
			});
		}

		if (quantityInCart + quantity > stock) {
			return res.status(400).json({
				success: false,
				message: `You already have ${quantityInCart} of this variant in your cart. Maximum available is ${stock}.`,
			});
		}

		const updatedCart = await cartModel.findOneAndUpdate(
			{ user: req.user._id, "items.product": productId, "items.variants": variantId },
			{ $inc: { "items.$.quantity": quantity } },
			{ new: true },
		).populate("items.product");

		return res.status(200).json({
			success: true,
			message: "Product added to cart successfully",
			cart: updatedCart,
		});
	}

	const stock = (isBaseProduct ? 9999 : await stockOfVariant(productId, variantId)) ?? 0;
	if (quantity > stock) {
		return res.status(400).json({
			success: false,
			message: `Maximum available is ${stock}.`,
		});
	}

	const price = isBaseProduct
		? product.price
		: product.variants.find((v) => v._id.toString() === variantId)?.price || product.price;

	cart.items.push({
		product: productId,
		variants: variantId,
		quantity,
		price,
	});

	await cart.save();
	await cart.populate("items.product");

	return res.status(200).json({
		success: true,
		message: "Product added to cart successfully",
		cart,
	});
};

export const getCart = async (req, res, next) => {
	const cart = await cartModel.findOne({ user: req.user._id }).populate("items.product");

	if (!cart)
		return res.status(404).json({
			success: false,
			message: "Cart not found",
		});

	return res.status(200).json({
		success: true,
		message: "Cart fetched successfully",
		cart,
	});
};

import porductModel from "../models/porduct.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res, _next) => {
	// Authorize seller
	const seller = req.user;
	if (seller.role !== "seller")
		return res.status(403).json({
			success: false,
			message: "Unauthorized",
		});

	const { title, description, priceAmount, priceCurrency, variants } = req.body;

	// --- Upload product-level images ---
	const productFiles = req.files?.["images"];

	if (!productFiles || productFiles.length === 0) {
		return res.status(400).json({
			success: false,
			message: "Images are required",
		});
	}

	const images = await Promise.all(
		productFiles.map(async (file) => {
			return await uploadFile({
				buffer: file.buffer,
				fileName: file.originalname,
			});
		}),
	);

	// --- Build variants (if provided) ---
	let parsedVariants = [];
	if (variants) {
		const variantList = typeof variants === "string" ? JSON.parse(variants) : variants;

		parsedVariants = await Promise.all(
			variantList.map(async (variant, index) => {
				// Upload variant-specific images (field: variantImages_0, variantImages_1, …)
				const variantFiles = req.files?.[`variantImages_${index}`];

				const variantImages = variantFiles?.length
					? await Promise.all(
							variantFiles.map(async (file) => {
								return await uploadFile({
									buffer: file.buffer,
									fileName: file.originalname,
								});
							}),
						)
					: [];

				return {
					images: variantImages.map((i) => ({ url: i.url })),
					stock: Number(variant.stock) || 0,
					attributes: variant.attributes || {},
					price: {
						amount: Number(variant.priceAmount),
						currency: variant.priceCurrency || priceCurrency || "INR",
					},
				};
			}),
		);
	}

	const product = await porductModel.create({
		title,
		description,
		price: {
			amount: Number(priceAmount),
			currency: priceCurrency || "INR",
		},
		images: images.map((i) => ({ url: i.url })),
		variants: parsedVariants,
		seller: seller._id,
	});

	res.status(201).json({
		success: true,
		message: "Product created successfully",
		product,
	});
};

export const getSellerProducts = async (req, res, _next) => {
	const seller = req.user;
	if (seller.role !== "seller")
		return res.status(401).json({
			success: false,
			message: "Unauthorized",
		});

	const products = await porductModel.find({ seller: seller._id }).lean();

	res.status(200).json({
		success: true,
		message: "Products fetched successfully",
		products,
	});
};

export const getAllProducts = async (_req, res, _next) => {
	const products = await porductModel.find().lean();

	return res.status(200).json({
		success: true,
		message: "Products fetched successfully",
		products,
	});
};

export const getProductDetails = async (req, res, _next) => {
	const { productId } = req.params;
	const product = await porductModel.findById(productId).lean();

	if (!product)
		return res.status(404).json({
			success: false,
			message: "Product not found",
		});

	return res.status(200).json({
		success: true,
		message: "Product fetched successfully",
		product,
	});
};

export const updateProduct = async (req, res, _next) => {
	// Authorize seller
	const seller = req.user;
	if (seller.role !== "seller")
		return res.status(403).json({
			success: false,
			message: "Unauthorized",
		});

	const { productId } = req.params;

	const product = await porductModel.findById(productId);
	if (!product)
		return res.status(404).json({
			success: false,
			message: "Product not found",
		});

	// Only the product owner can edit
	if (product.seller.toString() !== seller._id.toString())
		return res.status(403).json({
			success: false,
			message: "You are not the owner of this product",
		});

	const { title, description, priceAmount, priceCurrency, variants, existingImages } = req.body;

	// --- Update basic fields (only if provided) ---
	if (title !== undefined) product.title = title;
	if (description !== undefined) product.description = description;
	if (priceAmount !== undefined) product.price.amount = Number(priceAmount);
	if (priceCurrency !== undefined) product.price.currency = priceCurrency;

	// --- Update product-level images ---
	// existingImages: JSON stringified array of image URLs the seller wants to KEEP
	// New uploads come via req.files["images"]
	const keptImages = existingImages
		? (typeof existingImages === "string" ? JSON.parse(existingImages) : existingImages).map((url) => ({ url }))
		: product.images; // if not provided, keep all existing

	const newProductFiles = req.files?.["images"];
	let uploadedImages = [];
	if (newProductFiles && newProductFiles.length > 0) {
		uploadedImages = await Promise.all(
			newProductFiles.map(async (file) => {
				return await uploadFile({
					buffer: file.buffer,
					fileName: file.originalname,
				});
			}),
		);
	}

	product.images = [...keptImages, ...uploadedImages.map((i) => ({ url: i.url }))];

	// --- Update variants ---
	// If variants field is sent, fully replace the variants array
	if (variants !== undefined) {
		const variantList = typeof variants === "string" ? JSON.parse(variants) : variants;

		if (!variantList || variantList.length === 0) {
			// Seller explicitly cleared all variants
			product.variants = [];
		} else {
			product.variants = await Promise.all(
				variantList.map(async (variant, index) => {
					// Existing variant images the seller wants to keep
					const existingVarImagesRaw = req.body[`existingVariantImages_${index}`];
					const keptVariantImages = existingVarImagesRaw
						? (typeof existingVarImagesRaw === "string" ? JSON.parse(existingVarImagesRaw) : existingVarImagesRaw).map((url) => ({ url }))
						: [];

					// Newly uploaded variant images
					const variantFiles = req.files?.[`variantImages_${index}`];
					let uploadedVariantImages = [];
					if (variantFiles && variantFiles.length > 0) {
						uploadedVariantImages = await Promise.all(
							variantFiles.map(async (file) => {
								return await uploadFile({
									buffer: file.buffer,
									fileName: file.originalname,
								});
							}),
						);
					}

					return {
						images: [...keptVariantImages, ...uploadedVariantImages.map((i) => ({ url: i.url }))],
						stock: Number(variant.stock) || 0,
						attributes: variant.attributes || {},
						price: {
							amount: Number(variant.priceAmount),
							currency: variant.priceCurrency || product.price.currency || "INR",
						},
					};
				}),
			);
		}
	}

	await product.save();

	res.status(200).json({
		success: true,
		message: "Product updated successfully",
		product,
	});
};

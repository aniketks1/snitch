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

	const { title, description, priceAmount, priceCurrency } = req.body;
	let images;

	console.log(req.files);

	if (!req.files || req.files.length === 0) {
		return res.status(400).json({
			success: false,
			message: "Images are required",
		});
	}

	images = await Promise.all(
		req.files?.map(async (file) => {
			return await uploadFile({
				buffer: file.buffer,
				fileName: file.originalname,
			});
		}),
	);

	const product = await porductModel.create({
		title,
		description,
		price: {
			amount: Number(priceAmount),
			currency: priceCurrency || "INR",
		},
		images: images?.map((i) => ({ url: i.url })),
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

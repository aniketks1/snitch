import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: errors.array()[0].msg,
			error: errors.array(),
		});
	}
	next();
}

export const validateCreateProduct = [
	body("title").trim().notEmpty().withMessage("Title is required"),
	body("description").trim().notEmpty().withMessage("Description is required"),
	body("priceAmount")
		.notEmpty()
		.withMessage("Price amount is required")
		.isNumeric()
		.withMessage("Price amount must be a number"),
	body("priceCurrency").trim().notEmpty().withMessage("Price currency is required"),
	validateRequest,
];

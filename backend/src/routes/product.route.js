import { Router } from "express";
import { createProduct, getSellerProducts } from "../controllers/product.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import multer from "multer";
import { validateCreateProduct } from "../validator/product.validator.js";

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024, files: 7 },
	fileFilter: (_req, file, cb) => {
		const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

		if (allowedFileTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type"));
		}
	},
});

const router = Router();

/**
 * @route POST /api/product/create
 * @description Create a new product
 * @access Private (Seller only)
 */
router.post("/create", authenticateUser, upload.array("images", 7), validateCreateProduct, createProduct);

/**
 * @route GET /api/product/:sellerId
 * @description Get Seller specific products
 * @access Private (Seller Only)
 */
router.get("/seller", authenticateUser, getSellerProducts);

/**
 * @route GET /api/product
 * @description Get Seller specific products
 * @access Private (Seller Only)
 */
// router.get("/public", getAllProducts);

export default router;

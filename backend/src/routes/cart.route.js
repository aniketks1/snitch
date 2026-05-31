import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const router = Router();

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add a item to cart
 * @access Private
 * @arguments productId - ID of the product to add to the cart
 * @arguments variantId - ID of the variant of the product to add to the cart
 * @arguments quantity - Quantity of the item to add (optional, default: 1)
 */
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart);
router.get("/", authenticateUser, getCart);

export default router;

import Razorpay from "razorpay";
import crypto from "crypto";
import cartModel from "../models/cart.model.js";
import config from "../config/config.js";

const razorpay = new Razorpay({
	key_id: config.RAZORPAY_KEY_ID,
	key_secret: config.RAZORPAY_KEY_SECRET,
});

// Step 1: Create a Razorpay order from user's cart
export const createOrder = async (req, res, next) => {
	try {
		console.log("[createOrder] user:", req.user?._id);
		const cart = await cartModel.findOne({ user: req.user._id }).populate("items.product");

		console.log("[createOrder] cart found:", !!cart, "| items count:", cart?.items?.length);

		if (!cart || cart.items.length === 0) {
			return res.status(400).json({ success: false, message: "Cart is empty" });
		}

		// Calculate total amount in paise (Razorpay uses smallest currency unit)
		const totalAmount = cart.items.reduce((acc, item) => {
			console.log("[createOrder] item price:", item.price, "qty:", item.quantity);
			return acc + item.price.amount * item.quantity * 100; // paise
		}, 0);

		console.log("[createOrder] totalAmount (paise):", totalAmount);

		const options = {
			amount: Math.round(totalAmount), // must be integer
			currency: "INR",
			receipt: `rcpt_${Date.now()}`,
		};

		const order = await razorpay.orders.create(options);
		console.log("[createOrder] Razorpay order created:", order.id);

		return res.status(200).json({
			success: true,
			order,
			key: config.RAZORPAY_KEY_ID, // send key to frontend
		});
	} catch (error) {
		console.error("[createOrder] ERROR:", error.message, error.statusCode || error.status || "");
		return res.status(500).json({
			success: false,
			message: error.error?.description || error.message || "Failed to create order",
		});
	}
};

// Step 2: Verify payment signature after Razorpay callback
export const verifyPayment = async (req, res, next) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

		const body = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSignature = crypto.createHmac("sha256", config.RAZORPAY_KEY_SECRET).update(body).digest("hex");

		if (expectedSignature !== razorpay_signature) {
			return res.status(400).json({ success: false, message: "Payment verification failed" });
		}

		// ✅ Payment is genuine — clear cart, create your Order record here
		await cartModel.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

		return res.status(200).json({
			success: true,
			message: "Payment verified successfully",
			paymentId: razorpay_payment_id,
		});
	} catch (error) {
		next(error);
	}
};

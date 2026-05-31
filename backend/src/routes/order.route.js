import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment } from "../controllers/order.controller.js";

const router = Router();

// POST /api/order/create  → creates Razorpay order from cart
router.post("/create", authenticateUser, createOrder);

// POST /api/order/verify  → verifies payment signature
router.post("/verify", authenticateUser, verifyPayment);

export default router;

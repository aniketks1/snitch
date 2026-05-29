import { Router } from "express";
import { loginUser, registerUser, googleCallback, getMe, logoutUser } from "../controllers/auth.controller.js";
import { validateLoginUser, validateRegisterUser } from "../validator/auth.validator.js";
import passport from "passport";
import config from "../config/config.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateRegisterUser, registerUser);
router.post("/login", validateLoginUser, loginUser);
router.get("/me", authenticateUser, getMe);
router.post("/logout", logoutUser);

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get(
	"/google/callback",
	passport.authenticate("google", { session: false, failureRedirect: `${config.FRONTEND_URL}/auth/login` }),
	googleCallback,
);

export default router;

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config/config.js";

/**
 * Routes Import
 */
import authRouter from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";

const app = express();

/**
 * Middlewares
 */
app.use(passport.initialize());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: config.FRONTEND_URL,
		methods: ["GET", "POST", "PUT", "DELETE"],
		// allowedHeaders: ["Content-Type", "Authorization"],
	}),
);		

passport.use(
	new GoogleStrategy(
		{
			clientID: config.GOOGLE_CLIENT_ID,
			clientSecret: config.GOOGLE_CLIENT_SECRET,
			callbackURL: config.GOOGLE_CLLBACK_URL,
			// scope: ["email", "profile"],
		},
		(_accessToken, _refreshToken, profile, done) => {
			return done(null, profile);
		},
	),
);

/**
 * Routes
 */
app.use("/api/auth", authRouter);
app.use("/api/product", productRoute);

app.get("/health", (req, res) => {
	res.status(200).json({
		success: true,
		status: "UP",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

app.use("*name", (req, res, next) => {
	res.status(404).json({
		error: "Not Found",
		message: `Cannot ${req.method} ${req.originalUrl}`,
	});
});

export default app;

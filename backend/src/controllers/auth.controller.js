import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

function sendTokenResponse(user, res) {
	const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: "7d" });
	res.cookie("token", token);
}

const registerUser = async (req, res) => {
	const { email, contact, password, fullName, isSeller } = req.body;

	try {
		const existingUser = await UserModel.findOne({ $or: [{ email }, { contact }] });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const user = await UserModel.create({
			email,
			contact,
			password,
			fullName,
			role: isSeller ? "seller" : "buyer",
		});

		sendTokenResponse(user, res);

		return res.status(201).json({
			success: true,
			message: "Registered successfully!",
			user: {
				id: user._id,
				email: user.email,
				contact: user.contact,
				fullName: user.fullName,
				role: user.role,
				profilePicture: user.profilePicture,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await UserModel.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		if (!user.comparePassword(password)) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		sendTokenResponse(user, res);

		return res.status(200).json({
			success: true,
			message: "Logged in successfully!",
			user: {
				id: user._id,
				email: user.email,
				contact: user.contact,
				fullName: user.fullName,
				role: user.role,
				profilePicture: user.profilePicture,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const logoutUser = async (req, res, next) => {
	res.clearCookie("token");
	return res.status(200).json({ success: true, message: "Logged out successfully!" });
};

const getMe = async (req, res, next) => {
	const user = req.user;
	return res.status(200).json({
		success: true,
		message: "User fetched successfully!",
		user: {
			id: user._id,
			email: user.email,
			contact: user.contact,
			fullName: user.fullName,
			role: user.role,
			profilePicture: user.profilePicture,
		},
	});
};

const googleCallback = async (req, res, next) => {
	const { id, displayName, emails, photos } = req.user;
	const email = emails[0].value;
	const photo = photos[0].value;

	let user = await UserModel.findOne({ email });

	if (!user) {
		user = await UserModel.create({
			email,
			fullName: displayName,
			role: "buyer",
			googleId: id,
			profilePicture: photo,
		});
	}

	sendTokenResponse(user, res);

	res.redirect(`${config.FRONTEND_URL}/dashboard`);
};

export { registerUser, loginUser, logoutUser, getMe, googleCallback };

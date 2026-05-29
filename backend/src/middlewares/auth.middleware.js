import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

const authenticateUser = async (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized access: No token provided",
		});
	}

	const { userId } = jwt.verify(token, config.JWT_SECRET);
	let user;

	try {
		user = await userModel.findById({ _id: userId }).select("-password").lean();
	} catch (error) {
		console.log(error.message, error.stack);
		next(error);
	}

	if (!user) {
		res.status(404).json({
			success: false,
			message: "Unauthorized access: No user found for this token",
		});
	}

	req.user = user;
	next();
};

export default authenticateUser;

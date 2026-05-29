import mongoose from "mongoose";
import config from "./config.js";

/**
 * Establishes a connection to the MongoDB database.
 * Listens to Mongoose connection events for robust logging.
 */
const connectDB = async () => {
	try {
		const mongoURI = config.MONGO_URI;

		if (!mongoURI) {
			console.error("CRITICAL: MONGODB_URI environment variable is not defined!");
			process.exit(1);
		}

		// Configure mongoose connection listeners
		mongoose.connection.on("connected", () => {
			console.log("MongoDB connection established successfully.");
		});

		mongoose.connection.on("error", (err) => {
			console.error("MongoDB connection error:", err);
		});

		mongoose.connection.on("disconnected", () => {
			console.warn("MongoDB connection disconnected.");
		});

		// Handle process termination to close database connection gracefully
		process.on("SIGINT", async () => {
			await mongoose.connection.close();
			console.log("MongoDB connection closed through app termination.");
			process.exit(0);
		});

		console.log("Connecting to MongoDB...");
		const conn = await mongoose.connect(mongoURI);

		console.log(`MongoDB Connected: ${conn.connection.host}`);
		return conn;
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);
		process.exit(1);
	}
};

export default connectDB;

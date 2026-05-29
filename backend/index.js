import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import config from "./src/config/config.js";

const PORT = config.PORT || 5000;

// Connect to Database
connectDB()
	.then(() => {
		console.log("Database connected.");
		// start server
		app.listen(PORT, () => {
			console.log("Server running on port", PORT);
		});
	})
	.catch((error) => {
		console.error("CRITICAL: Failed to initialize application:", error);
		process.exit(1);
	});

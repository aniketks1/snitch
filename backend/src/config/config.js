import "dotenv/config";

const requiredEnvVars = [
	"PORT",
	"MONGO_URI",
	"JWT_SECRET",
	"GOOGLE_CLIENT_ID",
	"GOOGLE_CLIENT_SECRET",
	"GOOGLE_CLLBACK_URL",
	"NODE_ENV",
	"FRONTEND_URL",
	"IMAGEKIT_PRIVATE",
	"IMAGEKIT_PUBLIC",
	"IMAGEKIT_ENDPOINT",
];

for (const variable of requiredEnvVars) {
	if (!process.env[variable]) {
		throw new Error(`Missing required environment variable: ${variable}`);
	}
}

const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	JWT_SECRET: process.env.JWT_SECRET,
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	GOOGLE_CLLBACK_URL: process.env.GOOGLE_CLLBACK_URL,
	FRONTEND_URL: process.env.FRONTEND_URL,
	NODE_ENV: process.env.NODE_ENV,
	IMAGEKIT_PRIVATE: process.env.IMAGEKIT_PRIVATE,
	IMAGEKIT_PUBLIC: process.env.IMAGEKIT_PUBLIC,
	IMAGEKIT_ENDPOINT: process.env.IMAGEKIT_ENDPOINT,
};

export default config;

import ImageKit from "@imagekit/nodejs";
import config from "../config/config.js";

const imageKitClient = new ImageKit({
	privateKey: config.IMAGEKIT_PRIVATE,
});

export async function uploadFile({ buffer, fileName, folder = "snitch" }) {
	const result = await imageKitClient.files.upload({
		file: await ImageKit.toFile(buffer),
		fileName,
		folder,
	});

	return result;
}

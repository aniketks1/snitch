import axios from "axios";

const productApiInstance = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/product`,
	withCredentials: true,
});

export const createProductApi = async ({
	title,
	description,
	priceAmount,
	priceCurrency,
	images,
	variants,
	variantImages,
}) => {
	try {
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("priceAmount", priceAmount);
		formData.append("priceCurrency", priceCurrency);

		if (images && images.length > 0) {
			images.forEach((image) => {
				formData.append("images", image);
			});
		}

		// Append variant metadata as JSON string
		if (variants && variants.length > 0) {
			formData.append("variants", JSON.stringify(variants));

			// Append variant images under indexed field names
			if (variantImages) {
				variants.forEach((_, index) => {
					const files = variantImages[index];
					if (files && files.length > 0) {
						files.forEach((file) => {
							formData.append(`variantImages_${index}`, file);
						});
					}
				});
			}
		}

		const response = await productApiInstance.post("/create", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getSellerProductsApi = async () => {
	try {
		const response = await productApiInstance.get("/seller");
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getAllProductsApi = async () => {
	try {
		const response = await productApiInstance.get("/");
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const getProductDetailsApi = async ({ productId }) => {
	try {
		const response = await productApiInstance.get(`/details/${productId}`);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const updateProductApi = async ({
	productId,
	title,
	description,
	priceAmount,
	priceCurrency,
	existingImages,
	newImages,
	variants,
	existingVariantImages,
	variantImages,
}) => {
	try {
		const formData = new FormData();
		if (title !== undefined) formData.append("title", title);
		if (description !== undefined) formData.append("description", description);
		if (priceAmount !== undefined) formData.append("priceAmount", priceAmount);
		if (priceCurrency !== undefined) formData.append("priceCurrency", priceCurrency);

		// Existing images the seller wants to keep (array of URLs)
		if (existingImages) {
			formData.append("existingImages", JSON.stringify(existingImages));
		}

		// Newly uploaded product images
		if (newImages && newImages.length > 0) {
			newImages.forEach((image) => {
				formData.append("images", image);
			});
		}

		// Variants metadata
		if (variants !== undefined) {
			formData.append("variants", JSON.stringify(variants));

			if (variants.length > 0) {
				// Existing variant images to keep per variant
				variants.forEach((_, index) => {
					const kept = existingVariantImages?.[index];
					if (kept && kept.length > 0) {
						formData.append(`existingVariantImages_${index}`, JSON.stringify(kept));
					}
				});

				// Newly uploaded variant images
				if (variantImages) {
					variants.forEach((_, index) => {
						const files = variantImages[index];
						if (files && files.length > 0) {
							files.forEach((file) => {
								formData.append(`variantImages_${index}`, file);
							});
						}
					});
				}
			}
		}

		const response = await productApiInstance.patch(`/update/${productId}`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

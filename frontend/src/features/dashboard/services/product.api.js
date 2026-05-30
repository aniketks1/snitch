import axios from "axios";

const productApiInstance = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/product`,
	withCredentials: true,
});

export const createProductApi = async ({ title, description, priceAmount, priceCurrency, images }) => {
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

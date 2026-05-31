import axios from "axios";

const cartApiInstance = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/cart`,
	withCredentials: true,
});

export const addToCartApi = async ({ productId, variantId, quantity }) => {
	const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, { quantity });

	return response.data;
};

export const getCartApi = async () => {
	const response = await cartApiInstance.get("/");

	return response.data;
};

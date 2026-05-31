import axios from "axios";

const orderApiInstance = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/order`,
	withCredentials: true,
});

export const createOrderApi = async () => {
	const response = await orderApiInstance.post("/create");
	return response.data;
};

export const verifyPaymentApi = async (paymentData) => {
	const response = await orderApiInstance.post("/verify", paymentData);
	return response.data;
};

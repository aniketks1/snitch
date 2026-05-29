import axios from "axios";

const authApiInstance = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/auth`,
	withCredentials: true,
});

export async function registerUserApi({ email, contact, password, fullName, isSeller }) {
	try {
		const response = await authApiInstance.post("/register", {
			email,
			contact,
			password,
			fullName,
			isSeller,
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.log(error.response.data);
		return error.response.data;
	}
}

export async function loginUserApi({ email, password }) {
	try {
		const response = await authApiInstance.post("/login", {
			email,
			password,
		});
		return response.data;
	} catch (error) {
		console.log(error.response.data);
		return error.response.data;
	}
}

export async function fetchUserApi() {
	try {
		const response = await authApiInstance.get("/me");
		return response.data;
	} catch (error) {
		return error.response.data;
	}
}

export async function logoutUserApi() {
	const response = await authApiInstance.post("/logout");
	return response.data;
}

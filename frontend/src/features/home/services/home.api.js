import axios from "axios";

const healthCheckApi = async () => {
	try {
		const response = await axios.get(`http://localhost:3000/health`, { withCredentials: true });
		return response.data;
	} catch (error) {
		console.error("Error fetching health:", error);
		throw error;
	}
};

export default healthCheckApi;

import healthCheckApi from "../services/home.api";

const useHealthCheck = () => {
	async function healthCheck() {
		try {
			const response = await healthCheckApi();
			return response;
		} catch (error) {
			return null;
		}
	}

	return healthCheck;
};

export default useHealthCheck;

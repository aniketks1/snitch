import { setUser, setError, setLoading } from "../state/auth.slice.js";
import { fetchUserApi, loginUserApi, registerUserApi, logoutUserApi } from "../services/auth.api.js";
import { useDispatch } from "react-redux";

export const useAuth = () => {
	const dispatch = useDispatch();
	async function handleRegister({ email, password, contact, fullName, isSeller = false }) {
		try {
			dispatch(setLoading(true));
			dispatch(setError(null));
			const data = await registerUserApi({ email, password, contact, fullName, isSeller });
			if (data && data.success === false) {
				throw new Error(data.message || "Failed to register account");
			}
			dispatch(setUser(data.user));
		} catch (err) {
			dispatch(setError(err.response?.data?.message || err.message || "Something went wrong"));
		} finally {
			dispatch(setLoading(false));
		}
	}

	async function handleLogin({ email, password }) {
		try {
			dispatch(setLoading(true));
			dispatch(setError(null));
			const data = await loginUserApi({ email, password });
			if (data && data.success === false) {
				throw new Error(data.message || "Invalid credentials");
			}
			dispatch(setUser(data.user));
			return data;
		} catch (err) {
			dispatch(setError(err.response?.data?.message || err.message || "Something went wrong"));
		} finally {
			dispatch(setLoading(false));
		}
	}

	async function handleGoogleAuth() {
		try {
			dispatch(setLoading(true));
			dispatch(setError(null));
			window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
		} catch (err) {
			dispatch(setError(err.response?.data?.message || err.message || "Something went wrong"));
		} finally {
			dispatch(setLoading(false));
		}
	}

	async function handleGetMe() {
		try {
			dispatch(setLoading(true));
			dispatch(setError(null));
			const response = await fetchUserApi();
			if (response && response.success === false) {
				throw new Error(response.message || "Session not found");
			}
			dispatch(setUser(response.user));
		} catch (err) {
			dispatch(setError(err.response?.data?.message || err.message || "Something went wrong"));
		} finally {
			dispatch(setLoading(false));
		}
	}

	async function handleLogout() {
		try {
			dispatch(setLoading(true));
			dispatch(setError(null));
			await logoutUserApi();
			dispatch(setUser(null));
		} catch (err) {
			dispatch(setError(err.response?.data?.message || err.message || "Something went wrong"));
		} finally {
			dispatch(setLoading(false));
		}
	}

	return { handleRegister, handleLogin, handleGoogleAuth, handleGetMe, handleLogout };
};

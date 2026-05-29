import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const Protected = ({ children, allowedRoles = [] }) => {
	const { user, loading } = useSelector((state) => state.auth);
	const location = useLocation();

	if (loading) {
		return (
			<div className="min-h-screen bg-[#030303] flex items-center justify-center">
				<span className="w-8 h-8 border-2 border-zinc-100 border-t-transparent rounded-full animate-spin shrink-0"></span>
			</div>
		);
	}

	// If the user is not authenticated, redirect to login page
	if (!user) {
		return (
			<Navigate
				to="/auth/login"
				state={{ from: location }}
				replace
			/>
		);
	}

	// If roles are specified, check if the user meets any allowed roles
	if (allowedRoles.length > 0) {
		const isSeller = user.role === "seller" || user.isSeller;
		const userRole = isSeller ? "seller" : "buyer";

		if (!allowedRoles.includes(userRole)) {
			// Redirect unauthorized users back to the home page
			return (
				<Navigate
					to="/"
					replace
				/>
			);
		}
	}

	return children;
};

export default Protected;

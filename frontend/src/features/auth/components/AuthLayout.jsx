import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import AuthPageLeft from "./AuthPageLeft";

const AuthLayout = () => {
	const { user } = useSelector((state) => state.auth);

	// Signed-in user protection redirects
	if (user) {
		const isSeller = user.role === "seller" || user.isSeller;
		return (
			<Navigate
				to={isSeller ? "/dashboard" : "/"}
				replace
			/>
		);
	}

	return (
		<div className="relative register-container flex min-h-screen overflow-hidden bg-[#ffffff]">
			{/* Responsive Split Columns Grid */}
			<div className="relative w-full grid grid-cols-1 lg:grid-cols-12 z-10">
				{/* LEFT COLUMN: Editorial Clothing Campaign Sidebar (Visible only on lg screens) */}
				<AuthPageLeft />

				{/* RIGHT COLUMN: Blended Registration Panel */}
				<div className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 bg-[#ffffff] overflow-y-auto min-h-screen relative z-20">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { useAuth } from "../features/auth/hook/useAuth.js";
import useProducts from "../features/dashboard/hooks/useSellerProduct.js";
import { useCart } from "../features/cart/hook/useCart.js";

import { useState } from "react";

const App = () => {
	const { user } = useSelector((state) => state.auth);
	const [isHydrating, setIsHydrating] = useState(true);
	const { handleGetMe } = useAuth();
	const { handleGetAllProducts } = useProducts();
	const { handleGetCart } = useCart();

	useEffect(() => {
		async function initSession() {
			let loggedInUser = user;
			if (!user) {
				loggedInUser = await handleGetMe();
			}
			if (loggedInUser) {
				try {
					await handleGetCart();
				} catch (err) {
					console.error("Error fetching cart on startup:", err);
				}
			}
			await handleGetAllProducts();
			setIsHydrating(false);
		}
		initSession();
	}, []);

	// While hydrating global user session on initial load, render the premium spinner
	if (isHydrating) {
		return (
			<div className="min-h-screen bg-[#030303] flex items-center justify-center">
				<span className="w-8 h-8 border-2 border-zinc-100 border-t-transparent rounded-full animate-spin shrink-0"></span>
			</div>
		);
	}

	return (
		<>
			<Outlet />
		</>
	);
};

export default App;

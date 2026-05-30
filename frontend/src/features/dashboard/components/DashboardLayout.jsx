import { Outlet } from "react-router";
import DashboardNav from "./DashboardNav.jsx";
import useSellerProduct from "../hooks/useSellerProduct.js";
import { useEffect } from "react";

const DashboardLayout = () => {
	const { handleGetSellerProduct } = useSellerProduct();

	useEffect(() => {
		async function hydrateDashboard() {
			await handleGetSellerProduct();
		}
		hydrateDashboard();
	}, []);
	return (
		<div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-['Outfit','Inter',sans-serif]">
			{/* Sticky Dashboard Navbar */}
			<DashboardNav />

			{/* Main Layout Content Area */}
			<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
				<Outlet />
			</main>
		</div>
	);
};

export default DashboardLayout;

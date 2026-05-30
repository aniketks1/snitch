import { Outlet } from "react-router";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "./ShopLayout.css";

const ShopLayout = () => {
	return (
		<div className="shop-layout-container font-['Outfit','Inter',sans-serif] min-h-screen flex flex-col relative bg-[#fafafa]">
			{/* Floating Ambient Glowing Spheres */}
			<div className="glow-sphere glow-sphere-1" />
			<div className="glow-sphere glow-sphere-2" />

			{/* Shared Header Navigation */}
			<Navbar />

			{/* Main Children Layout */}
			<main className="flex-grow relative z-10 w-full">
				<Outlet />
			</main>

			{/* Shared Footer */}
			<Footer />
		</div>
	);
};

export default ShopLayout;

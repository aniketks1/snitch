import { Link } from "react-router";
import useSellerProduct from "../../hooks/useSellerProduct.js";
import SellerProductCard from "../../components/SellerProductCard.jsx";
import { RiShoppingBag3Line, RiVerifiedBadgeLine, RiArrowRightUpLine } from "@remixicon/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../../auth/hook/useAuth.js";

const Dashboard = () => {
	// Custom Hooks
	const sellerProducts = useSelector((state) => state.sellerProduct.sellerProducts); // sellerProduct is slice/state & sellerProducts is array

	return (
		<div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 animate-fade-in-up">
			{/* Welcoming Banner Card */}
			<div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-8 sm:p-12 shadow-md">
				{/* Ambient background glows */}
				<div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-zinc-100 blur-[80px] pointer-events-none" />
				<div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-zinc-200/20 blur-[80px] pointer-events-none" />

				<div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
					<div className="space-y-4 max-w-xl">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-100 text-xs font-light text-zinc-600">
							<RiVerifiedBadgeLine
								size={12}
								className="text-zinc-700"
							/>
							<span>Seller Account Active</span>
						</div>
						<h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-zinc-900 uppercase">
							Snitch <span className="font-light text-zinc-500">Studio</span>
						</h1>
						<p className="text-zinc-500 text-sm leading-relaxed font-light">
							Welcome to your curation workshop. Introduce new collections, edit your catalogs, and track
							demand across global fashion releases instantly.
						</p>
					</div>

					<Link
						to="/dashboard/create-product"
						className="shrink-0 group flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-50 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-black/10 active:scale-95"
					>
						<span>Create Product</span>
						<RiArrowRightUpLine
							size={14}
							className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
						/>
					</Link>
				</div>
			</div>

			{/* Catalog List / Empty State conditional rendering */}
			{sellerProducts && sellerProducts.length > 0 ? (
				<div className="mt-12 space-y-6">
					<div className="flex items-center justify-between pb-4 border-b border-zinc-200">
						<h3 className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
							Released Drops ({sellerProducts.length})
						</h3>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{sellerProducts.map((product) => (
							<SellerProductCard
								key={product._id}
								product={product}
								onEdit={(prod) => alert(`Editing product drop: "${prod.title}"`)}
								onDelete={(prod) => {
									if (
										window.confirm(
											`Are you sure you want to remove "${prod.title}" from the catalog?`,
										)
									) {
										alert(`Successfully deleted: "${prod.title}"`);
									}
								}}
							/>
						))}
					</div>
				</div>
			) : (
				/* Empty State / Catalog Grid Info */
				<div className="mt-12 text-center border border-dashed border-zinc-200 rounded-2xl py-16 px-6 bg-white">
					<div className="w-12 h-12 rounded-full border border-zinc-150 bg-zinc-50 flex items-center justify-center mx-auto mb-4 text-zinc-400">
						<RiShoppingBag3Line size={20} />
					</div>
					<h3 className="text-sm font-semibold text-zinc-800 tracking-wide uppercase">
						No Products Released Yet
					</h3>
					<p className="text-xs text-zinc-500 max-w-md mx-auto mt-2 font-light leading-relaxed">
						Your seller catalog is currently empty. Get started by designing and launching your very first
						drop item to the Snitch store.
					</p>
					<div className="mt-6">
						<Link
							to="/dashboard/create-product"
							className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors uppercase tracking-widest border-b border-zinc-400 pb-0.5 hover:border-zinc-950"
						>
							Launch First Product
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;

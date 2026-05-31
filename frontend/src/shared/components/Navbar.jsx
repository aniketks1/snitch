import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import {
	RiShoppingBag3Line,
	RiUser3Line,
	RiLogoutBoxRLine,
	RiStore2Line,
} from "@remixicon/react";

import { useAuth } from "../../features/auth/hook/useAuth.js";

const Navbar = () => {
	const location = useLocation();
	const { user } = useSelector((state) => state.auth);
	const { handleLogout } = useAuth();
	const { items } = useSelector((state) => state.cart || { items: [] });
	const cartCount = items ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

	const isProductDetails = location.pathname.startsWith("/product/");

	return (
		<header className="glass-header sticky top-0 z-50 w-full">
			<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Brand Logo */}
				<div className="flex items-center">
					<Link
						to="/"
						className="text-2xl font-light tracking-[0.3em] text-zinc-900 transition-colors hover:text-zinc-950 uppercase"
					>
						S N I T C H
					</Link>
				</div>

				{/* Center Editorial Links */}
				<nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-zinc-500">
					{isProductDetails ? (
						<>
							<Link
								to="/"
								className="hover:text-zinc-900 transition-colors cursor-pointer"
							>
								New Drops
							</Link>
							<span className="text-zinc-300">//</span>
							<span className="text-zinc-900 font-bold">Studio Showcase</span>
						</>
					) : (
						<>
							<Link
								to="/"
								className="text-zinc-900 font-bold uppercase tracking-widest"
							>
								New Drops
							</Link>
							<span className="text-zinc-300">//</span>
							<span className="text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-widest">
								Studio Releases
							</span>
						</>
					)}
				</nav>

				{/* Dynamic User Authentication Actions */}
				<div className="flex items-center gap-4">
					{user && (
						<Link
							to="/cart"
							className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 transition-all duration-200 cursor-pointer"
							title="Shopping Bag"
						>
							<RiShoppingBag3Line size={14} />
							{cartCount > 0 && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[8px] font-bold text-white shadow-xs animate-scale">
									{cartCount}
								</span>
							)}
						</Link>
					)}

					{user ? (
						<div className="flex items-center gap-3">
							<span className="hidden sm:inline text-xs font-light text-zinc-500 tracking-wide">
								Curation by <span className="font-semibold text-zinc-800">{user.fullName}</span>
							</span>

							{/* Studio redirect for Seller Role */}
							{(user.role === "seller" || user.isSeller) && (
								<Link
									to="/dashboard"
									className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-700 transition-all duration-200"
								>
									<RiStore2Line size={12} />
									<span>Studio</span>
								</Link>
							)}

							<button
								onClick={handleLogout}
								type="button"
								className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 hover:border-rose-200 bg-white hover:bg-rose-50/50 text-zinc-500 hover:text-rose-600 transition-all duration-200 cursor-pointer"
								title="Sign Out"
							>
								<RiLogoutBoxRLine size={14} />
							</button>
						</div>
					) : (
						<Link
							to="/auth/login"
							className="inline-flex items-center gap-2 py-2 px-5 bg-zinc-950 hover:bg-zinc-800 text-zinc-50 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-sm active:scale-95"
						>
							<RiUser3Line size={12} />
							<span>Sign In</span>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Navbar;

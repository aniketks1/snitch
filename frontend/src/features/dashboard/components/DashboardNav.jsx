import { Link } from "react-router";
import { RiLogoutBoxRLine } from "@remixicon/react";
import { useAuth } from "../../auth/hook/useAuth.js";

const DashboardNav = () => {
	const { handleLogout } = useAuth();

	return (
		<header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Brand Logo / Branding on the Left */}
				<div className="flex items-center">
					<Link
						to="/dashboard"
						className="text-xl font-light tracking-[0.25em] text-zinc-900 transition-colors hover:text-zinc-950 uppercase"
					>
						Snitch
					</Link>
				</div>

				{/* Logout Button on the Right */}
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={handleLogout}
						className="flex items-center justify-center gap-1.5 py-2 px-4 border border-rose-200 bg-rose-50/50 hover:bg-rose-600 hover:text-white text-rose-600 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer active:scale-95"
						title="Logout of Studio"
					>
						<RiLogoutBoxRLine size={14} />
						<span>Logout</span>
					</button>
				</div>
			</div>
		</header>
	);
};

export default DashboardNav;

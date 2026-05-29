import { Link } from "react-router";
import { RiArrowLeftLine } from "@remixicon/react";
import "./authComponents.css";

const AuthPageMobileNav = ({ to = "/", linkLabel = "Shop", brandName = "S N I T C H" }) => {
	return (
		<div className="w-full max-w-lg mb-8 lg:hidden flex justify-between items-center">
			<Link
				to={to}
				id="linkBackHomeMobile"
				className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors text-xs font-medium tracking-[0.15em] uppercase group"
			>
				<RiArrowLeftLine
					size={14}
					className="transition-transform group-hover:-translate-x-0.5"
				/>
				{linkLabel}
			</Link>
			<span className="text-lg font-light tracking-[0.25em] text-zinc-200 select-none uppercase">
				{brandName}
			</span>
		</div>
	);
};

export default AuthPageMobileNav;

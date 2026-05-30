import { Link } from "react-router";

const Footer = () => {
	return (
		<footer className="border-t border-zinc-200 bg-white py-12 mt-20 relative z-10 w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-400 font-light tracking-widest uppercase">
				<div className="flex items-center gap-2">
					<span className="font-semibold text-zinc-600">Snitch Curation Studio</span>
					<span>//</span>
					<span>© {new Date().getFullYear()} All Rights Reserved</span>
				</div>
				<div className="flex items-center gap-6">
					<Link
						to="/"
						className="hover:text-zinc-800 transition-colors"
					>
						Shop
					</Link>
					<Link
						to="/"
						className="hover:text-zinc-800 transition-colors"
					>
						Privacy
					</Link>
					<Link
						to="/"
						className="hover:text-zinc-800 transition-colors"
					>
						Terms
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

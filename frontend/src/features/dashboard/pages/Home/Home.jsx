import { useSelector } from "react-redux";
import { RiShoppingBag3Line, RiSparkling2Line } from "@remixicon/react";
import ProductCard from "../../components/ProductCard.jsx";
import "./Home.css";

const Home = () => {
	const { products } = useSelector((state) => state.products);

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
			{/* Welcome Hero Editorial Card */}
			<section className="hero-card animate-fade-in-up">
				<div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
					<div className="space-y-4 max-w-2xl">
						{/* Live Drop Badge */}
						<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
							<span className="relative flex h-1.5 w-1.5">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-900 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-900"></span>
							</span>
							<span>01 // F/W Collection Live</span>
						</div>

						<h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-zinc-900 leading-[1.15]">
							CURATING THE ART OF <br />
							<span className="font-normal text-zinc-950 italic">CONTEMPORARY WEAR</span>
						</h1>

						<p className="text-zinc-500 text-sm font-light leading-relaxed max-w-lg">
							Discover our hand-crafted linen fabrics, minimalist everyday silhouettes, and
							high-fashion boutique curations sourced directly from active designers globally.
						</p>
					</div>

					{/* Quick Link/Callout */}
					<div className="shrink-0 flex flex-col gap-3">
						<div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
							<RiSparkling2Line
								size={12}
								className="text-zinc-500"
							/>
							<span>Verified Contemporary Quality</span>
						</div>
						<div className="h-px bg-zinc-200 w-full" />
						<p className="text-[11px] text-zinc-500 font-light italic max-w-xs">
							"Silhouettes sculpted for ultimate comfort and contemporary elegance."
						</p>
					</div>
				</div>
			</section>

			{/* Showcase Section */}
			<section className="space-y-10">
				{/* Title and Filter Bar */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200/80">
					<div className="space-y-1">
						<h2 className="text-2xl font-light tracking-wide text-zinc-950 uppercase">The Showcase</h2>
						<p className="text-xs font-light text-zinc-400 uppercase tracking-widest">
							Explore seasonal drops // total {products ? products.length : 0} releases
						</p>
					</div>
				</div>

				{/* Product Cards Grid & Empty State conditional rendering */}
				{products && products.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
						{products.map((product, index) => (
							<ProductCard
								key={product._id}
								product={product}
								to={`/product/${product._id}`}
								className="animate-fade-in-up"
								style={{ animationDelay: `${index * 50}ms` }}
							/>
						))}
					</div>
				) : (
					/* Empty State */
					<div className="border border-dashed border-zinc-200 rounded-2xl py-20 px-6 bg-white/40 text-center backdrop-blur-sm animate-fade-in-up">
						<div className="w-16 h-16 rounded-full border border-zinc-150 bg-zinc-50 flex items-center justify-center mx-auto mb-5 text-zinc-400">
							<RiShoppingBag3Line
								size={24}
								strokeWidth={1.5}
							/>
						</div>

						<h3 className="text-base font-medium text-zinc-800 tracking-wide uppercase">
							Curation Coming Soon
						</h3>

						<p className="text-xs text-zinc-500 max-w-sm mx-auto mt-2 font-light leading-relaxed">
							No products are live at the moment. Keep an eye out for our upcoming seasonal drop.
						</p>
					</div>
				)}
			</section>
		</main>
	);
};

export default Home;

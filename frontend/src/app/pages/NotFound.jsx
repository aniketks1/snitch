import { Link } from "react-router";
import { RiShoppingBag3Line, RiCompass3Line, RiSparkling2Line } from "@remixicon/react";

const NotFound = () => {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 text-center overflow-hidden font-['Outfit','Inter',sans-serif]">
			{/* Custom Embedded CSS for Advanced Editorial Animations */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
				@keyframes floatApparel {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					50% { transform: translateY(-12px) rotate(1.5deg); }
				}
				@keyframes drawPattern {
					to { stroke-dashoffset: 0; }
				}
				@keyframes spinRadial {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
				.animate-float-apparel {
					animation: floatApparel 6s ease-in-out infinite;
				}
				.animate-draw-pattern {
					stroke-dasharray: 800;
					stroke-dashoffset: 800;
					animation: drawPattern 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
				}
				.bg-technical-grid {
					background-size: 30px 30px;
					background-image: 
						linear-gradient(to right, rgba(228, 228, 231, 0.3) 1px, transparent 1px),
						linear-gradient(to bottom, rgba(228, 228, 231, 0.3) 1px, transparent 1px);
				}
			`,
				}}
			/>

			{/* Editorial Background Elements */}
			{/* 1. Sleek Technical Drafting Grid with radial fade mask */}
			<div
				className="absolute inset-0 bg-technical-grid pointer-events-none opacity-60"
				style={{
					maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
					WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
				}}
			/>

			{/* 2. Soft Dynamic Glowing Ambient Spheres */}
			<div className="absolute top-1/4 left-1/4 w-120 h-120 bg-zinc-200/50 rounded-full blur-[110px] pointer-events-none" />
			<div className="absolute bottom-1/4 right-1/4 w-110 h-110 bg-zinc-300/30 rounded-full blur-[130px] pointer-events-none" />

			{/* Main Editorial Bounded Container */}
			<div className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-10 py-10">
				{/* Visual Element: Floating Interactive Pattern Hanger drafting */}
				<div className="relative w-64 h-64 flex items-center justify-center animate-float-apparel">
					{/* Outer dashed measurement bounding ring */}
					<div className="absolute inset-0 border border-dashed border-zinc-200 rounded-full opacity-40 animate-[spin_40s_linear_infinite]" />

					{/* Angle ticks / layout drafting ticks */}
					<div className="absolute inset-2 border border-dotted border-zinc-300 rounded-full opacity-30" />

					{/* Technical Blueprint SVG representation of an editorial hanger/apparel draft */}
					<svg
						width="180"
						height="180"
						viewBox="0 0 100 100"
						fill="none"
						className="relative z-10 stroke-zinc-900 stroke-[0.75] stroke-linecap-round stroke-linejoin-round"
					>
						{/* Hanger neck loop hook */}
						<path
							d="M 50 35 C 50 25, 60 25, 55 20 C 50 15, 45 20, 48 25"
							className="animate-draw-pattern"
							style={{ animationDelay: "100ms" }}
						/>
						{/* Hanger shoulders wireframe triangle */}
						<path
							d="M 15 50 L 50 35 L 85 50 Z"
							className="animate-draw-pattern"
							style={{ animationDelay: "300ms" }}
						/>
						{/* Hanging empty garment drafting outline */}
						<path
							d="M 28 50 L 25 78 L 38 82 L 50 78 L 62 82 L 75 78 L 72 50 Z"
							className="animate-draw-pattern stroke-zinc-400 stroke-[0.5]"
							style={{ animationDelay: "600ms" }}
						/>
						{/* Measurement guides / crosses */}
						<line
							x1="50"
							y1="10"
							x2="50"
							y2="90"
							strokeDasharray="2,2"
							className="stroke-zinc-300 stroke-[0.5]"
						/>
						<line
							x1="10"
							y1="50"
							x2="90"
							y2="50"
							strokeDasharray="2,2"
							className="stroke-zinc-300 stroke-[0.5]"
						/>
					</svg>

					{/* Layout dimension callouts (technical drafting marks) */}
					<span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-mono tracking-widest text-zinc-400 uppercase select-none">
						HNG // 50cm
					</span>
					<span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono tracking-widest text-zinc-400 uppercase select-none">
						SEAM DRAFT // 0.75px
					</span>
				</div>

				{/* Typography and Garment Spec sheet */}
				<div className="max-w-md space-y-8">
					<div className="space-y-4">
						{/* Collection sourcing tag */}
						<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200 bg-zinc-50/80 text-[9px] font-semibold tracking-widest text-zinc-500 uppercase select-none">
							<RiSparkling2Line
								size={10}
								className="text-zinc-600"
							/>
							<span>ERROR CODE // 404 UNRESOLVED</span>
						</div>

						<h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-zinc-950 uppercase leading-tight font-sans">
							CURATION <br />
							<span className="font-normal italic">ARCHIVED</span>
						</h1>

						<p className="text-sm text-zinc-500 font-light leading-relaxed max-w-xs mx-auto">
							This specific silhouette or drop sequence has been pulled from circulation or does not
							exist.
						</p>
					</div>

					{/* Technical Garment Spec Sheet Grid */}
					<div className="border border-zinc-200/80 rounded-2xl bg-white/60 backdrop-blur-md p-5 text-left space-y-4 shadow-sm max-w-sm mx-auto">
						<div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-zinc-400 uppercase border-b border-zinc-150 pb-2">
							<span>Garment Specification Sheet</span>
							<span>REF: SN-404</span>
						</div>

						<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] font-light text-zinc-600">
							<div className="flex justify-between border-b border-zinc-100 py-1.5">
								<span className="text-zinc-400">Design Index:</span>
								<span className="font-semibold text-zinc-800 uppercase">Null</span>
							</div>
							<div className="flex justify-between border-b border-zinc-100 py-1.5">
								<span className="text-zinc-400">Textile Fiber:</span>
								<span className="font-semibold text-zinc-800 uppercase">Linen 0%</span>
							</div>
							<div className="flex justify-between border-b border-zinc-100 py-1.5 col-span-2">
								<span className="text-zinc-400">Sourcing Origin:</span>
								<span className="font-semibold text-zinc-800 uppercase">Forest of Kindergarten</span>
							</div>
						</div>
					</div>

					{/* Multi-action Luxury CTA Section */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
						<Link
							to="/"
							className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-zinc-950 hover:bg-zinc-800 text-zinc-50 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
						>
							<RiShoppingBag3Line size={13} />
							<span>Explore Drops</span>
						</Link>

						<Link
							to="/dashboard"
							className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
						>
							<RiCompass3Line size={13} />
							<span>Curation Studio</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotFound;

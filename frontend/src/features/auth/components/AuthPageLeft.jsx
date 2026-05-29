import { Link } from "react-router";
import { RiArrowLeftLine, RiVerifiedBadgeLine, RiDiscountPercentLine, RiStore2Line } from "@remixicon/react";
import "./authComponents.css";

const AuthPageLeft = ({
	backgroundImage = "/campaign_fashion.png",
	brandName = "S N I T C H",
	collectionTag = "Collections Live",
	collectionDesc = "FALL / WINTER 2026 COLLECTION. Explore hand-crafted garments, minimalist essentials, and curated independent boutique streetwear.",
	features = [
		{ icon: RiVerifiedBadgeLine, text: "Premium contemporary silhouettes" },
		{ icon: RiDiscountPercentLine, text: "Priority member drop access" },
		{ icon: RiStore2Line, text: "Verified independent boutique hub" },
	],
	dropText = "01 // F/W DROP",
	copyrightText = `&copy; ${new Date().getFullYear()} SNITCH APPAREL`,
}) => {
	return (
		<div
			className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 relative overflow-hidden bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: `url('${backgroundImage}')` }}
		>
			{/* Dark editorial vignette overlay to ensure high contrast for text */}
			<div className="absolute inset-0 bg-linear-to-b from-zinc-950/50 via-transparent to-zinc-950/70 z-0 pointer-events-none" />

			{/* Header Top - Back Home shop navigation */}
			<div className="relative z-10">
				<Link
					to="/"
					id="linkBackHome"
					className="inline-flex items-center gap-2 text-zinc-200 hover:text-white transition-colors text-xs font-medium tracking-[0.2em] uppercase group"
				>
					<RiArrowLeftLine
						size={14}
						className="transition-transform group-hover:-translate-x-1"
					/>
					Back to Shop
				</Link>
			</div>

			{/* Center Section - Brand & Collections */}
			<div className="relative z-10 space-y-6 mt-auto mb-10">
				<div>
					{/* Premium spaced typography */}
					<h1 className="text-5xl font-light tracking-[0.25em] text-white select-none font-sans uppercase">
						{brandName}
					</h1>

					{/* Curation tag */}
					{collectionTag && (
						<div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-medium tracking-[0.2em] uppercase backdrop-blur-md">
							<span className="relative flex h-1.5 w-1.5">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
								<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
							</span>
							{collectionTag}
						</div>
					)}
				</div>

				<div className="h-px w-12 bg-white/40"></div>

				<p className="text-sm font-light text-zinc-200 tracking-wide leading-relaxed max-w-sm">
					{collectionDesc}
				</p>

				{/* Premium Curation details */}
				{features && features.length > 0 && (
					<div className="space-y-4 pt-4 max-w-xs text-xs text-zinc-300 font-light tracking-wide">
						{features.map((feature, idx) => {
							const IconComponent = feature.icon;
							return (
								<div
									key={idx}
									className="flex items-center gap-3"
								>
									{IconComponent && (
										<IconComponent
											size={16}
											className="text-zinc-200"
										/>
									)}
									<span>{feature.text}</span>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Bottom Footer Subtext */}
			<div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-medium">
				<span>{dropText}</span>
				<span dangerouslySetInnerHTML={{ __html: copyrightText }} />
			</div>
		</div>
	);
};

export default AuthPageLeft;

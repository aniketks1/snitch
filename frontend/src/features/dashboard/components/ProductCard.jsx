import { Link } from "react-router";
import { RiEdit2Line, RiDeleteBin6Line, RiShoppingBag3Line } from "@remixicon/react";

const ProductCard = ({ 
	product = {}, 
	to, 
	onClick, 
	onEdit, 
	onDelete, 
	isSellerMode = false,
	className = "",
	style
}) => {
	const { title = "Unnamed Product", description = "No description provided.", images = [] } = product || {};

	// Resolve price properties supporting both flat object keys and nested MongoDB schemas
	const priceAmount = Number(product?.price?.amount ?? product?.priceAmount ?? 0) || 0;
	const priceCurrency = product?.price?.currency ?? product?.priceCurrency ?? "INR";

	// Determine the main display image. Handles local File objects, backend URL objects, and raw strings.
	const getDisplayImage = () => {
		if (!images || images.length === 0) return null;
		const firstImage = images[0];
		if (firstImage instanceof File) {
			return URL.createObjectURL(firstImage);
		}
		if (firstImage && typeof firstImage === "object" && "url" in firstImage) {
			return firstImage.url;
		}
		return firstImage;
	};

	const displayImage = getDisplayImage();

	const formatPrice = (amount, currency) => {
		const num = Number(amount) || 0;
		const symbol =
			currency === "INR"
				? "₹"
				: currency === "USD"
					? "$"
					: currency === "EUR"
						? "€"
						: currency === "GBP"
							? "£"
							: "";
		return `${symbol}${num.toLocaleString()}`;
	};

	const CardContent = () => (
		<>
			{/* Product Campaign Image */}
			<div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100">
				{displayImage ? (
					<img
						src={displayImage}
						alt={title}
						className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
						loading="lazy"
					/>
				) : (
					<div className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-400">
						<RiShoppingBag3Line
							size={28}
							strokeWidth={1.5}
						/>
						<span className="text-[10px] uppercase tracking-wider font-light">No Campaign Image</span>
					</div>
				)}

				{/* Quick View overlay on hover (only in non-seller mode) */}
				{!isSellerMode && !onEdit && !onDelete && (
					<div className="absolute inset-0 bg-linear-to-t from-zinc-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-center pb-6">
						<span className="transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0 bg-white/95 backdrop-blur-xs border border-white/20 text-zinc-900 text-[10px] font-bold tracking-widest uppercase py-2 px-5 rounded-full shadow-lg">
							View Details
						</span>
					</div>
				)}
			</div>

			{/* Drop Details Area */}
			<div className="flex flex-col p-4 pb-3 space-y-1.5 bg-white border-t border-zinc-100 grow">
				<div className="flex items-start justify-between gap-3">
					<h4 className="text-xs font-semibold tracking-wide text-zinc-800 uppercase truncate flex-1" title={title}>
						{title}
					</h4>
					<span className="text-xs font-bold text-zinc-900 shrink-0">
						{formatPrice(priceAmount, priceCurrency)}
					</span>
				</div>
				<p className="text-[10px] text-zinc-500 font-light line-clamp-2 leading-relaxed h-7">{description}</p>
			</div>
		</>
	);

	// Styling class for the outer card
	const cardStyles = `group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-350 hover:shadow-lg hover:shadow-zinc-200/30 ${className}`;

	// Render different wrappers depending on if it has a dynamic route link or is standard clickable/seller card
	if (to && !isSellerMode && !onEdit && !onDelete) {
		return (
			<Link to={to} className={cardStyles} onClick={onClick} style={style}>
				<CardContent />
			</Link>
		);
	}

	return (
		<div className={cardStyles} onClick={onClick ? () => onClick(product) : undefined} style={style}>
			<CardContent />

			{/* Dedicated Action Options Footer for Seller Mode */}
			{(isSellerMode || onEdit || onDelete) && (
				<div className="flex items-center gap-2 p-4 pt-0 bg-white">
					{onEdit && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onEdit(product);
							}}
							className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 transition-all duration-200 cursor-pointer active:scale-95"
						>
							<RiEdit2Line size={12} />
							<span>Edit</span>
						</button>
					)}
					{onDelete && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onDelete(product);
							}}
							className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 bg-rose-50/40 hover:bg-rose-600 text-rose-600 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
							title="Delete product"
						>
							<RiDeleteBin6Line size={12} />
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default ProductCard;

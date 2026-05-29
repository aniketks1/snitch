import { RiEdit2Line, RiDeleteBin6Line, RiShoppingBag3Line } from "@remixicon/react";

const SellerProductCard = ({ product = {}, onEdit, onDelete }) => {
	const { title = "Unnamed Product", description = "No description provided.", images = [] } = product;

	// Resolve price properties supporting both flat object keys and nested MongoDB schemas
	const priceAmount = product.price?.amount ?? product.priceAmount ?? 0;
	const priceCurrency = product.price?.currency ?? product.priceCurrency ?? "INR";

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
		return `${symbol}${amount.toLocaleString()}`;
	};

	return (
		<div className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-350 hover:shadow-lg hover:shadow-zinc-200/30">
			{/* Product Campaign Image */}
			<div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100">
				{displayImage ? (
					<img
						src={displayImage}
						alt={title}
						className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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
			</div>

			{/* Drop Details Area */}
			<div className="flex flex-col p-4 pb-3 space-y-1.5 bg-white border-t border-zinc-100">
				<div className="flex items-start justify-between gap-3">
					<h4 className="text-xs font-semibold tracking-wide text-zinc-850 uppercase truncate flex-1">
						{title}
					</h4>
					<span className="text-xs font-bold text-zinc-900 shrink-0">
						{formatPrice(priceAmount, priceCurrency)}
					</span>
				</div>
				<p className="text-[10px] text-zinc-500 font-light line-clamp-2 leading-relaxed h-7">{description}</p>
			</div>

			{/* Dedicated Action Options Footer */}
			<div className="flex items-center gap-2 p-4 pt-0 bg-white">
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						if (onEdit) {
							onEdit(product);
						} else {
							console.log("Edit product:", product);
						}
					}}
					className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 transition-all duration-200 cursor-pointer active:scale-95"
				>
					<RiEdit2Line size={12} />
					<span>Edit</span>
				</button>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						if (onDelete) {
							onDelete(product);
						} else {
							console.log("Delete product:", product);
						}
					}}
					className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 bg-rose-50/40 hover:bg-rose-600 text-rose-600 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
					title="Delete product"
				>
					<RiDeleteBin6Line size={12} />
				</button>
			</div>
		</div>
	);
};

export default SellerProductCard;

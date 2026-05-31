import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useRazorpay } from "../hook/useRazorpay.js";
import {
	RiShoppingBag3Line,
	RiArrowLeftLine,
	RiShieldCheckLine,
	RiLoader5Line,
	RiCloseLine,
	RiSparkling2Line,
	RiAddLine,
	RiSubtractLine,
} from "@remixicon/react";

import { useCart } from "../hook/useCart.js";
import "./Cart.css";

const Cart = () => {
	const navigate = useNavigate();
	const { handleGetCart, handleAddItem } = useCart();
	const { items } = useSelector((state) => state.cart || { items: [] });

	const [loading, setLoading] = useState(true);
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [updatingItemId, setUpdatingItemId] = useState(null);

	const { handleCheckout } = useRazorpay();
	const user = useSelector((state) => state.auth.user); // adjust selector
	const onCheckout = () => {
		setCheckoutLoading(true);
		handleCheckout({
			userName: user?.name,
			userEmail: user?.email,
			userContact: user?.phone || "",
			onSuccess: (_data) => {
				setCheckoutLoading(false);
				setShowSuccessModal(true);
			},
			onError: (msg) => {
				setCheckoutLoading(false);
				alert(msg);
			},
		});
	};

	const handleQuantityChange = async (productId, variantId, quantityChange) => {
		setUpdatingItemId(`${productId}-${variantId}`);
		try {
			await handleAddItem({ productId, variantId, quantity: quantityChange });
		} catch (err) {
			console.error("Failed to update cart quantity:", err);
			const msg = err.response?.data?.message || "Failed to update quantity.";
			alert(msg);
		} finally {
			setUpdatingItemId(null);
		}
	};

	useEffect(() => {
		async function fetchCart() {
			setLoading(true);
			try {
				await handleGetCart();
			} catch (err) {
				console.error("Error fetching cart on page mount:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchCart();
	}, []);

	// Calculate prices and total sums
	const subtotal = useMemo(() => {
		return items.reduce((acc, item) => acc + (item.price?.amount || 0) * item.quantity, 0);
	}, [items]);

	const currencySymbol = useMemo(() => {
		if (items.length === 0) return "₹";
		const currency = items[0].price?.currency || "INR";
		return currency === "INR"
			? "₹"
			: currency === "USD"
				? "$"
				: currency === "EUR"
					? "€"
					: currency === "GBP"
						? "£"
						: "";
	}, [items]);

	const formatPrice = (amount) => {
		return `${currencySymbol}${amount.toLocaleString()}`;
	};

	if (loading) {
		return (
			<div className="cart-loading-container">
				<RiLoader5Line
					size={32}
					className="animate-spin text-zinc-800"
				/>
				<span className="text-xs uppercase tracking-widest font-light text-zinc-500 mt-4">
					Loading your bag...
				</span>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in-up">
				<div className="max-w-md mx-auto space-y-6">
					<div className="relative inline-flex items-center justify-center p-6 rounded-full bg-zinc-100 border border-zinc-200/50">
						<RiShoppingBag3Line
							size={48}
							strokeWidth={1}
							className="text-zinc-400"
						/>
					</div>
					<h2 className="text-2xl font-light uppercase tracking-widest text-zinc-900">Your Bag is Empty</h2>
					<p className="text-zinc-500 text-sm font-light leading-relaxed max-w-sm mx-auto">
						There are currently no items in your curation. Explore our drops to discover our latest
						architectural fits.
					</p>
					<button
						onClick={() => navigate("/")}
						className="inline-flex items-center gap-2 mt-4 px-6 py-3 border border-zinc-900 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-sm hover:shadow active:scale-95 cursor-pointer"
					>
						<RiArrowLeftLine size={12} />
						<span>Explore Drops</span>
					</button>
				</div>
			</main>
		);
	}

	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 animate-fade-in-up">
			{/* Editorial Header */}
			<div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-zinc-200/80 pb-6 mb-10 gap-4">
				<h1 className="text-3xl font-extralight tracking-tight text-zinc-950 uppercase">Shopping Bag</h1>
				<span className="text-xs font-light text-zinc-500 uppercase tracking-widest">
					{items.length} unique {items.length === 1 ? "design" : "designs"} secured
				</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
				{/* Left: Cart Items List */}
				<div className="lg:col-span-8 space-y-6">
					{items.map((item) => {
						const isBaseProduct = item.variants?.toString() === item.product?._id?.toString();
						const selectedVariant = isBaseProduct
							? null
							: item.product?.variants?.find((v) => v._id?.toString() === item.variants?.toString());

						// Resolve correct thumbnail image
						const itemImage =
							selectedVariant && selectedVariant.images?.length > 0
								? selectedVariant.images[0].url
								: item.product?.images?.length > 0
									? item.product.images[0].url
									: null;

						// Resolve correct variant label
						const variantLabel = isBaseProduct
							? "Original Product"
							: selectedVariant?.attributes
								? Object.entries(
										selectedVariant.attributes instanceof Map
											? Object.fromEntries(selectedVariant.attributes)
											: selectedVariant.attributes,
									)
										.map(([k, v]) => `${k}: ${v}`)
										.join(" / ")
								: "Standard Variant";

						return (
							<div
								key={item._id}
								className="flex flex-col sm:flex-row gap-5 p-5 bg-white border border-zinc-200/60 rounded-2xl shadow-xs transition-all duration-300 hover:border-zinc-300/80"
							>
								{/* Image Thumbnail Frame */}
								<div className="relative h-28 w-24 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
									{itemImage ? (
										<img
											src={itemImage}
											alt={item.product?.title || "Product"}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-400">
											<RiShoppingBag3Line
												size={20}
												strokeWidth={1}
											/>
										</div>
									)}
								</div>

								{/* Details Panel */}
								<div className="grow flex flex-col justify-between py-1 gap-2">
									<div>
										<div className="flex justify-between items-start gap-4">
											<h3 className="text-base font-light text-zinc-900 uppercase tracking-tight hover:text-zinc-600 transition-colors">
												<Link to={`/product/${item.product?._id}`}>
													{item.product?.title || "Untitled Drop"}
												</Link>
											</h3>
											<span className="text-sm font-semibold text-zinc-950">
												{formatPrice((item.price?.amount || 0) * item.quantity)}
											</span>
										</div>

										{/* Variant details pill */}
										<div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full border border-zinc-200 bg-zinc-50 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
											{variantLabel}
										</div>
									</div>

									{/* Quantity & Unit Price */}
									<div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100/50">
										<span className="text-xs font-light text-zinc-400 uppercase tracking-widest">
											Unit: {formatPrice(item.price?.amount || 0)}
										</span>
										<div className="flex items-center gap-3">
											<span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
												QTY:
											</span>
											<div className="flex items-center gap-2.5">
												<button
													onClick={() =>
														handleQuantityChange(item.product?._id, item.variants, -1)
													}
													disabled={
														updatingItemId === `${item.product?._id}-${item.variants}`
													}
													className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 active:scale-95 disabled:opacity-50 transition-all cursor-pointer select-none"
													title="Decrease Quantity"
												>
													<RiSubtractLine size={10} />
												</button>
												<span className="text-sm font-bold text-zinc-800 min-w-4 text-center select-none">
													{item.quantity}
												</span>
												<button
													onClick={() =>
														handleQuantityChange(item.product?._id, item.variants, 1)
													}
													disabled={
														updatingItemId === `${item.product?._id}-${item.variants}`
													}
													className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 active:scale-95 disabled:opacity-50 transition-all cursor-pointer select-none"
													title="Increase Quantity"
												>
													<RiAddLine size={10} />
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Right: Checkout Order Summary Panel */}
				<div className="lg:col-span-4 sticky top-24">
					<div className="glass-summary-card p-6 rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-md shadow-xs space-y-6">
						<h2 className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase pb-3 border-b border-zinc-200/50">
							Order Summary
						</h2>

						{/* Calculations list */}
						<div className="space-y-4 text-sm font-light text-zinc-600">
							<div className="flex justify-between">
								<span>Subtotal</span>
								<span className="font-semibold text-zinc-900">{formatPrice(subtotal)}</span>
							</div>
							<div className="flex justify-between">
								<span>Shipping</span>
								<span className="text-emerald-600 font-medium">Complementary</span>
							</div>
							<div className="flex justify-between">
								<span>Estimated Taxes</span>
								<span className="font-light italic text-zinc-400">Included</span>
							</div>

							<div className="h-px bg-zinc-200/80 my-4" />

							<div className="flex justify-between items-baseline text-zinc-900">
								<span className="text-sm font-bold uppercase tracking-wider">Total</span>
								<span className="text-xl font-bold">{formatPrice(subtotal)}</span>
							</div>
						</div>

						{/* Checkout CTA */}
						<button
							onClick={onCheckout}
							disabled={checkoutLoading}
							className="btn-premium-checkout w-full py-4 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-sm active:scale-98 flex items-center justify-center gap-3 cursor-pointer"
						>
							{checkoutLoading ? (
								<>
									<RiLoader5Line
										size={14}
										className="animate-spin"
									/>
									<span>Verifying Stock...</span>
								</>
							) : (
								<span>Secure Checkout</span>
							)}
						</button>

						{/* Secure shopping details */}
						<div className="flex items-center gap-2 justify-center text-[10px] text-zinc-400 uppercase tracking-widest font-semibold pt-2">
							<RiShieldCheckLine
								size={14}
								className="text-zinc-800"
							/>
							<span>Carbon Neutral & SSL Secured</span>
						</div>
					</div>
				</div>
			</div>

			{/* Checkout Success Modal */}
			{showSuccessModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-fade-in">
					<div className="relative max-w-md w-full bg-white rounded-3xl border border-zinc-200 shadow-2xl p-8 text-center space-y-6 animate-scale">
						<button
							onClick={() => {
								setShowSuccessModal(false);
								navigate("/");
							}}
							className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 border border-zinc-200/50 transition-all cursor-pointer"
							title="Close"
						>
							<RiCloseLine size={16} />
						</button>

						<div className="inline-flex items-center justify-center p-4 rounded-full bg-zinc-950 text-white animate-pulse">
							<RiSparkling2Line size={32} />
						</div>

						<div className="space-y-2">
							<h3 className="text-xl font-light uppercase tracking-widest text-zinc-900">
								Order Curated
							</h3>
							<p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">
								Secure Drop Secured
							</p>
						</div>

						<p className="text-zinc-500 text-sm font-light leading-relaxed max-w-xs mx-auto">
							Thank you for shopping Snitch Studio. Your exclusive selection has been verified and sent
							for luxury packaging. An notification will be dispatched shortly.
						</p>

						<button
							onClick={() => {
								setShowSuccessModal(false);
								navigate("/");
							}}
							className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
						>
							Return to drops collection
						</button>
					</div>
				</div>
			)}
		</main>
	);
};

export default Cart;

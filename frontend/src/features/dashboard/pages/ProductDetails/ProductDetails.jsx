import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
	RiShoppingBag3Line,
	RiVerifiedBadgeLine,
	RiSparkling2Line,
	RiArrowLeftLine,
	RiHeartLine,
	RiHeartFill,
	RiLoader5Line,
	RiCheckLine,
	RiArrowLeftSLine,
	RiArrowRightSLine,
	RiStackLine,
} from "@remixicon/react";

import "./ProductDetails.css";
import useProducts from "../../hooks/useSellerProduct";
import { useCart } from "../../../cart/hook/useCart";
import NotFound from "../../../../app/pages/NotFound";

const ProductDetails = () => {
	const { productId } = useParams();
	const { handleGetProductDetails } = useProducts();
	const { handleAddItem } = useCart();
	const navigate = useNavigate();
	const [productDetails, setProductDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isNotFound, setIsNotFound] = useState(false);

	useEffect(() => {
		async function getProduct() {
			setLoading(true);
			setIsNotFound(false);
			const data = await handleGetProductDetails({ productId });
			console.log(data);
			if (data) {
				setProductDetails(data);
				setIsNotFound(false);
			} else {
				setProductDetails(null);
				setIsNotFound(true);
			}
			setLoading(false);
		}
		getProduct();
	}, [productId]);

	// Local states for interactivity
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [slideDirection, setSlideDirection] = useState("right");
	const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
	const [isLiked, setIsLiked] = useState(false);
	const [openAccordion, setOpenAccordion] = useState("composition");
	const [isAdding, setIsAdding] = useState(false);
	const [isAdded, setIsAdded] = useState(false);

	// State for mobile horizontal touch swiping gesture control
	const [touchStartX, setTouchStartX] = useState(null);
	const [touchEndX, setTouchEndX] = useState(null);

	// Helper to resolve image paths (files, urls, raw strings)
	const getDisplayImage = (imageObj) => {
		if (!imageObj) return null;
		if (imageObj instanceof File) {
			return URL.createObjectURL(imageObj);
		}
		if (imageObj && typeof imageObj === "object" && "url" in imageObj) {
			return imageObj.url;
		}
		return imageObj;
	};

	// Reset indices and selection when product changes
	useEffect(() => {
		setActiveImageIndex(0);
		setIsAdded(false);
		// Auto-select first variant if available
		if (productDetails?.variants?.length > 0) {
			setSelectedVariantIndex(0);
		} else {
			setSelectedVariantIndex(null);
		}
	}, [productId, productDetails]);

	// Derive variant data
	const baseVariant = useMemo(() => {
		if (!productDetails) return null;
		return {
			_id: productDetails._id,
			images: productDetails.images || [],
			stock: 9999,
			attributes: {
				Type: "Original",
			},
			price: productDetails.price || {
				amount: productDetails.priceAmount || 0,
				currency: productDetails.priceCurrency || "INR",
			},
		};
	}, [productDetails]);

	const variants = useMemo(() => {
		if (!productDetails) return [];
		const productVariants = productDetails.variants || [];
		if (baseVariant && productVariants.length > 0) {
			return [baseVariant, ...productVariants];
		}
		return productVariants;
	}, [productDetails, baseVariant]);

	const hasVariants = variants.length > 0;
	const selectedVariant = selectedVariantIndex !== null ? variants[selectedVariantIndex] : null;

	// Build unique attribute keys across all variants for selector grouping
	const attributeKeys = useMemo(() => {
		if (!hasVariants) return [];
		const keySet = new Set();
		variants.forEach((v) => {
			if (v.attributes) {
				// attributes can be a Map (serialised as object) or a plain object
				const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes;
				Object.keys(attrs).forEach((k) => keySet.add(k));
			}
		});
		return Array.from(keySet);
	}, [variants, hasVariants]);

	// Helper: get attribute value from a variant
	const getAttr = (variant, key) => {
		if (!variant?.attributes) return undefined;
		const attrs = variant.attributes instanceof Map ? Object.fromEntries(variant.attributes) : variant.attributes;
		return attrs[key];
	};

	// Determine which images to display: variant images (if selected and they exist) or product images
	const displayImages = useMemo(() => {
		if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
			return selectedVariant.images;
		}
		return productDetails?.images || [];
	}, [selectedVariant, productDetails]);

	// Reset active image index when display images change
	useEffect(() => {
		setActiveImageIndex(0);
	}, [displayImages]);

	// Determine active price: selected variant's price or base product price
	const activePriceAmount = selectedVariant?.price?.amount ?? productDetails?.price?.amount ?? productDetails?.priceAmount ?? 0;
	const activePriceCurrency = selectedVariant?.price?.currency ?? productDetails?.price?.currency ?? productDetails?.priceCurrency ?? "INR";

	// Active stock (variant-level)
	const activeStock = selectedVariant?.stock;

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

	// Actual premium Add To Bag action
	const handleAddToBag = async () => {
		if (isAdding || isAdded) return;

		const variantId = selectedVariant?._id;
		if (!variantId) {
			console.error("Please select a variant.");
			return;
		}

		setIsAdding(true);
		try {
			await handleAddItem({ productId, variantId, quantity: 1 });
			setIsAdded(true);
			setTimeout(() => {
				setIsAdded(false);
			}, 3000);
		} catch (error) {
			console.error("Failed to add product to cart:", error);
			const msg = error.response?.data?.message || "Failed to add to cart.";
			alert(msg);
		} finally {
			setIsAdding(false);
		}
	};

	// Image slider navigation helpers
	const handleNextImage = () => {
		if (displayImages.length <= 1) return;
		setSlideDirection("right");
		setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
	};

	const handlePrevImage = () => {
		if (displayImages.length <= 1) return;
		setSlideDirection("left");
		setActiveImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
	};

	const handleSelectImage = (idx) => {
		if (idx === activeImageIndex) return;
		setSlideDirection(idx > activeImageIndex ? "right" : "left");
		setActiveImageIndex(idx);
	};

	const handleTouchStart = (e) => {
		setTouchStartX(e.targetTouches[0].clientX);
		setTouchEndX(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e) => {
		setTouchEndX(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = () => {
		if (touchStartX === null || touchEndX === null) return;
		const distance = touchStartX - touchEndX;
		const minSwipeDistance = 50; // pixels
		if (distance > minSwipeDistance) {
			// Swiped left -> show next image
			handleNextImage();
		} else if (distance < -minSwipeDistance) {
			// Swiped right -> show previous image
			handlePrevImage();
		}
		setTouchStartX(null);
		setTouchEndX(null);
	};

	// Dynamic accordion helper
	const toggleAccordion = (section) => {
		setOpenAccordion(openAccordion === section ? null : section);
	};

	// Handle variant selection
	const handleSelectVariant = (idx) => {
		setSelectedVariantIndex(idx);
	};

	// Render NotFound page if product details fetch returns a 404
	if (isNotFound) {
		return <NotFound />;
	}

	// Premium skeleton loader if the product list is still hydrating
	if (loading || !productDetails) {
		return (
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
					<div className="lg:col-span-7">
						<div className="skeleton w-full aspect-3/4 rounded-2xl" />
					</div>
					<div className="lg:col-span-5 space-y-6">
						<div className="skeleton h-4 w-1/3" />
						<div className="skeleton h-10 w-3/4" />
						<div className="skeleton h-6 w-1/4" />
						<div className="h-px bg-zinc-200/80 my-6" />
						<div className="skeleton h-16 w-full" />
						<div className="skeleton h-12 w-full" />
					</div>
				</div>
			</main>
		);
	}

	const currentMainImage = getDisplayImage(displayImages[activeImageIndex]);

	return (
		<main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
			{/* Minimal Breadcrumb Back Action */}
			<div className="animate-fade-in-up">
				<button
					onClick={() => navigate("/")}
					className="back-breadcrumb"
				>
					<RiArrowLeftLine size={12} />
					<span>Back to Drops Collection</span>
				</button>
			</div>

			{/* Product Presentation Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				{/* Left Panel: Image Gallery Showcase */}
				<div className="lg:col-span-7 gallery-sticky animate-fade-in-up delay-50">
					<div className="flex flex-col sm:flex-row gap-5 items-start">
						{/* Thumbnail Strip Gallery (Horizontal on mobile, vertical on desktop) */}
						{displayImages.length > 1 && (
							<div className="thumbnails-container order-2 sm:order-1">
								{displayImages.map((image, index) => {
									const imgUrl = getDisplayImage(image);
									return (
										<button
											key={image._id || index}
											onClick={() => handleSelectImage(index)}
											className={`thumbnail-card ${activeImageIndex === index ? "active" : ""}`}
										>
											<img
												src={imgUrl}
												alt={`Thumbnail ${index + 1}`}
												className="thumbnail-img"
											/>
										</button>
									);
								})}
							</div>
						)}

						{/* Main Display Image Frame */}
						<div 
							className="main-image-frame group relative flex-1 order-1 sm:order-2 w-full"
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
						>
							{currentMainImage ? (
								<>
									<img
										key={`${selectedVariantIndex}-${activeImageIndex}`}
										src={currentMainImage}
										alt={productDetails.title}
										className={`main-image ${slideDirection === "right" ? "animate-slide-right" : "animate-slide-left"}`}
									/>

									{/* Prev/Next Navigation Chevrons */}
									{displayImages.length > 1 && (
										<>
											<button
												onClick={(e) => {
													e.stopPropagation();
													handlePrevImage();
												}}
												className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-zinc-800 border border-zinc-200/50 shadow-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 cursor-pointer active:scale-95"
												title="Previous Image"
											>
												<RiArrowLeftSLine size={20} />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleNextImage();
												}}
												className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-zinc-800 border border-zinc-200/50 shadow-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 cursor-pointer active:scale-95"
												title="Next Image"
											>
												<RiArrowRightSLine size={20} />
											</button>
										</>
									)}

									{/* Horizontal Capsule Progress Dots */}
									{displayImages.length > 1 && (
										<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
											{displayImages.map((_, idx) => (
												<button
													key={idx}
													onClick={(e) => {
														e.stopPropagation();
														handleSelectImage(idx);
													}}
													className={`h-1.5 rounded-full transition-all duration-300 ${activeImageIndex === idx ? "w-6 bg-white shadow-sm" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
												/>
											))}
										</div>
									)}
								</>
							) : (
								<div className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-400">
									<RiShoppingBag3Line
										size={36}
										strokeWidth={1.5}
									/>
									<span className="text-xs uppercase tracking-wider font-light">
										No Campaign Image
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Right Panel: Editorial Details Block */}
				<div className="lg:col-span-5 space-y-8 animate-fade-in-up delay-100">
					{/* Drop & Brand Badging */}
					<div className="space-y-2.5">
						<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-[9px] font-semibold tracking-widest text-zinc-500 uppercase">
							<RiSparkling2Line
								size={10}
								className="text-zinc-500 animate-pulse"
							/>
							<span>STUDIO ORIGINAL // CURATED SELECTION</span>
						</div>

						<h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-zinc-900 uppercase leading-snug">
							{productDetails.title}
						</h1>

						{/* Localized Formatted Pricing */}
						<div className="flex items-baseline gap-2">
							<span className="text-2xl font-bold text-zinc-950">
								{formatPrice(activePriceAmount, activePriceCurrency)}
							</span>
							{selectedVariant && selectedVariant.price?.amount !== (productDetails?.price?.amount ?? productDetails?.priceAmount) && (
								<span className="text-sm font-light text-zinc-400 line-through">
									{formatPrice(productDetails?.price?.amount ?? productDetails?.priceAmount ?? 0, productDetails?.price?.currency ?? productDetails?.priceCurrency ?? "INR")}
								</span>
							)}
							<span className="text-[10px] font-light text-zinc-400 uppercase tracking-wider">
								VAT / Taxes Included
							</span>
						</div>
					</div>

					<div className="h-px bg-zinc-200/80 w-full" />

					{/* Exquisite Description Block */}
					<div className="space-y-3">
						<h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
							Editorial Note
						</h3>
						<p className="text-zinc-500 text-sm font-light leading-relaxed tracking-wide">
							{productDetails.description ||
								"A masterfully constructed contemporary silhouette crafted specifically for our editorial showcase series, showcasing sleek geometric proportions and exquisite detailing."}
						</p>
					</div>

					{/* Micro-details like Seller Code & Verification */}
					<div className="flex items-center gap-6 p-4 rounded-xl border border-zinc-200/60 bg-white/50 backdrop-blur-xs">
						<div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-zinc-600 uppercase">
							<RiVerifiedBadgeLine
								size={14}
								className="text-zinc-800 shrink-0"
							/>
							<span>Quality Assured Curation</span>
						</div>
						<div className="h-4 w-px bg-zinc-200" />
						<div className="text-[10px] text-zinc-400 uppercase tracking-widest">
							Seller:{" "}
							<span className="font-semibold text-zinc-600">
								{productDetails.seller?.slice(-8) || "STUDIO-X"}
							</span>
						</div>
					</div>

					{/* ─── Variant Selector ─── */}
					{hasVariants && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
									{attributeKeys.length > 0 ? `Select Variant` : "Available Variants"}
								</h3>
								{activeStock !== undefined && activeStock !== null && (
									<span className={`text-[10px] font-semibold uppercase tracking-widest ${activeStock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
										{activeStock > 0 ? `${activeStock} in stock` : "Out of stock"}
									</span>
								)}
							</div>

							{/* Variant chip selector */}
							<div className="flex flex-wrap gap-3">
								{variants.map((variant, vIdx) => {
									const isSelected = selectedVariantIndex === vIdx;
									// Build label from attributes
									const attrs = variant.attributes instanceof Map ? Object.fromEntries(variant.attributes) : (variant.attributes || {});
									const label = Object.values(attrs).length > 0
										? Object.values(attrs).join(" / ")
										: `Variant ${vIdx + 1}`;
									const outOfStock = variant.stock !== undefined && variant.stock <= 0;

									return (
										<button
											key={variant._id || vIdx}
											onClick={() => handleSelectVariant(vIdx)}
											className={`variant-chip ${isSelected ? "active" : ""} ${outOfStock ? "out-of-stock" : ""}`}
											title={outOfStock ? "Out of stock" : label}
										>
											{/* Show a mini swatch if variant has images */}
											{variant.images && variant.images.length > 0 && (
												<img
													src={getDisplayImage(variant.images[0])}
													alt={label}
													className="variant-chip-swatch"
												/>
											)}
											<span>{label}</span>
											{outOfStock && <span className="variant-chip-oos">✕</span>}
										</button>
									);
								})}
							</div>

							{/* Selected variant attribute details */}
							{selectedVariant && attributeKeys.length > 0 && (
								<div className="variant-detail-pills animate-fade-in-up">
									{attributeKeys.map((key) => {
										const val = getAttr(selectedVariant, key);
										if (!val) return null;
										return (
											<div key={key} className="variant-detail-pill">
												<span className="variant-detail-pill-key">{key}</span>
												<span className="variant-detail-pill-val">{val}</span>
											</div>
										);
									})}
								</div>
							)}

							{/* Variant images mini gallery when variant is selected */}
							{selectedVariant && selectedVariant.images && selectedVariant.images.length > 1 && (
								<div className="flex gap-2 mt-2">
									{selectedVariant.images.map((img, imgIdx) => (
										<button
											key={img._id || imgIdx}
											onClick={() => handleSelectImage(imgIdx)}
											className={`variant-mini-thumb ${activeImageIndex === imgIdx ? "active" : ""}`}
										>
											<img
												src={getDisplayImage(img)}
												alt={`Variant image ${imgIdx + 1}`}
											/>
										</button>
									))}
								</div>
							)}
						</div>
					)}

					{/* CTA Action Panel */}
					<div className="flex gap-4">
						<button
							onClick={handleAddToBag}
							disabled={isAdding || (hasVariants && selectedVariantIndex === null) || (activeStock !== undefined && activeStock <= 0)}
							className="btn-premium-cta flex-1 flex items-center justify-center gap-3"
						>
							{isAdding ? (
								<>
									<RiLoader5Line
										size={14}
										className="animate-spin"
									/>
									<span>Securing Garment...</span>
								</>
							) : isAdded ? (
								<>
									<RiCheckLine
										size={14}
										className="text-zinc-100"
									/>
									<span>Added to Curation</span>
								</>
							) : hasVariants && selectedVariantIndex === null ? (
								<>
									<RiStackLine size={14} />
									<span>Select a Variant</span>
								</>
							) : activeStock !== undefined && activeStock <= 0 ? (
								<>
									<RiCloseLine size={14} />
									<span>Out of Stock</span>
								</>
							) : (
								<>
									<RiShoppingBag3Line size={14} />
									<span>Add to Bag</span>
								</>
							)}
						</button>

						<button
							onClick={() => setIsLiked(!isLiked)}
							className="btn-premium-secondary"
							title="Add to Wishlist"
						>
							{isLiked ? (
								<RiHeartFill
									size={16}
									className="text-rose-600 animate-scale"
								/>
							) : (
								<RiHeartLine
									size={16}
									className="text-zinc-800"
								/>
							)}
						</button>
					</div>

					{/* Editorial Accordions */}
					<div className="space-y-0 pt-4">
						{/* Accordion 1: Composition & Care */}
						<div className={`accordion-wrapper ${openAccordion === "composition" ? "open" : ""}`}>
							<button
								onClick={() => toggleAccordion("composition")}
								className="accordion-header"
							>
								<span>Composition & Premium Care</span>
								<span className="accordion-icon text-[14px]">
									{openAccordion === "composition" ? "—" : "+"}
								</span>
							</button>
							<div className="accordion-content">
								<div className="accordion-inner-text space-y-2">
									<p>
										Fabricated from 100% premium sourced linen fibers, selected from kindergarten
										forests to ensure unparalleled flexibility, breathability, and organic texture.
									</p>
									<ul className="list-disc list-inside space-y-1 text-zinc-500">
										<li>Dry clean highly recommended for structural longevity</li>
										<li>Alternatively machine wash cold on delicate cycle</li>
										<li>Dry in shade only; iron inside out at medium temperature</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Accordion 2: Sizing & Fit */}
						<div className={`accordion-wrapper ${openAccordion === "sizing" ? "open" : ""}`}>
							<button
								onClick={() => toggleAccordion("sizing")}
								className="accordion-header"
							>
								<span>Sizing & Silhouette Fit</span>
								<span className="accordion-icon text-[14px]">
									{openAccordion === "sizing" ? "—" : "+"}
								</span>
							</button>
							<div className="accordion-content">
								<div className="accordion-inner-text">
									<p>
										Tailored with a modern, slightly relaxed silhouette. Fits true to size.
										Developed specifically to drape cleanly while allowing comfortable movement.
									</p>
									<p className="mt-2 text-zinc-500 italic">
										Our model stands 6'1" (185 cm) and is showcased wearing a size Medium.
									</p>
								</div>
							</div>
						</div>

						{/* Accordion 3: Delivery & Returns */}
						<div className={`accordion-wrapper ${openAccordion === "delivery" ? "open" : ""}`}>
							<button
								onClick={() => toggleAccordion("delivery")}
								className="accordion-header"
							>
								<span>Editorial Delivery & Returns</span>
								<span className="accordion-icon text-[14px]">
									{openAccordion === "delivery" ? "—" : "+"}
								</span>
							</button>
							<div className="accordion-content">
								<div className="accordion-inner-text space-y-1 text-zinc-500">
									<p>
										Each release is packaged inside our signature luxury cardboard box and wrapped
										in delicate editorial tissue.
									</p>
									<p>
										• Domestic Delivery: 2–4 business days (Carbon-Neutral shipping via Snitch
										Express)
									</p>
									<p>• International Curation Shipping: 5–8 business days</p>
									<p>• Free exchanges and returns within 14 days of receipt</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ProductDetails;

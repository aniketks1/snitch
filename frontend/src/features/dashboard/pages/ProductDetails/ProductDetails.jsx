import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
} from "@remixicon/react";

import "./ProductDetails.css";
import useProducts from "../../hooks/useSellerProduct";
import NotFound from "../../../../app/pages/NotFound";

const ProductDetails = () => {
	const { productId } = useParams();
	const { handleGetProductDetails } = useProducts();
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
	const [selectedSize, setSelectedSize] = useState("M");
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
	}, [productId]);

	// Simulating luxury Add To Bag action
	const handleAddToBag = () => {
		if (isAdding || isAdded) return;
		setIsAdding(true);
		setTimeout(() => {
			setIsAdding(false);
			setIsAdded(true);
			setTimeout(() => {
				setIsAdded(false);
			}, 3000);
		}, 1200);
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

	// Local pricing calculation supporting both flat object keys and nested MongoDB schemas
	const priceAmount = productDetails?.price?.amount ?? productDetails?.priceAmount ?? 0;
	const priceCurrency = productDetails?.price?.currency ?? productDetails?.priceCurrency ?? "INR";

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

	// Dynamic accordion helper
	const toggleAccordion = (section) => {
		setOpenAccordion(openAccordion === section ? null : section);
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

	const displayImages = productDetails.images || [];
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
										key={activeImageIndex}
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
								{formatPrice(priceAmount, priceCurrency)}
							</span>
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

					{/* Size Selector Block */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
								Select Silhouette Size
							</h3>
							<button className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 border-b border-zinc-300 pb-0.5 hover:border-zinc-900 transition-all duration-200 cursor-pointer">
								Sizing Grid
							</button>
						</div>

						<div className="flex gap-3">
							{["S", "M", "L", "XL", "XXL"].map((size) => (
								<button
									key={size}
									onClick={() => setSelectedSize(size)}
									className={`size-btn ${selectedSize === size ? "active" : ""}`}
								>
									{size}
								</button>
							))}
						</div>
					</div>

					{/* CTA Action Panel */}
					<div className="flex gap-4">
						<button
							onClick={handleAddToBag}
							disabled={isAdding}
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
